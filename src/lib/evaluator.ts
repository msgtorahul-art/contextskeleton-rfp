/**
 * Robust NLP Evaluator for Local Rule Compliance Checking.
 * Handles negations (no, not, lack, without, zero, un-, non-, refused, failed)
 * to prevent false-positive compliance passes.
 */

export function checkComplianceClause(
  text: string,
  targetTerms: string[],
  negationTerms: string[] = ['no', 'not', 'lack', 'lacks', 'without', 'zero', 'un-', 'non-', 'refused', 'failed', 'never', 'denied', 'absence']
): { present: boolean; negated: boolean; pass: boolean } {
  const lower = text.toLowerCase();

  // Check if any target term is present as a whole word or meaningful boundary
  let foundTerm = '';
  for (const term of targetTerms) {
    const termLower = term.toLowerCase();
    if (lower.includes(termLower)) {
      foundTerm = termLower;
      break;
    }
  }

  if (!foundTerm) {
    return { present: false, negated: false, pass: false };
  }

  // Check if negation words appear within 4 words before or after the found term
  const words = lower.split(/\s+/);
  const termIdx = words.findIndex(w => w.includes(foundTerm));

  let isNegated = false;
  if (termIdx !== -1) {
    const start = Math.max(0, termIdx - 4);
    const end = Math.min(words.length - 1, termIdx + 4);
    const windowText = words.slice(start, end + 1).join(' ');

    for (const neg of negationTerms) {
      if (windowText.includes(neg)) {
        isNegated = true;
        break;
      }
    }
  }

  // Special checks for prefixes like "unencrypted", "uncalibrated", "without 20mm"
  if (lower.includes(`un${foundTerm}`) || lower.includes(`non-${foundTerm}`) || lower.includes(`without ${foundTerm}`)) {
    isNegated = true;
  }

  return {
    present: true,
    negated: isNegated,
    pass: !isNegated
  };
}
