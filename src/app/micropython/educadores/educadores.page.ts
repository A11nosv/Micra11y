import { Component, OnInit, OnDestroy, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent, IonSplitPane, IonMenu, IonList, IonListHeader, IonItem, IonLabel, IonMenuToggle, IonBadge, IonAccordionGroup, IonAccordion, IonBackButton, IonMenuButton } from '@ionic/angular/standalone';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageChooserComponent } from '../../components/language-chooser/language-chooser.component';
import { Highlight } from 'ngx-highlightjs';
import { Subscription } from 'rxjs';
import { LanguageService } from '../../services/language.service';
import { addIcons } from 'ionicons';
import { accessibilityOutline, constructOutline, homeOutline, schoolOutline, bookOutline, documentTextOutline, chevronForwardOutline } from 'ionicons/icons';

@Component({
  selector: 'app-educadores',
  templateUrl: './educadores.page.html',
  styleUrls: ['./educadores.page.scss'],
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent, IonSplitPane, IonMenu, IonList, IonListHeader, IonItem, IonLabel, IonMenuToggle, IonBadge, IonAccordionGroup, IonAccordion, IonBackButton, IonMenuButton,
    CommonModule, FormsModule, RouterLink, TranslateModule, LanguageChooserComponent, Highlight]
})
export class EducadoresPage implements OnInit, OnDestroy {
  @ViewChild('mainContent', { static: false }) content!: IonContent;
  
  private route = inject(ActivatedRoute);
  private translate = inject(TranslateService);
  private languageService = inject(LanguageService);
  private langSub!: Subscription;

  userRole: 'educator' | 'student' = 'educator';
  
  currentModule: any = null;
  openAccordions: string[] = [];

  modules: any[] = [];

  constructor() { 
    addIcons({ accessibilityOutline, constructOutline, homeOutline, schoolOutline, bookOutline, documentTextOutline, chevronForwardOutline });
  }

  ngOnInit() {
    // Detect role based on URL
    const path = this.route.snapshot.url[this.route.snapshot.url.length - 1]?.path;
    if (path === 'estudiantes') {
      this.userRole = 'student';
    } else {
      this.userRole = 'educator';
    }

    // Subscribe to language changes to update translated modules
    this.langSub = this.languageService.currentLanguage$.subscribe(() => {
      this.updateModulesTranslation();
    });
  }

  ngOnDestroy() {
    if (this.langSub) {
      this.langSub.unsubscribe();
    }
  }

  updateModulesTranslation() {
    const moduleIds = [
      { id: 'dua',      num: '00', icon: '♿', educatorOnly: true },
      { id: 'cap1',     num: '01', icon: '🖥️' },
      { id: 'cap2',     num: '02', icon: '📦' },
      { id: 'cap3',     num: '03', icon: '🚦' },
      { id: 'cap4',     num: '04', icon: '🔄' },
      { id: 'cap5',     num: '05', icon: '🧩' },
      { id: 'cap6',     num: '06', icon: '🌡️' },
      { id: 'cap7',     num: '07', icon: '🎵' },
      { id: 'cap8',     num: '08', icon: '📡' },
      { id: 'cap9',     num: '09', icon: '🚀' },
      { id: 'cap11',    num: '10', icon: '♿' },
      { id: 'cap10',    num: '11', icon: '🎓', educatorOnly: true },
      { id: 'apendice', num: 'A',  icon: '📋' },
    ];

    this.modules = moduleIds.map(m => {
      return {
        ...m,
        title: this.translate.instant(`EDUCADORES_PAGE.MODULES.${m.id}.title`),
        desc: this.translate.instant(`EDUCADORES_PAGE.MODULES.${m.id}.desc`)
      };
    });

    // If a module is selected, update its reference to reflect translation changes
    if (this.currentModule) {
      this.currentModule = this.modules.find(m => m.id === this.currentModule.id);
    }
  }

  selectModule(moduleId: string | null) {
    if (moduleId === null) {
      this.currentModule = null;
    } else {
      this.currentModule = this.modules.find(m => m.id === moduleId);
    }
    
    this.openAccordions = []; // Reset open accordions when changing modules
    
    // Scroll to top when changing modules
    if (this.content) {
      setTimeout(() => {
        this.content.scrollToTop(300);
      }, 50);
    }
  }

