import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonList, IonItem, IonLabel, PopoverController, IonAvatar } from '@ionic/angular/standalone';
import { LanguageService } from 'src/app/services/language.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-language-popover-content',
  template: `
    <ion-list>
      <ion-item *ngFor="let lang of languageService.getAvailableLanguages()" (click)="changeLanguage(lang.code)" button>
        <div slot="start" class="language-flag-icon" [style.background-image]="'url(' + lang.flag + ')'"></div>
        <ion-label>{{ lang.name }}</ion-label>
      </ion-item>
    </ion-list>
  `,
  styles: [`
    .language-flag-icon {
      width: 24px;
      height: 24px;
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
      margin-right: 8px;
    }
  `],
  standalone: true,
  imports: [CommonModule, IonList, IonItem, IonLabel, TranslateModule]
})
export class LanguagePopoverContentComponent implements OnInit {

  constructor(
    public languageService: LanguageService, // Made public to be accessible in template
    private popoverController: PopoverController
  ) { }

  ngOnInit() { }

  changeLanguage(langCode: string) {
    this.languageService.setLanguage(langCode);
    this.popoverController.dismiss(); // Dismiss the popover after selection
  }
}
