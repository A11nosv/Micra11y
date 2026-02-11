import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButtons, IonButton, IonIcon } from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LanguageService } from 'src/app/services/language.service'; // Import LanguageService

interface Project {
  id: string; // Add id property
  TITLE: string;
  DESCRIPTION: string;
  img: string;
  route: string; // Add route property
  alt: string; // Add alt property
}

@Component({
  selector: 'app-microbit',
  templateUrl: 'microbit.page.html',
  styleUrls: ['microbit.page.scss'],
  standalone: true,
  imports: [CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, RouterLink, TranslateModule, IonButtons, IonButton, IonIcon]
})
export class MicrobitPage implements OnInit { // Implemented OnInit

  public projects$: Observable<{[key: string]: Project}>;
  currentLanguageFlag$: Observable<string>;
  accessibleLabel: string = '';

  constructor(
    private translate: TranslateService,
    private languageService: LanguageService
  ) {
    this.projects$ = this.translate.get('MICROBIT_PAGE.PROJECTS').pipe(
      map(projects => {
        const projectOrder: string[] = [
          "ACCESSIBLE_PROGRAMMING",
          "COUNTDOWN",
          "HEARTBEAT",
          "DUEL",
          "STONE_PAPER_SCISSORS",
          "SECRET_MESSAGE"
          // Add other project keys in their desired order
        ];

        const transformedProjects: { [key: string]: Project } = {};
        projectOrder.forEach(key => {
          if (projects.hasOwnProperty(key)) {
            transformedProjects[key] = {
              ...projects[key],
              route: `/tabs/microbit/${key.toLowerCase().replace(/_/g, '-')}`,
            };
          }
        });
        return transformedProjects;
      })
    );

    this.currentLanguageFlag$ = this.languageService.currentLanguage$.pipe(
      map(() => this.languageService.getCurrentLanguageFlag())
    );
  }

  ngOnInit() {
    this.updateAccessibleLabel();
    this.languageService.currentLanguage$.subscribe(() => {
      this.updateAccessibleLabel();
    });
  }

  private updateAccessibleLabel() {
    this.accessibleLabel = this.languageService.getAccessibleLabel();
  }
}