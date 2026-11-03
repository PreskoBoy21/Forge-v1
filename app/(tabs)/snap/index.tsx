import { useState } from 'react';
import { Image, Pressable, Text, TextInput, View } from 'react-native';

import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { FOODS, searchFoods, type Food } from '@/features/food/foods';
import {
  mealTypeFor,
  sumMacros,
  type MealItem,
} from '@/features/food/nutrition';
import { scanMeal, type ScanOutcome } from '@/features/food/scan';
import { useFood, useToday } from '@/features/food/store';
import { colors } from '@/theme/tokens';

const SCAN_ERROR: Record<Exclude<ScanOutcome, { ok: true }>['reason'], string> =
  {
    cancelled: '',
    no_permission:
      'Camera access is off. Allow it in Settings, or add foods below.',
    signed_out: 'Log in to use photo scan. You can still add foods below.',
    not_food: 'That doesn’t look like food. Try again or add foods below.',
    limit_reached:
      '3 free scans used today. Go Pro for unlimited, or add foods below.',
    unavailable: 'Photo scan isn’t available right now. Add foods below.',
  };

const fromFood = (f: Food): MealItem => ({
  name: f.name,
  grams: f.portion,
  kcal: f.kcal,
  protein: f.protein,
  carbs: f.carbs,
  fat: f.fat,
});