  handleAccordionChange(ev: any) {
    const val = ev.detail.value;
    this.openAccordions = Array.isArray(val) ? val : (val ? [val] : []);
  }

  isExpanded(value: string): boolean {
    return this.openAccordions.includes(value);
  }

  handleSpaceKey(ev: KeyboardEvent, value: string, accordionGroup: any) {
    if (ev.key === ' ' || ev.key === 'Spacebar') {
      ev.preventDefault();
      // To toggle manually, we have to interact with the accordion-group's value
      let currentVal = accordionGroup.value;
      if (Array.isArray(currentVal)) {
        if (currentVal.includes(value)) {
          accordionGroup.value = currentVal.filter((v: string) => v !== value);
        } else {
          accordionGroup.value = [...currentVal, value];
        }
      } else {
        accordionGroup.value = currentVal === value ? null : value;
      }
    }
  }

  // Helper for Cap1 code blocks
  pythonCode_1_1 = `# Mi primer programa en MicroPython
# El símbolo # indica un comentario: Python lo ignora

from microbit import *

display.scroll('Hola mundo!')`;

  pythonCode_1_2 = `from microbit import *

# Mostrar una imagen del banco de imágenes integrado
display.show(Image.HAPPY)        # Cara feliz
sleep(1000)                      # Espera 1 segundo (1000 ms)
display.show(Image.SAD)          # Cara triste
sleep(1000)
display.show(Image.HEART)        # Corazón`;

  // Helper for Cap2 code blocks
  pythonCode_2_1 = `from microbit import *

nombre  = 'micro:bit'   # str: texto
version = 2             # int: número entero
voltaje = 3.3           # float: decimal
activo  = True          # bool: verdadero/falso

display.scroll(nombre)
sleep(500)
display.scroll(str(version))  # str() convierte número a texto`;

  pythonCode_2_2 = `from microbit import *

a = 10
b = 3

suma     = a + b    # 13
resta    = a - b    # 7
producto = a * b    # 30
division = a / b    # 3.333...
entero   = a // b   # 3  (división sin decimales)
resto    = a % b    # 1  (módulo: resto de la división)
potencia = a ** b   # 1000 (10 elevado a 3)

display.scroll('suma=' + str(suma))
sleep(500)
display.scroll('resto=' + str(resto))`;

  pythonCode_2_3 = `from microbit import *

while True:
    temp = temperature()        # Lee la temperatura en °C
    display.scroll(str(temp) + 'C')
    sleep(2000)                 # Espera 2 segundos entre lecturas`;

  // Helper for Cap3 code blocks
  pythonCode_3_1 = `from microbit import *

temperatura = temperature()

if temperatura > 30:
    display.show(Image.HAPPY)      # Hace calor
elif temperatura > 20:
    display.scroll('Bien')         # Agradable
elif temperatura > 10:
    display.scroll('Frio')
else:
    display.show(Image.SAD)        # Mucho frio`;

  pythonCode_3_2 = `from microbit import *

while True:
    if button_a.is_pressed():
        display.show(Image.HAPPY)
    elif button_b.is_pressed():
        display.show(Image.SAD)
    elif button_a.is_pressed() and button_b.is_pressed():
        display.show(Image.SURPRISED)
    else:
        display.clear()            # Apaga todos los LEDs
    sleep(100)`;

  pythonCode_3_3 = `from microbit import *
import random

opciones = ['Piedra', 'Papel', 'Tijera']

while True:
    jugador = None
    if button_a.is_pressed() and button_b.is_pressed():
        jugador = 2   # Tijera
    elif button_a.is_pressed():
        jugador = 0   # Piedra
    elif button_b.is_pressed():
        jugador = 1   # Papel

    if jugador is not None:
        maquina = random.randint(0, 2)
        display.scroll(opciones[jugador])
        if jugador == maquina:
            display.scroll('Empate!')
        elif (jugador - maquina) % 3 == 1:
            display.scroll('GANAS!')
        else:
            display.scroll('Pierdes...')
    sleep(200)`;

