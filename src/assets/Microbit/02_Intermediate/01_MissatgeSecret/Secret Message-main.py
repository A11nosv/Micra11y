# Imports
from microbit import *
import music
import speech

# Constants
ALPHABET = {
    ".-":"A", "-...":"B", "-.-.":"C", "-..":"D", ".":"E", "..-.":"F", "--.":"G", "....":"H", "..":"I", ".---":"J", "-.-":"K", ".-..":"L", "--":"M", "-.":"N", "--.--":"Ñ", "---":"O", ".--.":"P", "--.-":"Q", ".-.":"R", "...":"S", "-":"T", "..-":"U", "...-":"V", ".--":"W", "-..-":"X", "-.--":"Y", "--..":"Z",
}

# More conversions (not used in the project)
# "-----":"0", ".----":"1", "..---":"2", "...--":"3", "....-":"4", ".....":"5", "-....":"6", "--...":"7", "---..":"8", "----.":"9", ".-.-.-":".", "--..--":",", "---...":":", "..--..":"?", ".----.":"'", "-....-":"-", "-..-.":"/", ".-..-.":"\"", ".--.-.":"@", "-...-":"=", "−.−.−−":"!"

# Variables
letter = ''
word = ''

# Main loop
while True:
    if button_a.is_pressed():
        display.show(Image('00000:'
                     '00000:'
                     '00900:'
                     '00000:'
                     '00000'
                    ))

        music.play('a')
        #letter.append('.')
        letter = letter + '.'
        
    if button_b.is_pressed():
        display.show(Image('00000:'
                     '00000:'
                     '09990:'
                     '00000:'
                     '00000'
                    ))
        
        music.play('b')
        letter = letter + '-'

    if accelerometer.was_gesture('left') | accelerometer.was_gesture('right'):
        if letter in ALPHABET:
                word = word + ALPHABET[letter]
                music.play(music.POWER_UP)
                letter = ''
        else:
            music.play(music.POWER_DOWN)
    
    sleep(1000)
    display.clear()

    if accelerometer.was_gesture('shake'):
        display.show(word)
        speech.say((word))
        