import { useEffect, useRef, useCallback } from 'react';

interface UseCardReaderOptions {
  onScan: (cardId: string) => void;
  scanTimeout?: number; // Time in ms to wait for next character before clearing buffer
  minLength?: number;   // Minimum length of card ID
}

/**
 * Hook to listen for card scanner input (Keyboard Wedge).
 * Most card readers act as a keyboard, typing the ID and hitting Enter.
 */
export const useCardReader = ({
  onScan,
  scanTimeout = 50, // Card readers type very fast
  minLength = 5
}: UseCardReaderOptions) => {
  const buffer = useRef<string>('');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Ignore if user is typing in an input field (unless we want to capture that too, but usually safer to ignore)
    const target = event.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
      return;
    }

    const key = event.key;

    // Clear previous timeout since we got a new key
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (key === 'Enter') {
      if (buffer.current.length >= minLength) {
        onScan(buffer.current);
      }
      buffer.current = '';
    } else if (key.length === 1) { // Only printable characters
      buffer.current += key;
    }

    // Set a timeout to clear buffer if typing stops (human typing is slower than scanner)
    // If it's a scanner, the whole string comes in < 100-200ms usually.
    timeoutRef.current = setTimeout(() => {
      buffer.current = '';
    }, scanTimeout * 10); // *10 to give a bit more leeway for human vs scanner, or adjust strictly
  }, [onScan, minLength, scanTimeout]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [handleKeyDown]);
};
