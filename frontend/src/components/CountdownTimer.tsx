import { useState, useEffect } from 'react';

interface CountdownTimerProps {
  targetTimestamp: bigint;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculateTimeLeft(targetMs: number): TimeLeft {
  const diff = targetMs - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export default function CountdownTimer({ targetTimestamp }: CountdownTimerProps) {
  const targetMs = Number(targetTimestamp) / 1_000_000;
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calculateTimeLeft(targetMs));
  const isExpired = targetMs <= Date.now();

  useEffect(() => {
    if (isExpired) return;
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetMs));
    }, 1000);
    return () => clearInterval(interval);
  }, [targetMs, isExpired]);

  if (isExpired) {
    return (
      <div className="text-center py-4">
        <p className="font-cinzel text-gold tracking-widest uppercase text-sm">Event Has Started</p>
      </div>
    );
  }

  const units = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds },
  ];

  return (
    <div className="flex gap-3 sm:gap-6 justify-center">
      {units.map(({ label, value }, i) => (
        <div key={label} className="flex items-center">
          <div className="text-center">
            <div className="w-16 sm:w-20 h-16 sm:h-20 bg-black-card border border-gold/30 flex items-center justify-center animate-gold-pulse">
              <span className="font-cinzel font-bold text-2xl sm:text-3xl text-gold">
                {String(value).padStart(2, '0')}
              </span>
            </div>
            <p className="font-cinzel text-xs tracking-widest uppercase text-foreground/40 mt-2">
              {label}
            </p>
          </div>
          {i < units.length - 1 && (
            <span className="font-cinzel text-gold text-2xl mx-1 sm:mx-2 mb-6">:</span>
          )}
        </div>
      ))}
    </div>
  );
}
