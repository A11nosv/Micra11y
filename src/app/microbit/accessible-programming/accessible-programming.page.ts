import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonModal, IonButton, IonIcon } from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription, Observable } from 'rxjs'; // Import Observable
import { map } from 'rxjs/operators'; // Import map operator
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Highlight } from 'ngx-highlightjs';
import { RouterModule } from '@angular/router';
import { LanguageService } from 'src/app/services/language.service'; // Import LanguageService
import { LanguageChooserComponent } from 'src/app/components/language-chooser/language-chooser.component';

@Component({
  selector: 'app-accessible-programming',
  templateUrl: './accessible-programming.page.html',
  styleUrls: ['./accessible-programming.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButtons, IonBackButton, TranslateModule, IonModal, IonButton, HttpClientModule, Highlight, IonIcon, RouterModule, LanguageChooserComponent]
})
export class AccessibleProgrammingPage implements OnInit, OnDestroy {

  @ViewChild('nonAccessibleModal') nonAccessibleModal!: IonModal;
  @ViewChild('accessibleModal') accessibleModal!: IonModal;
  @ViewChild('codeModal') codeModal!: IonModal;

  private langChangeSubscription: Subscription | undefined;
  public currentImageSrc: string;
  public workflowImageSrc: string;
  public pythonCode: string = '';

  constructor(
    private translate: TranslateService,
    private http: HttpClient,
    private languageService: LanguageService // Inject LanguageService
  ) {
    // Initial assignment will be handled in ngOnInit and onLangChange subscription
    this.currentImageSrc = '';
    this.workflowImageSrc = '';
  }

  ngOnInit() {
    this.updateImageSources();

    this.langChangeSubscription = this.translate.onLangChange.subscribe(() => {
      this.updateImageSources();
    });
    console.log('Current Language:', this.translate.currentLang);
    console.log('Generated Image Source:', this.currentImageSrc);
    console.log('Translation test:', this.translate.instant('ACCESSIBLE_PROGRAMMING.TITLE'));
  }

  private updateImageSources() {
    this.currentImageSrc = this.getImageSrc();
    this.workflowImageSrc = this.getWorkflowImageSrc();
  }

  ngOnDestroy() {
    if (this.langChangeSubscription) {
      this.langChangeSubscription.unsubscribe();
    }
  }

  getImageSrc(): string {
    const lang = this.translate.currentLang;
    const imagePath = `assets/img/a11y_${lang}.png`;
    console.log('Lang in getImageSrc:', lang);
    console.log('Image Path in getImageSrc:', imagePath);
    return imagePath;
  }

  getWorkflowImageSrc(): string {
    const lang = this.translate.currentLang;
    let imageName = '';

    switch (lang) {
      case 'ca':
        imageName = 'flux_treball.png';
        break;
      case 'es':
        imageName = 'flujo_trabajo.png';
        break;
      case 'en':
        imageName = 'workflow.png';
        break;
      case 'gl':
        imageName = 'fluxo_traballo.png';
        break;
      case 'eu':
        imageName = 'lan_fluxua.png';
        break;
      default:
        imageName = 'flux_treball.png'; // Default to Catalan
        break;
    }

    return `assets/img/${imageName}`;
  }

  async openModal(type: 'non-accessible' | 'accessible') {
    if (type === 'non-accessible') {
      await this.nonAccessibleModal.present();
    } else {
      await this.accessibleModal.present();
    }
  }

  async openCodeModal(codeType: string) {
    let filePath: string = '';
    if (codeType === 'non-accessible-code') {
      filePath = 'assets/microbit_code/beatingHeart/beatingHeart.py';
    } else if (codeType === 'accessible-code') {
      filePath = 'assets/microbit_code/beatingHeart_a11y.py';
    }
    // Add more conditions here for other code types if needed in the future

    if (filePath) {
      this.http.get(filePath, { responseType: 'text' }).subscribe(data => {
        this.pythonCode = data;
        this.codeModal.present();
      });
    }
  }

  download() {
    const lang = this.translate.currentLang;
    let fileName = '';

    switch (lang) {
      case 'es':
        fileName = 'Hablando_sobre_accesibilidad_en_la_microbit_es.pdf';
        break;
      case 'ca':
        fileName = 'Parlant_sobre_accessibilitat_microbit_CA.pdf';
        break;
      case 'en':
        fileName = 'Talking_About_Accessibility_microbit_EN.pdf';
        break;
      case 'gl':
        fileName = 'Falando_sobre_accesibilidade_microbit_GL.pdf';
        break;
      case 'eu':
        fileName = 'microbit_irisgarritasuna_EU.pdf';
        break;
      default:
        fileName = 'Parlant_sobre_accessibilitat_microbit_CA.pdf'; // Default to Catalan
        break;
    }

    const filePath = `assets/pdfs/${fileName}`;
    
    // Crear un elemento de enlace temporal para forzar la descarga
    const link = document.createElement('a');
    link.href = filePath;
    link.download = fileName; // El atributo download fuerza la descarga con este nombre
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}