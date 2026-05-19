import Link from 'next/link';

export interface FinalCTAAction {
  label: string;
  href: string;
}

export interface FinalCTAProps {
  title: string;
  description: string;
  primaryCta?: FinalCTAAction;
  secondaryCta?: FinalCTAAction;
}

export function FinalCTA({
  title,
  description,
  primaryCta,
  secondaryCta,
}: Readonly<FinalCTAProps>) {
  return (
    <section className="bg-primary text-white py-16">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="headline-large mb-4">{title}</h2>
          <p className="body-large opacity-90 mb-8">{description}</p>
          {(primaryCta || secondaryCta) && (
            <div className="flex flex-wrap items-center justify-center gap-4">
              {primaryCta && (
                <Link
                  href={primaryCta.href}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary rounded-full label-large hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                >
                  <span>{primaryCta.label}</span>
                  <span className="material-symbols-outlined text-[20px]">
                    arrow_forward
                  </span>
                </Link>
              )}
              {secondaryCta && (
                <Link
                  href={secondaryCta.href}
                  className="inline-flex items-center gap-2 px-8 py-4 border border-white bg-transparent text-white rounded-full label-large hover:bg-white/10 hover:-translate-y-0.5 transition-all duration-300"
                >
                  <span>{secondaryCta.label}</span>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default FinalCTA;
