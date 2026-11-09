import {
  ErrorBoundary as RouterErrorBoundary,
  type ErrorBoundaryProps,
} from 'expo-router';
import { useEffect } from 'react';

import { currentScreenPath, reportError } from '@/lib/telemetry';

/** Route error screen that also sends a crash report (screen + stack). */
export function ErrorBoundary(props: ErrorBoundaryProps) {
  useEffect(() => {
    reportError(props.error, { screen: currentScreenPath(), boundary: true });
  }, [props.error]);
  return <RouterErrorBoundary {...props} />;
}
