import { type ReactNode } from 'react';
import { View } from 'react-native';

type CardProps = {
  children: ReactNode;
  accent?: 'lime' | 'none';
};

export function Card({ children, accent = 'none' }: CardProps) {
  return (
    <View
      className={`rounded-3xl bg-surface p-5 ${accent === 'lime' ? 'border border-lime/40' : ''}`}
    >
      {children}
    </View>
  );
}
