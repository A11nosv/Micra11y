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
  title: string = '';

  constructor(private http: HttpClient, private translate: TranslateService) { }

  ngOnInit() {
    this.http.get('assets/Microbit/02_Intermediate/01_MissatgeSecret/Secret Message-main.py', { responseType: 'text' })
      .subscribe(data => {
        this.pythonCode = data;
      });
    
    this.translate.get('MICROBIT_PAGE.PROJECTS.SECRET.TITLE').subscribe((res: string) => {
      this.title = res;
    });
  }

}
