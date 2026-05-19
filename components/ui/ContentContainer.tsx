import type { ReactNode } from 'react';

export type ContentContainerSize = 'sm' | 'md' | 'lg';

export interface ContentContainerProps {
  children: ReactNode;
  size?: ContentContainerSize;
}

const sizeClasses: Record<ContentContainerSize, string> = {
  sm: 'max-w-3xl',
  md: 'max-w-4xl',
  lg: 'max-w-5xl',
};

export function ContentContainer({
  children,
  size = 'md',
}: Readonly<ContentContainerProps>) {
  return (
    <div className={`container-custom ${sizeClasses[size]} mx-auto`}>
      {children}
    </div>
  );
}

export default ContentContainer;
