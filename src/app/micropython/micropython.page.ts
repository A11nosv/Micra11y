import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon } from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Highlight } from 'ngx-highlightjs';
// Removed LanguageService, Observable, map operator imports

import { LanguageChooserComponent } from '../components/language-chooser/language-chooser.component'; // Import LanguageChooserComponent

@Component({
  selector: 'app-micropython',
  templateUrl: 'micropython.page.html',
  styleUrls: ['micropython.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon, RouterModule, TranslateModule, CommonModule, HttpClientModule, Highlight, LanguageChooserComponent], // Added LanguageChooserComponent
})
export class MicropythonPage implements OnInit {
  pythonCode: string = '';

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.http.get('assets/microbit_code/beatingHeart/beatingHeart.py', { responseType: 'text' })
      .subscribe(data => {
        this.pythonCode = data;
      });
  }

  // Removed updateAccessibleLabel()
}