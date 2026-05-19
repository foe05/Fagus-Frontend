import type { ReactNode } from 'react';

export type SectionTone = 'default' | 'light' | 'primary-soft';

export interface SectionProps {
  children: ReactNode;
  tone?: SectionTone;
  title?: string;
  eyebrow?: string;
  description?: string;
  id?: string;
}

const toneClasses: Record<SectionTone, string> = {
  default: 'bg-white',
  light: 'bg-[var(--bg-light)]',
  'primary-soft': 'bg-primary/5',
};

export function Section({
  children,
  tone = 'default',
  title,
  eyebrow,
  description,
  id,
}: Readonly<SectionProps>) {
  const hasHeader = Boolean(title || eyebrow || description);

  return (
    <section id={id} className={`py-20 ${toneClasses[tone]}`}>
      <div className="container-custom max-w-6xl mx-auto">
        {hasHeader && (
          <div className="mb-12">
            {eyebrow && (
              <p className="label-large text-primary uppercase tracking-wider mb-3">
                {eyebrow}
              </p>
            )}
            {title && (
              <h2 className="headline-large text-text-dark mb-4">{title}</h2>
            )}
            {description && (
              <p className="body-large text-text-medium max-w-3xl">{description}</p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}

export default Section;
