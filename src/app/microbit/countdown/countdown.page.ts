import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonButton, IonIcon } from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Highlight } from 'ngx-highlightjs';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-countdown',
  templateUrl: './countdown.page.html',
  styleUrls: ['./countdown.page.scss'],
  standalone: true,
  imports: [CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, TranslateModule, HttpClientModule, Highlight, IonButton, IonIcon, RouterModule]
})
export class CountdownPage implements OnInit {

  pythonCode: string = '';
  pythonCode_1_1: string = '';
  pythonCode_1_2: string = '';
  pythonCode_2_1: string = '';
  title: string = '';

  constructor(private http: HttpClient, private translate: TranslateService) { }

  ngOnInit() {
    this.http.get('assets/Microbit/01_Beginner/03_ConteEnrere/Countdown-main.py', { responseType: 'text' })
      .subscribe(data => {
        this.pythonCode = data;
      });

    this.pythonCode_1_1 = "i = 10";
    this.pythonCode_1_2 = "# Imports go at the top \nfrom microbit import * \nimport music \n\n# Variables \nstep = 10";
    this.pythonCode_2_1 =  "# Main loop \nfor index in range(11): \n\tdisplay.show(step) \n\tmusic.play(‘a’) \n\tstep = step - 1 \n\tsleep(1000)";

    this.translate.get('COUNTDOWN_PAGE.TITLE').subscribe((res: string) => {
      this.title = res;
    });
  }

}
