import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon, ModalController, IonCheckbox, IonLabel } from '@ionic/angular/standalone';
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
    IonCheckbox,
    IonLabel,
    TranslateModule,
  ],
})
export class UploadModalComponent implements OnInit {
  @Input() newProjectInput: RepositoryItem | undefined;
  @Output() projectSubmitted = new EventEmitter<RepositoryItem>();

  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild('hexFileInput') hexFileInput!: ElementRef;
  @ViewChild('instructionsFileInput') instructionsFileInput!: ElementRef;

  newProject: Omit<RepositoryItem, 'id'> = {
    title: '',
    category: '',
    description: '',
    author: '',
    level: '',
    materials: [],
    tags: [],
    downloads: 0,
    likes: 0,
    date: '',
    code: '',
    hexFile: '',
    instructionsFile: ''
  };

  availableMaterials: string[] = ['Micro:bit', 'LEDs', 'Servos', 'Sensors', 'Buzzer', 'Resistencias'];

  availableTags: { category: string; tags: string[] }[] = [
    { category: 'TAG_CATEGORIES.GENERAL', tags: ['TAGS.EDUCATION', 'TAGS.GAME', 'TAGS.TOOL', 'TAGS.SCIENCE', 'TAGS.ART', 'TAGS.MUSIC', 'TAGS.SPORT'] },
    { category: 'TAG_CATEGORIES.MICROBIT', tags: ['TAGS.LED', 'TAGS.RADIO', 'TAGS.PINS', 'TAGS.SENSORS', 'TAGS.BUTTONS', 'TAGS.ACCELEROMETER', 'TAGS.COMPASS'] },
    { category: 'TAG_CATEGORIES.ACCESSIBILITY', tags: ['TAGS.VISUAL', 'TAGS.AUDITORY', 'TAGS.MOTOR', 'TAGS.COGNITIVE', 'TAGS.EASY_READING', 'TAGS.AAC'] },
    { category: 'TAG_CATEGORIES.LANGUAGES', tags: ['TAGS.MICROPYTHON', 'TAGS.MAKECODE', 'TAGS.SCRATCH'] },
    { category: 'TAG_CATEGORIES.CONNECTIVITY', tags: ['TAGS.BLUETOOTH', 'TAGS.IOT', 'TAGS.NETWORKS'] },
  ];

  uploadedCodeFile: File | null = null;
  uploadedHexFile: File | null = null;
  uploadedInstructionsFile: File | null = null;

  constructor(private modalController: ModalController, private translate: TranslateService) {}

  ngOnInit() {
    if (this.newProjectInput) {
      this.newProject = { ...this.newProjectInput, level: '', materials: [] };
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
      level: '',
      materials: [],
      tags: [],
      downloads: 0,
      likes: 0,
      date: '',
      code: '',
      hexFile: '',
      instructionsFile: ''
    };
  }

  isPdfInstructions(): boolean {
    return this.uploadedInstructionsFile?.type === 'application/pdf' || 
           this.uploadedInstructionsFile?.name.endsWith('.pdf') || false;
  }

  toggleTagSelection(tag: string): void {
    const index = this.newProject.tags.indexOf(tag);
    if (index > -1) {
      this.newProject.tags.splice(index, 1);
    } else {
      this.newProject.tags.push(tag);
    }
  }

  isTagSelected(tag: string): boolean {
    return this.newProject.tags.includes(tag);
  }

  updateMaterials(material: string, event: any) {
    const isChecked = event.detail.checked;
    if (isChecked) {
      if (!this.newProject.materials.includes(material)) {
        this.newProject.materials.push(material);
      }
    } else {
      const index = this.newProject.materials.indexOf(material);
      if (index > -1) {
        this.newProject.materials.splice(index, 1);
      }
    }
  }

  isMaterialSelected(material: string): boolean {
    return this.newProject.materials.includes(material);
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
    this.uploadedCodeFile = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      this.newProject.code = e.target?.result as string;
    };
    reader.readAsText(file);
  }

  handleHexFileDrop(event: DragEvent): void {
    event.preventDefault();
    const file = event.dataTransfer?.files[0];
    if (file && file.name.endsWith('.hex')) {
      this.processHexFileUpload(file);
    }
  }

  handleHexFileInput(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.processHexFileUpload(file);
    }
  }

  processHexFileUpload(file: File): void {
    this.uploadedHexFile = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      this.newProject.hexFile = e.target?.result as string;
    };
    reader.readAsText(file);
  }

  handleInstructionsFileDrop(event: DragEvent): void {
    event.preventDefault();
    const file = event.dataTransfer?.files[0];
    if (file && (file.name.endsWith('.txt') || file.name.endsWith('.pdf'))) {
      this.processInstructionsFileUpload(file);
    }
  }

  handleInstructionsFileInput(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.processInstructionsFileUpload(file);
    }
  }

  processInstructionsFileUpload(file: File): void {
    this.uploadedInstructionsFile = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      this.newProject.instructionsFile = e.target?.result as string;
    };
    if (file.type === 'application/pdf') {
      // For PDF we just want to know it's uploaded, not necessarily read as text
      this.newProject.instructionsFile = 'PDF_FILE_UPLOADED';
    } else {
      reader.readAsText(file);
    }
  }

  handleFormSubmit(): void {
    this.modalController.dismiss({
      project: this.newProject,
      codeFile: this.uploadedCodeFile,
      hexFile: this.uploadedHexFile,
      instructionsFile: this.uploadedInstructionsFile
    }, 'submit');
  }
}
