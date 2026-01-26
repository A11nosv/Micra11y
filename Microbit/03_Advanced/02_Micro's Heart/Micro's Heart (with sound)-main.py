# Imports go at the top
from microbit import *
import music

# Variables
a = 769.23
b = 75
lives = True

# Code in a while executes if the value of lives is true
while lives:
    display.show(Image.HEART)
    music.pitch(b)
    sleep(a)
    display.show(Image.HEART_SMALL)
    sleep(a)

    if button_a.is_pressed() or accelerometer.was_gesture('shake'):
        a = a - 50
        
    if button_b.is_pressed() or pin_logo.is_touched():
        a = a + 50

    #if a < 598.80 or a > 1000:
    if a < 100 or a > 1500:
        lives = False
        
b = 200
music.pitch(b)
display.show(Image.SKULL)