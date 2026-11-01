import { Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { PreviewBanner } from '@/components/PreviewBanner';
import { Screen } from '@/components/Screen';
import { healthProviderLabel, useHealth } from '@/features/health/store';
import { go } from '@/lib/nav';

const READS = [
  ['⚖️', 'Weight, body fat, lean mass', 'from your smart scale'],
  ['😴', 'Sleep, HRV, resting heart rate', 'from your watch or phone'],
  ['👟', 'Steps and active calories', 'from your phone'],
] as const;

export default function ConnectScreen() {
  const { connect, loading, permission } = useHealth();
  const native = healthProviderLabel !== 'Sample data';
  const label = native ? healthProviderLabel : 'Apple Health / Health Connect';

  const onConnect = async () => {
    await connect();
    go('/(onboarding)/forging');
  };

  return (
    <Screen scroll>
      <PreviewBanner />
      <Text className="font-display text-[34px] uppercase tracking-wide text-bone">
        Connect your data
      </Text>
      <Text className="mt-2 font-ui text-[17px] leading-[24px] text-steel">
        Your coach plans each day around what your body actually did: how you
        slept, how recovered you are and where your weight is really going.
      </Text>

      <View className="mt-8 gap-3">
        {READS.map(([icon, title, sub]) => (
          <Card key={title}>
            <View className="flex-row items-center">
              <Text className="text-[24px]">{icon}</Text>
              <View className="ml-3 flex-1">
                <Text className="font-uiSemi text-[17px] text-bone">
                  {title}
                </Text>
                <Text className="font-ui text-[13px] text-steel">{sub}</Text>
              </View>
            </View>
          </Card>
        ))}
      </View>

      <Text className="mt-6 font-ui text-[13px] leading-[19px] text-steel">
        Works with Withings, RENPHO, Eufy, Wyze, Etekcity and any scale or watch
        that syncs to {label}. Forge only reads. It never writes to your health
        data or sells it.
      </Text>
      {permission === 'unavailable' ? (
        <Text className="mt-3 font-ui text-[13px] text-gold">
          Health data isn’t available here, so you’ll see sample data for now.
        </Text>
      ) : null}

      <View className="mt-8 gap-3 pb-6">
        <Button
          label={
            loading
              ? 'Connecting…'
              : native
                ? `Connect ${label}`
                : 'Connect health data'
          }
          disabled={loading}
          onPress={() => void onConnect()}
        />
        <Button
          label="Skip for now"
          variant="ghost"
          onPress={() => go('/(onboarding)/forging')}
        />
      </View>
    </Screen>
  );
}
