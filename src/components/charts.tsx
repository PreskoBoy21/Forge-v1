import { useState } from 'react';
import { Text, View } from 'react-native';
import Svg, {
  Circle,
  Defs,
  G,
  Line,
  LinearGradient,
  Path,
  Rect,
  Stop,
} from 'react-native-svg';

import { useColors } from '@/theme/theme';

/** Small, dependency-light SVG charts that follow the current theme. */

type Pt = { x: number; y: number };

function smoothPath(pts: Pt[]) {
  if (pts.length < 2) return '';
  let d = `M${pts[0]!.x},${pts[0]!.y}`;
  for (let i = 1; i < pts.length; i++) {
    const p0 = pts[i - 1]!;
    const p1 = pts[i]!;
    const cx = (p0.x + p1.x) / 2;
    d += ` C${cx},${p0.y} ${cx},${p1.y} ${p1.x},${p1.y}`;
  }
  return d;
}

function useWidth() {
  const [width, setWidth] = useState(0);
  return {
    width,
    onLayout: (e: { nativeEvent: { layout: { width: number } } }) =>
      setWidth(Math.round(e.nativeEvent.layout.width)),
  };
}

let gid = 0;

export type LineSeries = {
  values: (number | undefined)[];
  color: string;
  /** Faint dots instead of a line (e.g. raw scale weigh-ins). */
  dots?: boolean;
  area?: boolean;
};

export function LineChart({
  series,
  labels,
  height = 150,
  target,
  unit = '',
  decimals = 1,
}: {
  series: LineSeries[];
  labels?: [string, string];
  height?: number;
  target?: number;
  unit?: string;
  decimals?: number;
}) {
  const c = useColors();
  const { width, onLayout } = useWidth();
  const [id] = useState(() => `g${gid++}`);
  const all = series.flatMap((s) =>
    s.values.filter((v): v is number => v !== undefined),
  );
  if (target !== undefined) all.push(target);
  const n = Math.max(...series.map((s) => s.values.length));
  if (all.length < 2 || n < 2) {
    return (
      <View style={{ height }} className="items-center justify-center">
        <Text className="font-ui text-[13px] text-steel">
          Not enough data yet.
        </Text>
      </View>
    );
  }
  let min = Math.min(...all);
  let max = Math.max(...all);
  const pad = (max - min || Math.abs(max) * 0.1 || 1) * 0.15;
  min -= pad;
  max += pad;
  const padY = 6;
  const x = (i: number) => (i / (n - 1)) * width;
  const y = (v: number) =>
    padY + (1 - (v - min) / (max - min)) * (height - padY * 2);

  return (
    <View>
      <View style={{ height }} onLayout={onLayout}>
        {width > 0 ? (
          <Svg width={width} height={height}>
            <Defs>
              {series.map((s, si) => (
                <LinearGradient
                  key={si}
                  id={`${id}-${si}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <Stop offset="0" stopColor={s.color} stopOpacity={0.28} />
                  <Stop offset="1" stopColor={s.color} stopOpacity={0} />
                </LinearGradient>
              ))}
            </Defs>
            {[0.25, 0.5, 0.75].map((f) => (
              <Line
                key={f}
                x1={0}
                x2={width}
                y1={height * f}
                y2={height * f}
                stroke={c.line}
                strokeWidth={1}
              />
            ))}
            {target !== undefined ? (
              <Line
                x1={0}
                x2={width}
                y1={y(target)}
                y2={y(target)}
                stroke={c.muted}
                strokeDasharray="4 4"
                strokeWidth={1}
              />
            ) : null}
            {series.map((s, si) => {
              const pts = s.values
                .map((v, i) => (v === undefined ? null : { x: x(i), y: y(v) }))
                .filter((p): p is Pt => p !== null);
              if (s.dots) {
                return pts.map((p, i) => (
                  <Circle
                    key={`${si}-${i}`}
                    cx={p.x}
                    cy={p.y}
                    r={2.5}
                    fill={s.color}
                    opacity={0.45}
                  />
                ));
              }
              const d = smoothPath(pts);
              const last = pts.at(-1);
              return (
                <G key={si}>
                  {s.area && pts.length > 1 ? (
                    <Path
                      d={`${d} L${pts.at(-1)!.x},${height} L${pts[0]!.x},${height} Z`}
                      fill={`url(#${id}-${si})`}
                    />
                  ) : null}
                  <Path
                    d={d}
                    stroke={s.color}
                    strokeWidth={2.5}
                    fill="none"
                    strokeLinecap="round"
                  />
                  {last ? (
                    <Circle
                      cx={last.x}
                      cy={last.y}
                      r={4}
                      fill={c.card}
                      stroke={s.color}
                      strokeWidth={2.5}
                    />
                  ) : null}
                </G>
              );
            })}
          </Svg>
        ) : null}
      </View>
      <View className="mt-2 flex-row justify-between">
        <Text className="font-ui text-[11px] text-steel">{labels?.[0]}</Text>
        <Text className="font-ui text-[11px] text-steel">
          {max.toFixed(decimals)} – {min.toFixed(decimals)}
          {unit}
        </Text>
        <Text className="font-ui text-[11px] text-steel">{labels?.[1]}</Text>
      </View>
    </View>
  );
}

