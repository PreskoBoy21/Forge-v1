import { useEffect, useState } from 'react';
import { AppState } from 'react-native';

const isoNow = () => new Date().toISOString().slice(0, 10);

/**
 * Today's date in the workout log's convention (ISO, YYYY-MM-DD), refreshed
 * whenever the app comes back to the foreground so screens never go stale
 * after midnight.
 */
export function useTodayIso() {
  const [today, setToday] = useState(isoNow);
  useEffect(() => {
    const sub = AppState.addEventListener('change', (s) => {
      if (s === 'active') setToday(isoNow());
    });
    return () => sub.remove();
  }, []);
  return today;
}
