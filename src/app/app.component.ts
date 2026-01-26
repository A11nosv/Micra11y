import { Component, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet, TranslateModule],
})
export class AppComponent implements OnInit {
  constructor(private translate: TranslateService) {
    this.initializeApp();
  }

  ngOnInit(): void {
    // Listen for changes in the system's dark mode preference
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      // If the user hasn't explicitly set a preference, update the theme
      if (localStorage.getItem('darkMode') === null) {
        this.setDarkMode(e.matches);
      }
    });
  }

  initializeApp() {
    this.translate.setDefaultLang('en');
    const supportedLangs = ['ca', 'es', 'en', 'eu', 'gl'];

    // Initialize language
    const savedLang = localStorage.getItem('language');
    let langToUse = 'en'; // Default fallback

    if (savedLang && supportedLangs.includes(savedLang)) {
      langToUse = savedLang;
    } else {
      const browserLang = this.translate.getBrowserLang();
      if (browserLang) {
        const foundLang = supportedLangs.find(lang => browserLang.startsWith(lang));
        if (foundLang) {
          langToUse = foundLang;
        }
      }
    }
    this.translate.use(langToUse);

    // Initialize dark mode
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    const savedDarkMode = localStorage.getItem('darkMode');

    if (savedDarkMode !== null) {
      this.setDarkMode(savedDarkMode === 'true');
    } else {
      this.setDarkMode(prefersDark.matches);
    }
  }

  private setDarkMode(isDark: boolean) {
    document.body.classList.toggle('dark-theme', isDark);
  }
}
