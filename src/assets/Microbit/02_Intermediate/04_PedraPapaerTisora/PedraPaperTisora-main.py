# Imports
from microbit import *
import random
import speech
import music
import radio

# Variables
turn = True
tool = 10

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
        music.play(music.PYTHON)
        speech.say('Ganas')
    elif result == 'Pierdes':
        display.show(Image.SAD)
        music.play(music.FUNERAL)
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
    
    if accelerometer.was_gesture('shake') & turn:
        turn = False
        tool = random.randint(0,2)
        
        Trie(tool)

        sleep(500)

    if pin_logo.is_touched():
        radio.send(str(tool))
        recieved=radio.receive()

        result = Comparison(tool, recieved)

        Winner(result)

        sleep(2000)
        
        Clean(tool, turn, result)
