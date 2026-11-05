import React, { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

interface TimerProps {
  initialMinutes: number;
  isRunning: boolean;
  onTimeUp: () => void;
  resetKey?: string | number;
  onElapsedChange?: (elapsedSeconds: number) => void;
}

export const Timer: React.FC<TimerProps> = ({
  initialMinutes,
  isRunning,
  onTimeUp,
  resetKey,
  onElapsedChange,
}) => {
  const totalInitialSeconds = initialMinutes * 60;
  const [secondsLeft, setSecondsLeft] = useState(totalInitialSeconds);

  // Reset when initialMinutes or resetKey changes
  useEffect(() => {
    setSecondsLeft(initialMinutes * 60);
    if (onElapsedChange) {
      onElapsedChange(0);
    }
  }, [initialMinutes, resetKey]);

  useEffect(() => {
    if (!isRunning) return;

    if (secondsLeft <= 0) {
      onTimeUp();
      return;
    }

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        const next = prev <= 1 ? 0 : prev - 1;
        if (onElapsedChange) {
          onElapsedChange(totalInitialSeconds - next);
        }
        if (prev <= 1) {
          clearInterval(interval);
          onTimeUp();
          return 0;
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, secondsLeft, onTimeUp, totalInitialSeconds, onElapsedChange]);

  if (!isRunning) return null;

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const isLowTime = secondsLeft <= 300 && secondsLeft > 0; // <= 5 phút

  const formatDigits = (n: number) => (n < 10 ? `0${n}` : `${n}`);

  return (
    <div
      className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs sm:text-sm font-semibold tracking-wide transition-all shadow-md ${
        isLowTime
          ? 'bg-rose-950/80 border-rose-500 text-rose-200 animate-pulse'
          : 'bg-[#0b1739] border-amber-500/40 text-amber-300'
      }`}
      title="Thời gian làm bài còn lại"
    >
      <Clock
        className={`w-4 h-4 ${isLowTime ? 'text-rose-400' : 'text-amber-400'}`}
      />
      <span className="font-mono text-base tabular-nums font-black text-white">
        {formatDigits(minutes)}:{formatDigits(seconds)}
      </span>
      {isLowTime && (
        <span className="hidden sm:inline text-xs font-bold text-rose-300">
          (Sắp hết giờ!)
        </span>
      )}
    </div>
  );
};
