import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonButton, IonIcon } from '@ionic/angular/standalone';
import { TranslateModule, TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Highlight } from 'ngx-highlightjs';
import { RouterModule } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { map } from 'rxjs/operators'; // Import map operator
import { LanguageService } from 'src/app/services/language.service'; // Adjust path if necessary
import { LanguageChooserComponent } from 'src/app/components/language-chooser/language-chooser.component';

@Component({
  selector: 'app-duel',
  templateUrl: './duel.page.html',
  styleUrls: ['./duel.page.scss'],
  standalone: true,
  imports: [CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, TranslateModule, HttpClientModule, Highlight, IonButton, IonIcon, RouterModule, NgFor, LanguageChooserComponent]
})
export class DuelPage implements OnInit, OnDestroy {

  pythonCode: string = '';
  pythonCode_step_1: string = '';
  pythonCode_step_1_2: string = '';
  pythonCode_step_1_3: string = '';
  pythonCode_step_1_4: string = '';
  pythonCode_step_1_5: string = '';
  pythonCode_step_1_6: string = '';
  pythonCode_step_1_7: string = '';
  pythonCode_step_2_1: string = '';
  pythonCode_step_2_2: string = '';
  pythonCode_step_2_3: string = '';
  pythonCode_step_2_4: string = '';
  pythonCode_step_3_1: string = '';
  pythonCode_step_3_2: string = '';
  pythonCode_step_3_3: string = '';
  pythonCode_step_3_4: string = '';
  pythonCode_step_3_5: string = '';
  pythonCode_step_3_6: string = '';
  pythonCode_step_4_1: string = '';
  pythonCode_step_4_2: string = '';
  pythonCode_step_4_3: string = '';
  pythonCode_step_4_4: string = '';
  pythonCode_step_5_1: string = '';
  pythonCode_step_5_2: string = '';
  pythonCode_step_5_3: string = '';
  pythonCode_step_5_4: string = '';
  pythonCode_step_5_5: string = '';
  pythonCode_step_6_1: string = '';
  pythonCode_step_7_1: string = '';
  pythonCode_step_7_2: string = '';
  pythonCode_step_7_3: string = '';
  pythonCode_step_7_4: string = '';
  pythonCode_step_7_5: string = '';
  pythonCode_step_8_1: string = '';
  pythonCode_step_9_1: string = '';
  pythonCode_step_10_1: string = '';
  title: string = '';

  private languageChangeSubscription: Subscription | undefined; // Keep for title translation, but add languageService subscription for label

  constructor(
    private http: HttpClient,
    private translate: TranslateService,
    private languageService: LanguageService // Inject LanguageService
  ) {
  }

