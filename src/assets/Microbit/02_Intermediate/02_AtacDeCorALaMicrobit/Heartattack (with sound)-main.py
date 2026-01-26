# Imports go at the top
from microbit import *
import music

# Variables
a = 500
b = 100

# Code in a while a > 50 or a < 1000 executes if a value is between 50 and 1000
while a > 50:
    display.show(Image.HEART)
    music.play('c')
    sleep(a)
    display.show(Image.HEART_SMALL)
    sleep(a)

    if button_a.is_pressed():
        a = a - 50

b = 200
music.pitch(b)
display.show(Image.SKULL)