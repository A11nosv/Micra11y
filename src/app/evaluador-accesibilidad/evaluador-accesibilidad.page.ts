import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon, IonBackButton, IonTextarea } from '@ionic/angular/standalone'; // Import IonTextarea
import { TranslateModule } from '@ngx-translate/core';
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
  score: number = 0; // Initialize score to 0
  improvementMessage: string = ''; // Initialize message to empty
  redundancyDetected: boolean = false; // Initialize to false
  errorCount: number = 0; // New property for error count
  warningCount: number = 0; // New property for warning count

  private validator: MicrobitValidatorPro; // Declare the validator instance

  constructor() {
    this.highlightedCode = this.userCode; // Initialize highlighted code
    this.validator = new MicrobitValidatorPro(); // Instantiate the validator
    this.checkAccessibility(); // Perform initial check
  }

  onCodeChange() {
    // This method will be called when the textarea content changes
    // In a real scenario, you might want to debounce this to avoid excessive highlighting
    this.highlightedCode = this.userCode;
    // Optionally, re-evaluate accessibility on code change
    this.checkAccessibility();
  }

  checkAccessibility() {
    const result = this.validator.validate(this.userCode);
    this.score = result.score;
    
    // Calculate error and warning counts
    this.errorCount = result.issues.filter(issue => issue.type === 'error').length;
    this.warningCount = result.issues.filter(issue => issue.type === 'warning').length;

    // Process issues to generate improvementMessage and redundancyDetected
    this.improvementMessage = result.issues
      .filter(issue => issue.suggestion)
      .map(issue => issue.suggestion)
      .join(';\n');
    
    this.redundancyDetected = result.issues.some(issue => 
      issue.message.includes("Entrada accesible") || issue.message.includes("Solo usas botones físicos")
    );
  }
}
