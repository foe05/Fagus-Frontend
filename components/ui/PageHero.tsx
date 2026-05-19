import Link from 'next/link';

export interface PageHeroProps {
  title: string;
  subtitle?: string;
  backHref?: string;
  backLabel?: string;
  icon?: string;
}

export function PageHero({
  title,
  subtitle,
  backHref,
  backLabel = 'Zurück',
  icon,
}: Readonly<PageHeroProps>) {
  return (
    <section className="bg-gradient-to-br from-primary to-primary-light text-white py-20">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto text-center">
          {backHref && (
            <Link
              href={backHref}
              className="inline-flex items-center gap-2 label-large mb-8 opacity-90 hover:opacity-100 transition-opacity"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
              <span>{backLabel}</span>
            </Link>
          )}

          {icon && (
            <div className="flex justify-center mb-6">
              <span className="material-symbols-outlined text-[56px]">{icon}</span>
            </div>
          )}

          <h1 className="display-medium mb-6">{title}</h1>

          {subtitle && (
            <p className="headline-small font-normal opacity-90">{subtitle}</p>
          )}
        </div>
      </div>
    </section>
  );
}

export default PageHero;
