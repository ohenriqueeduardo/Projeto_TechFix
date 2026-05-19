import React from 'react';

interface AnimatedCounterProps {
  value: number | string;
  duration?: number;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ value, duration = 1000 }) => {
  const [count, setCount] = React.useState(0);
  const numericValue = typeof value === 'number' ? value : parseInt(value, 10);
  const isNumeric = !isNaN(numericValue);

  React.useEffect(() => {
    if (!isNumeric || numericValue <= 0) {
      setCount(numericValue || 0);
      return;
    }

    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * numericValue));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(numericValue);
      }
    };

    window.requestAnimationFrame(step);
  }, [numericValue, duration, isNumeric]);

  return <span>{isNumeric ? count : value}</span>;
};
export default AnimatedCounter;
