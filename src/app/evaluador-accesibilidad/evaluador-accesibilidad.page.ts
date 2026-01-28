import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon, IonBackButton, IonTextarea } from '@ionic/angular/standalone'; // Import IonTextarea
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Highlight } from 'ngx-highlightjs'; // Import Highlight
import { MicrobitValidatorPro } from '../../../testacce'; // Import the validator

@Component({
  selector: 'app-evaluador-accesibilidad',
  templateUrl: './evaluador-accesibilidad.page.html',
  styleUrls: ['./evaluador-accesibilidad.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule, // Add FormsModule
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    TranslateModule,
    IonButtons,
    IonButton,
    IonIcon,
    IonBackButton,
    IonTextarea, // Add IonTextarea
    Highlight // Add Highlight
  ],
})
export class EvaluadorAccesibilidadPage {
  userCode: string = `
from microbit import *

# Example: Simple LED animation
while True:
    display.show(Image.HEART)
    sleep(500)
    display.clear()
    sleep(500)
`; // Initial code for the textarea
  highlightedCode: string = '';
  correctedCode: string = ''; // New property for corrected code with annotations
  score: number = 0; // Initialize score to 0
  improvementMessage: string = ''; // Initialize message to empty
  improvementSuggestions: string[] = []; // New property for the suggestions list
  redundancyStatus: string = 'ACCESSIBILITY_EVALUATOR_PAGE.NO'; // New property for redundancy status
  errorCount: number = 0; // New property for error count
  warningCount: number = 0; // New property for warning count

  private validator: MicrobitValidatorPro; // Declare the validator instance

  constructor(private translate: TranslateService) {
    this.highlightedCode = this.userCode; // Initialize highlighted code with user's input
    this.correctedCode = this.userCode; // Initialize corrected code
    this.validator = new MicrobitValidatorPro(); // Instantiate the validator
  }

  onCodeChange() {
    // This method will be called when the textarea content changes
    this.highlightedCode = this.userCode; // Always show user's raw code initially
    this.correctedCode = this.userCode; // Reset corrected code
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
      this.improvementMessage = this.improvementSuggestions.join(';\\n'); // Set for *ngIf

      // New logic for three-state redundancy status
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
      // Filter out success messages for annotations, sort by line number in reverse for safe insertion
      const issuesToProcess = result.issues
        .filter(issue => issue.type === 'error' || issue.type === 'warning')
        .sort((a, b) => (b.line || 0) - (a.line || 0)); 

      let microbitImportLine = -1;
      let hasMicrobitImport = false;
      let hasSpeechImport = false;
      let hasMusicImport = false;

      // Pre-scan for existing imports to avoid duplication
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

      for (const issue of issuesToProcess) {
        const translatedMessage = translations[issue.message as string];
        const translatedSuggestion = issue.suggestion ? translations[issue.suggestion as string] : '';

        // Specific correction for VALIDATOR.AUDIO_FEEDBACK.ERROR_MESSAGE (Missing audio import)
        if (issue.message === "VALIDATOR.AUDIO_FEEDBACK.ERROR_MESSAGE" && issue.suggestion === "VALIDATOR.AUDIO_FEEDBACK.ERROR_SUGGESTION_2") {
          if (!hasSpeechImport && !hasMusicImport) { // Only add if neither speech nor music is imported
            const snippetToAdd = [
              '#Import auditory content for visual impaired users',
              'import music #You can also: import speech'
            ];
            
            if (microbitImportLine !== -1) {
                lines.splice(microbitImportLine + 1, 0, ...snippetToAdd);
            } else {
                // If microbit import is missing, add it before our snippet
                lines.unshift(...['from microbit import *', ...snippetToAdd]);
            }
            hasSpeechImport = true; // Mark as added
            hasMusicImport = true; // Mark as added
          }
        } 
        // Specific correction for VALIDATOR.AUDIO_FEEDBACK.MISSING_AUDIO_OUTPUT_WITH_DISPLAY_SHOW
        else if (issue.message === "VALIDATOR.AUDIO_FEEDBACK.MISSING_AUDIO_OUTPUT_WITH_DISPLAY_SHOW" && issue.line !== undefined) {
          const lineNumber = issue.line - 1; // Convert to 0-based index
          if (lineNumber >= 0 && lineNumber < lines.length) {
            // Get the original line to find its indentation
            const originalLine = lines[lineNumber];
            const indentationMatch = originalLine.match(/^\s*/); // Regex to get leading whitespace
            const indentation = indentationMatch ? indentationMatch[0] : ''; // Fallback to no indentation

            const snippetToAdd = [
              '#Auditory feedback for visual impaired users',
              'music.play(music.BA_DING) #You can also: speech.say("Displayed")' // Using a default sound/text
            ].map(line => indentation + line); // Prepend indentation to each new line

            lines.splice(lineNumber + 1, 0, ...snippetToAdd);
          }
        }
        // General line-specific annotation
        else if (issue.line !== undefined) {
          const lineNumber = issue.line - 1; // Convert to 0-based index
          if (lineNumber >= 0 && lineNumber < lines.length) {
            // Get the original line to find its indentation
            const originalLine = lines[lineNumber];
            const indentationMatch = originalLine.match(/^\s*/); // Regex to get leading whitespace
            const indentation = indentationMatch ? indentationMatch[0] : ''; // Fallback to no indentation

            let annotation = `# ${issue.type.toUpperCase()}: ${translatedMessage}`;
            if (translatedSuggestion) {
              annotation += ` # SUGERENCIA: ${translatedSuggestion}`;
            }
            lines.splice(lineNumber + 1, 0, indentation + annotation); // Prepend indentation
          }
        }
        // General file-level annotation
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
}
