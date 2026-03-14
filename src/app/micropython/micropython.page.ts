import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon } from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Highlight } from 'ngx-highlightjs';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

import { LanguageChooserComponent } from '../components/language-chooser/language-chooser.component'; // Import LanguageChooserComponent

@Component({
  selector: 'app-micropython',
  templateUrl: 'micropython.page.html',
  styleUrls: ['micropython.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon, RouterModule, TranslateModule, CommonModule, HttpClientModule, Highlight, LanguageChooserComponent], // Added LanguageChooserComponent
})
export class MicropythonPage implements OnInit, OnDestroy {
  pythonCode: string = '';
  private langChangeSubscription: Subscription | undefined;

  constructor(
    private http: HttpClient,
    private titleService: Title,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.updateTitle();
    this.langChangeSubscription = this.translate.onLangChange.subscribe(() => {
      this.updateTitle();
    });

    this.http.get('assets/microbit_code/beatingHeart/beatingHeart.py', { responseType: 'text' })
      .subscribe(data => {
        this.pythonCode = data;
      });
  }

  private updateTitle() {
    this.translate.get('TABS.MICROPYTHON').subscribe(title => {
      this.titleService.setTitle(title);
    });
  }

  ngOnDestroy() {
    if (this.langChangeSubscription) {
      this.langChangeSubscription.unsubscribe();
    }
  }
}