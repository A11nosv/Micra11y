import { Component, OnInit } from '@angular/core'; // Removed OnInit
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon } from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core'; // Removed TranslateService from import line
// Removed LanguageService, Observable, map operator imports
import { Title } from '@angular/platform-browser';

import { LanguageChooserComponent } from '../components/language-chooser/language-chooser.component'; // Import LanguageChooserComponent

@Component({
  selector: 'app-microia',
  templateUrl: 'microia.page.html',
  styleUrls: ['microia.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon, RouterModule, TranslateModule, CommonModule, LanguageChooserComponent], // Added LanguageChooserComponent
})
export class MicroiaPage implements OnInit { // Removed implements OnInit

  constructor(private titleService: Title) {
    // Constructor logic for languageService removed
  }

  ngOnInit() {
    this.titleService.setTitle('micro:bit IA');
  }
  // Removed updateAccessibleLabel()
}