  // Helper for Cap4 code blocks
  pythonCode_4_1 = `from microbit import *

# Cuenta regresiva de 5 a 0
numero = 5
while numero > 0:
    display.show(str(numero))
    sleep(800)
    numero -= 1   # Equivale a: numero = numero - 1

display.show(Image.HAPPY)`;

  pythonCode_4_2 = `from microbit import *

# range(5) genera: 0, 1, 2, 3, 4
for i in range(5):
    display.show(str(i))
    sleep(500)

# range(1, 6) genera: 1, 2, 3, 4, 5
for i in range(1, 6):
    display.show(str(i))
    sleep(400)

# range con paso: 0, 2, 4, 6, 8
for i in range(0, 10, 2):
    display.scroll(str(i))
    sleep(300)`;

  pythonCode_4_3 = `from microbit import *

# Encender LEDs fila a fila
for y in range(5):             # fila: 0, 1, 2, 3, 4
    for x in range(5):         # columna: 0, 1, 2, 3, 4
        display.set_pixel(x, y, 9)    # brillo máximo = 9
        sleep(50)

sleep(500)
display.clear()`;

  pythonCode_4_4 = `# Animación de lluvia — ejemplo creativo
from microbit import *
import random

while True:
    columna = random.randint(0, 4)
    for fila in range(5):
        display.clear()
        display.set_pixel(columna, fila, 9)
        sleep(80)
    display.clear()
    sleep(random.randint(50, 200))`;

  // Helper for Cap5 code blocks
  pythonCode_5_1 = `from microbit import *

colores = ['rojo', 'verde', 'azul', 'amarillo']
numeros = [3, 7, 15, 2, 9]

display.scroll(colores[0])      # 'rojo'   (índice 0 = primero)
display.scroll(colores[2])      # 'azul'   (índice 2 = tercero)
display.scroll(str(len(colores)))  # 4 (cantidad de elementos)

# Recorrer una lista con for
for color in colores:
    display.scroll(color)
    sleep(200)`;

  pythonCode_5_2 = `from microbit import *

# Función sin parámetros
def mostrar_temperatura():
    temp = temperature()
    display.scroll('T:' + str(temp))

# Función con parámetros
def parpadear(imagen, veces):
    for i in range(veces):
        display.show(imagen)
        sleep(300)
        display.clear()
        sleep(200)

# Función que devuelve un valor
def celsius_a_fahrenheit(c):
    return (c * 9 / 5) + 32

# Llamar a las funciones
mostrar_temperatura()
parpadear(Image.HEART, 3)
f = celsius_a_fahrenheit(100)
display.scroll(str(f) + 'F')`;

  // Helper for Cap6 code blocks
  pythonCode_6_1 = `from microbit import *

while True:
    x = accelerometer.get_x()   # Izquierda-derecha (-2000 a +2000)
    y = accelerometer.get_y()   # Adelante-atrás
    z = accelerometer.get_z()   # Arriba-abajo (gravedad ≈ 1000)

    display.scroll('x:' + str(x), delay=50)
    sleep(500)`;

  pythonCode_6_2 = `# El LED sigue la inclinación de la placa
from microbit import *

while True:
    x = accelerometer.get_x()
    y = accelerometer.get_y()
    col  = min(4, max(0, 2 + x // 500))
    fila = min(4, max(0, 2 + y // 500))
    display.clear()
    display.set_pixel(col, fila, 9)
    sleep(50)`;

  pythonCode_6_3 = `from microbit import *

while True:
    luz  = display.read_light_level()  # 0-255
    temp = temperature()               # grados Celsius

    display.scroll('L:' + str(luz) + ' T:' + str(temp), delay=60)

    if luz < 50:
        display.show(Image.ASLEEP)     # Muy oscuro
    elif temp > 28:
        display.show(Image.SURPRISED)  # Mucho calor
    else:
        display.show(Image.HAPPY)
    sleep(1500)`;

  pythonCode_6_4 = `# Solo disponible en micro:bit v2
from microbit import *

while True:
    nivel = microphone.sound_level()    # 0-255
    display.scroll(str(nivel))

    if microphone.was_event(SoundEvent.LOUD):
        display.show(Image.SURPRISED)
    elif microphone.was_event(SoundEvent.QUIET):
        display.show(Image.ASLEEP)
    sleep(200)`;

