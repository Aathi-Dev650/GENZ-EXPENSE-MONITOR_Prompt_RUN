import React, { useEffect, useState } from 'react';
import { formatINR } from '../../lib/format-currency';

interface AnimatedCounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  isCurrency?: boolean;
  duration?: number;
  className?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  prefix = '',
  suffix = '',
  isCurrency = false,
  duration = 500,
  className = '',
}) => {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const startValue = displayValue;
    const diff = value - startValue;

    if (diff === 0) return;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Ease out quad
      const ease = 1 - (1 - progress) * (1 - progress);
      const current = Math.round(startValue + diff * ease);
      setDisplayValue(current);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setDisplayValue(value);
      }
    };

    const animId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(animId);
  }, [value, duration]);

  if (isCurrency) {
    return <span className={className}>{formatINR(displayValue)}</span>;
  }

  return (
    <span className={className}>
      {prefix}
      {displayValue.toLocaleString('en-IN')}
      {suffix}
    </span>
  );
};
