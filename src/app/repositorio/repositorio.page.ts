import { Component } from '@angular/core'; // Removed OnInit
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon } from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';

import { LanguageChooserComponent } from '../components/language-chooser/language-chooser.component'; // Import LanguageChooserComponent

import { Repository } from '../interfaces/repository';

@Component({
  selector: 'app-repositorio',
  templateUrl: 'repositorio.page.html',
  styleUrls: ['repositorio.page.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, IonHeader, IonToolbar, IonTitle, IonContent, TranslateModule, IonButtons, IonButton, IonIcon, LanguageChooserComponent],
})
export class RepositorioPage { // Removed implements OnInit

  constructor() {
    // Constructor logic for languageService removed
  }

  // Removed ngOnInit
  // Removed updateAccessibleLabel()
}