import { CameraView, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { ScanBarcode, X } from '@/components/icons';
import {
  foodToItem,
  lookupBarcode,
  useScannedFood,
  type OffFood,
} from '@/features/food/openfoodfacts';
import { useColors } from '@/theme/theme';

/** Point the camera at a barcode → product from Open Food Facts → add. */
export default function BarcodeScreen() {
  const c = useColors();
  const [permission, requestPermission] = useCameraPermissions();
  const [status, setStatus] = useState<
    'scanning' | 'looking' | 'found' | 'missing' | 'error'
  >('scanning');
  const [food, setFood] = useState<OffFood | null>(null);
  const lastCode = useRef('');

  const onCode = async (code: string) => {
    if (status !== 'scanning' || code === lastCode.current) return;
    lastCode.current = code;
    setStatus('looking');
    try {
      const f = await lookupBarcode(code);
      setFood(f);
      setStatus(f ? 'found' : 'missing');
    } catch {
      setStatus('error');
    }
  };

  const again = () => {
    lastCode.current = '';
    setFood(null);
    setStatus('scanning');
  };

  const add = () => {
    if (!food) return;
    useScannedFood.getState().set(foodToItem(food));
    router.back();
  };

  if (Platform.OS === 'web') {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-graphite-950 p-6">
        <Text className="text-center font-ui text-[15px] text-steel">
          Barcode scanning works in the iPhone and Android app.
        </Text>
      </SafeAreaView>
    );
  }

  if (!permission?.granted) {
    return (
      <SafeAreaView className="flex-1 justify-center bg-graphite-950 p-6">
        <ScanBarcode size={40} color={c.accent} />
        <Text className="mt-4 font-display text-[24px] uppercase text-bone">
          Scan a barcode
        </Text>
        <Text className="mt-2 font-ui text-[15px] leading-[22px] text-steel">
          Forge needs the camera to read barcodes. Nothing is recorded or saved.
        </Text>
        <View className="mt-6 gap-3">
          <Button
            label={
              permission?.canAskAgain === false
                ? 'Allow camera in Settings'
                : 'Allow camera'
            }
            onPress={() => void requestPermission()}
          />
          <Button
            label="Cancel"
            variant="ghost"
            onPress={() => router.back()}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <CameraView
        style={{ flex: 1 }}
        facing="back"
        barcodeScannerSettings={{
          barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e'],
        }}
        onBarcodeScanned={
          status === 'scanning' ? (r) => void onCode(r.data) : undefined
        }
      />
      <SafeAreaView
        className="absolute inset-0 justify-between p-4"
        pointerEvents="box-none"
      >
        <View className="flex-row justify-end">
          <Pressable
            onPress={() => router.back()}
            accessibilityLabel="Close"
            className="h-11 w-11 items-center justify-center rounded-full bg-black/50"
          >
            <X size={22} color="#fff" />
          </Pressable>
        </View>
        {status === 'scanning' ? (
          <View className="items-center">
            <View className="h-44 w-72 rounded-3xl border-2 border-white/80" />
            <Text className="mt-4 font-uiSemi text-[15px] text-white">
              Point at the barcode
            </Text>
          </View>
        ) : (
          <View />
        )}
        <View>
          {status === 'looking' ? (
            <Card>
              <Text className="font-uiSemi text-[16px] text-bone">
                Looking it up…
              </Text>
            </Card>
          ) : null}
          {status === 'found' && food ? (
            <Card>
              <Text className="font-uiSemi text-[17px] text-bone">
                {food.name}
              </Text>
              <Text className="mt-1 font-ui text-[14px] text-steel">
                Per 100 g: {food.kcal} kcal · {food.protein} g protein ·{' '}
                {food.carbs} g carbs · {food.fat} g fat
              </Text>
              <View className="mt-4 flex-row gap-3">
                <View className="flex-1">
                  <Button
                    label="Scan again"
                    variant="secondary"
                    onPress={again}
                  />
                </View>
                <View className="flex-1">
                  <Button label={`Add ${food.portion} g`} onPress={add} />
                </View>
              </View>
            </Card>
          ) : null}
          {status === 'missing' || status === 'error' ? (
            <Card>
              <Text className="font-uiSemi text-[16px] text-bone">
                {status === 'missing'
                  ? 'Product not found'
                  : 'Couldn’t reach the food database'}
              </Text>
              <Text className="mt-1 font-ui text-[14px] text-steel">
                {status === 'missing'
                  ? 'Try searching it by name, or snap a photo instead.'
                  : 'Check your connection and try again.'}
              </Text>
              <View className="mt-4 flex-row gap-3">
                <View className="flex-1">
                  <Button
                    label="Scan again"
                    variant="secondary"
                    onPress={again}
                  />
                </View>
                <View className="flex-1">
                  <Button label="Done" onPress={() => router.back()} />
                </View>
              </View>
            </Card>
          ) : null}
        </View>
      </SafeAreaView>
    </View>
  );
}
