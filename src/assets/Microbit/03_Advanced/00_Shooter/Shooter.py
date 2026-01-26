# Imports go at the top
from microbit import *
import music
import speech
 
# Variables 
j = 0
playerA = 0
playerB = 0
result = [j, playerA, playerB]
 
# Funtions
def countdown(i):
    while i > 0:
        for n in range(4): 
            display.show(i)
            music.play('d') 
            sleep(1000)
            i = i - 1
 
        if i == 0:
            display.show(0)
 
def btn_presed(btn, result):
    if btn == 0:
        display.show(Image.ARROW_W)
        music.play('a')
        result[1] = result[1] + 1
        
    elif btn == 1:
        display.show(Image.ARROW_E)
        music.play('b')
        result[2] = result[2] + 1

    result[0] = result[0] + 1    
    return result
 
    sleep(500)
 
def on_shake(i):
    if accelerometer.is_gesture('shake'):
        if i > 0:
            countdown(i)
            music.play(music.JUMP_UP)
            i = 0
            
# Code in a 'while True:' loop repeats forever
while j < 5:
    on_shake(3)
        
    if button_a.is_pressed():
        result = btn_presed(0,result)
                
    elif button_b.is_pressed():
        result = btn_presed(1, result)
        
    j = result[0]
    
    if j == 5:
        A = result[1]
        B = result[2]
        
        if A > B:
            display.show('A')
            speech.say('Guanya el jugador A')
        else:
            display.show('B')
            speech.say('Guanya el jugador B')
        
        j = 0
    
        
