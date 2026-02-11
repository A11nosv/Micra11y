import { Component, OnInit, Renderer2 } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from './services/language.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet, TranslateModule],
})
export class AppComponent implements OnInit {
  constructor(
    private translate: TranslateService, // Keep TranslateService for now, as LanguageService uses it internally
    private languageService: LanguageService, // Inject LanguageService
    private renderer: Renderer2 // Inject Renderer2
  ) {
    // LanguageService's constructor already calls initLanguage(),
    // so no need to call initializeApp() for language here.
    // Dark mode initialization will remain for now.
    this.initializeDarkMode();
  }

  ngOnInit(): void {
    // Listen for changes in the system's dark mode preference
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      // If the user hasn't explicitly set a preference, update the theme
      if (localStorage.getItem('darkMode') === null) {
        this.setDarkMode(e.matches);
      }
    });

    // Subscribe to language changes from LanguageService to update the document's lang attribute
    this.languageService.currentLanguage$.subscribe(lang => {
      this.renderer.setAttribute(document.documentElement, 'lang', lang);
    });
  }

  initializeDarkMode() {
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
