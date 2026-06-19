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
    'ca': { name: 'Català', flag: '/assets/img/flags/ca.png' },
    'en': { name: 'English', flag: '/assets/img/flags/en.png' },
    'es': { name: 'Español', flag: '/assets/img/flags/es.png' },
    'gl': { name: 'Galego', flag: '/assets/img/flags/gl.png' },
    'eu': { name: 'Euskera', flag: '/assets/img/flags/eu.png' }
  };

  constructor(private translate: TranslateService) {
    this.translate.onLangChange.subscribe(({ lang }: { lang: string; translations: object }): void => {
      this._currentLanguage.next(lang);
      localStorage.setItem('language', lang);
    });
    this.initLanguage();
  }

  private initLanguage(): void {
    const storedLang: string | null = localStorage.getItem('language');
    let finalLang: string = 'ca';

    if (storedLang && this.languageMap[storedLang]) {
      finalLang = storedLang;
    } else {
      const browserLang: string | undefined = this.translate.getBrowserLang();
      if (browserLang && this.languageMap[browserLang]) {
        finalLang = browserLang;
      }
    }

    this._currentLanguage.next(finalLang);
    this.translate.setDefaultLang('ca');
    this.translate.use(finalLang).subscribe({
      error: (err: unknown): void => console.error(`Failed to load language '${finalLang}':`, err)
    });
  }

  setLanguage(lang: string): void {
    if (!this.languageMap[lang]) {
      console.warn(`Language '${lang}' not supported.`);
      return;
    }

    this._currentLanguage.next(lang);
    localStorage.setItem('language', lang);
    this.translate.use(lang).subscribe({
      error: (err: unknown): void => console.error(`Failed to load language '${lang}':`, err)
    });
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
