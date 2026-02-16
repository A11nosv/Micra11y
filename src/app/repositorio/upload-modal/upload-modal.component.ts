import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon, ModalController } from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  author: string;
  tags: string[];
  downloads: number;
  likes: number;
  date: string;
  code: string;
}

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
  @Input() newProjectInput: Project | undefined;
  @Output() projectSubmitted = new EventEmitter<Project>();

  @ViewChild('fileInput') fileInput!: ElementRef;

  newProject: Project = {
    id: 0,
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
  uploadedTags: string[] = [];
  uploadedFile: File | null = null;

  constructor(private modalController: ModalController, private translate: TranslateService) {}

  ngOnInit() {
    if (this.newProjectInput) {
      this.newProject = { ...this.newProjectInput };
      this.uploadedTags = [...this.newProjectInput.tags];
    }
  }

  closeModal(): void {
    this.modalController.dismiss();
  }

  resetUploadForm(): void {
    this.newProject = {
      id: 0,
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
    this.uploadedTags = [];
    this.uploadedFile = null;
  }

  addTag(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      const inputElement = event.target as HTMLInputElement;
      const tag = inputElement.value.trim();
      if (tag && !this.uploadedTags.includes(tag)) {
        this.uploadedTags.push(tag);
        inputElement.value = '';
      }
    }
  }

  removeTag(tag: string): void {
    this.uploadedTags = this.uploadedTags.filter(t => t !== tag);
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
    this.uploadedFile = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      this.newProject.code = e.target?.result as string;
    };
    reader.readAsText(file);
  }

  handleFormSubmit(): void {
    this.newProject.tags = [...this.uploadedTags];
    this.projectSubmitted.emit(this.newProject);
    this.modalController.dismiss(this.newProject, 'submit');
  }
}