  // Helper for Cap7 code blocks
  pythonCode_7_1 = `from microbit import *
import music

music.play(music.BIRTHDAY)    # Cumpleaños feliz
sleep(500)
music.play(music.POWER_UP)    # Sonido de inicio
sleep(500)
music.play(music.FUNERAL)     # Marcha fúnebre`;

  pythonCode_7_2 = `from microbit import *
import music

# Formato de nota: 'NOTA OCTAVA : DURACION'
# Notas: C D E F G A B = Do Re Mi Fa Sol La Si
# Duración: 4=negra  8=corchea  2=blanca  1=redonda

escala = ['C4:4','D4:4','E4:4','F4:4','G4:4','A4:4','B4:4','C5:4']
music.play(escala)`;

  pythonCode_7_3 = `from microbit import *
import speech

# Saludo básico en inglés
speech.say("Hello world")
sleep(500)

# Personalizar la voz
# speed (0-255), pitch (0-255), throat (0-255), mouth (0-255)
speech.say("I am a robot", speed=80, pitch=100, throat=200, mouth=150)`;

  pythonCode_7_4 = `from microbit import *
import speech

palabras = ["Hello", "Happy", "Microbit"]

for p in palabras:
    display.scroll(p, wait=False) # No espera a terminar el scroll
    speech.say(p)
    sleep(1000)`;

  pythonCode_7_5 = `from microbit import *
import music

# music.pitch(frecuencia_Hz, duracion_ms)
music.pitch(440, 500)     # La4 durante 0,5 segundos
sleep(200)
music.pitch(880, 500)     # La5 (el doble = octava superior)

# Sirena de emergencia
for i in range(5):
    music.pitch(800, 200)
    music.pitch(600, 200)`;

  // Helper for Cap8 code blocks
  pythonCode_8_1 = `# EMISOR — micro:bit que envía
from microbit import *
import radio

radio.on()                    # Activar la radio
radio.config(group=7)         # Solo hablan micro:bits en el mismo grupo

while True:
    if button_a.is_pressed():
        radio.send('Hola!')
        display.show(Image.ARROW_E)
        sleep(500)
        display.clear()
    sleep(100)`;

  pythonCode_8_2 = `# RECEPTOR — micro:bit que recibe
from microbit import *
import radio

radio.on()
radio.config(group=7)         # Mismo canal que el emisor

while True:
    mensaje = radio.receive()  # None si no hay mensaje
    if mensaje:
        display.scroll(mensaje)
    sleep(50)`;

  pythonCode_8_3 = `# Compartir temperatura con el grupo
from microbit import *
import radio

radio.on()
radio.config(group=7)

while True:
    temp = temperature()
    radio.send('T:' + str(temp))
    display.scroll('Envie:' + str(temp), delay=60)

    dato = radio.receive()
    if dato:
        display.scroll('Rec:' + dato, delay=60)

    sleep(3000)`;

  // Helper for Cap9 code blocks
  pythonCode_9_1 = `# ROBOT EMOCIONAL — Nivel 2 (estándar)
from microbit import *

display.show(Image.HAPPY)

while True:
    if accelerometer.current_gesture() == 'shake':
        display.show(Image.SURPRISED)
        sleep(1000)
        display.show(Image.HAPPY)

    if button_a.is_pressed():
        display.show(Image.SAD)
        sleep(800)
        display.scroll('Tengo hambre')
        display.show(Image.HAPPY)

    if button_b.is_pressed():
        display.show(Image.ASLEEP)
        sleep(2000)
        display.show(Image.HAPPY)

    sleep(100)`;

  pythonCode_9_2 = `# PODÓMETRO — Nivel 2
from microbit import *

pasos    = 0
ultimo_z = accelerometer.get_z()
umbral   = 400

display.scroll('Listo!')

while True:
    z          = accelerometer.get_z()
    diferencia = abs(z - ultimo_z)

    if diferencia > umbral:
        pasos += 1
        display.show(str(pasos % 10))

    ultimo_z = z

    if button_a.was_pressed():
        display.scroll('Pasos: ' + str(pasos))

    if button_b.was_pressed():
        pasos = 0
        display.scroll('Reset!')

    sleep(50)`;

