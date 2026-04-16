import { Component, OnInit, OnDestroy, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent, IonSplitPane, IonMenu, IonList, IonListHeader, IonItem, IonLabel, IonMenuToggle, IonBadge, IonAccordionGroup, IonAccordion, IonBackButton, IonMenuButton } from '@ionic/angular/standalone';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageChooserComponent } from '../../components/language-chooser/language-chooser.component';
import { Highlight } from 'ngx-highlightjs';
import { Subscription } from 'rxjs';
import { LanguageService } from '../../services/language.service';
import { addIcons } from 'ionicons';
import { accessibilityOutline, constructOutline, homeOutline, schoolOutline, bookOutline, documentTextOutline, chevronForwardOutline, copyOutline, checkmarkOutline } from 'ionicons/icons';

@Component({
  selector: 'app-educadores',
  templateUrl: './educadores.page.html',
  styleUrls: ['./educadores.page.scss'],
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent, IonSplitPane, IonMenu, IonList, IonListHeader, IonItem, IonLabel, IonMenuToggle, IonBadge, IonAccordionGroup, IonAccordion, IonBackButton, IonMenuButton,
    CommonModule, FormsModule, RouterLink, TranslateModule, LanguageChooserComponent, Highlight]
})
export class EducadoresPage implements OnInit, OnDestroy {
  @ViewChild('mainContent', { static: false }) content!: IonContent;
  
  private route = inject(ActivatedRoute);
  private translate = inject(TranslateService);
  private languageService = inject(LanguageService);
  private langSub!: Subscription;

  userRole: 'educator' | 'student' = 'educator';
  currentLanguage: string = 'es';
  
  get duaPdfPath(): string {
    return `assets/pdfs/glosario_dua_${this.currentLanguage}.pdf`;
  }
  
  currentModule: any = null;
  openAccordions: string[] = [];

  modules: any[] = [];

  copyStates: { [key: string]: 'idle' | 'copying' | 'copied' } = {};
  showingA11y: { [key: string]: boolean } = {};

  constructor() { 
    addIcons({ accessibilityOutline, constructOutline, homeOutline, schoolOutline, bookOutline, documentTextOutline, chevronForwardOutline, copyOutline, checkmarkOutline });
  }

  ngOnInit() {
    // Detect role based on URL
    const path = this.route.snapshot.url[this.route.snapshot.url.length - 1]?.path;
    if (path === 'estudiantes') {
      this.userRole = 'student';
    } else {
      this.userRole = 'educator';
    }

    // Subscribe to language changes to update translated modules
    this.langSub = this.languageService.currentLanguage$.subscribe((lang) => {
      this.currentLanguage = lang;
      this.updateModulesTranslation();
    });
  }

  ngOnDestroy() {
    if (this.langSub) {
      this.langSub.unsubscribe();
    }
  }

  toggleA11y(id: string) {
    this.showingA11y[id] = !this.showingA11y[id];
  }

  copyToClipboard(code: string, id: string) {
    navigator.clipboard.writeText(code).then(() => {
      this.copyStates[id] = 'copying';
      
      setTimeout(() => {
        this.copyStates[id] = 'copied';
        
        setTimeout(() => {
          this.copyStates[id] = 'idle';
        }, 30000);
      }, 2000);
    });
  }

