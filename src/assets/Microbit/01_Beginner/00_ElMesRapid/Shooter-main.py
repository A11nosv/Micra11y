# Imports
from microbit import *
import music
   
# Main loop
while True:
    if button_a.is_pressed():
        display.show((Image.ARROW_W))
        music.play('a')
    
    if button_b.is_pressed():
        display.show((Image.ARROW_E))
        music.play('b')