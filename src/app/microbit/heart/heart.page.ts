import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonButton, IonIcon } from '@ionic/angular/standalone';
import { TranslateModule, TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Highlight } from 'ngx-highlightjs';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs'; // Import Subscription

@Component({
  selector: 'app-heart',
  templateUrl: './heart.page.html',
  styleUrls: ['./heart.page.scss'],
  standalone: true,
  imports: [CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, TranslateModule, HttpClientModule, Highlight, IonButton, IonIcon, RouterModule, NgFor]
})
export class HeartPage implements OnInit, OnDestroy {

  pythonCode: string = '';
  pythonCode_1_1: string = '';
  pythonCode_2_1: string = '';
  pythonCode_2_2: string = '';
  pythonCode_2_3: string = '';
  pythonCode_3_1: string = '';
  pythonCode_3_2: string = '';
  pythonCode_4_1: string = '';
  pythonCode_5_1: string = '';
  pythonCode_6_1: string = '';
  pythonCode_7_1: string = '';
  pythonCode_8_1: string = '';
  pythonCode_9_1: string = '';
  pythonCode_10_1: string = '';
  pythonCode_10_2: string = '';
  pythonCode_10_3: string = '';
  pythonCode_11_1: string = '';
  pythonCode_11_2: string = '';
  title: string = '';
  private languageChangeSubscription: Subscription | undefined; // Declare subscription and initialize to undefined
  
    constructor(private http: HttpClient, private translate: TranslateService) { }
  
    ngOnInit() {
      this._loadPythonCode();
      this._setTranslatedTitle();
  
      // Subscribe to language changes
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
      this.http.get('assets/Microbit/03_Advanced/02_Micros_Heart/Micros_Heart.py', { responseType: 'text' })
        .subscribe(data => {
          this.pythonCode = data;
        });
  
      this.pythonCode_1_1 = "# Imports go at the top \nfrom microbit import * \n\n# Code in a 'while True:' loop repeats forever\nwhile True: \n\tdisplay.show(Image.HEART) \n\tsleep(500) \n\tdisplay.show(Image.HEART_SMALL) \n\tsleep(500)";
      this.pythonCode_2_1 = "import music";
      this.pythonCode_2_2 = "\tmusic.play(‘a’)";
      this.pythonCode_2_3 = "# Imports go at the top \nfrom microbit import * \nimport music \n\n# Code in a 'while True:' loop repeats forever \nwhile True: \n\tdisplay.show(Image.HEART) \n\tmusic.play(‘a’) \n\tsleep(500) \n\tdisplay.show(Image.HEART_SMALL) \n\tsleep(500)";
      this.pythonCode_3_1 = "# Variables \nbeats = 500";
      this.pythonCode_3_2 = "\tmusic.play(‘c’) \n\tsleep(beats)";
      this.pythonCode_4_1 = "\t\tif.button_a.is_pressed(): \n\t\t\tbeats = beats + 50";
      this.pythonCode_5_1 = "\twhile beats < 50:";
      this.pythonCode_6_1 = "\tmusic.play(‘c’) \n\tdisplay.show(Image.SKULL)";
      this.pythonCode_7_1 = "beats = 769.23 \nfreq=75";
      this.pythonCode_8_1 = "\tif button_b.is_pressed(): \n\t\tbeats = beats+ 50"; 
      this.pythonCode_9_1 = "lives = True";
      this.pythonCode_10_1 = "\twhile lives:"; 
      this.pythonCode_10_2 = "while lives:";
      this.pythonCode_10_3 = "\tif beats < 598.80 or beats > 1000: \n\t\tlives = false";
      this.pythonCode_11_1 = "\tif button_a.is_pressed() or accelerometer.was_gesture(‘shake’):";
      this.pythonCode_11_2 = "\tif button_b.is_pressed() or pin_logo.is_touched():";
    }

    private _setTranslatedTitle() {
        this.translate.get('HEART_PAGE.TITLE').subscribe((res: string) => {
            this.title = res;
        });
    }
  
    getImageSrc(): string {
      const lang = this.translate.currentLang;
      switch (lang) {
        case 'ca':
          return 'assets/img/formula_ca.png';
        case 'en':
          return 'assets/img/formula_en.png';
        case 'eu':
          return 'assets/img/formula_eu.png';
        case 'gl':
          return 'assets/img/formula_gl.png';
        case 'es':
        default:
          return 'assets/img/formula_es.png';
      }
    }
  
  }
