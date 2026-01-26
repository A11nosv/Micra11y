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
            issues.push({ type: 'success', message: "Multimodalidad: Se detectó importación de audio." });
            if ((/music\.play\(.*\)|speech\.say\(.*\)/).test(code)) {
                score += 1.5;
                issues.push({ type: 'success', message: "Multimodalidad: Se detectó salida de audio." });
            } else {
                issues.push({
                    type: 'error',
                    message: "Falta salida sonora.",
                    suggestion: "Añade 'speech.say('[string]')', 'music.play(music.[song])' o 'music.([number])'  para que usuarios con discapacidad visual reciban información."
                });
            }
        } else {
            issues.push({
                type: 'error',
                message: "Falta salida sonora.",
                suggestion: "Importa 'speech' o 'music' para que usuarios con discapacidad visual reciban información."
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
                    message: "Bucle bloqueante detectado.",
                    suggestion: "Usas sleep() muy largos. Esto impide que la Micro:bit reaccione a botones o comandos de voz rápidamente."
                });
            } else {
                score += 2;
            }
        }

        // 3. REGLA: Redundancia de Entrada
        const hasAlternativeInput = /pin_logo\.is_touched|accelerometer|pin[0-2]\.is_touched/.test(code);
        if (hasAlternativeInput) {
            score += 3;
            issues.push({ type: 'success', message: "Entrada accesible: Usas sensores táctiles o de movimiento." });
        } else {
            issues.push({
                type: 'error',
                message: "Solo usas botones físicos.",
                suggestion: "Añade 'pin_logo.is_touched()' para facilitar el uso a personas con dificultad motriz."
            });
        }

        // 4. REGLA: Pulsaciones complejas
        const complexPressRegex = /(button_a\.is_pressed\(\)\s*and\s*button_b\.is_pressed\(\))|(button_b\.is_pressed\(\)\s*and\s*button_a\.is_pressed\(\))|(button_a\.is_pressed\(\)\s*and\s*pin_logo\.is_touched\(\))|(pin_logo\.is_touched\(\)\s*and\s*button_a\.is_pressed\(\))|(button_b\.is_pressed\(\)\s*and\s*pin_logo\.is_touched\(\))|(pin_logo\.is_touched\(\)\s*and\s*button_b\.is_pressed\(\))/;
        if (complexPressRegex.test(code)) {
            score -= 1; // Reduce score for complex presses
            issues.push({
                type: 'warning',
                message: "Pulsación compleja detectada.",
                suggestion: "Evita solicitar la pulsación simultánea de dos botones o un botón y el logo, ya que dificulta la interacción para usuarios con ciertas discapacidades motrices."
            });
        } else {
            score += 1; // Award score if no complex presses are found
            issues.push({ type: 'success', message: "Pulsaciones simples: No se detectaron pulsaciones complejas." });
        }


        // 5. REGLA: Semántica de Código
        const namingScore = /(variable|estado|boton|sensor)_/.test(code) ? 2 : 0;
        if (namingScore > 0) {
            score += 2;
            issues.push({ type: 'success', message: "Semántica: Las variables tienen nombres descriptivos." });
        } else {
            issues.push({
                type: 'warning',
                message: "Nombres de variables genéricos.",
                suggestion: "Usa nombres como 'estado_alarma' en lugar de 'a' para facilitar la lectura con lectores de pantalla."
            });
        }

        return { score: Math.min(score, 10), issues };
    }
}