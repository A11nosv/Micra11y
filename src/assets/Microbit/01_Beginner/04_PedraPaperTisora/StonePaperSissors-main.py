# Imports
from microbit import *
import random
import speech
import music

# Main loop
while True:
    if accelerometer.was_gesture('shake'):
        tool = random.randint(0,2)
        if tool == 0:
            display.show(Image.SQUARE_SMALL)
            speech.say('Pedra')
            music.play(music.RINGTONE)
        elif tool == 1:
            display.show(Image.SQUARE)
            speech.say('Paper')
            music.play(music.JUMP_DOWN)
        else:
            display.show(Image.SCISSORS);
            speech.say('Tisores')
            music.play(music.JUMP_UP)
