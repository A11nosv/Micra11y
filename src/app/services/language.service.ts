import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private _currentLanguage: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public currentLanguage$: Observable<string> = this._currentLanguage.asObservable();

  private languageMap: { [key: string]: { name: string, flag: string } } = {
    'ca': { name: 'Català', flag: 'assets/img/flags/ca.svg' },
    'en': { name: 'English', flag: 'assets/img/flags/en.svg' },
    'es': { name: 'Español', flag: 'assets/img/flags/es.svg' },
    'gl': { name: 'Galego', flag: 'assets/img/flags/gl.svg' },
    'eu': { name: 'Euskera', flag: 'assets/img/flags/eu.svg' }
  };

  constructor(private translate: TranslateService) {
    this.initLanguage();
  }

  private initLanguage() {
    let lang: string | null = localStorage.getItem('language'); // Explicitly type lang
    let finalLang: string = 'ca'; // Default language

    if (lang && this.languageMap[lang]) {
      finalLang = lang;
    } else {
      // Try browser language
      const browserLang = this.translate.getBrowserLang();
      if (browserLang && this.languageMap[browserLang]) {
        finalLang = browserLang;
      }
    }

    this.translate.setDefaultLang('ca');
    this.translate.use(finalLang);
    this._currentLanguage.next(finalLang);
    localStorage.setItem('language', finalLang); // Now finalLang is definitely a string
  }

  setLanguage(lang: string) {
    if (this.languageMap[lang]) {
      this.translate.use(lang);
      this._currentLanguage.next(lang);
      localStorage.setItem('language', lang);
    } else {
      console.warn(`Language '${lang}' not supported.`);
    }
  }

  getCurrentLanguage(): string {
    return this._currentLanguage.getValue();
  }

  getCurrentLanguageName(): string {
    return this.languageMap[this._currentLanguage.getValue()]?.name || 'Unknown';
  }

  getCurrentLanguageFlag(): string {
    return this.languageMap[this._currentLanguage.getValue()]?.flag || '';
  }

  getAccessibleLabel(): string {
    const currentLangName = this.getCurrentLanguageName();
    return this.translate.instant('ACCESSIBILITY.LANGUAGE_BUTTON_LABEL', { language: currentLangName });
  }

  getAvailableLanguages() {
    return Object.keys(this.languageMap).map(key => ({
      code: key,
      name: this.languageMap[key].name,
      flag: this.languageMap[key].flag
    }));
  }
}
