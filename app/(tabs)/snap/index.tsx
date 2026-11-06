import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Image, Pressable, Text, TextInput, View } from 'react-native';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Progress, Ring } from '@/components/charts';
import {
  Camera,
  Coffee,
  Cookie,
  ImageIcon,
  Moon,
  Plus,
  ScanBarcode,
  Search,
  Sun,
  Utensils,
  type LucideIcon,
} from '@/components/icons';
import { IconBadge, SectionHeader } from '@/components/ui';
import { Screen } from '@/components/Screen';
import { FOODS, searchFoods, type Food } from '@/features/food/foods';
import {
  foodToItem,
  searchOnline,
  useScannedFood,
} from '@/features/food/openfoodfacts';
import {
  mealTypeFor,
  sumMacros,
  type MealItem,
} from '@/features/food/nutrition';
import { scanMeal, type ScanOutcome } from '@/features/food/scan';
import { useFood, useToday } from '@/features/food/store';
import { go } from '@/lib/nav';
import { useColors } from '@/theme/theme';

const SCAN_ERROR: Record<Exclude<ScanOutcome, { ok: true }>['reason'], string> =
  {
    cancelled: '',
    no_permission:
      'Camera access is off. Allow it in Settings, or add foods below.',
    signed_out: 'Log in to use photo scan. You can still add foods below.',
    not_food: 'That doesn’t look like food. Try again or add foods below.',
    limit_reached:
      'You’ve used today’s 10 photo scans. More tomorrow. Add foods below for now.',
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

const MEAL_ICON: Record<string, LucideIcon> = {
  breakfast: Coffee,
  lunch: Sun,
  dinner: Moon,
  snack: Cookie,
};

export default function SnapScreen() {
  const c = useColors();
  const { eaten, targets, meals } = useToday();
  const [items, setItems] = useState<MealItem[]>([]);
  const [source, setSource] = useState<'scan' | 'manual'>('manual');
  const [photo, setPhoto] = useState<string>();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [query, setQuery] = useState('');
  const [adding, setAdding] = useState(false);
  const [debounced, setDebounced] = useState('');

  // Foods coming back from the barcode screen.
  useEffect(
    () =>
      useScannedFood.subscribe((st) => {
        if (!st.pending) return;
        const item = st.pending;
        st.set(null);
        setItems((cur) => [...cur, item]);
        setMessage('Added from barcode · adjust the grams');
      }),
    [],
  );
  useEffect(() => {
    const t = setTimeout(() => setDebounced(query.trim()), 400);
    return () => clearTimeout(t);
  }, [query]);
  const online = useQuery({
    queryKey: ['off-search', debounced],
    queryFn: () => searchOnline(debounced),
    enabled: debounced.length >= 3,
    staleTime: 1000 * 60 * 60,
    retry: 1,
  });

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
            ? `Estimate · check the grams · ${r.scansLeft} scans left today`
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
      <Text className="font-display text-[28px] uppercase tracking-wide text-bone">
        Food
      </Text>

      {/* today at a glance */}
      <Card className="mt-4">
        <View className="flex-row items-center">
          <Ring
            value={(eaten.protein / Math.max(1, targets.proteinG)) * 100}
            size={104}
            stroke={10}
            color={c.accent}
          >
            <Text className="font-display text-[22px] text-bone">
              {proteinLeft}
            </Text>
            <Text className="font-uiMedium text-[11px] text-steel">
              g protein left
            </Text>
          </Ring>
          <View className="ml-4 flex-1 gap-3">
            <View>
              <View className="mb-1 flex-row justify-between">
                <Text className="font-uiMedium text-[13px] text-steel">
                  {kcalLeft >= 0 ? 'Calories left' : 'Over by'}
                </Text>
                <Text
                  className={`font-uiSemi text-[13px] ${kcalLeft >= 0 ? 'text-bone' : 'text-gold'}`}
                >
                  {Math.abs(kcalLeft)} kcal
                </Text>
              </View>
              <Progress value={eaten.kcal} max={targets.kcal} color={c.aqua} />
            </View>
            <View>
              <View className="mb-1 flex-row justify-between">
                <Text className="font-uiMedium text-[13px] text-steel">
                  Carbs
                </Text>
                <Text className="font-uiSemi text-[13px] text-bone">
                  {eaten.carbs} / {targets.carbsG} g
                </Text>
              </View>
              <Progress
                value={eaten.carbs}
                max={targets.carbsG}
                color={c.info}
              />
            </View>
            <View>
              <View className="mb-1 flex-row justify-between">
                <Text className="font-uiMedium text-[13px] text-steel">
                  Fat
                </Text>
                <Text className="font-uiSemi text-[13px] text-bone">
                  {eaten.fat} / {targets.fatG} g
                </Text>
              </View>
              <Progress value={eaten.fat} max={targets.fatG} color={c.warn} />
            </View>
          </View>
        </View>
      </Card>

      {/* capture */}
      {items.length === 0 ? (
        <View className="mt-6 gap-3">
          <Button
            label={busy ? 'Reading your plate…' : 'Snap a meal'}
            icon={Camera}
            size="gym"
            disabled={busy}
            onPress={() => void scan('camera')}
          />
          <View className="flex-row gap-2">
            {(
              [
                ['Barcode', ScanBarcode, () => go('/(tabs)/snap/barcode')],
                ['Photo', ImageIcon, () => void scan('library')],
                ['Search', Search, () => setAdding(true)],
              ] as const
            ).map(([label, Icon, onPress]) => (
              <Pressable
                key={label}
                onPress={onPress}
                disabled={busy}
                className="flex-1 items-center rounded-btn bg-graphite-800 py-3 active:opacity-80"
              >
                <Icon size={22} color={c.text} />
                <Text className="mt-1 font-uiSemi text-[13px] text-bone">
                  {label}
                </Text>
              </Pressable>
            ))}
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
            placeholder="Search any food or brand…"
            placeholderTextColor={c.muted}
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
          {debounced.length >= 3 ? (
            <Card className="mt-3 py-1">
              {online.isFetching ? (
                <Text className="py-3 font-ui text-[14px] text-steel">
                  Searching 3 million foods…
                </Text>
              ) : online.data?.length ? (
                online.data.map((f, i) => (
                  <Pressable
                    key={`${f.code ?? f.name}-${i}`}
                    onPress={() => {
                      setItems((cur) => [...cur, foodToItem(f)]);
                      setQuery('');
                    }}
                    className={`flex-row items-center py-3 ${i ? 'border-t border-graphite-700/60' : ''}`}
                  >
                    <View className="flex-1 pr-3">
                      <Text
                        className="font-uiMedium text-[15px] text-bone"
                        numberOfLines={1}
                      >
                        {f.name}
                      </Text>
                      <Text className="font-ui text-[12px] text-steel">
                        per 100 g · {f.kcal} kcal · {f.protein} g protein
                      </Text>
                    </View>
                    <Plus size={20} color={c.accent} />
                  </Pressable>
                ))
              ) : (
                <Text className="py-3 font-ui text-[14px] text-steel">
                  {online.isError
                    ? 'Couldn’t reach the food database.'
                    : 'No matches. Try another word or scan the barcode.'}
                </Text>
              )}
            </Card>
          ) : null}
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
        <>
          <SectionHeader title="Today’s meals" />
          <Card className="py-1">
            {meals.map((m, i) => {
              const t = sumMacros(m.items);
              const Icon = MEAL_ICON[m.type] ?? Utensils;
              return (
                <Pressable
                  key={m.id}
                  onLongPress={() => useFood.getState().removeMeal(m.id)}
                  className={`flex-row items-center py-3 ${i ? 'border-t border-graphite-700/60' : ''}`}
                >
                  <IconBadge Icon={Icon} color={c.warn} />
                  <View className="ml-3 flex-1">
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
                      {t.kcal} kcal · {m.items.map((it) => it.name).join(', ')}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </Card>
          <Text className="mb-6 mt-2 font-ui text-[12px] text-steel">
            Hold a meal to delete it.
          </Text>
        </>
      ) : (
        <Card className="mb-6 mt-6">
          <View className="flex-row items-center">
            <IconBadge Icon={Utensils} color={c.warn} />
            <Text className="ml-3 flex-1 font-ui text-[14px] leading-[20px] text-steel">
              No meals yet today. Snap your plate and Forge estimates calories
              and protein in seconds.
            </Text>
          </View>
        </Card>
      )}
    </Screen>
  );
}