  pythonCode_9_3 = `# ESTACIÓN METEOROLÓGICA — Nivel 2
from microbit import *

lecturas = []

def temp_calibrada():
    return temperature() - 3

def media(lista):
    if len(lista) == 0: return 0
    return sum(lista) / len(lista)

def registrar():
    t = temp_calibrada()
    lecturas.append(t)
    if len(lecturas) > 10: lecturas.pop(0)
    return t

def mostrar_stats():
    if not lecturas:
        display.scroll('Sin datos'); return
    display.scroll('Med:' + str(round(media(lecturas), 1)))
    display.scroll('Max:' + str(max(lecturas)))
    display.scroll('Min:' + str(min(lecturas)))

while True:
    t = registrar()
    display.scroll(str(t) + 'C', delay=70)
    if button_a.was_pressed(): mostrar_stats()
    sleep(5000)`;

  pythonCode_9_4 = `# CERRADURA — micro:bit fija en la puerta
from microbit import *
import radio

radio.on()
radio.config(group=42)

CONTRASENA = '2024micro'
intentos   = 0
bloqueado  = False

def abrir():
    display.show(Image.YES)
    sleep(2000); display.clear()

def bloquear():
    global bloqueado
    bloqueado = True
    for i in range(10):
        display.show(Image.NO); sleep(200)
        display.clear(); sleep(200)
    display.scroll('BLOQUEADO')

while True:
    msg = radio.receive()
    if msg and not bloqueado:
        if msg == CONTRASENA:
            intentos = 0; abrir()
        else:
            intentos += 1
            radio.send('FALLO:' + str(intentos))
            if intentos >= 3: bloquear()
    sleep(100)`;

  // Helper for Cap11 code blocks
  pythonCode_11_1 = `# Salidas multimodales: LED + Sonido
from microbit import *
import music

while True:
    if button_a.is_pressed():
        display.show(Image.HEART)
        music.play(music.PYTHON) # Sonido corto de Python
    elif button_b.is_pressed():
        display.scroll('A11Y')
        music.pitch(440, 500) # Nota La4 por 0.5 seg
    else:
        display.clear()
        music.stop() # Detener sonido si no hay acción
    sleep(100)`;

  pythonCode_11_2 = `# Botones gigantes con pines
from microbit import *

# Pines 0 y 1 como entradas (botones)
# Conectar pin 0 a GND para pulsar botón GRANDE (ej: pinza a pin 0, otra a P0)
# Conectar pin 1 a GND para pulsar botón GRANDE (ej: pinza a pin 1, otra a P1)

while True:
    if pin0.is_touched(): # Detecta si el pin está conectado a GND (pulsado)
        display.show(Image.YES)
    elif pin1.is_touched():
        display.show(Image.NO)
    else:
        display.clear()
    sleep(50)`;

  pythonCode_11_3 = `# Asistente de Acelerómetro: Control de Ratón Simple
from microbit import *

# Necesitará conexión serial (USB) a un PC para simular mouse
# NOTA: Esto es conceptual, requiere librería adicional en PC (ej: pyautogui en Python)

while True:
    x = accelerometer.get_x()
    y = accelerometer.get_y()

    # Mapear valores del acelerómetro a comandos de ratón (conceptual)
    # Movimiento X -> Movimiento horizontal del ratón
    # Movimiento Y -> Movimiento vertical del ratón
    # Pulsación Botón A -> Click izquierdo

    # Aquí iría el código para enviar comandos al PC vía serial,
    # por ejemplo, imprimiendo códigos especiales que un script en el PC interprete.
    # Ejemplo conceptual (no es código ejecutable tal cual):
    # if x > 500: print("MOUSE_MOVE_RIGHT")
    # elif x < -500: print("MOUSE_MOVE_LEFT")
    # ... y así para Y, y para botones.

    if button_a.was_pressed():
        print("MOUSE_LEFT_CLICK") # Envía comando de click izquierdo

    sleep(50)`;

}
