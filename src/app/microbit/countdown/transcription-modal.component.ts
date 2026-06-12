import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, ModalController, IonIcon } from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { close } from 'ionicons/icons';

@Component({
  selector: 'app-transcription-modal',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ title | translate }}</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="closeModal()" [ariaLabel]="'CLOSE' | translate">
            <ion-icon name="close" slot="icon-only"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="ion-text-center">
        <p style="text-align: justify; line-height: 1.5;">{{ content | translate }}</p>
        <ion-button expand="block" (click)="closeModal()">{{ 'CLOSE' | translate }}</ion-button>
      </div>
    </ion-content>
  `,
  standalone: true,
  imports: [CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon, TranslateModule],
})
export class TranscriptionModalComponent {
  @Input() title: string = '';
  @Input() content: string = '';

  constructor(private modalController: ModalController) {
    addIcons({ close });
  }

  closeModal() {
    this.modalController.dismiss();
  }
}