  updateModulesTranslation() {
    const moduleIds = [
      { id: 'dua',      num: '00', icon: '♿', educatorOnly: true },
      { id: 'cap1',     num: '01', icon: '🖥️' },
      { id: 'cap2',     num: '02', icon: '📦' },
      { id: 'cap3',     num: '03', icon: '🚦' },
      { id: 'cap4',     num: '04', icon: '🔄' },
      { id: 'cap5',     num: '05', icon: '🧩' },
      { id: 'cap6',     num: '06', icon: '🌡️' },
      { id: 'cap7',     num: '07', icon: '🎵' },
      { id: 'cap8',     num: '08', icon: '📡' },
      { id: 'cap9',     num: '09', icon: '🚀' },
      { id: 'cap11',    num: '10', icon: '♿' },
      { id: 'cap10',    num: '11', icon: '🎓', educatorOnly: true },
      { id: 'apendice', num: 'A',  icon: '📋' },
    ];

    this.modules = moduleIds.map(m => {
      return {
        ...m,
        title: this.translate.instant(`EDUCADORES_PAGE.MODULES.${m.id}.title`),
        desc: this.translate.instant(`EDUCADORES_PAGE.MODULES.${m.id}.desc`)
      };
    });

    // Load translated code samples robustly
    const codeKeys = [
      'cap1_1', 'cap1_1_a11y', 'cap1_2', 'cap1_2_a11y',
      'cap2_1', 'cap2_1_a11y', 'cap2_2', 'cap2_2_a11y', 'cap2_3', 'cap2_3_a11y',
      'cap3_1', 'cap3_1_a11y', 'cap3_2', 'cap3_2_a11y', 'cap3_3', 'cap3_3_a11y',
      'cap4_1', 'cap4_1_a11y', 'cap4_2', 'cap4_2_a11y', 'cap4_3', 'cap4_3_a11y', 'cap4_4', 'cap4_4_a11y',
      'cap5_1', 'cap5_1_a11y', 'cap5_2', 'cap5_2_a11y',
      'cap6_1', 'cap6_1_a11y', 'cap6_2', 'cap6_2_a11y', 'cap6_3', 'cap6_3_a11y', 'cap6_4', 'cap6_4_a11y',
      'cap7_1', 'cap7_1_a11y', 'cap7_2', 'cap7_2_a11y', 'cap7_3', 'cap7_3_a11y', 'cap7_4', 'cap7_4_a11y', 'cap7_5', 'cap7_5_a11y',
      'cap8_1', 'cap8_1_a11y', 'cap8_2', 'cap8_2_a11y', 'cap8_3', 'cap8_3_a11y',
      'cap9_1', 'cap9_1_a11y', 'cap9_2', 'cap9_2_a11y', 'cap9_3', 'cap9_3_a11y', 'cap9_4', 'cap9_4_a11y',
      'cap11_1', 'cap11_1_a11y', 'cap11_2', 'cap11_2_a11y', 'cap11_3', 'cap11_3_a11y',
      'capA_1', 'capA_2', 'capA_3', 'capA_4', 'capA_5'
    ];

    codeKeys.forEach(key => {
      this.translate.get(`CODE_SAMPLES.${key}`).subscribe(val => {
        const varName = `pythonCode_${key.replace('cap', '').replace('A_', 'A_')}`;
        if (val && val !== `CODE_SAMPLES.${key}`) {
          (this as any)[varName] = val;
        } else {
          (this as any)[varName] = '';
        }
      });
    });

    // Special mapping for pythonCode_A_* which doesn't follow the capN_M pattern directly in the regex replace above
    ['A_1', 'A_2', 'A_3', 'A_4', 'A_5'].forEach(subKey => {
      this.translate.get(`CODE_SAMPLES.cap${subKey}`).subscribe(val => {
        if (val && val !== `CODE_SAMPLES.cap${subKey}`) {
          (this as any)[`pythonCode_${subKey}`] = val;
        } else {
          (this as any)[`pythonCode_${subKey}`] = '';
        }
      });
    });

    // If a module is selected, update its reference to reflect translation changes
    if (this.currentModule) {
      this.currentModule = this.modules.find(m => m.id === this.currentModule.id);
    }
  }

  selectModule(moduleId: string | null) {
    if (moduleId === null) {
      this.currentModule = null;
    } else {
      this.currentModule = this.modules.find(m => m.id === moduleId);
    }
    
    this.openAccordions = []; // Reset open accordions when changing modules
    
    // Scroll to top when changing modules
    if (this.content) {
      setTimeout(() => {
        this.content.scrollToTop(300);
      }, 50);
    }
  }

