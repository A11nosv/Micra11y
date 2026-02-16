import { provideHighlightOptions } from 'ngx-highlightjs';
import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { HttpClient, provideHttpClient } from '@angular/common/http';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';

if (environment.production) {
  enableProdMode();
}

// Factory for the TranslateHttpLoader
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(), // Provide HttpClient
    provideHighlightOptions({
      fullLibraryLoader: () => import('highlight.js')
    }),
    importProvidersFrom(
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient],
        },
      })
    ), provideFirebaseApp(() => initializeApp({ projectId: "microbit-6aff6", appId: "1:906679586049:web:0cf89b7317e88a7379df00", storageBucket: "microbit-6aff6.firebasestorage.app", apiKey: "AIzaSyAc5bkchKzKihgSdMm8KLt6u0Uc28ZPleE", authDomain: "microbit-6aff6.firebaseapp.com", messagingSenderId: "906679586049", measurementId: "G-R7RM0JRQG0"})), provideFirestore(() => getFirestore()), provideStorage(() => getStorage()),
  ],
});
