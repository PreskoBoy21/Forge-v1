import { useState } from 'react';
import { Text, View } from 'react-native';

import { weightTrend } from '../insights';
import type { DayPoint } from '../types';

/** Scale weigh-ins as faint dots, the smoothed trend as a solid volt line. */
export function TrendChart({
  days,
  height = 140,
}: {
  days: DayPoint[];
  height?: number;
}) {
  const [width, setWidth] = useState(0);
  const series = weightTrend(days);
  if (series.length < 2) {
    return (
      <View style={{ height }} className="items-center justify-center">
        <Text className="font-ui text-[13px] text-steel">
          Weigh in a few times to see your trend.
        </Text>
      </View>
    );
  }
  const values = series.flatMap((s) =>
    s.scale !== undefined ? [s.scale, s.trend] : [s.trend],
  );
  const min = Math.min(...values) - 0.3;
  const max = Math.max(...values) + 0.3;
  const y = (v: number) => height - ((v - min) / (max - min)) * height;
  const step = width / Math.max(1, series.length - 1);

  return (
    <View>
      <View
        style={{ height }}
        onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
      >
        {[0.25, 0.5, 0.75].map((f) => (
          <View
            key={f}
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: height * f,
              height: 1,
            }}
            className="bg-graphite-800"
          />
        ))}
        {width > 0
          ? series.map((s, i) => {
              const x = i * step;
              const next = series[i + 1];
              const seg = next
                ? (() => {
                    const x2 = (i + 1) * step;
                    const y1 = y(s.trend);
                    const y2 = y(next.trend);
                    const len = Math.hypot(x2 - x, y2 - y1);
                    const ang = Math.atan2(y2 - y1, x2 - x);
                    return (
                      <View
                        style={{
                          position: 'absolute',
                          left: (x + x2) / 2 - len / 2,
                          top: (y1 + y2) / 2 - 1.5,
                          width: len,
                          height: 3,
                          borderRadius: 2,
                          transform: [{ rotate: `${ang}rad` }],
                        }}
                        className="bg-molten"
                      />
                    );
                  })()
                : null;
              return (
                <View key={s.date}>
                  {s.scale !== undefined ? (
                    <View
                      style={{
                        position: 'absolute',
                        left: x - 2.5,
                        top: y(s.scale) - 2.5,
                        width: 5,
                        height: 5,
                        borderRadius: 3,
                      }}
                      className="bg-steel/50"
                    />
                  ) : null}
                  {seg}
                </View>
              );
            })
          : null}
      </View>
      <View className="mt-2 flex-row justify-between">
        <Text className="font-ui text-[11px] text-steel">
          {series[0]!.date.slice(5)}
        </Text>
        <Text className="font-ui text-[11px] text-steel">
          {max.toFixed(1)} / {min.toFixed(1)} kg
        </Text>
        <Text className="font-ui text-[11px] text-steel">
          {series.at(-1)!.date.slice(5)}
        </Text>
      </View>
    </View>
  );
}
