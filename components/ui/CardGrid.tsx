import type { ReactNode } from 'react';

export type CardGridColumns = 2 | 3 | 4;
export type CardGridGap = 'md' | 'lg';

export interface CardGridProps {
  children: ReactNode;
  columns?: CardGridColumns;
  gap?: CardGridGap;
}

const columnClasses: Record<CardGridColumns, string> = {
  2: 'md:grid-cols-2 lg:grid-cols-2',
  3: 'md:grid-cols-2 lg:grid-cols-3',
  4: 'md:grid-cols-2 lg:grid-cols-4',
};

const gapClasses: Record<CardGridGap, string> = {
  md: 'gap-6',
  lg: 'gap-8',
};

export function CardGrid({
  children,
  columns = 3,
  gap = 'md',
}: Readonly<CardGridProps>) {
  return (
    <div className={`grid grid-cols-1 ${columnClasses[columns]} ${gapClasses[gap]}`}>
      {children}
    </div>
  );
}

export default CardGrid;
