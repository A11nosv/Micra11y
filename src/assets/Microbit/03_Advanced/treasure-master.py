
from microbit import *
import radio
import speech
import music
import utime

# Configuración
radio.on()
uart.init(baudrate=9600)
ruta = []

def sonar_alarma():
    """Función de emergencia que bloquea el juego hasta pulsar A+B"""
    speech.say("Emergency! Look for the monitor!")
    display.show(Image.SKULL)
    # Sonido de sirena bitonal
    for _ in range(5):
        music.play(["C5:4", "F5:4"], wait=True)
    display.scroll("SOS")

def revisar_bluetooth():
    """Revisa si el monitor ha enviado una ruta o un SOS"""
    if uart.any():
        msg = uart.read().decode('utf-8').strip()
        if "SOS" in msg:
            sonar_alarma()
            return "SOS"
        return msg
    return None

display.show(Image.ASLEEP)

# --- FASE 1: RECEPCIÓN DE RUTA ---
while not ruta:
    res = revisar_bluetooth()
    if res and "#" in res and "SOS" not in res:
        try:
            datos = res.replace("#", "")
            ruta = [int(x) for x in datos.split(',') if x != ""]
            display.show(Image.YES)
            speech.say("Route confirmed")
            sleep(1000)
        except:
            display.show(Image.NO)

# --- FASE 2: BÚSQUEDA ---
inicio_ms = utime.ticks_ms()

while len(ruta) > 0:
    grupo_objetivo = ruta[0]
    radio.config(group=grupo_objetivo)
    
    hallado = False
    while not hallado:
        # 1. Comprobar si el Monitor envía un SOS durante el juego
        if revisar_bluetooth() == "SOS":
            # Tras la alarma, el niño debe pulsar A+B para seguir
            display.scroll("PULSA A+B PARA VOLVER")
            while not (button_a.is_pressed() and button_b.is_pressed()):
                sleep(100)

        # 2. Lógica normal de búsqueda
        paquete = radio.receive_full()
        rssi = paquete[1] if paquete else None
        
        if rssi:
            if rssi > -45: # Captura
                music.play(music.POWER_UP, wait=False)
                ruta.pop(0)
                if len(ruta) > 0:
                    uart.write("Progreso:" + str(grupo_objetivo) + "#")
                    display.scroll("NEXT")
                    while not button_b.was_pressed(): sleep(100)
                    hallado = True
                else:
                    # Victoria
                    segundos = utime.ticks_diff(utime.ticks_ms(), inicio_ms) // 1000
                    uart.write("Finish:" + str(segundos) + "#")
                    speech.say("Victory!")
                    while True:
                        display.scroll(str(segundos) + "s")
                        music.play(music.ENTERTAINER)
            else:
                # Radar normal
                brillo = min(max(int((rssi + 100) / 6), 0), 9)
                display.show(Image(str(brillo)*25))
                music.pitch(523, duration=20, wait=False)
                sleep(max(50, (rssi * -10) - 450))
        else:
            display.clear()
            sleep(100)
