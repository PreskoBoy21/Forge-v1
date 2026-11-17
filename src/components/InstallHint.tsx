import { useEffect, useState, useSyncExternalStore } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';

import { Download, X } from '@/components/icons';
import { track } from '@/lib/telemetry';
import { useColors } from '@/theme/theme';

const KEY = 'forge-install-hint-dismissed';

type PromptEvent = Event & { prompt: () => Promise<void> };

/**
 * Web only: nudges phone users to add Forge to their Home Screen so it opens
 * full-screen like an app. Android/Chrome gets a real Install button; iPhone
 * Safari gets the Share → "Add to Home Screen" steps. Hidden once installed
 * or dismissed.
 */
/** 'ios' | 'android' when this is a phone browser that isn't installed yet. */
function readEnv(): 'ios' | 'android' | null {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return null;
  const standalone =
    window.matchMedia?.('(display-mode: standalone)').matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true;
  let dismissed = false;
  try {
    dismissed = localStorage.getItem(KEY) === '1';
  } catch {
    // storage blocked: just show it
  }
  if (standalone || dismissed) return null;
  if (/iphone|ipad|ipod/i.test(navigator.userAgent)) return 'ios';
  if (/android/i.test(navigator.userAgent)) return 'android';
  return null;
}
const noSubscribe = () => () => undefined;

export function InstallHint() {
  const c = useColors();
  const env = useSyncExternalStore(noSubscribe, readEnv, () => null);
  const [closed, setClosed] = useState(false);
  const [prompt, setPrompt] = useState<PromptEvent | null>(null);
  const ios = env === 'ios';
  const show = env !== null && !closed;

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return;
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setPrompt(e as PromptEvent);
    };
    window.addEventListener('beforeinstallprompt', onPrompt);
    return () => window.removeEventListener('beforeinstallprompt', onPrompt);
  }, []);

  if (!show) return null;

  const close = () => {
    setClosed(true);
    try {
      localStorage.setItem(KEY, '1');
    } catch {
      // ignore
    }
  };

  return (
    <View className="mb-4 flex-row items-center rounded-card bg-graphite-900 p-4">
      <Download size={20} color={c.accent} />
      <View className="ml-3 flex-1">
        <Text className="font-uiSemi text-[15px] text-bone">
          Get Forge on your Home Screen
        </Text>
        {prompt ? (
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              void prompt.prompt();
              track('screen', { path: 'install_prompt' });
              close();
            }}
          >
            <Text className="mt-1 font-uiSemi text-[14px] text-molten">
              Install the app →
            </Text>
          </Pressable>
        ) : (
          <Text className="mt-1 font-ui text-[13px] leading-[18px] text-steel">
            {ios
              ? 'Tap Share at the bottom of Safari, then “Add to Home Screen”.'
              : 'Open your browser menu, then “Add to Home screen”.'}
          </Text>
        )}
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Dismiss"
        onPress={close}
        hitSlop={12}
        className="ml-2"
      >
        <X size={18} color={c.muted} />
      </Pressable>
    </View>
  );
}
