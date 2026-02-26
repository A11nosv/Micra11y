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
            const trimmedLine = line.trim();

            if (trimmedLine === '' || trimmedLine.startsWith('#')) return;

            // 1. REGLA: Uso de retroalimentación multisensorial
            // Track imports
            if (/(from\s+microbit\s+import\s+.*|import\s+microbit)/.test(line)) {
                hasMicrobitImport = true;
            }
            if (/import\s+(speech|music)|from\s+(speech|music)/.test(line)) {
                hasAudioImport = true;
            }

            // Track usage
            if (/music\.play\(.*\)|speech\.say\(.*\)/.test(line)) {
                hasAudioOutput = true;
            }
            if (/display\.(show|scroll)\(.*\)/.test(line)) {
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
                } else {
                    score += 0.2; // Small reward for using sleep correctly instead of pass
                }
            }

            // 3. REGLA: Comentarios (Semántica y Claridad)
            if (line.includes('#')) {
                score += 0.5;
            }

            // 4. REGLA: Pulsaciones complejas
            const complexPressRegex = /(button_a\.is_pressed\(\)\s*and\s*button_b\.is_pressed\(\))|(button_b\.is_pressed\(\)\s*and\s*button_a\.is_pressed\(\))|(button_a\.is_pressed\(\)\s*and\s*pin_logo\.is_touched\(\))|(pin_logo\.is_touched\(\)\s*and\s*button_a\.is_pressed\(\))|(button_b\.is_pressed\(\)\s*and\s*pin_logo\.is_touched\(\))|(pin_logo\.is_touched\(\)\s*and\s*button_b\.is_pressed\(\))/;
            if (complexPressRegex.test(line)) {
                issues.push({
                    type: 'warning',
                    message: "VALIDATOR.COMPLEX_PRESSES.WARNING_MESSAGE",
                    suggestion: "VALIDATOR.COMPLEX_PRESSES.WARNING_SUGGESTION",
                    line: lineNumber
                });
            }

            // 5. REGLA: Semántica de Código
            const assignmentMatch = line.match(/^\s*(\w+)\s*=\s*(.*)$/);
            if (assignmentMatch) {
                const variableName = assignmentMatch[1];
                const assignedValue = assignmentMatch[2].trim();

                if (variableName.length <= 4) {
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
                } else {
                    score += 0.5; // Reward for descriptive names
                }
            }
        });
        
        // --- REGLA 1: Feedback Auditivo ---
        const hasDisplayShow = displayShowLines.length > 0;

        if (hasAudioImport) {
            score += 1.0;
        }
        if (hasAudioImport && hasAudioOutput) {
            score += 2.0;
            issues.push({ type: 'success', message: "VALIDATOR.AUDIO_FEEDBACK.SUCCESS_MESSAGE_2" });
        } else if (hasAudioImport && !hasAudioOutput) {
            issues.push({
                type: 'error',
                message: "VALIDATOR.AUDIO_FEEDBACK.ERROR_MESSAGE",
                suggestion: "VALIDATOR.AUDIO_FEEDBACK.ERROR_SUGGESTION"
            });
        } else { // No audio import
            if (hasDisplayShow && !hasAudioOutput) {
                displayShowLines.forEach(lineNumber => {
                    issues.push({
                        type: 'error',
                        message: "VALIDATOR.AUDIO_FEEDBACK.MISSING_AUDIO_OUTPUT_WITH_DISPLAY_SHOW",
                        suggestion: "VALIDATOR.AUDIO_FEEDBACK.SUGGEST_AUDIO_OUTPUT_WITH_DISPLAY_SHOW",
                        line: lineNumber
                    });
                });
            } else if (!hasAudioImport) {
                issues.push({
                    type: 'error',
                    message: "VALIDATOR.AUDIO_FEEDBACK.ERROR_MESSAGE",
                    suggestion: "VALIDATOR.AUDIO_FEEDBACK.ERROR_SUGGESTION_2"
                });
            }
        }

        // --- REGLA 3: Redundancia de Entrada ---
        const hasButtonA = /button_a\.is_pressed\(\)/.test(code);
        const hasButtonB = /button_b\.is_pressed\(\)/.test(code);
        const hasAlternativeInput = /pin_logo\.is_touched|accelerometer|pin[0-2]\.is_touched/.test(code);

        if (!hasButtonA && !hasButtonB) {
            score += 2.0; // Accessibility by not requiring buttons
            issues.push({
                type: 'success',
                message: "VALIDATOR.INPUT_REDUNDANCY.NO_BUTTONS_USED"
            });
        } else if (hasAlternativeInput) {
            score += 3.0;
            issues.push({ type: 'success', message: "VALIDATOR.INPUT_REDUNDANCY.SUCCESS_MESSAGE" });
        } else {
            issues.push({
                type: 'error',
                message: "VALIDATOR.INPUT_REDUNDANCY.ERROR_MESSAGE",
                suggestion: "VALIDATOR.INPUT_REDUNDANCY.ERROR_SUGGESTION"
            });
        }

        
        return { score: Math.min(score, 10), issues };
    }
}
