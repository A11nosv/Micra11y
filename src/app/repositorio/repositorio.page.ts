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
    code: '',
    hexFile: '',
    instructionsFile: ''
  };
  uploadedTags: string[] = [];
  uploadedFile: File | null = null;
  uploadedHexFile: File | null = null;

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
    this.repositoryService.getProjects().subscribe(data => {
      this.projects = data;
      this.filteredProjects = [...this.projects];
      this.updateStats();
      this.renderProjects();
    });
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
      // If 'todos' is currently selected, deselect it
      if (this.selectedCategories.includes('todos')) {
        this.selectedCategories = [];
      }

      const index = this.selectedCategories.indexOf(category);
      if (index > -1) {
        this.selectedCategories.splice(index, 1); // Deselect if already selected
      } else {
        this.selectedCategories.push(category); // Select if not selected
      }

      // If no other categories are selected, default back to 'todos'
      if (this.selectedCategories.length === 0) {
        this.selectedCategories = ['todos'];
      }
    }
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

  getLevelLabel(level: string): string {
    const lowercasedLevel = level.toLowerCase();
    const levelMap: { [key: string]: string } = {
      'low': 'REPOSITORIO_PAGE.LEVELS.LOW',
      'medium': 'REPOSITORIO_PAGE.LEVELS.MEDIUM',
      'high': 'REPOSITORIO_PAGE.LEVELS.HIGH',
    };
    return levelMap[lowercasedLevel] || level; // Fallback to original level name if no translation key
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
        newProjectInput: this.newProject, // This will be an an empty RepositoryItem structure
      },
    });

    modal.onWillDismiss().then(async (result) => { // Added async here
      if (result.role === 'submit' && result.data) {
        const { project, codeFile, hexFile, instructionsFile } = result.data;
        const submittedProject: RepositoryItem = project;

        // Upload Python code
        if (codeFile) {
          try {
            const uploadedResult = await this.repositoryService.uploadCodeFile(codeFile, submittedProject.title).toPromise();
            submittedProject.code = uploadedResult || '';
          } catch (error) {
            console.error('Error uploading code file:', error);
            this.presentToast(this.translate.instant('REPOSITORIO_PAGE.TOAST.FILE_UPLOAD_ERROR'), 'danger');
            return;
          }
        }

        // Upload HEX file
        if (hexFile) {
          try {
            const hexUploadedResult = await this.repositoryService.uploadHexFile(hexFile, submittedProject.title).toPromise();
            submittedProject.hexFile = hexUploadedResult || '';
          } catch (error) {
            console.error('Error uploading hex file:', error);
            this.presentToast(this.translate.instant('REPOSITORIO_PAGE.TOAST.HEX_FILE_UPLOAD_ERROR'), 'danger');
            return;
          }
        }

        // Upload Instructions file
        if (instructionsFile) {
          try {
            const instructionsUploadedResult = await this.repositoryService.uploadInstructionsFile(instructionsFile, submittedProject.title).toPromise();
            submittedProject.instructionsFile = instructionsUploadedResult || '';
          } catch (error) {
            console.error('Error uploading instructions file:', error);
            this.presentToast(this.translate.instant('REPOSITORIO_PAGE.TOAST.INSTRUCTIONS_FILE_UPLOAD_ERROR'), 'danger');
            return;
          }
        }

        // Assign current date
        submittedProject.date = new Date().toISOString().split('T')[0];

        // Add to Firestore
        this.repositoryService.addProject(submittedProject).subscribe(() => {
          this.loadProjects(); // Reload projects from Firebase
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

  async openProjectDetail(id: string): Promise<void> { // id is now string
    this.repositoryService.getProjectById(id).subscribe(async project => { // Added async for inner await
      this.selectedProject = project;
      if (!this.selectedProject) {
        // Handle case where project is not found, e.g., show a toast or navigate back
        this.presentToast(this.translate.instant('REPOSITORIO_PAGE.TOAST.PROJECT_NOT_FOUND'), 'danger');
        return;
      }

      const modal = await this.modalController.create({
        component: ProjectDetailModalComponent,
        componentProps: {
          selectedProject: this.selectedProject,
          downloadProjectFn: (id: string) => this.downloadProject(id),
          downloadHexFn: (id: string) => this.downloadHex(id),
          downloadInstructionsFn: (id: string) => this.downloadInstructions(id)
        },
      });

      modal.onWillDismiss().then((result) => {
        // Handle any dismissal logic if needed
      });

      await modal.present(); // Added await here
    });
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
      code: '',
      hexFile: '',
      instructionsFile: ''
    };
    this.uploadedTags = [];
    this.uploadedFile = null;
    this.uploadedHexFile = null;
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
  downloadProject(id: string, event?: Event): void { // id is now string
    if (event) event.stopPropagation();
    const project = this.projects.find(p => p.id === id); // Still finding from local array after loading from Firebase
    if (project && project.code) {
      // Assuming project.code is now the download URL
      fetch(project.code)
        .then(response => response.text())
        .then(codeContent => {
          const blob = new Blob([codeContent], { type: 'text/plain' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${project.title.toLowerCase().replace(/\s+/g, '_')}.py`;
          a.click();
          URL.revokeObjectURL(url);

          // Update downloads count in Firebase
          if (project.id) {
            const updatedProject = { ...project, downloads: project.downloads + 1 };
            this.repositoryService.updateProject(updatedProject).subscribe(() => {
              this.loadProjects(); // Reload to reflect updated download count
            }, error => {
              console.error('Error updating project download count:', error);
            });
          }
        })
        .catch(error => {
          console.error('Error downloading project code:', error);
          this.presentToast(this.translate.instant('REPOSITORIO_PAGE.TOAST.CODE_DOWNLOAD_ERROR'), 'danger');
        });
    } else {
      this.presentToast(this.translate.instant('REPOSITORIO_PAGE.TOAST.PROJECT_NOT_FOUND'), 'danger');
    }
  }

  downloadHex(id: string, event?: Event): void {
    if (event) event.stopPropagation();
    const project = this.projects.find(p => p.id === id);
    if (project && project.hexFile) {
      fetch(project.hexFile)
        .then(response => response.text())
        .then(hexContent => {
          const blob = new Blob([hexContent], { type: 'text/plain' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${project.title.toLowerCase().replace(/\s+/g, '_')}.hex`;
          a.click();
          URL.revokeObjectURL(url);
          
          // Optionally update download count here too
        })
        .catch(error => {
          console.error('Error downloading HEX file:', error);
          this.presentToast(this.translate.instant('REPOSITORIO_PAGE.TOAST.HEX_DOWNLOAD_ERROR'), 'danger');
        });
    }
  }

  downloadInstructions(id: string, event?: Event): void {
    if (event) event.stopPropagation();
    const project = this.projects.find(p => p.id === id);
    if (project && project.instructionsFile) {
      fetch(project.instructionsFile)
        .then(response => response.blob())
        .then(blob => {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          // Try to detect extension or default to txt/pdf
          const isPdf = project.instructionsFile!.toLowerCase().includes('.pdf');
          a.download = `${project.title.toLowerCase().replace(/\s+/g, '_')}_instrucciones${isPdf ? '.pdf' : '.txt'}`;
          a.click();
          URL.revokeObjectURL(url);
        })
        .catch(error => {
          console.error('Error downloading instructions file:', error);
          this.presentToast(this.translate.instant('REPOSITORIO_PAGE.TOAST.INSTRUCTIONS_DOWNLOAD_ERROR'), 'danger');
        });
    }
  }

  viewProject(id: string, event: Event): void {
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