export default function SnapScreen() {
  const { eaten, targets, meals } = useToday();
  const [items, setItems] = useState<MealItem[]>([]);
  const [source, setSource] = useState<'scan' | 'manual'>('manual');
  const [photo, setPhoto] = useState<string>();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [query, setQuery] = useState('');
  const [adding, setAdding] = useState(false);

  const draft = sumMacros(items);
  const proteinLeft = Math.max(0, targets.proteinG - eaten.protein);
  const kcalLeft = targets.kcal - eaten.kcal;

  const scan = async (from: 'camera' | 'library') => {
    setBusy(true);
    setMessage('');
    try {
      const r = await scanMeal(from);
      if (r.photoUri) setPhoto(r.photoUri);
      if (r.ok) {
        setItems(r.items);
        setSource('scan');
        setMessage(
          r.scansLeft !== null
            ? `Estimate · check the grams · ${r.scansLeft} free scans left today`
            : 'Estimate · check the grams',
        );
      } else {
        setMessage(SCAN_ERROR[r.reason]);
        if (r.reason !== 'cancelled') setAdding(true);
      }
    } catch {
      setMessage(SCAN_ERROR.unavailable);
      setAdding(true);
    } finally {
      setBusy(false);
    }
  };

  const setGrams = (index: number, delta: number) =>
    setItems((cur) =>
      cur.map((it, i) =>
        i === index ? { ...it, grams: Math.max(5, it.grams + delta) } : it,
      ),
    );

  const save = () => {
    const now = new Date();
    useFood.getState().addMeal({
      date: now.toISOString().slice(0, 10),
      eatenAt: now.toISOString(),
      type: mealTypeFor(now.getHours()),
      source,
      items,
    });
    setItems([]);
    setPhoto(undefined);
    setMessage('Saved ✓');
    setAdding(false);
    setSource('manual');
  };

  return (
    <Screen scroll>
      <Text className="font-display text-[34px] uppercase tracking-wide text-bone">
        Food
      </Text>

      {/* today at a glance */}
      <View className="mt-4 flex-row gap-3">
        <Stat
          label="Protein left"
          value={`${proteinLeft} g`}
          sub={`${eaten.protein} / ${targets.proteinG} g`}
          tone="mint"
        />
        <Stat
          label={kcalLeft >= 0 ? 'Calories left' : 'Over by'}
          value={`${Math.abs(kcalLeft)}`}
          sub={`${eaten.kcal} / ${targets.kcal} kcal`}
          tone={kcalLeft >= 0 ? 'bone' : 'gold'}
        />
      </View>

      {/* capture */}
      {items.length === 0 ? (
        <View className="mt-6 gap-3">
          <Button
            label={busy ? 'Reading your plate…' : '📸 Snap a meal'}
            size="gym"
            disabled={busy}
            onPress={() => void scan('camera')}
          />
          <View className="flex-row gap-3">
            <View className="flex-1">
              <Button
                label="From photos"
                variant="secondary"
                disabled={busy}
                onPress={() => void scan('library')}
              />
            </View>
            <View className="flex-1">
              <Button
                label="Add by hand"
                variant="secondary"
                onPress={() => setAdding(true)}
              />
            </View>
          </View>
        </View>
      ) : null}

      {message ? (
        <Text className="mt-3 font-ui text-[13px] text-steel">{message}</Text>
      ) : null}

      {/* draft meal */}
      {photo && items.length > 0 ? (
        <Image
          source={{ uri: photo }}
          className="mt-4 h-40 w-full rounded-card"
          resizeMode="cover"
        />
      ) : null}
      {items.length > 0 ? (
        <View className="mt-4 gap-2">
          {items.map((item, index) => (
            <View
              key={`${item.name}-${index}`}
              className="flex-row items-center justify-between rounded-card bg-graphite-900 px-4 py-3"
            >
              <Pressable
                className="flex-1 pr-2"
                onLongPress={() =>
                  setItems((cur) => cur.filter((_, i) => i !== index))
                }
              >
                <Text className="font-uiSemi text-[15px] text-bone">
                  {item.name}
                </Text>
                <Text className="mt-0.5 font-ui text-[12px] text-steel">
                  {Math.round((item.protein * item.grams) / 100)} g protein ·{' '}
                  {Math.round((item.kcal * item.grams) / 100)} kcal
                </Text>
              </Pressable>
              <View className="flex-row items-center gap-3">
                <Pressable onPress={() => setGrams(index, -10)} hitSlop={8}>
                  <Text className="font-display text-[22px] text-steel">−</Text>
                </Pressable>
                <Text
                  className="min-w-[56px] text-right font-display text-[18px] text-bone"
                  style={{ fontVariant: ['tabular-nums'] }}
                >
                  {item.grams} g
                </Text>
                <Pressable onPress={() => setGrams(index, 10)} hitSlop={8}>
                  <Text className="font-display text-[22px] text-steel">+</Text>
                </Pressable>
              </View>
            </View>
          ))}
          <Text className="font-ui text-[12px] text-steel">
            Long-press an item to remove it.
          </Text>
          <Text className="mt-1 font-uiSemi text-[15px] text-bone">
            {draft.kcal} kcal · {draft.protein} g protein · {draft.carbs} g
            carbs · {draft.fat} g fat
          </Text>
        </View>
      ) : null}

      {/* add foods */}
      {adding || items.length > 0 ? (
        <View className="mt-4">
          <TextInput
            className="min-h-[48px] rounded-btn bg-graphite-900 px-4 font-ui text-[16px] text-bone"
            placeholder="Search food (chicken, rice, oats…)"
            placeholderTextColor={colors.steel[400]}
            value={query}
            onChangeText={setQuery}
          />
          <View className="mt-2 flex-row flex-wrap gap-2">
            {(query ? searchFoods(query) : FOODS.slice(0, 8)).map((f) => (
              <Pressable
                key={f.name}
                onPress={() => {
                  setItems((cur) => [...cur, fromFood(f)]);
                  setQuery('');
                }}
                className="rounded-full bg-graphite-800 px-3 py-2"
              >
                <Text className="font-uiMedium text-[13px] text-bone">
                  + {f.name}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      ) : null}

      {items.length > 0 ? (
        <View className="mt-6 gap-2">
          <Button label="Save meal" onPress={save} />
          <Button
            label="Discard"
            variant="ghost"
            onPress={() => {
              setItems([]);
              setPhoto(undefined);
              setMessage('');
            }}
          />
        </View>
      ) : null}

      {/* today's meals */}
      {meals.length > 0 ? (
        <View className="mt-8 gap-2 pb-6">
          <Text className="font-uiMedium text-[12px] uppercase tracking-widest text-steel">
            Today
          </Text>
          {meals.map((m) => {
            const t = sumMacros(m.items);
            return (
              <Pressable
                key={m.id}
                onLongPress={() => useFood.getState().removeMeal(m.id)}
                className="rounded-card bg-graphite-900 px-4 py-3"
              >
                <View className="flex-row justify-between">
                  <Text className="font-uiSemi text-[15px] capitalize text-bone">
                    {m.type}
                  </Text>
                  <Text className="font-uiSemi text-[15px] text-mint">
                    {t.protein} g protein
                  </Text>
                </View>
                <Text
                  className="mt-0.5 font-ui text-[13px] text-steel"
                  numberOfLines={1}
                >
                  {t.kcal} kcal · {m.items.map((i) => i.name).join(', ')}
                </Text>
              </Pressable>
            );
          })}
        </View>
      ) : null}
    </Screen>
  );
}

function Stat({
  label,
  value,
  sub,
  tone,
}: {
  label: string;
  value: string;
  sub: string;
  tone: 'mint' | 'bone' | 'gold';
}) {
  const color =
    tone === 'mint' ? 'text-mint' : tone === 'gold' ? 'text-gold' : 'text-bone';
  return (
    <View className="flex-1 rounded-card bg-graphite-900 p-4">
      <Text className="font-uiMedium text-[11px] uppercase tracking-widest text-steel">
        {label}
      </Text>
      <Text className={`mt-1 font-display text-[28px] ${color}`}>{value}</Text>
      <Text className="font-ui text-[12px] text-steel">{sub}</Text>
    </View>
  );
}
