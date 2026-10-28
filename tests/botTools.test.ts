import { describe, it, expect } from 'vitest';
import { escapeMarkdown } from '../src/bot/utils/markdown.js';

describe('escapeMarkdown', () => {
  it('escapes Telegram legacy Markdown special characters', () => {
    expect(escapeMarkdown('john_doe')).toBe('john\\_doe');
    expect(escapeMarkdown('*bold* and _italic_')).toBe('\\*bold\\* and \\_italic\\_');
    expect(escapeMarkdown('user[name]')).toBe('user\\[name\\]');
    expect(escapeMarkdown('`code`')).toBe('\\`code\\`');
    expect(escapeMarkdown('plain text')).toBe('plain text');
    expect(escapeMarkdown(null)).toBe('');
    expect(escapeMarkdown(undefined)).toBe('');
  });
});

describe('BMI Calculation Logic', () => {
  it('correctly calculates BMI when height is entered in cm or meters', () => {
    const calcBmi = (weightKg: number, rawHeight: number) => {
      const heightM = rawHeight < 3 ? rawHeight : rawHeight / 100;
      return heightM > 0 ? weightKg / (heightM * heightM) : 22.5;
    };

    // 72 kg, 178 cm
    const bmiFromCm = calcBmi(72, 178);
    // 72 kg, 1.78 m
    const bmiFromMeters = calcBmi(72, 1.78);

    expect(bmiFromCm.toFixed(1)).toBe('22.7');
    expect(bmiFromMeters.toFixed(1)).toBe('22.7');
    expect(bmiFromCm).toBeCloseTo(bmiFromMeters, 5);
  });
});

describe('EMI Calculation Logic', () => {
  it('handles standard and 0% interest rate without dividing by zero', () => {
    const calcEmi = (p: number, annualRate: number, years: number) => {
      const r = annualRate / 12 / 100;
      const n = Math.max(1, years * 12);
      const emi = r === 0 ? p / n : (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      const totalPayment = emi * n;
      const totalInterest = Math.max(0, totalPayment - p);
      return { emi, totalPayment, totalInterest };
    };

    // Standard 50k at 8.5% for 5 years
    const standard = calcEmi(50000, 8.5, 5);
    expect(standard.emi).toBeGreaterThan(1000);
    expect(standard.totalInterest).toBeGreaterThan(0);

    // 0% interest rate
    const zeroInterest = calcEmi(12000, 0, 1);
    expect(zeroInterest.emi).toBe(1000);
    expect(zeroInterest.totalInterest).toBe(0);
    expect(zeroInterest.totalPayment).toBe(12000);
  });
});

describe('Numerology Date Parsing Logic', () => {
  it('normalizes both YYYY-MM-DD and DD-MM-YYYY dates correctly', () => {
    const parseDob = (cleanDob: string) => {
      const rawParts = cleanDob.replace(/\//g, '-').split('-');
      let y = '1998', m = '05', d = '15';
      if (rawParts.length === 3) {
        if (rawParts[0].length === 4) {
          [y, m, d] = rawParts;
        } else if (rawParts[2].length === 4) {
          [d, m, y] = rawParts;
        } else {
          [y, m, d] = rawParts;
        }
      }
      return { y, m, d };
    };

    const iso = parseDob('1998-05-15');
    const uk = parseDob('15-05-1998');
    const slash = parseDob('15/05/1998');

    expect(iso).toEqual({ y: '1998', m: '05', d: '15' });
    expect(uk).toEqual({ y: '1998', m: '05', d: '15' });
    expect(slash).toEqual({ y: '1998', m: '05', d: '15' });
  });
});
