import Link from 'next/link';
import type { ReactNode } from 'react';

export interface FeatureCardProps {
  title: string;
  description: ReactNode;
  icon?: string;
  href?: string;
}

function CardInner({
  title,
  description,
  icon,
  isLink,
}: Readonly<{
  title: string;
  description: ReactNode;
  icon?: string;
  isLink: boolean;
}>) {
  return (
    <>
      {icon && (
        <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
          <span className="material-symbols-outlined text-primary text-[28px]">
            {icon}
          </span>
        </div>
      )}
      <h3 className="title-large text-text-dark mb-3">{title}</h3>
      <p className="body-medium text-text-medium">{description}</p>
      {isLink && (
        <div className="mt-5 inline-flex items-center gap-1 text-primary label-large">
          <span>Mehr erfahren</span>
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </div>
      )}
    </>
  );
}

export function FeatureCard({
  title,
  description,
  icon,
  href,
}: Readonly<FeatureCardProps>) {
  const baseClasses =
    'block bg-white rounded-2xl p-8 transition-all duration-300';

  if (href) {
    return (
      <Link
        href={href}
        className={`${baseClasses} hover:shadow-xl hover:-translate-y-1`}
      >
        <CardInner title={title} description={description} icon={icon} isLink />
      </Link>
    );
  }

  return (
    <div className={`${baseClasses} shadow-sm`}>
      <CardInner title={title} description={description} icon={icon} isLink={false} />
    </div>
  );
}

export default FeatureCard;
