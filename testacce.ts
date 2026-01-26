export type AccessibilityIssue = {
    type: 'error' | 'warning' | 'success';
    message: string;
    suggestion?: string;
};

export class MicrobitValidatorPro {
    public validate(code: string): { score: number; issues: AccessibilityIssue[] } {
        const issues: AccessibilityIssue[] = [];
        let score = 0;

        // 1. REGLA: Feedback Auditivo
        if (/import\s+(speech|music)|from\s+(speech|music)/.test(code)) {
            score += 1.5;
            issues.push({ type: 'success', message: "VALIDATOR.AUDIO_FEEDBACK.SUCCESS_MESSAGE" });
            if ((/music\.play\(.*\)|speech\.say\(.*\)/).test(code)) {
                score += 1.5;
                issues.push({ type: 'success', message: "VALIDATOR.AUDIO_FEEDBACK.SUCCESS_MESSAGE_2" });
            } else {
                issues.push({
                    type: 'error',
                    message: "VALIDATOR.AUDIO_FEEDBACK.ERROR_MESSAGE",
                    suggestion: "VALIDATOR.AUDIO_FEEDBACK.ERROR_SUGGESTION"
                });
            }
        } else {
            issues.push({
                type: 'error',
                message: "VALIDATOR.AUDIO_FEEDBACK.ERROR_MESSAGE",
                suggestion: "VALIDATOR.AUDIO_FEEDBACK.ERROR_SUGGESTION_2"
            });
        }

        // 2. REGLA: Bucles Bloqueantes (Uso excesivo de sleep)
        const sleepMatches = code.match(/sleep\((\d+)\)/g);
        if (sleepMatches) {
            const longSleep = sleepMatches.some(s => {
                const ms = parseInt(s.match(/\d+/)![0]);
                return ms > 2000; // Más de 2 segundos bloqueado
            });
            if (longSleep) {
                issues.push({
                    type: 'warning',
                    message: "VALIDATOR.BLOCKING_LOOPS.WARNING_MESSAGE",
                    suggestion: "VALIDATOR.BLOCKING_LOOPS.WARNING_SUGGESTION"
                });
            } else {
                score += 2;
            }
        }

        // 3. REGLA: Redundancia de Entrada
        const hasAlternativeInput = /pin_logo\.is_touched|accelerometer|pin[0-2]\.is_touched/.test(code);
        if (hasAlternativeInput) {
            score += 3;
            issues.push({ type: 'success', message: "VALIDATOR.INPUT_REDUNDANCY.SUCCESS_MESSAGE" });
        } else {
            issues.push({
                type: 'error',
                message: "VALIDATOR.INPUT_REDUNDANCY.ERROR_MESSAGE",
                suggestion: "VALIDATOR.INPUT_REDUNDANCY.ERROR_SUGGESTION"
            });
        }

        // 4. REGLA: Pulsaciones complejas
        const complexPressRegex = /(button_a\.is_pressed\(\)\s*and\s*button_b\.is_pressed\(\))|(button_b\.is_pressed\(\)\s*and\s*button_a\.is_pressed\(\))|(button_a\.is_pressed\(\)\s*and\s*pin_logo\.is_touched\(\))|(pin_logo\.is_touched\(\)\s*and\s*button_a\.is_pressed\(\))|(button_b\.is_pressed\(\)\s*and\s*pin_logo\.is_touched\(\))|(pin_logo\.is_touched\(\)\s*and\s*button_b\.is_pressed\(\))/;
        if (complexPressRegex.test(code)) {
            score -= 1; // Reduce score for complex presses
            issues.push({
                type: 'warning',
                message: "VALIDATOR.COMPLEX_PRESSES.WARNING_MESSAGE",
                suggestion: "VALIDATOR.COMPLEX_PRESSES.WARNING_SUGGESTION"
            });
        } else {
            score += 1; // Award score if no complex presses are found
            issues.push({ type: 'success', message: "VALIDATOR.COMPLEX_PRESSES.SUCCESS_MESSAGE" });
        }


        // 5. REGLA: Semántica de Código
        const namingScore = /(variable|estado|boton|sensor)_/.test(code) ? 2 : 0;
        if (namingScore > 0) {
            score += 2;
            issues.push({ type: 'success', message: "VALIDATOR.CODE_SEMANTICS.SUCCESS_MESSAGE" });
        } else {
            issues.push({
                type: 'warning',
                message: "VALIDATOR.CODE_SEMANTICS.WARNING_MESSAGE",
                suggestion: "VALIDATOR.CODE_SEMANTICS.WARNING_SUGGESTION"
            });
        }

        return { score: Math.min(score, 10), issues };
    }
}