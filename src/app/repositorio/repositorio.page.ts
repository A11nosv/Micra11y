import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon } from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';

import { Repository } from '../interfaces/repository';

@Component({
  selector: 'app-repositorio',
  templateUrl: 'repositorio.page.html',
  styleUrls: ['repositorio.page.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, IonHeader, IonToolbar, IonTitle, IonContent, TranslateModule, IonButtons, IonButton, IonIcon],
})
export class RepositorioPage {
  
  constructor() {}
}
