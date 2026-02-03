# Imports go at the top
from microbit import *
import music

# Variables
beats = 769.23
freq = 75
lives = True

# Code in a while executes if the value of lives is true
while lives:
    display.show(Image.HEART)
    music.pitch(freq)
    sleep(beats)
    display.show(Image.HEART_SMALL)
    sleep(beats)

    if button_a.is_pressed() or accelerometer.was_gesture('shake'):
        beats = beats - 50
        
    if button_b.is_pressed() or pin_logo.is_touched():
        beats = beats + 50

    #if beats < 598.80 or beats > 1000:
    if beats < 100 or beats > 1500:
        lives = False
        
freq = 200
music.pitch(freq)
display.show(Image.SKULL)
