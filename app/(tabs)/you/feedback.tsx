import { useState } from 'react';
import { Platform, Text, TextInput, View, type TextStyle } from 'react-native';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Screen } from '@/components/Screen';
import { Pill } from '@/components/ui';
import { flush, track } from '@/lib/telemetry';
import { useColors } from '@/theme/theme';

const WEB_NO_OUTLINE = (
  Platform.OS === 'web' ? { outlineStyle: 'none' } : {}
) as TextStyle;

const TOPICS = ['Bug', 'Idea', 'Confusing', 'Love it'] as const;

/** You → Send feedback: goes straight to the team (app_events, name=feedback). */
export default function FeedbackScreen() {
  const c = useColors();
  const [topic, setTopic] = useState<(typeof TOPICS)[number]>('Idea');
  const [text, setText] = useState('');
  const [sent, setSent] = useState(false);
  const [queued, setQueued] = useState(false);

  const send = async () => {
    track('feedback', { topic, text: text.trim() });
    const ok = await flush();
    setQueued(!ok);
    setSent(true);
    setText('');
  };

  if (sent)
    return (
      <Screen>
        <Text className="font-display text-[28px] uppercase tracking-wide text-bone">
          Thanks!
        </Text>
        <Text className="mt-2 font-ui text-[17px] leading-[24px] text-steel">
          {queued
            ? 'Saved on your phone. It will be sent automatically when you’re back online.'
            : 'Got it. We read every message.'}
        </Text>
        <View className="mt-8">
          <Button
            label="Send another"
            variant="secondary"
            onPress={() => setSent(false)}
          />
        </View>
      </Screen>
    );

  return (
    <Screen scroll>
      <Text className="font-ui text-[17px] leading-[24px] text-steel">
        What should we fix or add? One line is enough.
      </Text>
      <View className="mt-5 flex-row flex-wrap gap-2">
        {TOPICS.map((t) => (
          <Pill
            key={t}
            label={t}
            active={t === topic}
            onPress={() => setTopic(t)}
          />
        ))}
      </View>
      <Card className="mt-4">
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="e.g. The rest timer should vibrate"
          placeholderTextColor={c.muted}
          multiline
          maxLength={280}
          className="min-h-[120px] font-ui text-[16px] text-bone"
          // no browser focus ring inside the rounded card (web preview)
          style={[{ textAlignVertical: 'top' }, WEB_NO_OUTLINE]}
        />
      </Card>
      <Text className="mt-2 font-ui text-[12px] text-steel">
        {text.length}/280 · Please don’t include personal details.
      </Text>
      <View className="mt-6 pb-6">
        <Button
          label="Send feedback"
          onPress={() => void send()}
          disabled={text.trim().length < 3}
        />
      </View>
    </Screen>
  );
}
