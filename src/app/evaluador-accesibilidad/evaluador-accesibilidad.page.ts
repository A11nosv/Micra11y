import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon, IonBackButton, IonTextarea, ModalController } from '@ionic/angular/standalone'; // Import ModalController
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Highlight } from 'ngx-highlightjs';
import { MicrobitValidatorPro } from '../../../testacce';
import { LanguageService } from '../services/language.service';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { LanguageChooserComponent } from 'src/app/components/language-chooser/language-chooser.component';
import { ManualCheckModalComponent } from './manual-check-modal/manual-check-modal.component'; // Import ManualCheckModalComponent
import { ResultsModalComponent } from './results-modal/results-modal.component'; // Import ResultsModalComponent
import { Title } from '@angular/platform-browser';


@Component({
  selector: 'app-evaluador-accesibilidad',
  templateUrl: './evaluador-accesibilidad.page.html',
  styleUrls: ['./evaluador-accesibilidad.page.scss'],
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
    IonTextarea,
    Highlight,
    LanguageChooserComponent
  ],
})
export class EvaluadorAccesibilidadPage implements OnInit, OnDestroy {
  userCode: string = `
from microbit import *

# Example: Simple LED animation
while True:
    display.show(Image.HEART)
    sleep(500)
    display.clear()
    sleep(500)
`;
  highlightedCode: string = '';
  correctedCode: string = '';
  score: number = 0;
  improvementMessage: string = '';
  improvementSuggestions: string[] = [];
  redundancyStatus: string = 'ACCESSIBILITY_EVALUATOR_PAGE.NO';
  errorCount: number = 0;
  warningCount: number = 0;

  private validator: MicrobitValidatorPro;

  constructor(
    private translate: TranslateService,
    private languageService: LanguageService,
    private modalController: ModalController, // Inject ModalController
    private titleService: Title
  ) {
    this.highlightedCode = this.userCode;
    this.correctedCode = this.userCode;
    this.validator = new MicrobitValidatorPro();
  }

  ngOnInit() {
    this.titleService.setTitle('Evaluador de Accesibilidad');
  }

  ngOnDestroy() {
  }

  onCodeChange() {
    this.highlightedCode = this.userCode;
    this.correctedCode = this.userCode;
  }

