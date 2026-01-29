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
  title: string = '';

  constructor(private http: HttpClient, private translate: TranslateService) { }

  ngOnInit() {
    this.http.get('assets/Microbit/01_Beginner/03_ConteEnrere/Countdown-main.py', { responseType: 'text' })
      .subscribe(data => {
        this.pythonCode = data;
      });
    
    this.translate.get('COUNTDOWN_PAGE.TITLE').subscribe((res: string) => {
      this.title = res;
    });
  }

}
