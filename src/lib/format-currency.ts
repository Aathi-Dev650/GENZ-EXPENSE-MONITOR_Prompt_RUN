/**
 * Formats a number to Indian Rupee (INR) representation
 * e.g., 7650 -> "₹7,650", -499 -> "-₹499"
 */
export function formatINR(amount: number, showDecimals = false): string {
  const isNegative = amount < 0;
  const absAmount = Math.abs(Math.round(amount * (showDecimals ? 100 : 1)) / (showDecimals ? 100 : 1));

  const formatted = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: showDecimals ? 2 : 0,
    minimumFractionDigits: showDecimals ? 2 : 0,
  }).format(absAmount);

  return `${isNegative ? '-' : ''}₹${formatted}`;
}

/**
 * Compact Indian format e.g. 10000 -> "₹10K", 2500 -> "₹2.5K"
 */
export function formatCompactINR(amount: number): string {
  const isNegative = amount < 0;
  const abs = Math.abs(amount);

  if (abs >= 100000) {
    return `${isNegative ? '-' : ''}₹${(abs / 100000).toFixed(1)}L`;
  }
  if (abs >= 1000) {
    const val = (abs / 1000).toFixed(abs % 1000 === 0 ? 0 : 1);
    return `${isNegative ? '-' : ''}₹${val}K`;
  }
  return formatINR(amount);
}
