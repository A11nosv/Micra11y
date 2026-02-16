import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { RouterModule } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon, ModalController, ToastController } from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { LanguageChooserComponent } from '../components/language-chooser/language-chooser.component';
import { UploadModalComponent } from './upload-modal/upload-modal.component';
import { ProjectDetailModalComponent } from './project-detail-modal/project-detail-modal.component';

// Define the Project interface
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
  selector: 'app-repositorio',
  templateUrl: 'repositorio.page.html',
  styleUrls: ['repositorio.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule, // Add FormsModule
    RouterModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonButton,
    IonIcon,
    TranslateModule,
    LanguageChooserComponent,
    UploadModalComponent,
    ProjectDetailModalComponent
  ],
})
export class RepositorioPage implements OnInit { // Implement OnInit
  @ViewChild('fileInput') fileInput!: ElementRef;

  // --- Component Properties ---
  projects: Project[] = [
    {
      id: 1,
      title: "Bastón Inteligente",
      category: "accesibilidad",
      description: "Detector de obstáculos con retroalimentación vibratoria y sonora para asistencia en la movilidad.",
      author: "Equipo Micra11y",
      tags: ["sensores", "vibración", "sonido", "movilidad"],
      downloads: 45,
      likes: 12,
      date: "2026-02-10",
      code: `# Código del Bastón Inteligente
from microbit import *

# Ver código completo en baston_inteligente.py`
    },
    {
      id: 2,
      title: "Semáforo Sonoro",
      category: "accesibilidad",
      description: "Sistema de señalización accesible que combina luces LED con señales auditivas para personas con discapacidad visual.",
      author: "Equipo Micra11y",
      tags: ["LED", "audio", "educación", "señales"],
      downloads: 67,
      likes: 18,
      date: "2026-02-11",
      code: `# Código del Semáforo Sonoro
from microbit import *

# Ver código completo en semaforo_sonoro.py`
    },
    {
      id: 3,
      title: "Comunicador Adaptativo",
      category: "comunicacion",
      description: "Sistema de comunicación por botones personalizables con salida de voz para personas con dificultades del habla.",
      author: "Equipo Micra11y",
      tags: ["voz", "CAA", "botones", "comunicación"],
      downloads: 89,
      likes: 25,
      date: "2026-02-12",
      code: `# Código del Comunicador Adaptativo
from microbit import *
import speech

# Ver código completo en comunicador_adaptativo.py`
    }
  ];
  filteredProjects: Project[] = [];
  currentFilter: string = 'todos';
  searchTerm: string = '';

  totalProjects: number = 0;
  totalDownloads: number = 0;
  totalContributors: number = 0;
  totalCategories: number = 0;
  
  newProject: Project = {
    id: 0, // Will be assigned dynamically
    title: '',
    category: '',
    description: '',
    author: '',
    tags: [],
    downloads: 0,
    likes: 0,
    date: '', // Will be assigned dynamically
    code: ''
  };
  uploadedTags: string[] = [];
  uploadedFile: File | null = null;

  selectedProject: Project | null = null;
  copied: boolean = false;

  constructor(private translate: TranslateService, private modalController: ModalController, private toastController: ToastController) {}

  ngOnInit() {
    this.filteredProjects = [...this.projects];
    this.updateStats();
    this.renderProjects(); // Initial render
  }

  // --- Stat & Project Rendering Methods ---
  updateStats(): void {
    this.totalProjects = this.projects.length;
    this.totalDownloads = this.projects.reduce((sum, project) => sum + project.downloads, 0);
    // For contributors and categories, we'd need more complex logic based on actual data
    // For now, use fixed values or simple counts based on available data
    this.totalContributors = new Set(this.projects.map(p => p.author)).size;
    this.totalCategories = new Set(this.projects.map(p => p.category)).size;
  }