  checkAccessibility() {
    const result = this.validator.validate(this.userCode);
    this.score = result.score;

    this.errorCount = result.issues.filter(issue => issue.type === 'error').length;
    this.warningCount = result.issues.filter(issue => issue.type === 'warning').length;

    const suggestionKeys = result.issues
      .filter(issue => issue.suggestion)
      .map(issue => issue.suggestion);

    const messageKeys = result.issues.map(issue => issue.message);
    const allTranslationKeys = [...messageKeys, ...suggestionKeys];

    this.translate.get(allTranslationKeys as string[]).subscribe(translations => {
      this.improvementSuggestions = Object.values(
        suggestionKeys.map(key => translations[key as string])
      );
      this.improvementMessage = this.improvementSuggestions.join(';\\n');

      const noButtonsIssue = result.issues.find(
        issue => issue.message === 'VALIDATOR.INPUT_REDUNDANCY.NO_BUTTONS_USED'
      );
      const redundancyErrorIssue = result.issues.find(
        issue => issue.message === 'VALIDATOR.INPUT_REDUNDANCY.ERROR_MESSAGE'
      );

      if (noButtonsIssue) {
        this.redundancyStatus = 'ACCESSIBILITY_EVALUATOR_PAGE.NO_BUTTONS_USED';
      } else if (redundancyErrorIssue) {
        this.redundancyStatus = 'ACCESSIBILITY_EVALUATOR_PAGE.YES';
      } else {
        this.redundancyStatus = 'ACCESSIBILITY_EVALUATOR_PAGE.NO';
      }

      let lines = this.userCode.split('\n');
      const issuesToProcess = result.issues
        .filter(issue => issue.type === 'error' || issue.type === 'warning')
        .sort((a, b) => (b.line || 0) - (a.line || 0)); 

      let microbitImportLine = -1;
      let hasMicrobitImport = false;
      let hasSpeechImport = false;
      let hasMusicImport = false;

      lines.forEach((line, index) => {
        const trimmedLine = line.trim();
        if (trimmedLine.startsWith("from microbit import *") || trimmedLine.startsWith("import microbit")) {
          hasMicrobitImport = true;
          microbitImportLine = index;
        }
        if (trimmedLine.startsWith("import speech")) {
          hasSpeechImport = true;
        }
        if (trimmedLine.startsWith("import music")) {
          hasMusicImport = true;
        }
      });

      if (!hasSpeechImport && !hasMusicImport) {
        if (microbitImportLine !== -1) {
            lines.splice(microbitImportLine + 1, 0, '# Import media', 'import music');
            hasMusicImport = true;
        }
      }

      for (const issue of issuesToProcess) {
        const translatedMessage = translations[issue.message as string];
        const translatedSuggestion = issue.suggestion ? translations[issue.suggestion as string] : '';

        if (issue.message === "VALIDATOR.AUDIO_FEEDBACK.ERROR_MESSAGE" && issue.suggestion === "VALIDATOR.AUDIO_FEEDBACK.ERROR_SUGGESTION_2") {
          if (!hasSpeechImport && !hasMusicImport) {
            const snippetToAdd = [
              '#Import auditory content for visual impaired users',
              'import music #You can also: import speech'
            ];
            
            if (microbitImportLine !== -1) {
                lines.splice(microbitImportLine + 1, 0, ...snippetToAdd);
            } else {
                lines.unshift(...['from microbit import *', ...snippetToAdd]);
            }
            hasSpeechImport = true;
            hasMusicImport = true;
          }
        } 
        else if (issue.message === "VALIDATOR.AUDIO_FEEDBACK.MISSING_AUDIO_OUTPUT_WITH_DISPLAY_SHOW" && issue.line !== undefined) {
          const lineNumber = issue.line - 1;
          if (lineNumber >= 0 && lineNumber < lines.length) {
            const originalLine = lines[lineNumber];
            const indentationMatch = originalLine.match(/^\s*/);
            const indentation = indentationMatch ? indentationMatch[0] : '';

            const snippetToAdd = [
              '#Auditory feedback for visual impaired users',
              'music.play(music.BA_DING) #You can also: speech.say("Displayed")'
            ].map(line => indentation + line);

            lines.splice(lineNumber + 1, 0, ...snippetToAdd);
          }
        }
        else if (issue.line !== undefined) {
          const lineNumber = issue.line - 1;
          if (lineNumber >= 0 && lineNumber < lines.length) {
            const originalLine = lines[lineNumber];
            const indentationMatch = originalLine.match(/^\s*/);
            const indentation = indentationMatch ? indentationMatch[0] : '';

            let annotation = `# ${issue.type.toUpperCase()}: ${translatedMessage}`;
            if (translatedSuggestion) {
              annotation += ` # SUGERENCIA: ${translatedSuggestion}`;
            }
            lines.splice(lineNumber + 1, 0, indentation + annotation);
          }
        }
        else {
          let annotation = `# ${issue.type.toUpperCase()}: ${translatedMessage}`;
          if (translatedSuggestion) {
            annotation += ` # SUGERENCIA: ${translatedSuggestion}`;
          }
          lines.push('\n' + annotation);
        }
      }

      this.correctedCode = lines.join('\n');
      this.highlightedCode = this.correctedCode;
    });
  }

  formatSuggestion(suggestion: string): string {
    let formatted = suggestion.replace(/;/g, ';<br>');
    formatted = formatted.replace(/,/g, ',<br>');
    return formatted;
  }

  async openManualCheckModal() {
    const modal = await this.modalController.create({
      component: ManualCheckModalComponent,
    });
    modal.present();

    const { data, role } = await modal.onDidDismiss();

    if (data !== undefined && data !== null) {
      this.openResultsModal(data);
    }
  }

  async openResultsModal(score: number) {
    let feedbackMessageKey: string;
    if (score >= 0 && score <= 17) {
      feedbackMessageKey = 'RESULTS_MODAL_FEEDBACK_0_17';
    } else if (score >= 18 && score <= 27) {
      feedbackMessageKey = 'RESULTS_MODAL_FEEDBACK_18_27';
    } else { // score >= 28 && score <= 34 (max score)
      feedbackMessageKey = 'RESULTS_MODAL_FEEDBACK_28_36';
    }

    const feedbackMessage = await this.translate.get(feedbackMessageKey).toPromise();

    const resultsModal = await this.modalController.create({
      component: ResultsModalComponent,
      componentProps: {
        score: score,
        feedbackMessage: feedbackMessage
      }
    });
    resultsModal.present();
  }
}
