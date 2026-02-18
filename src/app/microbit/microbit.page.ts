import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButtons, IonButton, IonIcon } from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Observable, map } from 'rxjs';
import { LanguageChooserComponent } from '../components/language-chooser/language-chooser.component';
import { Title } from '@angular/platform-browser';


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
  imports: [CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, RouterLink, TranslateModule, IonButtons, IonButton, IonIcon, LanguageChooserComponent]
})
export class MicrobitPage implements OnInit {

  public projects$: Observable<{[key: string]: Project}>;


  constructor(
    private translate: TranslateService,
    private titleService: Title
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


  }

  ngOnInit() {
    this.titleService.setTitle('micro:bit a11y');
  }




}