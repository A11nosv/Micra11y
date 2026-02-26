# Imports go at the top
from microbit import *
import music

# Variables
i = 10

# Main loop
for index in range(11):
    display.show(i)
    if i > 0:
        set_volume(255)
        music.pitch(100)
        i = i - 1
        sleep(750)
        set_volume(0)
        sleep(250)

    if i == 0:
        set_volume(255)
        music.play(music.POWER_UP)