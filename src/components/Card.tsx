import { type ReactNode } from 'react';
import { View } from 'react-native';

type CardProps = {
  children: ReactNode;
  molten?: boolean;
  className?: string;
};

export function Card({ children, molten = false, className = '' }: CardProps) {
  return (
    <View
      className={`rounded-card border bg-graphite-900 p-4 ${molten ? 'border-molten/50' : 'border-graphite-700/60'} ${className}`}
    >
      {children}
    </View>
  );
}
