import { Component, OnInit, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router'; // Import Router
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon, IonBackButton, IonItem, IonToggle, IonSelect, IonSelectOption } from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    TranslateModule,
    IonButtons,
    IonButton,
    IonIcon,
    IonBackButton,
    IonItem,
    IonToggle,
    IonSelect,
    IonSelectOption
  ],
})
export class SettingsPage implements OnInit {
  darkMode: boolean;
  selectedLanguage: string;

  constructor(private translate: TranslateService, private router: Router, private renderer: Renderer2) { // Inject Router and Renderer2
    // Initialize darkMode based on system preference or saved preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    this.darkMode = localStorage.getItem('darkMode') === 'true' || (localStorage.getItem('darkMode') === null && prefersDark.matches);

    // Initialize selectedLanguage from TranslateService
    this.selectedLanguage = this.translate.currentLang || this.translate.getDefaultLang();
  }

  ngOnInit() {
    this.setDarkMode(this.darkMode);
  }

  onDarkModeToggle() {
    this.setDarkMode(this.darkMode);
    localStorage.setItem('darkMode', this.darkMode.toString());
  }

  onLanguageChange() {
    this.translate.use(this.selectedLanguage).subscribe(() => {
      localStorage.setItem('language', this.selectedLanguage);
      this.renderer.setAttribute(document.documentElement, 'lang', this.selectedLanguage); // Update lang attribute
      // Navigate to the root to force a full re-initialization of the main tab view
      this.router.navigate(['/tabs/microbit'], { onSameUrlNavigation: 'reload' }).then(() => {
        window.location.reload(); // Fallback for full refresh if router reload is not enough
      });
    });
  }

  private setDarkMode(isDark: boolean) {
    document.body.classList.toggle('dark-theme', isDark);
  }
}
