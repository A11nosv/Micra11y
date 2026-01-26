# Imports go at the top
from microbit import *
import music

# Variables
i = 10

# Main loop
for index in range(11):
    display.show(i)
    music.play('a')
    i = i - 1
    sleep(1000)
