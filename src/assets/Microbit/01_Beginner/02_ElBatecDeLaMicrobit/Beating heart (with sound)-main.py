# Imports go at the top
from microbit import *
import music

# Code in a 'while True:' loop repeats forever
while True:
    display.show(Image.HEART)
    music.play('a')
    sleep(500)
    display.show(Image.HEART_SMALL)
    sleep(500)
    