  handleAccordionChange(ev: any) {
    const val = ev.detail.value;
    this.openAccordions = Array.isArray(val) ? val : (val ? [val] : []);
  }

  isExpanded(value: string): boolean {
    return this.openAccordions.includes(value);
  }

  handleSpaceKey(ev: KeyboardEvent, value: string, accordionGroup: any) {
    if (ev.key === ' ' || ev.key === 'Spacebar') {
      ev.preventDefault();
      // To toggle manually, we have to interact with the accordion-group's value
      let currentVal = accordionGroup.value;
      if (Array.isArray(currentVal)) {
        if (currentVal.includes(value)) {
          accordionGroup.value = currentVal.filter((v: string) => v !== value);
        } else {
          accordionGroup.value = [...currentVal, value];
        }
      } else {
        accordionGroup.value = currentVal === value ? null : value;
      }
    }
  }

  // Variables para los bloques de código (se inicializan en updateModulesTranslation)
  pythonCode_1_1 = '';
  pythonCode_1_1_a11y = '';
  pythonCode_1_2 = '';
  pythonCode_1_2_a11y = '';
  pythonCode_2_1 = '';
  pythonCode_2_1_a11y = '';
  pythonCode_2_2 = '';
  pythonCode_2_2_a11y = '';
  pythonCode_2_3 = '';
  pythonCode_2_3_a11y = '';
  pythonCode_3_1 = '';
  pythonCode_3_1_a11y = '';
  pythonCode_3_2 = '';
  pythonCode_3_2_a11y = '';
  pythonCode_3_3 = '';
  pythonCode_3_3_a11y = '';
  pythonCode_4_1 = '';
  pythonCode_4_1_a11y = '';
  pythonCode_4_2 = '';
  pythonCode_4_2_a11y = '';
  pythonCode_4_3 = '';
  pythonCode_4_3_a11y = '';
  pythonCode_4_4 = '';
  pythonCode_4_4_a11y = '';
  pythonCode_5_1 = '';
  pythonCode_5_1_a11y = '';
  pythonCode_5_2 = '';
  pythonCode_5_2_a11y = '';
  pythonCode_6_1 = '';
  pythonCode_6_1_a11y = '';
  pythonCode_6_2 = '';
  pythonCode_6_2_a11y = '';
  pythonCode_6_3 = '';
  pythonCode_6_3_a11y = '';
  pythonCode_6_4 = '';
  pythonCode_6_4_a11y = '';
  pythonCode_7_1 = '';
  pythonCode_7_1_a11y = '';
  pythonCode_7_2 = '';
  pythonCode_7_2_a11y = '';
  pythonCode_7_3 = '';
  pythonCode_7_3_a11y = '';
  pythonCode_7_4 = '';
  pythonCode_7_4_a11y = '';
  pythonCode_7_5 = '';
  pythonCode_7_5_a11y = '';
  pythonCode_8_1 = '';
  pythonCode_8_1_a11y = '';
  pythonCode_8_2 = '';
  pythonCode_8_2_a11y = '';
  pythonCode_8_3 = '';
  pythonCode_8_3_a11y = '';
  pythonCode_9_1 = '';
  pythonCode_9_1_a11y = '';
  pythonCode_9_2 = '';
  pythonCode_9_2_a11y = '';
  pythonCode_9_3 = '';
  pythonCode_9_3_a11y = '';
  pythonCode_9_4 = '';
  pythonCode_9_4_a11y = '';
  pythonCode_11_1 = '';
  pythonCode_11_1_a11y = '';
  pythonCode_11_2 = '';
  pythonCode_11_2_a11y = '';
  pythonCode_11_3 = '';
  pythonCode_11_3_a11y = '';
  pythonCode_A_1 = '';
  pythonCode_A_2 = '';
  pythonCode_A_3 = '';
  pythonCode_A_4 = '';
  pythonCode_A_5 = '';
}
