export type AccessibilityIssue = {
    type: 'error' | 'warning' | 'success';
    message: string;
    suggestion?: string;
    line?: number; // Added line number for precise feedback
};

export class MicrobitValidatorPro {
    public validate(code: string): { score: number; issues: AccessibilityIssue[] } {
        const issues: AccessibilityIssue[] = [];
        let score = 0;
        const lines = code.split('\n');

        let hasMicrobitImport = false;
        let hasAudioImport = false;
        let hasAudioOutput = false;
        let displayShowLines: number[] = [];

        lines.forEach((line, index) => {
            const lineNumber = index + 1;

            // 1. REGLA: Uso de retroalimentación multisensorial
            // Track imports
            if (/(from microbit import \*|import microbit)/.test(line)) {
                hasMicrobitImport = true;
            }
            if (!/^\s*#/.test(line) && /import\s+(speech|music)|from\s+(speech|music)/.test(line)) {
                hasAudioImport = true;
            }

            // Track usage
            if (/music\.play\(.*\)|speech\.say\(.*\)/.test(line)) {
                hasAudioOutput = true;
            }
            if (/display\.show\(.*\)/.test(line)) {
                displayShowLines.push(lineNumber);
            }

            // 2. REGLA: Bucles Bloqueantes (Uso excesivo de sleep)
            const sleepMatch = line.match(/sleep\((\d+)\)/);
            if (sleepMatch) {
                const ms = parseInt(sleepMatch[1]);
                if (ms > 2000) { // Más de 2 segundos bloqueado
                    issues.push({
                        type: 'error',
                        message: "VALIDATOR.BLOCKING_LOOPS.WARNING_MESSAGE",
                        suggestion: "VALIDATOR.BLOCKING_LOOPS.WARNING_SUGGESTION",
                        line: lineNumber
                    });
                }
            }

            // 4. REGLA: Pulsaciones complejas (Check per line for simplicity, might need multi-line if button checks are split)
            const complexPressRegex = /(button_a\.is_pressed\(\)\s*and\s*button_b\.is_pressed\(\))|(button_b\.is_pressed\(\)\s*and\s*button_a\.is_pressed\(\))|(button_a\.is_pressed\(\)\s*and\s*pin_logo\.is_touched\(\))|(pin_logo\.is_touched\(\)\s*and\s*button_a\.is_pressed\(\))|(button_b\.is_pressed\(\)\s*and\s*pin_logo\.is_touched\(\))|(pin_logo\.is_touched\(\)\s*and\s*button_b\.is_pressed\(\))/;
            if (complexPressRegex.test(line)) {
                issues.push({
                    type: 'warning',
                    message: "VALIDATOR.COMPLEX_PRESSES.WARNING_MESSAGE",
                    suggestion: "VALIDATOR.COMPLEX_PRESSES.WARNING_SUGGESTION",
                    line: lineNumber
                });
            }

            // 5. REGLA: Semántica de Código (Nueva lógica)
            const assignmentMatch = line.match(/^\s*(\w+)\s*=\s*(.*)$/);
            if (assignmentMatch) {
                const variableName = assignmentMatch[1];
                const assignedValue = assignmentMatch[2].trim();

                if (variableName.length <= 4) {
                    // Check if value is a literal number, boolean, or string
                    const isNumber = /^-?\d+(\.\d*)?([eE][+-]?\d+)?$/.test(assignedValue);
                    const isBoolean = /^(True|False)$/.test(assignedValue);
                    const isString = /^(".*"|'.*')$/.test(assignedValue);

                    if (isNumber || isBoolean || isString) {
                        issues.push({
                            type: 'warning',
                            message: "VALIDATOR.CODE_SEMANTICS.WARNING_MESSAGE",
                            suggestion: "VALIDATOR.CODE_SEMANTICS.WARNING_SUGGESTION",
                            line: lineNumber
                        });
                    }
                }
            }
        });
        
        // --- REGLA 1: Feedback Auditivo (Evaluación a nivel de archivo/después de recorrer todas las líneas) ---
        const hasDisplayShow = displayShowLines.length > 0;

        if (hasAudioImport) {
            score += 1.5;
            // The success message for import is handled here, but output is separate
        }
        if (hasAudioImport && hasAudioOutput) {
            score += 1.5;
            // The success message for output is handled here
            issues.push({ type: 'success', message: "VALIDATOR.AUDIO_FEEDBACK.SUCCESS_MESSAGE_2" });
        } else if (hasAudioImport && !hasAudioOutput) {
            issues.push({
                type: 'error',
                message: "VALIDATOR.AUDIO_FEEDBACK.ERROR_MESSAGE", // Missing sound output
                suggestion: "VALIDATOR.AUDIO_FEEDBACK.ERROR_SUGGESTION" // Suggest adding music.play or speech.say
            });
        } else { // No audio import
            if (hasDisplayShow && !hasAudioOutput) { // Using display.show but no audio output
                displayShowLines.forEach(lineNumber => {
                    issues.push({
                        type: 'error',
                        message: "VALIDATOR.AUDIO_FEEDBACK.MISSING_AUDIO_OUTPUT_WITH_DISPLAY_SHOW",
                        suggestion: "VALIDATOR.AUDIO_FEEDBACK.SUGGEST_AUDIO_OUTPUT_WITH_DISPLAY_SHOW",
                        line: lineNumber // The crucial fix: ADD THE LINE NUMBER
                    });
                });
            } else if (!hasAudioImport) { // General case: no audio import at all
                issues.push({
                    type: 'error',
                    message: "VALIDATOR.AUDIO_FEEDBACK.ERROR_MESSAGE", // Missing sound output
                    suggestion: "VALIDATOR.AUDIO_FEEDBACK.ERROR_SUGGESTION_2" // Suggest importing speech/music
                });
            }
        }

        // --- REGLA 3: Redundancia de Entrada (Evaluación a nivel de archivo/después de recorrer todas las líneas) ---
        const hasButtonA = /button_a\.is_pressed\(\)/.test(code);
        const hasButtonB = /button_b\.is_pressed\(\)/.test(code);
        const hasAlternativeInput = /pin_logo\.is_touched|accelerometer|pin[0-2]\.is_touched/.test(code);

        if (!hasButtonA && !hasButtonB) {
            // New state: No buttons are used at all.
            issues.push({
                type: 'success', // Changed from 'warning'
                message: "VALIDATOR.INPUT_REDUNDANCY.NO_BUTTONS_USED"
            });
        } else if (hasAlternativeInput) {
            // Original success state: Alternative inputs are present.
            score += 3;
            issues.push({ type: 'success', message: "VALIDATOR.INPUT_REDUNDANCY.SUCCESS_MESSAGE" });
        } else {
            // Original error state: Buttons are used, but no alternatives.
            issues.push({
                type: 'error',
                message: "VALIDATOR.INPUT_REDUNDANCY.ERROR_MESSAGE",
                suggestion: "VALIDATOR.INPUT_REDUNDANCY.ERROR_SUGGESTION"
            });
        }

        
        return { score: Math.min(score, 10), issues };
    }
}
