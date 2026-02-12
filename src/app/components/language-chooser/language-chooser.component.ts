import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonButton, PopoverController } from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language.service';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { LanguagePopoverContentComponent } from '../language-popover-content/language-popover-content.component'; // Import the new component

@Component({
  selector: 'app-language-chooser',
  templateUrl: './language-chooser.component.html',
  styleUrls: ['./language-chooser.component.scss'],
  standalone: true,
  imports: [CommonModule, IonButton, TranslateModule, LanguagePopoverContentComponent] // Update imports
})
export class LanguageChooserComponent implements OnInit, OnDestroy {
  currentLanguageFlag$: Observable<string>;
  accessibleLabel: string = '';

  private languageChangeSubscription: Subscription | undefined;

  constructor(
    private languageService: LanguageService,
    private popoverController: PopoverController,
    private translate: TranslateService
  ) {
    this.currentLanguageFlag$ = this.languageService.currentLanguage$.pipe(
      map(languageCode => {
        const lang = this.languageService.getAvailableLanguages().find(l => l.code === languageCode);
        const flagPath = lang ? lang.flag : '';
        console.log('LanguageChooserComponent: Language code:', languageCode, 'Flag path:', flagPath); // More detailed debug log
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

  async presentPopover(e: Event) {
    const popover = await this.popoverController.create({
      component: LanguagePopoverContentComponent, // Use the new component for content
      event: e,
      translucent: true,
      cssClass: 'language-popover'
    });
    await popover.present();
  }
}
