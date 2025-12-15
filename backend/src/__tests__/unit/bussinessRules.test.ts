import { describe, it, expect } from '@jest/globals';

// --- Helper Functions to Test (Copy/Paste logic or export from your services to test directly) ---

// Logic from RepairPlanService
function calculatePriority(findings: any[]): string {
    const maxSeverity = Math.max(...findings.map(f => f.severity));
    if (maxSeverity >= 5) return 'HIGH';
    if (maxSeverity >= 3) return 'MEDIUM';
    return 'LOW';
}

// Logic from FindingService (The "Crack" Rule)
function applyCrackRule(category: string, notes: string, severity: number): number {
    if (category === 'BLADE_DAMAGE' && notes.toLowerCase().includes('crack')) {
        return Math.max(severity, 4);
    }
    return severity;
}

describe('Business Rules Unit Tests', () => {

    describe('1. Repair Plan Priority Logic', () => {
        it('should return HIGH if max severity is 5', () => {
            const findings = [{ severity: 1 }, { severity: 5 }];
            expect(calculatePriority(findings)).toBe('HIGH');
        });

        it('should return HIGH if max severity is > 5', () => {
            const findings = [{ severity: 8 }];
            expect(calculatePriority(findings)).toBe('HIGH');
        });

        it('should return MEDIUM if max severity is 3 or 4', () => {
            expect(calculatePriority([{ severity: 3 }])).toBe('MEDIUM');
            expect(calculatePriority([{ severity: 4 }])).toBe('MEDIUM');
        });

        it('should return LOW if max severity is < 3', () => {
            expect(calculatePriority([{ severity: 1 }, { severity: 2 }])).toBe('LOW');
        });
    });

    describe('2. Finding "Crack" Rule Logic', () => {
        it('should upgrade severity to 4 if BLADE_DAMAGE and "crack" detected', () => {
            const result = applyCrackRule('BLADE_DAMAGE', 'Visible crack on surface', 1);
            expect(result).toBe(4);
        });

        it('should NOT downgrade severity if user inputs 5', () => {
            const result = applyCrackRule('BLADE_DAMAGE', 'Huge crack', 5);
            expect(result).toBe(5);
        });

        it('should NOT change severity if category is not BLADE_DAMAGE', () => {
            const result = applyCrackRule('LIGHTNING', 'crack in logic', 1);
            expect(result).toBe(1);
        });

        it('should NOT change severity if "crack" is not in notes', () => {
            const result = applyCrackRule('BLADE_DAMAGE', 'Just a scratch', 2);
            expect(result).toBe(2);
        });

         it('should be case insensitive', () => {
            const result = applyCrackRule('BLADE_DAMAGE', 'CRACK detected', 1);
            expect(result).toBe(4);
        });
    });
});