import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon, IonBackButton, IonTextarea, ModalController } from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Highlight } from 'ngx-highlightjs';
import { MicrobitValidatorPro } from '../../../testacce';
import { LanguageService } from '../services/language.service';
import { Subscription } from 'rxjs';
import { LanguageChooserComponent } from 'src/app/components/language-chooser/language-chooser.component';
import { ManualCheckModalComponent } from './manual-check-modal/manual-check-modal.component';
import { ResultsModalComponent } from './results-modal/results-modal.component';
import { Title } from '@angular/platform-browser';

export interface DisplayIssue {
  type: 'error' | 'warning' | 'success';
  message: string;
  suggestion?: string;
  line?: number;
}

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
  detectedIssues: DisplayIssue[] = [];
  redundancyStatus: string = 'ACCESSIBILITY_EVALUATOR_PAGE.NO';
  errorCount: number = 0;
  warningCount: number = 0;
  evaluationStatus: string = '';
  accessibilityMessage: string = '';

  private validator: MicrobitValidatorPro;
  private langChangeSubscription: Subscription | undefined;

  constructor(
    private translate: TranslateService,
    private languageService: LanguageService,
    private modalController: ModalController,
    private titleService: Title
  ) {
    this.highlightedCode = this.userCode;
    this.correctedCode = this.userCode;
    this.validator = new MicrobitValidatorPro();
  }

  ngOnInit() {
    this.updateTitle();
    this.langChangeSubscription = this.translate.onLangChange.subscribe(() => {
      this.updateTitle();
      this.updateAccessibilityMessageOnLangChange();
    });
  }

  private updateTitle() {
    this.translate.get('ACCESSIBILITY_EVALUATOR_TITLE').subscribe(title => {
      this.titleService.setTitle(title);
    });
  }

  updateAccessibilityMessageOnLangChange() {
    if (this.evaluationStatus === 'ACCESSIBILITY_EVALUATOR_PAGE.CHECKING') {
      this.translate.get('ACCESSIBILITY_EVALUATOR_PAGE.CHECKING').subscribe(msg => {
        this.accessibilityMessage = msg;
      });
    } else if (this.evaluationStatus === 'ACCESSIBILITY_EVALUATOR_PAGE.CHECK_FINISHED') {
      const summaryKeys = [
        'ACCESSIBILITY_EVALUATOR_PAGE.CHECK_FINISHED',
        'ACCESSIBILITY_EVALUATOR_PAGE.SCORE',
        'ACCESSIBILITY_EVALUATOR_PAGE.ERRORS',
        'ACCESSIBILITY_EVALUATOR_PAGE.WARNINGS',
        'ACCESSIBILITY_EVALUATOR_PAGE.REDUNDANCY_DETECTED',
        this.redundancyStatus
      ];

      this.translate.get(summaryKeys).subscribe(sumTranslations => {
        const checkFinished = sumTranslations['ACCESSIBILITY_EVALUATOR_PAGE.CHECK_FINISHED'];
        const scoreLabel = sumTranslations['ACCESSIBILITY_EVALUATOR_PAGE.SCORE'];
        const errorsLabel = sumTranslations['ACCESSIBILITY_EVALUATOR_PAGE.ERRORS'];
        const warningsLabel = sumTranslations['ACCESSIBILITY_EVALUATOR_PAGE.WARNINGS'];
        const redundancyLabel = sumTranslations['ACCESSIBILITY_EVALUATOR_PAGE.REDUNDANCY_DETECTED'];
        const redundancyValue = sumTranslations[this.redundancyStatus];

        this.accessibilityMessage = `${checkFinished} ${scoreLabel}: ${this.score}/10. ${errorsLabel}: ${this.errorCount}. ${warningsLabel}: ${this.warningCount}. ${redundancyLabel}: ${redundancyValue}.`;
      });
    } else {
      this.accessibilityMessage = '';
    }
  }

  ngOnDestroy() {
    if (this.langChangeSubscription) {
      this.langChangeSubscription.unsubscribe();
    }
  }

  onCodeChange() {
    this.highlightedCode = this.userCode;
    this.correctedCode = this.userCode;
    this.evaluationStatus = '';
    this.detectedIssues = [];
  }

  checkAccessibility() {
    this.evaluationStatus = 'ACCESSIBILITY_EVALUATOR_PAGE.CHECKING';
    this.translate.get('ACCESSIBILITY_EVALUATOR_PAGE.CHECKING').subscribe(msg => {
      this.accessibilityMessage = msg;
    });

    const codeToValidate = this.userCode;
    const result = this.validator.validate(codeToValidate);
    this.score = result.score;
    this.correctedCode = result.correctedCode;
    this.highlightedCode = this.correctedCode;

    this.errorCount = result.issues.filter(issue => issue.type === 'error').length;
    this.warningCount = result.issues.filter(issue => issue.type === 'warning').length;

    const issuesWithSuggestions = result.issues.filter(
      issue => issue.type === 'error' || issue.type === 'warning'
    );

    const suggestionKeys = issuesWithSuggestions
      .filter(issue => issue.suggestion)
      .map(issue => issue.suggestion as string);

    const messageKeys = issuesWithSuggestions.map(issue => issue.message);
    const allTranslationKeys = [...new Set([...messageKeys, ...suggestionKeys])];

    this.translate.get(allTranslationKeys).subscribe(translations => {
      this.evaluationStatus = 'ACCESSIBILITY_EVALUATOR_PAGE.CHECK_FINISHED';

      this.detectedIssues = issuesWithSuggestions.map(issue => ({
        type: issue.type,
        message: translations[issue.message] ?? issue.message,
        suggestion: issue.suggestion ? (translations[issue.suggestion] ?? issue.suggestion) : undefined,
        line: issue.line
      }));

      this.improvementSuggestions = [...new Set(
        suggestionKeys.map(key => translations[key]).filter(Boolean)
      )];
      this.improvementMessage = this.improvementSuggestions.join(';\n');

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

      this.updateAccessibilityMessageOnLangChange();
    });
  }

  formatSuggestion(suggestion: string): string {
    let formatted = suggestion.replace(/;/g, ';<br>');
    formatted = formatted.replace(/,/g, ',<br>');
    return formatted;
  }

  getIssueClass(type: string): string {
    switch (type) {
      case 'error': return 'issue-error';
      case 'warning': return 'issue-warning';
      default: return 'issue-success';
    }
  }

  async openManualCheckModal() {
    const modal = await this.modalController.create({
      component: ManualCheckModalComponent,
    });
    modal.present();

    const { data } = await modal.onDidDismiss();

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
    } else {
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
