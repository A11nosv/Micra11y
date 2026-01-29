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
  redundancyDetected: boolean = false; // Initialize to false
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
      this.improvementMessage = Object.values(
        suggestionKeys.map(key => translations[key as string])
      ).join(';\n');

      this.redundancyDetected = result.issues.some(
        issue => issue.message === 'VALIDATOR.INPUT_REDUNDANCY.ERROR_MESSAGE'
      );

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
        if (line.includes("from microbit import *") || line.includes("import microbit")) {
          hasMicrobitImport = true;
          microbitImportLine = index;
        }
        if (line.includes("import speech")) {
          hasSpeechImport = true;
        }
        if (line.includes("import music")) {
          hasMusicImport = true;
        }
      });

      for (const issue of issuesToProcess) {
        const translatedMessage = translations[issue.message as string];
        const translatedSuggestion = issue.suggestion ? translations[issue.suggestion as string] : '';

        // Specific correction for VALIDATOR.AUDIO_FEEDBACK.ERROR_MESSAGE (Missing audio import)
        if (issue.message === "VALIDATOR.AUDIO_FEEDBACK.ERROR_MESSAGE" && issue.suggestion === "VALIDATOR.AUDIO_FEEDBACK.ERROR_SUGGESTION_2") {
          if (!hasSpeechImport && !hasMusicImport) { // Only add if neither speech nor music is imported
            let correctionSnippet = '';
            if (!hasMicrobitImport) {
              correctionSnippet += `from microbit import *\n`;
            }
            correctionSnippet += `import speech # SUGERENCIA: ${translatedSuggestion}\nimport music # Opcional: también puedes usar 'import music'`;
            
            if (microbitImportLine !== -1) {
                lines.splice(microbitImportLine + 1, 0, correctionSnippet);
            } else {
                lines.unshift(correctionSnippet);
            }
            hasSpeechImport = true; // Mark as added to prevent further additions
            hasMusicImport = true; // Mark as added
          }
        } 
        // Specific correction for VALIDATOR.AUDIO_FEEDBACK.MISSING_AUDIO_OUTPUT_WITH_DISPLAY_SHOW
        else if (issue.message === "VALIDATOR.AUDIO_FEEDBACK.MISSING_AUDIO_OUTPUT_WITH_DISPLAY_SHOW" && issue.line !== undefined) {
          const lineNumber = issue.line - 1; // Convert to 0-based index
          if (lineNumber >= 0 && lineNumber < lines.length) {
            let correctionLine = '';
            // Ensure necessary imports are present for the suggestion
            if (!hasMicrobitImport) {
                lines.unshift(`from microbit import *`);
                hasMicrobitImport = true;
                microbitImportLine = 0; // Adjust if prepended
            }
            if (!hasSpeechImport && !hasMusicImport) {
                const importSnippet = `import speech # Necesario para la sugerencia\nimport music # Opcional`;
                if (microbitImportLine !== -1) {
                  lines.splice(microbitImportLine + 1, 0, importSnippet);
                } else {
                  lines.unshift(importSnippet);
                }
                hasSpeechImport = true;
                hasMusicImport = true;
            }
            correctionLine = `music.play(music.BA_DING) # SUGERENCIA: ${translatedSuggestion.replace(/'import speech' o 'import music' y /g, '')}`; // Use BA_DING as example
            lines.splice(lineNumber + 1, 0, correctionLine);
          }
        }
        // General line-specific annotation
        else if (issue.line !== undefined) {
          const lineNumber = issue.line - 1; // Convert to 0-based index
          if (lineNumber >= 0 && lineNumber < lines.length) {
            let annotation = `# ${issue.type.toUpperCase()}: ${translatedMessage}`;
            if (translatedSuggestion) {
              annotation += ` # SUGERENCIA: ${translatedSuggestion}`;
            }
            lines.splice(lineNumber + 1, 0, annotation);
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
}
