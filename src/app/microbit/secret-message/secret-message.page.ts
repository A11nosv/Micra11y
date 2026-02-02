import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonButton, IonIcon } from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Highlight } from 'ngx-highlightjs';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-secret-message',
  templateUrl: './secret-message.page.html',
  styleUrls: ['./secret-message.page.scss'],
  standalone: true,
  imports: [CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, TranslateModule, HttpClientModule, Highlight, IonButton, IonIcon, RouterModule, NgFor]
})
export class SecretMessagePage implements OnInit {

  pythonCode: string = '';
  pythonCode_1_1: string = '';
  pythonCode_1_2: string = '';
  pythonCode_1_3: string = '';
  pythonCode_1_4: string = '';
  pythonCode_1_5: string = '';
  pythonCode_2_1: string = '';
  pythonCode_2_2: string = '';
  pythonCode_2_3: string = '';
  pythonCode_3_1: string = '';
  pythonCode_4_1: string = '';
  pythonCode_4_2: string = '';
  pythonCode_5_1: string = '';
  pythonCode_5_2: string = '';
  pythonCode_5_3: string = '';
  pythonCode_6_1: string = '';
  pythonCode_6_2: string = '';
  pythonCode_6_3: string = '';
  pythonCode_6_4: string = '';
  pythonCode_6_5: string = '';
  pythonCode_7_1: string = '';
  pythonCode_7_2: string = '';
  pythonCode_8_1: string = '';
  pythonCode_9_1: string = '';
  title: string = '';

  constructor(private http: HttpClient, private translate: TranslateService) { }

  ngOnInit() {
    this.http.get('assets/Microbit/03_Advanced/01_MissatgeSecret/Secret Message-main.py', { responseType: 'text' })
      .subscribe(data => {
        this.pythonCode = data;
      });

    this.pythonCode_1_1 = "from microbit import *";
    this.pythonCode_1_2 = "while True:";
    this.pythonCode_1_3 = "\tif button_a.is_pressed():";
    this.pythonCode_1_4 = "\t\tdisplay.show(Image(‘00000:’ \n\t\t\t\t‘00000:’ \n\t\t\t\t‘00900:’ \n\t\t\t\t‘00000:’ \n\t\t\t\t‘00000’))";
    this.pythonCode_1_5 = "from microbit import * \n\n#Main loop \nwhile True: \n\tif button_a.is_pressed(): \n\t\tdisplay.show(Image(‘00000:’ \n\t\t\t\t‘00000:’ \n\t\t\t\t‘00900:’ \n\t\t\t\t‘00000:’ \n\t\t\t\t‘00000’)) \n\tif button_b.is_pressed(): \n\t\tdisplay.show(Image(‘00000:’ \n\t\t\t\t‘00000:’ \n\t\t\t\t‘09990:’ \n\t\t\t\t‘00000:’ \n\t\t\t\t‘00000’))"; 
    this.pythonCode_2_1 = "import music";
    this.pythonCode_2_2 = "\t\tmusic.play(‘a’)";
    this.pythonCode_2_3 = "# Imports \nfrom microbit import * \nimport music \n\n# Main loop \nwhile True: \n\tif button_a.is_pressed(): \n\t\tdisplay.show(Image('00000:' \n\t\t\t\t'00000' \n\t\t\t\t'00900:' \n\t\t\t\t'00000:' \n\t\t\t \t'00000' \n\t\t\t\t))\n\n\t\t\tmusic.play('a') \n\n\tif button_b.is_pressed(): \nt\t\tdisplay.show(Image('00000:' \n\t\t\t\t'00000:' \n\t\t\t\t'09990:' \n\t\t\t\t'00000:' \n\t\t\t\t'00000' \n\t\t\t\t\t)) \n\n\t\t\tmusic.play('b')"; 
    this.pythonCode_3_1 = "\t\tsleep(500) \n\t\tdisplay.clear()";
    this.pythonCode_4_1 = "'.-': 'A'";
    this.pythonCode_4_2 = "# Constant \nALPHABET = { \n'.- ':'A', '-...': 'B', '-.-.': 'C', '-..': 'D', '.': 'E', '..-.': 'F', '--.': 'G',\n '....': 'H'', '..': 'I', '.---': 'J', '-.-': 'K','.-..': 'L', '--':'M', ' -.':'N',\n '--.--':'Ñ', '-- - ':'O', '.--.':'P', '--.-':'Q', '.-.':'R', '...':'S', ' - ':'T',\n '..- ':'U', '...-':'V', '.--':'W', ' -..- ':'X', ' -.--':'Y', '--..':'Z'}";
    this.pythonCode_5_1 = "# Variables \nletter = ‘’ \nword = ‘’";
    this.pythonCode_5_2 = "\t\t\tletter = letter + '.’)";
    this.pythonCode_5_3 = "t\t\tletter. = letter + ('-')";
    this.pythonCode_6_1 = "\tif accelerometer.was_gesture('left') | accelerometer.was_gesture('right'):";
    this.pythonCode_6_2 = "\t\t\tword = word + ALPHABET[letter]";
    this.pythonCode_6_3 = "\t\t\tletter = ‘’";
    this.pythonCode_6_4 = "\t\t\t\tmusic.play(music.POWER_UP)";
    this.pythonCode_6_5 = "\t\telse: \n\t\t\tmusic.play(music.POWER_DOWN)";
    this.pythonCode_7_1 = "import speech";
    this.pythonCode_7_2 = "\tif accelerometer.was_gesture(‘shake’): \n\t\tdisplay.show(word) \n\t\tspeech.say(word) \n\t\tword = ‘’";
    this.pythonCode_8_1 = "import radio";
    this.pythonCode_9_1 = "\t\t\tradio.send(word) \n\n\t\t\tif radio.receive(): \n\t\t\t\tmsg = radio.receive() \n\n\t\t\tif msg: \n\t\t\t\tdisplay.scroll(msg) \n\t\t\t\tspeech.say((msg))";

    this.translate.get('SECRET_MESSAGE_PAGE.TITLE').subscribe((res: string) => {
      this.title = res;
    });
  }

}
