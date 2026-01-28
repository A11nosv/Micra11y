import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonButton, IonIcon } from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Highlight } from 'ngx-highlightjs';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-duel',
  templateUrl: './duel.page.html',
  styleUrls: ['./duel.page.scss'],
  standalone: true,
  imports: [CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, TranslateModule, HttpClientModule, Highlight, IonButton, IonIcon, RouterModule, NgFor]
})
export class DuelPage implements OnInit {

  pythonCode: string = '';
  pythonCode_step_1: string = '';
  pythonCode_step_1_2: string = '';
  pythonCode_step_1_3: string = '';
  pythonCode_step_1_4: string = '';
  pythonCode_step_1_5: string = '';
  pythonCode_step_1_6: string = '';
  title: string = '';

  constructor(private http: HttpClient, private translate: TranslateService) { }

  ngOnInit() {
    this.http.get('assets/Microbit/01_Beginner/00_ElMesRapid/Shooter-main.py', { responseType: 'text' })
      .subscribe(data => {
        this.pythonCode = data;
      });
    
      this.pythonCode_step_1 = "from Microbit Import *";
      this.pythonCode_step_1_2 = "while True:";
      this.pythonCode_step_1_3 = "if button_a_is.pressed(): \n\tdisplay.show(Image.ARROW.W)";
      this.pythonCode_step_1_4 = "if button_b_is.pressed(): \n\tdisplay.show(Image.ARROW.E)"
      this.pythonCode_step_1_5 = "import music";
      this.pythonCode_step_1_6 = "music.play(‘a’)";

    this.translate.get('DUEL_PAGE.TITLE').subscribe((res: string) => {
      this.title = res;
    });
  }

}
