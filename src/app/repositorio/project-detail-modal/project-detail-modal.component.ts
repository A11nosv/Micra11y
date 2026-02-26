import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon, ModalController } from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HighlightModule } from 'ngx-highlightjs'; // Add this import
import { RepositoryItem } from '../../interfaces/repository'; // Import RepositoryItem

@Component({
  selector: 'app-project-detail-modal',
  templateUrl: './project-detail-modal.component.html',
  styleUrls: ['./project-detail-modal.component.scss'],
  standalone: true,
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
    TranslateModule,
    HighlightModule // Add HighlightModule here
  ],
})
export class ProjectDetailModalComponent implements OnInit {
  @Input() selectedProject: RepositoryItem | null = null;
  @Input() downloadProjectFn!: (id: string) => void;
  @Input() downloadInstructionsFn!: (id: string) => void;
  @Input() likeProjectFn!: (id: string) => void;

  copied: boolean = false;

  constructor(private modalController: ModalController, private translate: TranslateService) {}

  ngOnInit() {}

  closeModal(): void {
    this.modalController.dismiss();
  }

  getCategoryLabel(category: string): string {
    const categoryMap: { [key: string]: string } = {
      'accesibilidad': 'REPOSITORIO_PAGE.CATEGORIES.ACCESSIBILITY',
      'sensores': 'REPOSITORIO_PAGE.CATEGORIES.SENSORS',
      'comunicacion': 'REPOSITORIO_PAGE.CATEGORIES.COMMUNICATION',
      'educacion': 'REPOSITORIO_PAGE.CATEGORIES.EDUCATION',
      'entretenimiento': 'REPOSITORIO_PAGE.CATEGORIES.ENTERTAINMENT',
    };
    return categoryMap[category] || category;
  }

  getLevelLabel(level: string): string {
    const lowercasedLevel = level.toLowerCase();
    const levelMap: { [key: string]: string } = {
      'low': 'REPOSITORIO_PAGE.LEVELS.LOW',
      'medium': 'REPOSITORIO_PAGE.LEVELS.MEDIUM',
      'high': 'REPOSITORIO_PAGE.LEVELS.HIGH',
    };
    return levelMap[lowercasedLevel] || level; // Fallback to original level name if no translation key
  }

  downloadProject(id: string): void {
    if (this.downloadProjectFn) {
      this.downloadProjectFn(id);
    }
  }

  downloadInstructions(id: string): void {
    if (this.downloadInstructionsFn) {
      this.downloadInstructionsFn(id);
    }
  }

  likeProject(id: string): void {
    if (this.likeProjectFn) {
      this.likeProjectFn(id);
    }
  }

  copyCode(code: string): void {
    navigator.clipboard.writeText(code).then(() => {
      this.copied = true;
      setTimeout(() => {
        this.copied = false;
      }, 2000);
    });
  }
}
