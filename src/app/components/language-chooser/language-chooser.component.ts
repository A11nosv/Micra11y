import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonButton, ActionSheetController, ActionSheetButton } from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language.service';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-language-chooser',
  templateUrl: './language-chooser.component.html',
  styleUrls: ['./language-chooser.component.scss'],
  standalone: true,
  imports: [CommonModule, IonButton, TranslateModule]
})
export class LanguageChooserComponent implements OnInit, OnDestroy {
  currentLanguageFlag$: Observable<string>;
  accessibleLabel: string = '';

  private languageChangeSubscription: Subscription | undefined;

  constructor(
    private languageService: LanguageService,
    private actionSheetController: ActionSheetController,
    private translate: TranslateService
  ) {
    this.currentLanguageFlag$ = this.languageService.currentLanguage$.pipe(
      map(language => {
        const flagPath = this.languageService.getCurrentLanguageFlag();
        console.log('Current language flag path:', flagPath); // Debug log
        return flagPath;
      })
    );
  }

  ngOnInit() {
    this.updateAccessibleLabel();
    this.languageChangeSubscription = this.languageService.currentLanguage$.subscribe(() => {
      this.updateAccessibleLabel();
    });
  }

  ngOnDestroy() {
    if (this.languageChangeSubscription) {
      this.languageChangeSubscription.unsubscribe();
    }
  }

  private updateAccessibleLabel() {
    this.accessibleLabel = this.languageService.getAccessibleLabel();
  }

  async openLanguageChooser() {
    const availableLanguages = this.languageService.getAvailableLanguages();
    const buttons: ActionSheetButton[] = availableLanguages.map(lang => ({ // Type as ActionSheetButton[]
      text: lang.name,
      icon: '', // Optionally add icon here if needed
      handler: () => {
        this.languageService.setLanguage(lang.code);
      }
    }));

    // Explicitly type the cancel button
    const cancelButton: ActionSheetButton = {
      text: this.translate.instant('MODAL_CLOSE'), // Re-using translation key
      icon: 'close',
      role: 'cancel'
    };

    const actionSheet = await this.actionSheetController.create({
      header: this.translate.instant('SETTINGS.LANGUAGE_SELECT'), // Re-using translation key
      buttons: buttons.concat([cancelButton]) // Concat with the typed cancel button
    });
    await actionSheet.present();
  }
}
