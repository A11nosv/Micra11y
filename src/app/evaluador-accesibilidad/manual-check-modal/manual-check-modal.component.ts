import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon, IonSelect, IonSelectOption, ModalController, IonList, IonItem, IonLabel, IonRadioGroup, IonRadio } from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

interface Question {
  id: string;
  textKey: string;
  answer: 'yes' | 'partial' | 'no';
}

@Component({
  selector: 'app-manual-check-modal',
  templateUrl: './manual-check-modal.component.html',
  styleUrls: ['./manual-check-modal.component.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // Add this line
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonButton,
    IonIcon,
    IonSelect,
    IonSelectOption,
    IonList,
    IonItem,
    TranslateModule
  ],
})
export class ManualCheckModalComponent {
  questions: Question[] = [];

  constructor(
    private modalController: ModalController,
    private translate: TranslateService
  ) {
    this.initializeQuestions();
  }

  private initializeQuestions() {
    for (let i = 1; i <= 17; i++) {
      this.questions.push({
        id: `q${i}`,
        textKey: `MANUAL_CHECK_MODAL_QUESTION_${i}`,
        answer: 'partial' // Default to 'Parcial'
      });
    }
  }

  cancel() {
    this.modalController.dismiss(null); // Dismiss without a score
  }

  submitForm() {
    let score = 0;
    this.questions.forEach(q => {
      if (q.answer === 'yes') {
        score += 2;
      } else if (q.answer === 'partial') {
        score += 1;
      }
      // 'no' adds 0, so no action needed
    });
    this.modalController.dismiss(score); // Dismiss with the calculated score
  }
}
