import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon } from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { LanguageChooserComponent } from '../components/language-chooser/language-chooser.component';

@Component({
  selector: 'app-microia',
  templateUrl: 'microia.page.html',
  styleUrls: ['microia.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon, RouterModule, TranslateModule, CommonModule, LanguageChooserComponent],
})
export class MicroiaPage implements OnInit, OnDestroy {

  private langChangeSubscription: Subscription | undefined;

  constructor(
    private titleService: Title,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.updateTitle();
    this.langChangeSubscription = this.translate.onLangChange.subscribe(() => {
      this.updateTitle();
    });
  }

  private updateTitle() {
    this.translate.get('TABS.MICROIA').subscribe(title => {
      this.titleService.setTitle(title);
    });
  }

  ngOnDestroy() {
    if (this.langChangeSubscription) {
      this.langChangeSubscription.unsubscribe();
    }
  }
}