  renderProjects(): void {
    this.filteredProjects = this.projects.filter(project => {
      const matchesFilter = this.currentFilter === 'todos' || project.category === this.currentFilter;
      const matchesSearch = project.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                            project.description.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                            project.tags.some(tag => tag.toLowerCase().includes(this.searchTerm.toLowerCase()));
      return matchesFilter && matchesSearch;
    });
  }

  filterProjects(category: string): void {
    this.currentFilter = category;
    this.renderProjects();
  }

  getCategoryLabel(category: string): string {
    // This will return the translation key for the category
    // The HTML will then use the translate pipe on this key
    const categoryMap: { [key: string]: string } = {
      'accesibilidad': 'REPOSITORIO_PAGE.CATEGORIES.ACCESSIBILITY',
      'sensores': 'REPOSITORIO_PAGE.CATEGORIES.SENSORS',
      'comunicacion': 'REPOSITORIO_PAGE.CATEGORIES.COMMUNICATION',
      'educacion': 'REPOSITORIO_PAGE.CATEGORIES.EDUCATION',
      'entretenimiento': 'REPOSITORIO_PAGE.CATEGORIES.ENTERTAINMENT',
    };
    return categoryMap[category] || category; // Fallback to category name if no translation key
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
    // Use the current language from TranslateService
    return date.toLocaleDateString(this.translate.currentLang || 'en-US', options);
  }

  // --- Modals Methods ---
  async openUploadModal(): Promise<void> {
    const modal = await this.modalController.create({
      component: UploadModalComponent,
      componentProps: {
        newProjectInput: this.newProject,
      },
    });

    modal.onWillDismiss().then((result) => {
      if (result.role === 'submit' && result.data) {
        const submittedProject: Project = result.data;
        submittedProject.id = this.projects.length + 1;
        submittedProject.date = new Date().toISOString().split('T')[0];
        this.projects.push(submittedProject);
        this.updateStats();
        this.renderProjects();
        this.presentToast(this.translate.instant('REPOSITORIO_PAGE.TOAST.PROJECT_PUBLISHED_SUCCESS'), 'success');
      }
      this.resetUploadForm(); // Reset the form after modal dismisses
    });

    await modal.present();
  }

  async openProjectDetail(id: number): Promise<void> {
    this.selectedProject = this.projects.find(p => p.id === id) || null;
    if (!this.selectedProject) {
      return;
    }

    const modal = await this.modalController.create({
      component: ProjectDetailModalComponent,
      componentProps: {
        selectedProject: this.selectedProject,
      },
    });

    modal.onWillDismiss().then((result) => {
      // Handle any dismissal logic if needed
    });

    await modal.present();
  }

  async presentToast(message: string, color: string = 'primary') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color,
    });
    toast.present();
  }

  // --- Upload Form Methods ---
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
      event.preventDefault(); // Prevent form submission
      const inputElement = event.target as HTMLInputElement;
      const tag = inputElement.value.trim();
      if (tag && !this.uploadedTags.includes(tag)) {
        this.uploadedTags.push(tag);
        inputElement.value = ''; // Clear input
      }
    }
  }

  removeTag(tag: string): void {
    this.uploadedTags = this.uploadedTags.filter(t => t !== tag);
  }

  handleDragOver(event: DragEvent): void {
    event.preventDefault();
    // Add visual feedback for drag-over if needed
  }

  handleDragLeave(event: DragEvent): void {
    event.preventDefault();
    // Remove visual feedback
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

  // handleFormSubmit is now in the modal component

  // --- Project Actions ---
  downloadProject(id: number, event?: Event): void {
    if (event) event.stopPropagation();
    const project = this.projects.find(p => p.id === id);
    if (project) {
      const blob = new Blob([project.code], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${project.title.toLowerCase().replace(/\s+/g, '_')}.py`;
      a.click();
      URL.revokeObjectURL(url);

      project.downloads++;
      this.renderProjects();
    }
  }

  viewProject(id: number, event: Event): void {
    event.stopPropagation();
    this.openProjectDetail(id);
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