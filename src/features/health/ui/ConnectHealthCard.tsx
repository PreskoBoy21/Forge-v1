import { Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { HeartPulse } from '@/components/icons';
import { IconBadge } from '@/components/ui';
import { useColors } from '@/theme/theme';

import { healthProviderLabel, healthSupported, useHealth } from '../store';

/** Shown wherever health data is missing. */
export function ConnectHealthCard({ compact = false }: { compact?: boolean }) {
  const c = useColors();
  const { connected, loading, connect, permission } = useHealth();
  const label = healthSupported
    ? healthProviderLabel
    : 'Apple Health / Health Connect';

  return (
    <Card molten>
      <View className="flex-row items-center">
        <IconBadge Icon={HeartPulse} color={c.bad} size={40} />
        <View className="ml-3 flex-1">
          <Text className="font-uiSemi text-[17px] text-bone">
            {connected ? 'No health data yet' : `Connect ${label}`}
          </Text>
          <Text className="mt-0.5 font-ui text-[14px] leading-[20px] text-steel">
            {connected
              ? 'Wear your watch tonight or weigh in tomorrow. Your coach reads it automatically.'
              : 'Your coach reads sleep, heart rate, steps and weight to plan each day.'}
          </Text>
        </View>
      </View>
      {!connected && !compact ? (
        <View className="mt-4">
          <Button
            label={loading ? 'Connecting…' : `Connect ${label}`}
            disabled={loading || !healthSupported}
            onPress={() => void connect()}
          />
        </View>
      ) : null}
      {!connected && compact ? (
        <View className="mt-3">
          <Button
            label={loading ? 'Connecting…' : 'Connect'}
            variant="secondary"
            disabled={loading || !healthSupported}
            onPress={() => void connect()}
          />
        </View>
      ) : null}
      {permission === 'denied' ? (
        <Text className="mt-3 font-ui text-[13px] text-gold">
          Access was declined. You can allow it in Settings → Health → Data
          Access → Forge.
        </Text>
      ) : null}
    </Card>
  );
}
