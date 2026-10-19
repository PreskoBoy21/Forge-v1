import { Text, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { mockCrew } from '@/features/preview/mock-data';

function Status({ status }: { status: (typeof mockCrew)[number]['status'] }) {
  if (status === 'Forged') {
    return <Text className="font-uiSemi text-[13px] text-mint">Forged ✓</Text>;
  }
  if (status === 'Rested') {
    return <Text className="font-uiSemi text-[13px] text-steel">Rested</Text>;
  }
  return (
    <View className="rounded-full bg-graphite-800 px-3 py-1">
      <Text className="font-uiSemi text-[13px] text-molten">Nudge</Text>
    </View>
  );
}

export default function CrewScreen() {
  return (
    <Screen scroll>
      <Text className="font-uiMedium text-[12px] uppercase tracking-widest text-steel">
        Your crew · 5 members
      </Text>
      <Text className="mt-1 font-display text-[34px] uppercase tracking-wide text-bone">
        Venlo Lifters
      </Text>

      <View className="mt-4 flex-row items-center justify-between rounded-card bg-graphite-900 px-4 py-3">
        <Text className="font-uiSemi text-[15px] text-bone">3 of 5 forged</Text>
        <Text className="font-ui text-[13px] text-mint">On a roll</Text>
      </View>

      <View className="mt-5 gap-2">
        {mockCrew.map((member) => (
          <View
            key={member.name}
            className="flex-row items-center rounded-card bg-graphite-900 px-4 py-3"
          >
            <View className="h-10 w-10 items-center justify-center rounded-full bg-graphite-800">
              <Text className="font-uiSemi text-[11px] text-ember">
                {member.initials}
              </Text>
            </View>
            <View className="ml-3 flex-1">
              <Text className="font-uiSemi text-[17px] text-bone">
                {member.name}
              </Text>
              <Text className="font-ui text-[13px] text-steel">
                {member.meta}
              </Text>
            </View>
            <Status status={member.status} />
          </View>
        ))}
      </View>

      <View className="mt-6 rounded-card border border-graphite-700 px-4 py-4">
        <Text className="font-uiSemi text-[15px] text-bone">
          + Invite a gym buddy
        </Text>
        <Text className="mt-1 font-ui text-[13px] text-steel">
          You both get 7 days Pro
        </Text>
      </View>
    </Screen>
  );
}
