import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonButton, IonIcon } from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Highlight } from 'ngx-highlightjs';
import { RouterModule } from '@angular/router';
import { Observable, Subscription } from 'rxjs'; // Import Observable and Subscription
import { map } from 'rxjs/operators'; // Import map operator
import { LanguageService } from 'src/app/services/language.service'; // Import LanguageService
import { LanguageChooserComponent } from '../../components/language-chooser/language-chooser.component'; // Add this import

@Component({
  selector: 'app-stone-paper-scissors',
  templateUrl: './stone-paper-scissors.page.html',
  styleUrls: ['./stone-paper-scissors.page.scss'],
  standalone: true,
  imports: [CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, TranslateModule, HttpClientModule, Highlight, IonButton, IonIcon, RouterModule, NgFor, LanguageChooserComponent]
})
export class StonePaperScissorsPage implements OnInit {

  pythonCode: string = '';
  pythonCode_1_1: string = '';
  pythonCode_2_1: string = '';
  pythonCode_3_1: string = '';
  pythonCode_4_1: string = '';
  pythonCode_5_1: string = '';
  pythonCode_5_2: string = '';
  pythonCode_6_1: string = '';
  pythonCode_7_1: string = '';
  pythonCode_8_1: string = '';
  pythonCode_9_1: string = '';
  pythonCode_10_1: string = '';
  pythonCode_11_1: string = '';
  pythonCode_11_2: string = '';
  pythonCode_11_3: string = '';
  pythonCode_11_4: string = '';
  pythonCode_12_1: string = '';
  pythonCode_13_1: string = '';
  pythonCode_13_2: string = '';
  pythonCode_13_3: string = '';
  pythonCode_14_1: string = '';
  pythonCode_14_2: string = '';
  pythonCode_15_1: string = '';
  pythonCode_16_1: string = '';
  pythonCode_17_1: string = '';
  pythonCode_17_2: string = '';
  pythonCode_18_1: string = '';
  pythonCode_19_1: string = '';
  title: string = '';

  currentLanguageFlag$: Observable<string>; // New property
  accessibleLabel: string = ''; // New property

  private languageChangeSubscription: Subscription | undefined; // For title and accessible label updates

  constructor(
    private http: HttpClient,
    private translate: TranslateService,
    private languageService: LanguageService // Inject LanguageService
  ) {
    this.currentLanguageFlag$ = this.languageService.currentLanguage$.pipe(
      map(() => this.languageService.getCurrentLanguageFlag())
    );
  }

