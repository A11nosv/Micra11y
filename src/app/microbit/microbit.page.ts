import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButtons, IonButton, IonIcon } from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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
export class MicrobitPage {

  public projects$: Observable<Project[]>; // Changed to array of Project

  constructor(private translate: TranslateService) {
    this.projects$ = this.translate.get('MICROBIT_PAGE.PROJECTS').pipe(
      map((projects: any[]) => { // projects is now an array
        return projects.map(project => ({
          ...project,
          route: `/tabs/microbit/${project.id.toLowerCase().replace(/_/g, '-')}` // Dynamically create the route using project.id
        }));
      })
    );
  }

}