  ngOnInit() {
    this._loadPythonCode();
    this._setTranslatedTitle();

    // Subscribe to language changes for title
    this.languageChangeSubscription = this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this._setTranslatedTitle();
    });
  }

  ngOnDestroy() {
    // Unsubscribe to prevent memory leaks
    if (this.languageChangeSubscription) {
      this.languageChangeSubscription.unsubscribe();
    }
  }

  private _loadPythonCode() {
    this.http.get('assets/Microbit/03_Advanced/00_Shooter/Shooter.py', { responseType: 'text' })
      .subscribe(data => {
        this.pythonCode = data;
      });
    
    this.pythonCode_step_1 = "from Microbit Import *";
    this.pythonCode_step_1_2 = "while True:";
    this.pythonCode_step_1_3 = "if button_a_is.pressed(): \n\tdisplay.show(Image.ARROW.W)";
    this.pythonCode_step_1_4 = "if button_b_is.pressed(): \n\tdisplay.show(Image.ARROW.E)";
    this.pythonCode_step_1_5 = "import music";
    this.pythonCode_step_1_6 = "music.play(‘a’)";
    this.pythonCode_step_1_7 = "music.play(‘b’)";
    this.pythonCode_step_2_1 = "# Variables \n step = 3";
    this.pythonCode_step_2_2 = "while True: \n\tfor index in range(4): \n\t\tdisplay.show(step) \n\t\tmusic.play(‘a’) \n\t\tstep = step - 1 \n\t\tsleep(1000)";
    this.pythonCode_step_2_3 = "while True: \n\twhile step > 0: \n\t\tfor index in range(3): \n\t\t\tdisplay.show(step) \n\t\t\tmusic.play(‘a’) \n\t\t\tstep = step - 1 \n\t\t\tsleep(1000) \n\n\t\t\t if step == 0: \n\t\t\t\tdisplay.show(0) \n\t\t\t\tmusic.play(music.JUMP_UP)";
    this.pythonCode_step_2_4 = "while True: \n\twhile step > 0: \n\t\tfor n in range(3):  \n\t\t\tdisplay.show(step) \n\t\t\tmusic.pitch(100) \n\t\t\tsleep(1000) \n\t\t\tstep = step - 1 \n\n\t\t\tif step == 0: \n\t\t\t\tdisplay.show(0) \n\t\t\t\tmusic.play(music.JUMP_UP) \n\n\t\tif button_a.is_pressed(): \n\t\t\tdisplay.show(Image.ARROW_W) \n\t\t\tmusic.play('a') \n\t\t\tsleep(500) \n\n\t\telif button_b.is_pressed(): \n\t\t\tdisplay.show(Image.ARROW_E) \n\t\t\tmusic.play('b') \n\t\t\tsleep(500)";
    this.pythonCode_step_3_1 = "def countdown(step): \n\n\twhile step > 0: \n\t\tfor n in range(3): \n\t\t\tdisplay.show(step) \n\t\t\tmusic.play(‘a’) \n\t\t\tsleep(500) \n\t\t\tstep = step - 1 \n\n\t\tif step == 0: \n\t\t\tdisplay.show(0)";
    this.pythonCode_step_3_2 = "\tif step > 0: \n\t\tcountdown(istep) \n\t\tmusic.play(music.JUMP_UP) \n\t\tstep = 0";
    this.pythonCode_step_3_3 = "def btn_presed(btn):\n\n\tif btn == 0: \n\t\tdisplay.show(Image.ARROW_W) \n\t\tmusic.play('a') \n\telif btn == 1: \n\t\tdisplay.show(Image.ARROW_E) \n\t\tmusic.play('b') \n\tsleep(1000)";
    this.pythonCode_step_3_4 = "\tif button_a.is_pressed():\n\t\tbtn_presed(0) \n\telif button_b.is_pressed(): \n\t\tbtn_presed(1)";
    this.pythonCode_step_3_5 = "def on_shake(step): \n\tif accelerometer.is_gesture('shake'): \n\t\tif step > 0: \n\t\t\tcountdown(step) \n\t\t\tmusic.play(music.JUMP_UP) \n\t\t\tstep = 0";
    this.pythonCode_step_3_6 = "while True: \n\ton_shake(3)";
    this.pythonCode_step_4_1 = "while True: \n\ton_shake(3) \n\n\tif button_a.is_pressed(): \n\t\tbtn_presed(0) \n\telif button_b.is_pressed(): \n\t\tbtn_presed(1)";
    this.pythonCode_step_4_2 = "# Variables \ngame = True \nturns = 5";
    this.pythonCode_step_4_3 = "while game:";
    this.pythonCode_step_4_4 = "\tif turns == 0: \n\t\tgame == False";
    this.pythonCode_step_5_1 = "import speech";
    this.pythonCode_step_5_2 = "player_a = 0 \nplayer_b = 0";
    this.pythonCode_step_5_3 = "\t\tplayer_a = player_a + 1";
    this.pythonCode_step_5_4 = "\t\tplayer_b = player_b + 1";
    this.pythonCode_step_5_5 = "\tif player_a > player_b: \n\t\tdisplay.show(‘A’) \n\t\tspeech.say(‘jugador A gana’) \n\telif player_b > player_a: \n\t\tdisplay.show(‘B’) \n\t\tspeech.say(‘jugador B gana’)";
    this.pythonCode_step_6_1 = "import radio";
    this.pythonCode_step_7_1 = "def players_paring(): \n\tradio.on() \n\tradio.config(group = 4)";
    this.pythonCode_step_7_2 = "def on_shake(interval, press): \n\tif accelerometer.is_gesture('shake'): \n\t\tplayers_pairing() \n\n\t\tif interval > 0: \n\t\t\tcountdown(interval) \n\t\t\tmusic.play(music.JUMP_UP) \n\t\t\tinterval = 0 \n\t\t\tpress = True \n\treturn press";
    this.pythonCode_step_7_3 = "press = on_shake(3, result)";
    this.pythonCode_step_7_4 = "if (button_a.is_pressed() | button_b.is_pressed()) & press:";
    this.pythonCode_step_7_5 = "\t\tradio.send('0') \n\t\tpress = False \n\t\tmsg = False \n\t\twinner = True \n\t\tmusic.play('b')";
    this.pythonCode_step_8_1 = "\tif radio.receive(): \n\t\tmsg = False \n\n\t\tif press: \n\t\t\tdisplay.show(Image.ANGRY) \n\t\t\tmusic.play(music.POWER_DOWN)";
    this.pythonCode_step_9_1 = "\tif winner: \n\t\tscore = score + 1 \n\t\tdisplay.show(Image.HAPPY) \n\t\tmusic.play(music.POWER_UP)"; 
    this.pythonCode_step_10_1 = "\tif pin_logo.is_touched(): \n\trounds = rounds + 1 \n\n\t\tif rounds < 5: \n\t\t\tmsg = True \n\t\telse: \n\t\t\tif score >= 3: \n\t\t\t\tspeech.say('Guanyes') \n\t\t\t\t\tdisplay.show(Image.FABULOUS) \n\t\t\t\tmusic.play(music.PYTHON) \n\t\t\telse: \n\t\t\t\tspeech.say('Perds') \n\t\t\t\tdisplay.show(Image.SKULL) \n\t\t\tmusic.play(music.FUNERAL)";
  }

  private _setTranslatedTitle() {
    this.translate.get('DUEL_PAGE.TITLE').subscribe((res: string) => {
      this.title = res;
    });
  }



}