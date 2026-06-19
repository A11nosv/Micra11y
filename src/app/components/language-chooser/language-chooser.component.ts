import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonButton, IonIcon, PopoverController } from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language.service';
import { Subscription } from 'rxjs';
import { addIcons } from 'ionicons';
import { languageOutline } from 'ionicons/icons';
import { LanguagePopoverContentComponent } from '../language-popover-content/language-popover-content.component';

@Component({
  selector: 'app-language-chooser',
  templateUrl: './language-chooser.component.html',
  styleUrls: ['./language-chooser.component.scss'],
  standalone: true,
  imports: [CommonModule, IonButton, IonIcon, TranslateModule]
})
export class LanguageChooserComponent implements OnInit, OnDestroy {
  accessibleLabel: string = '';

  private languageChangeSubscription: Subscription | undefined;

  constructor(
    private languageService: LanguageService,
    private popoverController: PopoverController,
    private translate: TranslateService
  ) {
    addIcons({ languageOutline });
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
      component: LanguagePopoverContentComponent,
      event: e,
      translucent: true,
      cssClass: 'language-popover'
    });
    await popover.present();
  }
}
