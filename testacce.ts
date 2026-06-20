export type CodeFixAction =
    | { action: 'insertAfter'; line: number; content: string[] }
    | { action: 'insertBefore'; line: number; content: string[] }
    | { action: 'replaceLine'; line: number; content: string }
    | { action: 'insertAtTop'; content: string[] }
    | { action: 'appendEnd'; content: string[] };

export type AccessibilityIssue = {
    type: 'error' | 'warning' | 'success';
    message: string;
    suggestion?: string;
    line?: number;
    rule?: string;
    fix?: CodeFixAction | CodeFixAction[];
};

export type EvaluationResult = {
    score: number;
    issues: AccessibilityIssue[];
    correctedCode: string;
};

export class MicrobitValidatorPro {
    public validate(code: string): EvaluationResult {
        const issues: AccessibilityIssue[] = [];
        let score = 0;
        const lines = code.split('\n');

        let hasMicrobitImport = false;
        let hasSpeechImport = false;
        let hasMusicImport = false;
        let hasAudioOutput = false;
        const displayShowLines: number[] = [];
        const displayScrollLines: number[] = [];

        lines.forEach((line, index) => {
            const lineNumber = index + 1;
            const trimmedLine = line.trim();

            if (trimmedLine === '' || trimmedLine.startsWith('#')) {
                return;
            }

            if (/(from\s+microbit\s+import\s+.*|import\s+microbit)/.test(line)) {
                hasMicrobitImport = true;
            }
            if (/import\s+speech/.test(line)) {
                hasSpeechImport = true;
            }
            if (/import\s+music/.test(line)) {
                hasMusicImport = true;
            }

            if (/music\.play\s*\(|music\.pitch\s*\(|speech\.say\s*\(/.test(line)) {
                hasAudioOutput = true;
            }

            const displayShowMatch = line.match(/display\.show\s*\(([^)]*)\)/);
            if (displayShowMatch) {
                displayShowLines.push(lineNumber);
            }

            const displayScrollMatch = line.match(/display\.scroll\s*\(([^)]*)\)/);
            if (displayScrollMatch) {
                displayScrollLines.push(lineNumber);
            }

            const sleepMatch = line.match(/sleep\s*\(\s*(\d+)\s*\)/);
            if (sleepMatch) {
                const ms = parseInt(sleepMatch[1], 10);
                if (ms > 2000) {
                    const indentation = line.match(/^\s*/)?.[0] ?? '';
                    issues.push({
                        type: 'error',
                        rule: 'BLOCKING_LOOPS',
                        message: 'VALIDATOR.BLOCKING_LOOPS.WARNING_MESSAGE',
                        suggestion: 'VALIDATOR.BLOCKING_LOOPS.WARNING_SUGGESTION',
                        line: lineNumber,
                        fix: {
                            action: 'replaceLine',
                            line: lineNumber,
                            content: line.replace(/sleep\s*\(\s*\d+\s*\)/, 'sleep(1000)  # Reducido para mejorar reactividad')
                        }
                    });
                } else {
                    score += 0.2;
                }
            }

            if (line.includes('#')) {
                score += 0.3;
            }

            const complexPressRegex =
                /(button_a\.is_pressed\(\)\s*and\s*button_b\.is_pressed\(\))|(button_b\.is_pressed\(\)\s*and\s*button_a\.is_pressed\(\))|(button_a\.is_pressed\(\)\s*and\s*pin_logo\.is_touched\(\))|(pin_logo\.is_touched\(\)\s*and\s*button_a\.is_pressed\(\))|(button_b\.is_pressed\(\)\s*and\s*pin_logo\.is_touched\(\))|(pin_logo\.is_touched\(\)\s*and\s*button_b\.is_pressed\(\))/;

            if (complexPressRegex.test(line)) {
                const indentation = line.match(/^\s*/)?.[0] ?? '';
                issues.push({
                    type: 'warning',
                    rule: 'COMPLEX_PRESSES',
                    message: 'VALIDATOR.COMPLEX_PRESSES.WARNING_MESSAGE',
                    suggestion: 'VALIDATOR.COMPLEX_PRESSES.WARNING_SUGGESTION',
                    line: lineNumber,
                    fix: {
                        action: 'insertAfter',
                        line: lineNumber,
                        content: [
                            `${indentation}# Alternativa accesible: usa pin_logo.is_touched() en lugar de pulsaciones simultáneas`
                        ]
                    }
                });
            }

            const assignmentMatch = line.match(/^\s*(\w+)\s*=\s*(.*)$/);
            if (assignmentMatch) {
                const variableName = assignmentMatch[1];
                const assignedValue = assignmentMatch[2].trim();
                const isNumber = /^-?\d+(\.\d*)?([eE][+-]?\d+)?$/.test(assignedValue);
                const isBoolean = /^(True|False)$/.test(assignedValue);
                const isString = /^(".*"|'.*')$/.test(assignedValue);

                if (variableName.length <= 2 && (isNumber || isBoolean || isString)) {
                    issues.push({
                        type: 'warning',
                        rule: 'CODE_SEMANTICS',
                        message: 'VALIDATOR.CODE_SEMANTICS.WARNING_MESSAGE',
                        suggestion: 'VALIDATOR.CODE_SEMANTICS.WARNING_SUGGESTION',
                        line: lineNumber
                    });
                } else if (variableName.length > 4) {
                    score += 0.5;
                }
            }
        });

        if (!hasMicrobitImport) {
            issues.push({
                type: 'error',
                rule: 'MISSING_IMPORT',
                message: 'VALIDATOR.MISSING_IMPORT.ERROR_MESSAGE',
                suggestion: 'VALIDATOR.MISSING_IMPORT.ERROR_SUGGESTION',
                fix: {
                    action: 'insertAtTop',
                    content: ['from microbit import *']
                }
            });
        }

        const hasAudioImport = hasSpeechImport || hasMusicImport;
        const hasDisplayOutput = displayShowLines.length > 0 || displayScrollLines.length > 0;

        if (hasAudioImport) {
            score += 1.0;
        }

        if (hasAudioImport && hasAudioOutput) {
            score += 2.0;
            issues.push({
                type: 'success',
                rule: 'AUDIO_FEEDBACK',
                message: 'VALIDATOR.AUDIO_FEEDBACK.SUCCESS_MESSAGE_2'
            });
        } else if (hasAudioImport && !hasAudioOutput) {
            issues.push({
                type: 'error',
                rule: 'AUDIO_FEEDBACK',
                message: 'VALIDATOR.AUDIO_FEEDBACK.ERROR_MESSAGE',
                suggestion: 'VALIDATOR.AUDIO_FEEDBACK.ERROR_SUGGESTION',
                fix: this.buildGlobalAudioOutputFix(displayShowLines, displayScrollLines, lines)
            });
        } else if (hasDisplayOutput && !hasAudioOutput) {
            displayShowLines.forEach(lineNumber => {
                issues.push(this.buildDisplayShowIssue(lineNumber, lines[lineNumber - 1]));
            });
            displayScrollLines.forEach(lineNumber => {
                if (!this.hasNearbyAudio(lines, lineNumber - 1)) {
                    issues.push(this.buildDisplayScrollIssue(lineNumber, lines[lineNumber - 1]));
                }
            });
        } else if (!hasAudioImport && hasDisplayOutput) {
            issues.push({
                type: 'error',
                rule: 'AUDIO_FEEDBACK',
                message: 'VALIDATOR.AUDIO_FEEDBACK.ERROR_MESSAGE',
                suggestion: 'VALIDATOR.AUDIO_FEEDBACK.ERROR_SUGGESTION_2'
            });
        }

        const hasButtonA = /button_a\.is_pressed\(\)/.test(code);
        const hasButtonB = /button_b\.is_pressed\(\)/.test(code);
        const hasAlternativeInput = /pin_logo\.is_touched|accelerometer|pin[0-2]\.is_touched|gesture/.test(code);

        if (!hasButtonA && !hasButtonB) {
            score += 2.0;
            issues.push({
                type: 'success',
                rule: 'INPUT_REDUNDANCY',
                message: 'VALIDATOR.INPUT_REDUNDANCY.NO_BUTTONS_USED'
            });
        } else if (hasAlternativeInput) {
            score += 3.0;
            issues.push({
                type: 'success',
                rule: 'INPUT_REDUNDANCY',
                message: 'VALIDATOR.INPUT_REDUNDANCY.SUCCESS_MESSAGE'
            });
        } else {
            const buttonLine = this.findFirstButtonLine(lines);
            issues.push({
                type: 'error',
                rule: 'INPUT_REDUNDANCY',
                message: 'VALIDATOR.INPUT_REDUNDANCY.ERROR_MESSAGE',
                suggestion: 'VALIDATOR.INPUT_REDUNDANCY.ERROR_SUGGESTION',
                line: buttonLine,
                fix: buttonLine
                    ? {
                          action: 'insertAfter',
                          line: buttonLine,
                          content: [
                              `${lines[buttonLine - 1].match(/^\s*/)?.[0] ?? ''}# Alternativa accesible: elif pin_logo.is_touched():`
                          ]
                      }
                    : undefined
            });
        }

        if (/while\s+True\s*:/.test(code) && !/sleep\s*\(/.test(code)) {
            const whileLine = lines.findIndex(l => /while\s+True\s*:/.test(l)) + 1;
            if (whileLine > 0) {
                const indentation = (lines[whileLine - 1].match(/^\s*/)?.[0] ?? '') + '    ';
                issues.push({
                    type: 'warning',
                    rule: 'INFINITE_LOOP',
                    message: 'VALIDATOR.INFINITE_LOOP.WARNING_MESSAGE',
                    suggestion: 'VALIDATOR.INFINITE_LOOP.WARNING_SUGGESTION',
                    line: whileLine,
                    fix: {
                        action: 'insertAfter',
                        line: whileLine,
                        content: [`${indentation}sleep(100)  # Evita bloqueo del bucle y mejora reactividad`]
                    }
                });
            }
        }

        const correctedCode = this.applyFixes(code, issues);

        return {
            score: Math.min(Math.round(score * 10) / 10, 10),
            issues,
            correctedCode
        };
    }

    public applyFixes(code: string, issues: AccessibilityIssue[]): string {
        let lines = code.split('\n');
        const fixes: CodeFixAction[] = [];

        for (const issue of issues) {
            if (!issue.fix) {
                continue;
            }
            const issueFixes = Array.isArray(issue.fix) ? issue.fix : [issue.fix];
            fixes.push(...issueFixes);
        }

        fixes.sort((a, b) => {
            const lineA = 'line' in a ? (a.line ?? 0) : 0;
            const lineB = 'line' in b ? (b.line ?? 0) : 0;
            return lineB - lineA;
        });

        for (const fix of fixes) {
            switch (fix.action) {
                case 'insertAfter': {
                    const idx = fix.line;
                    if (idx >= 1 && idx <= lines.length) {
                        lines.splice(idx, 0, ...fix.content);
                    }
                    break;
                }
                case 'insertBefore': {
                    const idx = fix.line - 1;
                    if (idx >= 0 && idx < lines.length) {
                        lines.splice(idx, 0, ...fix.content);
                    }
                    break;
                }
                case 'replaceLine': {
                    const idx = fix.line - 1;
                    if (idx >= 0 && idx < lines.length) {
                        lines[idx] = fix.content;
                    }
                    break;
                }
                case 'insertAtTop': {
                    lines.unshift(...fix.content);
                    break;
                }
                case 'appendEnd': {
                    lines.push(...fix.content);
                    break;
                }
            }
        }

        return this.ensureAudioImports(lines.join('\n'));
    }

    private ensureAudioImports(code: string): string {
        const lines = code.split('\n');
        let hasSpeech = lines.some(l => /import\s+speech/.test(l));
        let hasMusic = lines.some(l => /import\s+music/.test(l));
        const needsAudio = /display\.(show|scroll)\s*\(|speech\.say|music\.play/.test(code);

        if (!needsAudio || (hasSpeech && hasMusic)) {
            return lines.join('\n');
        }

        let microbitLine = -1;
        lines.forEach((line, i) => {
            if (/(from\s+microbit\s+import|import\s+microbit)/.test(line)) {
                microbitLine = i;
            }
        });

        const importsToAdd: string[] = [];
        if (!hasMusic && /music\.(play|pitch)/.test(code)) {
            importsToAdd.push('import music  # Retroalimentación auditiva');
        } else if (!hasMusic && !hasSpeech && /display\.(show|scroll)/.test(code)) {
            importsToAdd.push('import music  # Retroalimentación auditiva para usuarios con discapacidad visual');
        }
        if (!hasSpeech && /speech\.say/.test(code)) {
            importsToAdd.push('import speech  # Retroalimentación por voz');
        }

        if (importsToAdd.length === 0) {
            return lines.join('\n');
        }

        if (microbitLine >= 0) {
            lines.splice(microbitLine + 1, 0, ...importsToAdd);
        } else {
            lines.unshift('from microbit import *', ...importsToAdd);
        }

        return lines.join('\n');
    }

    private hasNearbyAudio(lines: string[], index: number): boolean {
        const start = Math.max(0, index - 2);
        const end = Math.min(lines.length - 1, index + 2);
        for (let i = start; i <= end; i++) {
            if (/music\.(play|pitch)\s*\(|speech\.say\s*\(/.test(lines[i])) {
                return true;
            }
        }
        return false;
    }

    private buildDisplayShowIssue(lineNumber: number, line: string): AccessibilityIssue {
        const indentation = line.match(/^\s*/)?.[0] ?? '';
        const arg = line.match(/display\.show\s*\(([^)]*)\)/)?.[1]?.trim() ?? '';
        const isImage = /Image\./.test(arg);
        const audioLine = isImage
            ? `${indentation}music.play(music.BA_DING)  # Retroalimentación sonora`
            : `${indentation}speech.say(str(${arg || '"Mostrado"'}))  # Retroalimentación por voz`;

        return {
            type: 'error',
            rule: 'AUDIO_FEEDBACK',
            message: 'VALIDATOR.AUDIO_FEEDBACK.MISSING_AUDIO_OUTPUT_WITH_DISPLAY_SHOW',
            suggestion: 'VALIDATOR.AUDIO_FEEDBACK.SUGGEST_AUDIO_OUTPUT_WITH_DISPLAY_SHOW',
            line: lineNumber,
            fix: {
                action: 'insertAfter',
                line: lineNumber,
                content: [audioLine]
            }
        };
    }

    private buildDisplayScrollIssue(lineNumber: number, line: string): AccessibilityIssue {
        const indentation = line.match(/^\s*/)?.[0] ?? '';
        const textArg = this.extractScrollText(line);
        const fixedLine = line.includes('wait=')
            ? line
            : line.replace(/display\.scroll\s*\(/, 'display.scroll(').replace(/\)\s*$/, ', wait=False)');

        const fixes: CodeFixAction[] = [];

        if (!line.includes('wait=False') && !line.includes('wait = False')) {
            fixes.push({
                action: 'replaceLine',
                line: lineNumber,
                content: fixedLine.replace(/display\.scroll\s*\(([^)]+)\)/, 'display.scroll($1, wait=False)')
            });
        }

        fixes.push({
            action: 'insertAfter',
            line: lineNumber,
            content: [`${indentation}speech.say(${textArg})  # Retroalimentación por voz`]
        });

        return {
            type: 'error',
            rule: 'AUDIO_FEEDBACK',
            message: 'VALIDATOR.AUDIO_FEEDBACK.MISSING_AUDIO_WITH_DISPLAY_SCROLL',
            suggestion: 'VALIDATOR.AUDIO_FEEDBACK.SUGGEST_AUDIO_OUTPUT_WITH_DISPLAY_SHOW',
            line: lineNumber,
            fix: fixes
        };
    }

    private extractScrollText(line: string): string {
        const match = line.match(/display\.scroll\s*\(\s*(['"])(.*?)\1/);
        if (match) {
            return `"${match[2]}"`;
        }
        const varMatch = line.match(/display\.scroll\s*\(\s*(\w+)/);
        if (varMatch) {
            return `str(${varMatch[1]})`;
        }
        return '"Texto mostrado"';
    }

    private buildGlobalAudioOutputFix(
        displayShowLines: number[],
        displayScrollLines: number[],
        lines: string[]
    ): CodeFixAction[] {
        const fixes: CodeFixAction[] = [];
        const targetLine = displayShowLines[0] ?? displayScrollLines[0] ?? 1;
        const indentation = lines[targetLine - 1]?.match(/^\s*/)?.[0] ?? '';

        fixes.push({
            action: 'insertAfter',
            line: targetLine,
            content: [`${indentation}music.play(music.BA_DING)  # Usa la salida de audio importada`]
        });

        return fixes;
    }

    private findFirstButtonLine(lines: string[]): number | undefined {
        for (let i = 0; i < lines.length; i++) {
            if (/button_[ab]\.is_pressed\(\)/.test(lines[i])) {
                return i + 1;
            }
        }
        return undefined;
    }
}
