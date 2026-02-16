import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon, ModalController } from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
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
  ],
})
export class ProjectDetailModalComponent implements OnInit {
  @Input() selectedProject: RepositoryItem | null = null;
  @Output() projectDownloaded = new EventEmitter<string>(); // Changed to string

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

  downloadProject(id: string): void { // Changed to string
    this.projectDownloaded.emit(id);
    // The actual download logic will remain in the parent component for now
    // as it interacts with the `projects` array and global `URL` object.
    // If needed, this can be refactored to emit the project object and handle download in the modal.
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
