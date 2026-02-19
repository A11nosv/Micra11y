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
  public pythonCode: string = '';

  constructor(
    private translate: TranslateService,
    private http: HttpClient,
    private languageService: LanguageService // Inject LanguageService
  ) {
    this.currentImageSrc = this.getImageSrc();
  }

  ngOnInit() {
    this.langChangeSubscription = this.translate.onLangChange.subscribe(() => {
      this.currentImageSrc = this.getImageSrc();
    });
    console.log('Current Language:', this.translate.currentLang);
    console.log('Generated Image Source:', this.currentImageSrc);
    console.log('Translation test:', this.translate.instant('ACCESSIBLE_PROGRAMMING.TITLE'));
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
}