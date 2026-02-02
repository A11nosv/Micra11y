import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonButton, IonIcon } from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Highlight } from 'ngx-highlightjs';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-heart',
  templateUrl: './heart.page.html',
  styleUrls: ['./heart.page.scss'],
  standalone: true,
  imports: [CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, TranslateModule, HttpClientModule, Highlight, IonButton, IonIcon, RouterModule, NgFor]
})
export class HeartPage implements OnInit {

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
  title: string = '';

  constructor(private http: HttpClient, private translate: TranslateService) { }

  ngOnInit() {
    this.http.get('assets/Microbit/01_Beginner/02_ElBatecDeLaMicrobit/Beating heart (with sound)-main.py', { responseType: 'text' })
      .subscribe(data => {
        this.pythonCode = data;
      });

    this.pythonCode_1_1 = "# Imports go at the top \nfrom microbit import * \n\n# Code in a 'while True:' loop repeats forever\nwhile True: \n\tdisplay.show(Image.HEART) \n\tsleep(500) \n\tdisplay.show(Image.HEART_SMALL) \n\tsleep(500)";
    this.pythonCode_2_1 = "import music";
    this.pythonCode_2_2 = "\tmusic.play(‘a’)";
    this.pythonCode_2_3 = "# Imports go at the top \nfrom microbit import * \nimport music \n\n# Code in a 'while True:' loop repeats forever \nwhile True: \n\tdisplay.show(Image.HEART) \n\tmusic.play(‘a’) \n\tsleep(500) \n\tdisplay.show(Image.HEART_SMALL) \n\tsleep(500)";
    this.pythonCode_3_1 = "# Variables \ntime = 500";
    this.pythonCode_3_2 = "\tmusic.play(‘c’) \n\tsleep(a)"; 
    this.pythonCode_4_1 = "\t\tif.button_a.is_pressed(): \n\t\t\ta = a + 50";
    this.pythonCode_5_1 = "\twhile a < 50:";
    this.pythonCode_6_1 = "\tmusic.play(‘c’) \n\tdisplay.show(Image.SKULL)";

    this.translate.get('HEART_PAGE.TITLE').subscribe((res: string) => {
      this.title = res;
    });
  }

}
