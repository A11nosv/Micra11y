# Imports
from microbit import *
import music

# Main loop
while True:
    if button_a.is_pressed():
        display.show(Image('00000:'
                     '00000:'
                     '00900:'
                     '00000:'
                     '00000'
                    ))

        music.play('a1')
        
    if button_b.is_pressed():
        display.show(Image('00000:'
                     '00000:'
                     '09990:'
                     '00000:'
                     '00000'
                    ))
        
        music.play('a3')
    sleep(1000)
    display.clear()