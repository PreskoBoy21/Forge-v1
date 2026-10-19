import { type ReactNode } from 'react';
import { View } from 'react-native';

type CardProps = {
  children: ReactNode;
  molten?: boolean;
};

export function Card({ children, molten = false }: CardProps) {
  return (
    <View
      className={`rounded-card bg-graphite-900 p-4 ${molten ? 'border border-molten' : ''}`}
    >
      {children}
    </View>
  );
}
