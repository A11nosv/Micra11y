# Imports
from microbit import *
import music
import speech

# Variables
game = True
turns=5
player_a=0
player_b=0


# Functions
def countdown(i):
    while i>0:
        for n in range(3):
            display.show(i)
            music.play('a')
            sleep(500)
            i=i-1

            if i==0:
                display.show(0)

def btn_pressed(btn):
    if btn == 0:
        display.show(Image.ARROW_W)
        music.play('a')

    elif btn == 1:
        display.show(Image.ARROW_E)
        music.play('b')

    sleep(1000)
    display.clear()
    music.play(music.JUMP_DOWN)
                
def on_shake(i):
    if accelerometer.is_gesture('shake'):
        if i > 0:
            countdown(i)
            music.play(music.JUMP_UP)
            i = 0

# Main loop
while game:
    on_shake(3)

    if button_a.is_pressed():
        btn_pressed(0)
        turns = turns - 1
        player_a = player_a + 1
        on_shake(3)
    
    if button_b.is_pressed():
        btn_pressed(1)
        turns = turns - 1
        player_b = player_b + 1
        on_shake(3)
        

    if turns == 0:
        game = False

        if player_a > player_b:
            display.show('A')
            speech.say('Jugador A gana')
        elif player_b > player_a:
            display.show('B')
            speech.say('Jugador B gana')