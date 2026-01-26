Curso: MicroPython Accesible con micro:bit
Módulo 1: Los Pilares de la Accesibilidad en Código

La accesibilidad en hardware educativo significa que la información debe ser multimodal: si algo se ve, también debe poder oírse o sentirse.
1.1 Programación Inaccesible vs. Accesible

Un error común es diseñar programas que dependen de un solo sentido (normalmente la vista).

Ejemplo de Código INACCESIBLE: Este programa solo avisa de un peligro mediante un icono visual. Una persona ciega no sabría que hay una alerta.
Python

from microbit import *

while True:
    if button_a.is_pressed():
        display.show(Image.SKULL) # Solo visual: Inaccesible

Ejemplo de Código ACCESIBLE: Este programa utiliza el principio de redundancia sensorial (Vista + Oído + Tacto).
Python

from microbit import *
import music

while True:
    if button_a.is_pressed():
        # 1. Visual
        display.show(Image.SKULL)
        # 2. Auditivo (V2 tiene altavoz, V1 requiere cables)
        music.play(music.BA_DING, wait=False)
        # 3. Táctil (Vibración o destello rítmico si hay periféricos)
        # En micro:bit, el sonido genera una pequeña vibración si el volumen es alto

Módulo 2: Interfaz y Navegación

Para que el código sea legible por lectores de pantalla (como NVDA o VoiceOver) y comprensible para personas con diversidad cognitiva, debemos cuidar la estructura.
Reglas de Oro:

    Comentarios Descriptivos: No digas qué hace la función, di qué experiencia genera.

    Variables Semánticas: Usa sensor_luz en lugar de sl.

    Evitar el "Flash" excesivo: No uses parpadeos rápidos de LEDs que puedan provocar ataques epilépticos (evitar frecuencias entre 5 y 30 Hz).

Módulo 3: Ejercicios Prácticos
Ejercicio 1: El Dado Incluyente

Objetivo: Crear un dado que lance un número al agitarlo, pero que el resultado sea accesible para alguien que no puede ver la pantalla LED.

Instrucciones:

    Al agitar (accelerometer.was_gesture('shake')), genera un número.

    Muestra el número en el LED.

    Reproduce tantos "beeps" como indique el número (ej. si sale 3, suena "beep, beep, beep").

Solución Propuesta:
Python

from microbit import *
import music
import random

while True:
    if accelerometer.was_gesture('shake'):
        numero = random.randint(1, 6)
        display.show(str(numero))
        
        # Retroalimentación auditiva para accesibilidad
        for i in range(numero):
            music.pitch(440, 100) # Nota LA por 100ms
            sleep(100)

Ejercicio 2: Termómetro con Alerta de "Color" Sonoro

Objetivo: Ayudar a una persona con daltonismo o baja visión a identificar si la temperatura es "Fría" o "Caliente" sin leer el número pequeño.

Instrucciones:

    Si la temperatura es < 18°C: Sonido grave y una "F" en pantalla.

    Si la temperatura es > 25°C: Sonido agudo y una "C" en pantalla.

Módulo 4: Herramientas de Entorno

Para programar de forma accesible, se recomienda usar el Editor de Python de micro:bit (V3) o Mu Editor, ya que:

    Soportan alto contraste.

    Permiten aumentar el tamaño de la fuente fácilmente (Ctrl + +).

    Son compatibles con lectores de pantalla gracias a su estructura de texto plano.

    Nota de Seguridad: Al trabajar con sonido en micro:bit V2, asegúrate de usar set_volume() para no dañar los oídos de personas con hipersensibilidad auditiva.

¿Te gustaría que diseñemos un proyecto final específico, como un bastón inteligente para detectar obstáculos usando el sensor de distancia?