export function BarChart({
  data,
  color,
  height = 120,
  target,
  format = (v: number) => String(Math.round(v)),
  highlightLast = true,
  edges,
}: {
  edges?: [string, string];
  data: { label: string; value: number | undefined }[];
  color: string;
  height?: number;
  target?: number;
  format?: (v: number) => string;
  highlightLast?: boolean;
}) {
  const c = useColors();
  const { width, onLayout } = useWidth();
  const vals = data.map((d) => d.value ?? 0);
  const max = Math.max(...vals, target ?? 0, 1) * 1.1;
  const gap = data.length > 14 ? 3 : 6;
  const bw = width ? (width - gap * (data.length - 1)) / data.length : 0;
  const top = 16;
  const h = (v: number) => (v / max) * (height - top);
  const showLabels = data.length <= 12;

  return (
    <View>
      <View style={{ height }} onLayout={onLayout}>
        {width > 0 ? (
          <Svg width={width} height={height}>
            {data.map((d, i) => {
              const v = d.value ?? 0;
              const last = i === data.length - 1;
              return (
                <Rect
                  key={i}
                  x={i * (bw + gap)}
                  y={height - Math.max(h(v), v > 0 ? 3 : 2)}
                  width={bw}
                  height={Math.max(h(v), v > 0 ? 3 : 2)}
                  rx={Math.min(6, bw / 2)}
                  fill={v > 0 ? color : c.line}
                  opacity={highlightLast && !last && v > 0 ? 0.55 : 1}
                />
              );
            })}
            {target !== undefined ? (
              <Line
                x1={0}
                x2={width}
                y1={height - h(target)}
                y2={height - h(target)}
                stroke={c.muted}
                strokeDasharray="4 4"
                strokeWidth={1}
              />
            ) : null}
          </Svg>
        ) : null}
      </View>
      {showLabels ? (
        <View className="mt-2 flex-row" style={{ gap }}>
          {data.map((d, i) => (
            <Text
              key={i}
              numberOfLines={1}
              className="flex-1 text-center font-ui text-[10px] text-steel"
            >
              {d.label}
            </Text>
          ))}
        </View>
      ) : (
        <View className="mt-2 flex-row justify-between">
          <Text className="font-ui text-[11px] text-steel">
            {edges?.[0] ?? data[0]?.label}
          </Text>
          <Text className="font-ui text-[11px] text-steel">
            max {format(Math.max(...vals))}
          </Text>
          <Text className="font-ui text-[11px] text-steel">
            {edges?.[1] ?? data.at(-1)?.label}
          </Text>
        </View>
      )}
    </View>
  );
}

export function Sparkline({
  values,
  color,
  width = 64,
  height = 24,
}: {
  values: (number | undefined)[];
  color: string;
  width?: number;
  height?: number;
}) {
  const v = values.filter((x): x is number => x !== undefined);
  if (v.length < 2) return <View style={{ width, height }} />;
  const min = Math.min(...v);
  const max = Math.max(...v);
  const pts = v.map((val, i) => ({
    x: (i / (v.length - 1)) * (width - 4) + 2,
    y: 2 + (1 - (val - min) / (max - min || 1)) * (height - 4),
  }));
  return (
    <Svg width={width} height={height}>
      <Path
        d={smoothPath(pts)}
        stroke={color}
        strokeWidth={2}
        fill="none"
        strokeLinecap="round"
      />
    </Svg>
  );
}

/** Progress ring, 0–100. */
export function Ring({
  value,
  size = 120,
  stroke = 10,
  color,
  children,
}: {
  value: number;
  size?: number;
  stroke?: number;
  color: string;
  children?: React.ReactNode;
}) {
  const c = useColors();
  const r = (size - stroke) / 2;
  const len = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, value)) / 100;
  return (
    <View
      style={{ width: size, height: size }}
      className="items-center justify-center"
    >
      <Svg width={size} height={size} style={{ position: 'absolute' }}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={c.raised}
          strokeWidth={stroke}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${len * pct} ${len}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      {children}
    </View>
  );
}

/** Horizontal progress bar. */
export function Progress({
  value,
  max,
  color,
}: {
  value: number;
  max: number;
  color: string;
}) {
  const pct = max > 0 ? Math.max(0, Math.min(1, value / max)) : 0;
  return (
    <View className="h-2 overflow-hidden rounded-full bg-graphite-800">
      <View
        style={{ width: `${pct * 100}%`, backgroundColor: color }}
        className="h-2 rounded-full"
      />
    </View>
  );
}
