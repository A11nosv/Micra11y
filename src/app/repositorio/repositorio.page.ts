import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon, ModalController, ToastController } from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Title } from '@angular/platform-browser';

import { LanguageChooserComponent } from '../components/language-chooser/language-chooser.component';
import { UploadModalComponent } from './upload-modal/upload-modal.component';
import { ProjectDetailModalComponent } from './project-detail-modal/project-detail-modal.component';

import { RepositoryService } from '../services/repository.service';
import { RepositoryItem } from '../interfaces/repository';


@Component({
  selector: 'app-repositorio',
  templateUrl: 'repositorio.page.html',
  styleUrls: ['repositorio.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonButton,
    IonIcon,
    TranslateModule,
    LanguageChooserComponent
  ],
})
export class RepositorioPage implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;

  // --- Component Properties ---
  projects: RepositoryItem[] = []; // Projects now fetched from Firebase
  filteredProjects: RepositoryItem[] = [];
  selectedCategories: string[] = ['todos']; // Now an array for multiple selections
  searchTerm: string = '';

  totalProjects: number = 0;
  totalDownloads: number = 0;
  totalContributors: number = 0;
  totalCategories: number = 0;
  
  newProject: Omit<RepositoryItem, 'id'> = { // Omit 'id' as it's assigned by Firestore
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
    code: ''
  };
  uploadedTags: string[] = [];
  uploadedFile: File | null = null;

  selectedProject: RepositoryItem | null = null;
  copied: boolean = false;

  constructor(
    private translate: TranslateService,
    private modalController: ModalController,
    private toastController: ToastController,
    private repositoryService: RepositoryService, // Inject RepositoryService
    private titleService: Title
  ) {}

  ngOnInit() {
    this.titleService.setTitle('Repositorio');
    this.loadProjects(); // Load projects from Firebase
    this.selectedCategories = ['todos']; // Initialize selectedCategories
  }

  loadProjects() {
    console.log('RepositorioPage: Loading projects...');
    this.repositoryService.getProjects().subscribe({
      next: (data) => {
        console.log('RepositorioPage: Received projects:', data);
        this.projects = data;
        this.filteredProjects = [...this.projects];
        this.updateStats();
        this.renderProjects();
      },
      error: (err) => {
        console.error('RepositorioPage: Error loading projects:', err);
      }
    });
  }

  // --- Stat & Project Rendering Methods ---
  updateStats(): void {
    this.totalProjects = this.projects.length;
    this.totalDownloads = this.projects.reduce((sum, project) => sum + project.downloads, 0);
    this.totalContributors = new Set(this.projects.map(p => p.author)).size;
    this.totalCategories = new Set(this.projects.map(p => p.category)).size;
  }

  renderProjects(): void {
    this.filteredProjects = this.projects.filter(project => {
      const matchesFilter = this.selectedCategories.includes('todos') || this.selectedCategories.includes(project.category);
      const matchesSearch = project.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                            project.description.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                            project.tags.some(tag => tag.toLowerCase().includes(this.searchTerm.toLowerCase()));
      return matchesFilter && matchesSearch;
    });
  }

  filterProjects(category: string): void {
    if (category === 'todos') {
      this.selectedCategories = ['todos'];
    } else {
      if (this.selectedCategories.includes('todos')) {
        this.selectedCategories = [];
      }

      const index = this.selectedCategories.indexOf(category);
      if (index > -1) {
        this.selectedCategories.splice(index, 1);
      } else {
        this.selectedCategories.push(category);
      }

      if (this.selectedCategories.length === 0) {
        this.selectedCategories = ['todos'];
      }
    }
    this.renderProjects();
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
    return levelMap[lowercasedLevel] || level;
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
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

    modal.onWillDismiss().then(async (result) => {
      if (result.role === 'submit' && result.data) {
        const { project } = result.data;
        const submittedProject: RepositoryItem = project;

        submittedProject.date = new Date().toISOString().split('T')[0];

        // Direct add to Firestore, code is string
        this.repositoryService.addProject(submittedProject).subscribe(() => {
          this.loadProjects();
          this.presentToast(this.translate.instant('REPOSITORIO_PAGE.TOAST.PROJECT_PUBLISHED_SUCCESS'), 'success');
        }, error => {
          console.error('Error adding project:', error);
          this.presentToast(this.translate.instant('REPOSITORIO_PAGE.TOAST.PROJECT_PUBLISH_ERROR'), 'danger');
        });
      }
      this.resetUploadForm();
    });

    await modal.present();
  }

  async openProjectDetail(id: string): Promise<void> {
    const project = this.projects.find(p => p.id === id);
    if (!project) return;

    const modal = await this.modalController.create({
      component: ProjectDetailModalComponent,
      componentProps: {
        selectedProject: project,
        downloadProjectFn: (id: string) => this.downloadProject(id),
        downloadInstructionsFn: (id: string) => this.downloadInstructions(id),
        likeProjectFn: (id: string) => this.likeProject(id, new Event('click'))
      },
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
      code: ''
    };
    this.uploadedTags = [];
  }

  // --- Project Actions ---
  downloadProject(id: string, event?: Event): void {
    if (event) event.stopPropagation();
    const project = this.projects.find(p => p.id === id);
    if (project && project.code) {
      const blob = new Blob([project.code], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${project.title.toLowerCase().replace(/\s+/g, '_')}.py`;
      a.click();
      URL.revokeObjectURL(url);

      const updatedProject = { ...project, downloads: project.downloads + 1 };
      this.repositoryService.updateProject(updatedProject).subscribe();
    }
  }

  downloadInstructions(id: string, event?: Event): void {
    if (event) event.stopPropagation();
    const project = this.projects.find(p => p.id === id);
    if (project && project.instructions) {
      const blob = new Blob([project.instructions], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${project.title.toLowerCase().replace(/\s+/g, '_')}_instrucciones.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }
  }

  viewProject(id: string, event: Event): void {
    event.stopPropagation();
    this.openProjectDetail(id);
  }

  likeProject(id: string, event: Event): void {
    event.stopPropagation();
    const project = this.projects.find(p => p.id === id);
    if (project) {
      const updatedProject = { ...project, likes: project.likes + 1 };
      this.repositoryService.updateProject(updatedProject).subscribe({
        next: () => {
          // The subscription in loadProjects will handle the UI update if it's a real-time stream,
          // but here we manually update the local state for immediate feedback if needed.
          project.likes += 1;
        },
        error: (err) => console.error('Error liking project:', err)
      });
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
