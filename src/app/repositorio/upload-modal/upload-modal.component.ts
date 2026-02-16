import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon, ModalController } from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RepositoryItem } from '../../interfaces/repository'; // Import RepositoryItem

@Component({
  selector: 'app-upload-modal',
  templateUrl: './upload-modal.component.html',
  styleUrls: ['./upload-modal.component.scss'],
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
export class UploadModalComponent implements OnInit {
  @Input() newProjectInput: RepositoryItem | undefined;
  @Output() projectSubmitted = new EventEmitter<RepositoryItem>();

  @ViewChild('fileInput') fileInput!: ElementRef;

  newProject: Omit<RepositoryItem, 'id'> = {
    title: '',
    category: '',
    description: '',
    author: '',
    tags: [],
    downloads: 0,
    likes: 0,
    date: '',
    code: ''
  };

  availableTags: { category: string; tags: string[] }[] = [
    { category: 'General', tags: ['educación', 'juego', 'herramienta', 'ciencia', 'arte', 'música', 'deporte'] },
    { category: 'Micro:bit', tags: ['LED', 'radio', 'pines', 'sensores', 'botones', 'acelerómetro', 'brújula'] },
    { category: 'Accesibilidad', tags: ['visual', 'auditiva', 'motriz', 'cognitiva', 'lectura fácil', 'CAA'] },
    { category: 'Lenguajes', tags: ['MicroPython', 'MakeCode', 'Scratch'] },
    { category: 'Conectividad', tags: ['Bluetooth', 'IoT', 'redes'] },
  ];

  constructor(private modalController: ModalController, private translate: TranslateService) {}

  ngOnInit() {
    if (this.newProjectInput) {
      this.newProject = { ...this.newProjectInput };
    }
  }

  closeModal(): void {
    this.modalController.dismiss();
  }

  resetUploadForm(): void {
    this.newProject = {
      title: '',
      category: '',
      description: '',
      author: '',
      tags: [],
      downloads: 0,
      likes: 0,
      date: '',
      code: ''
    };
  }

  toggleTagSelection(tag: string): void {
    const index = this.newProject.tags.indexOf(tag);
    if (index > -1) {
      this.newProject.tags.splice(index, 1); // Tag exists, remove it
    } else {
      this.newProject.tags.push(tag); // Tag doesn't exist, add it
    }
  }

  isTagSelected(tag: string): boolean {
    return this.newProject.tags.includes(tag);
  }

  handleDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  handleDragLeave(event: DragEvent): void {
    event.preventDefault();
  }

  handleFileDrop(event: DragEvent): void {
    event.preventDefault();
    const file = event.dataTransfer?.files[0];
    if (file && file.name.endsWith('.py')) {
      this.processFileUpload(file);
    }
  }

  handleFileInput(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.processFileUpload(file);
    }
  }

  processFileUpload(file: File): void {
    const reader = new FileReader();
    reader.onload = (e) => {
      this.newProject.code = e.target?.result as string;
    };
    reader.readAsText(file);
  }

  handleFormSubmit(): void {
    this.modalController.dismiss(this.newProject, 'submit');
  }
}