  ngOnInit() {
    this.http.get('assets/Microbit/03_Advanced/04_PedraPapaerTisora/PedraPaperTisora.py', { responseType: 'text' })
      .subscribe(data => {
        this.pythonCode = data;
      });

    this.pythonCode_1_1 = "# Imports \nfrom microbit import * \nimport random \nimport speech";
    this.pythonCode_2_1 = "# Main Loop \nwhile True: \n\tif accelerometer.was_gesture('shake'): \n\t\ttool = random.randint(0, 2) \n\t\tif tool == 0: \n\t\t\tdisplay.show(Image.SQUARE_SMALL) \n\t\telif tool == 1: \n\t\t\tdisplay.show(Image.SQUARE) \n\t\telse: \n\t\t\tdisplay.show(Image.SCISSORS)";
    this.pythonCode_3_1 = "tool = random.randint(a,b)";
    this.pythonCode_4_1 = "\tspeech.say('Pedra') \n\tspeech.say('Paper') \n\tspeech.say('Tissora')";
    this.pythonCode_5_1 = "import music')";
    this.pythonCode_5_2 = "\tmusic.play(music.RINGTONE) \n\tmusic.play(music.JUMP_DOWN) \n\tmusic.play(music.JUMP_UP)";
    this.pythonCode_6_1 = "import radio";
    this.pythonCode_7_1 = "\tradio.config(group=12)";
    this.pythonCode_8_1 = "\tradio.send(str(tool)) \n\trecieved=radio.receive() \n\tresult = '';";
    this.pythonCode_9_1 = "\tif tool == 0: \n\t\tif recieved == '1'': \n\t\t\tresult = 'Perds' \n\t\telif recieved == '2'': \n\t\t\tresult = 'Guanyes' \n\telif tool == 1: \n\t\tif recieved == '0': \n\t\t\tresult = 'Guanyes' \n\t\telif recieved == '2': \n\t\t\tresult = 'Perds' \n\telif tool == 2: \n\t\tif recieved == '0'': \n\t\t\tresult = 'Perds' \n\t\telif recieved == '1': \n\t\t\tresult = 'Guanyes'";
    this.pythonCode_10_1 = "\tif result == 'Guanyes': \n\t\tdisplay.show(Image.SMILE) \n\t\tmusic.play(music.PYTHON) \n\t\tspeech.say('Guanyes') \n\telif result == 'Perds': \n\t\tdisplay.show(Image.SAD) \n\t\tmusic.play(music.FUNERAL) \n\t\tspeech.say('Perds') \n\telif result == 'Empatas':  \n\t\tdisplay.show(Image.ASLEEP) \n\t\tmusic.play(music.WAWAWAWAA) \n\t\tspeech.say('Empat')";
    this.pythonCode_11_1 = "# Functions \ndef Trie(tool): \n\tif tool == 0: \n\t\tdisplay.show(Image.SQUARE_SMALL) \n\t\tspeech.say('Pedra') \n\telif tool == 1: \n\t\tdisplay.show(Image.SQUARE) \n\t\tspeech.say('Paper') \n\telse: \n\t\tdisplay.show(Image.SCISSORS); \n\t\tspeech.say('Tisores')";
    this.pythonCode_11_2 = "Tries(tool)";
    this.pythonCode_11_3 = "def Comparison(tool, recieved): \n\tresult = '' \n\n\tif tool == 0: \n\t\tif recieved == '1'': \n\t\t\tresult = 'Perds' \n\t\telif recieved == '2': \n\t\t\tresult = 'Guanyes' \n\telif tool == 1: \n\t\tif recieved == '0': \n\t\t\tresult = 'Guanyes' \n\t\telif recieved == '2': \n\t\t\tresult = 'Perds' \n\telif tool == 2: \n\t\tif recieved == '0': \n\t\t\tresult = 'Perds' \n\t\telif recieved == '1': \n\t\t\tresult = 'Guanyes' \n\n\treturn result";
    this.pythonCode_11_4 = "result = Comparison(tool, recieved)";
    this.pythonCode_12_1 = "\tif pin_logo.is_touched(): \n\t\tradio.send(str(tool)) \n\t\trecieved = radio.receive() \n\n\t\tresult = Comparison(tool, recieved) \n\n\t\tWinner(result)";
    this.pythonCode_13_1 = "# Variables \nturn = True";
    this.pythonCode_13_2 = "if accelerometer.was_gesture('shake') & turn:";
    this.pythonCode_13_3 = "tool = 10";
    this.pythonCode_14_1 = "def Clean(tool, turn, result): \n\ttool = 10 \n\tturn = True \n\tresult = ''";
    this.pythonCode_14_2 = "\t\tsleep(2000) \n\n\t\tClean(tool, turn, result)";
    this.pythonCode_15_1 = "\tif button_a.was_pressed() & turn: \n\t\tturn = False \n\t\ttool = 0 \n\n\t\tTrie(tool) \n\telif button_b.was_pressed() & turn: \n\t\tturn = False \n\t\ttool = 1 \n\n\t\tTrie(tool) \n\telif pin_logo.is_touched() & turn: \n\t\tturn = False \n\t\ttool = 3 \n\n\t\tTrie(tool) \n\n\tsleep(500)";
    this.pythonCode_16_1 = "if accelerometer.was_gesture('shake'):";
    this.pythonCode_17_1 = "count = 0 \npoints = 0";
    this.pythonCode_17_2 = "\tif result != 'Empatas': \n\t\tcount = count + 1";
    this.pythonCode_18_1 = "\t\tif result == 'Guanyes': \n\t\t\tpoints = points + 1";
    this.pythonCode_19_1 = "\t\tif points > 2: \n\t\t\tdisplay.show(Image.SMILE) \n\t\t\tspeech.say('Guanyes') \n\t\t\tmusic.play(music.PYTHON)\n\t\telif points < 3: \n\t\t\tdisplay.show(Image.SAD) \n\t\t\tspeech.say('Perds') \n\t\t\tmusic.play(music.FUNERAL)";

    this.translate.get('RPS_PAGE.TITLE').subscribe((res: string) => {
      this.title = res;
    });

    this.updateAccessibleLabel(); // Call to initialize accessibleLabel

    // Subscribe to language changes for title and accessible label
    this.languageChangeSubscription = this.translate.onLangChange.subscribe(() => {
      this.translate.get('RPS_PAGE.TITLE').subscribe((res: string) => {
        this.title = res;
      });
      this.updateAccessibleLabel(); // Also update accessibleLabel on language change
    });
  }

  // New method to update accessible label
  private updateAccessibleLabel() {
    this.accessibleLabel = this.languageService.getAccessibleLabel();
  }

  ngOnDestroy() {
    if (this.languageChangeSubscription) {
      this.languageChangeSubscription.unsubscribe();
    }
  }
}