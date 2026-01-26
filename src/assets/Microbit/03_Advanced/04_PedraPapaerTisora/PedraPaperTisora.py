# Imports
from microbit import *
import random
import speech
import music
import radio

# Variables
turn = True
tool = 10
count = 0
points = 0

# Functions
def Trie(tool):
    if tool == 0:
        display.show(Image.SQUARE_SMALL)
        speech.say('Pedra')
    elif tool == 1:
        display.show(Image.SQUARE)
        speech.say('Paper')
    else:
        display.show(Image.SCISSORS);
        speech.say('Tisores')

def Comparison(tool, recieved):
    result = ''
    
    if tool == 0:
        if recieved == "1":
            result = 'Pierdes'
        elif recieved == "2":
            result = 'Ganas'
    elif tool == 1:
        if recieved == "0":
            result = 'Ganas'
        elif recieved == "2":
            result = 'Pierdes'
    elif tool == 2:
        if recieved == "0":
            result = 'Pierdes'
    elif recieved == "1":
        result = 'Ganas'

    return result

def Winner(result):
    if result == 'Ganas':
        display.show(Image.SMILE)
        music.play(music.POWER_UP)
        speech.say('Ganas')
    elif result == 'Pierdes':
        display.show(Image.SAD)
        music.play(music.POWER_DOWN)
        speech.say('Pierdes')
    elif result == 'Empatas':
        display.show(Image.ASLEEP)
        music.play(music.WAWAWAWAA)
        speech.say('Empate')

def Clean(tool, turn, result):
    tool = 10
    turn = True
    result = ''
    
# Main loop
while True:
    
    radio.config(group=12)
    
    if button_a.was_pressed() & turn:
        turn = False
        tool = 0

        Trie(tool)
        
    elif button_b.was_pressed() & turn:
        turn = False
        tool = 1

        Trie(tool)

    elif pin_logo.is_touched() & turn:
        turn = False
        tool = 3

        Trie(tool)

    sleep(500)
    
    if accelerometer.was_gesture('shake'):
        radio.send(str(tool))
        recieved=radio.receive()

        if recieved:
            result = Comparison(tool, recieved)

            if result == 'Ganas':
                points = points + 1
        
            Winner(result)

            if result != 'Empatas':
                count = count + 1
        
            sleep(2000)
        
        if count < 5:
            count = count + 1
            Clean(tool, turn, result)
    
        elif count > 5:
            if points > 2:
                display.show(Image.HAPPY)
                speech.say('Ganas')
                music.play(music.PYTHON)
            elif points < 3:
                display.show(Image.SKULL)
                speech.say('Pierdes')
                music.play(music.FUNERAL)