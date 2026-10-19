import { Text, View } from 'react-native';

export function ForgedStamp() {
  return (
    <View
      className="self-center rounded-btn border-[3px] border-molten px-6 py-2"
      style={{ transform: [{ rotate: '-8deg' }] }}
    >
      <Text className="font-display text-[34px] uppercase tracking-[4px] text-molten">
        Forged
      </Text>
    </View>
  );
}
