// Darstellung der Owner-Kontaktdaten (Server-tauglich, kein Client-State).
// Optik mit dem bestehenden MD3-Design-System: Roboto, Material Symbols,
// Token-Farben (--primary etc.), vorhandene Typography-Klassen.

import Image from 'next/image';
import type { ContactCard } from '@/lib/cards';
import QrCode from './QrCode';

interface ContactCardViewProps {
  card: ContactCard;
  /** Absolute URL der Kartenseite — Inhalt des QR-Codes. */
  cardUrl: string;
}

const PHONE_LABEL: Record<string, string> = {
  cell: 'Mobil',
  work: 'Telefon',
  home: 'Telefon privat',
};

const EMAIL_LABEL: Record<string, string> = {
  work: 'E-Mail',
  home: 'E-Mail privat',
};

function initials(card: ContactCard): string {
  return `${card.firstName.charAt(0)}${card.lastName.charAt(0)}`.toUpperCase();
}

function ContactRow({
  icon,
  label,
  value,
  href,
}: {
  icon: string;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <>
      <span
        className="material-symbols-outlined text-[22px] text-primary shrink-0"
        aria-hidden="true"
      >
        {icon}
      </span>
      <span className="min-w-0">
        <span className="label-small block text-text-light">{label}</span>
        <span className="body-medium block break-words text-text-dark">{value}</span>
      </span>
    </>
  );

  const base = 'flex items-center gap-4 rounded-xl px-3 py-2.5 -mx-3';

  return href ? (
    <a
      href={href}
      className={`${base} transition-colors hover:bg-bg-light focus-visible:bg-bg-light`}
    >
      {content}
    </a>
  ) : (
    <div className={base}>{content}</div>
  );
}

export default function ContactCardView({ card, cardUrl }: ContactCardViewProps) {
  const address = card.addresses?.[0];
  const addressLine = address
    ? [
        address.street,
        [address.zip, address.city].filter(Boolean).join(' '),
        address.country,
      ]
        .filter(Boolean)
        .join(', ')
    : null;

  return (
    <article className="overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-border-light">
      {/* Kopf mit Markenverlauf */}
      <header
        className="flex flex-col items-center px-6 pb-6 pt-10 text-center text-white"
        style={{
          background: 'linear-gradient(135deg, var(--primary), var(--primary-light))',
        }}
      >
        <div className="mb-4 grid h-24 w-24 place-items-center overflow-hidden rounded-full bg-white/15 ring-4 ring-white/25 backdrop-blur-sm">
          {card.photoUrl ? (
            <Image
              src={card.photoUrl}
              alt={card.fullName}
              width={96}
              height={96}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="headline-medium font-medium text-white">{initials(card)}</span>
          )}
        </div>
        <h1 className="headline-medium font-medium">{card.fullName}</h1>
        {card.title && <p className="body-medium mt-1 text-white/90">{card.title}</p>}
        {card.org && <p className="body-small mt-0.5 text-white/80">{card.org}</p>}
      </header>

      {/* Kontaktdaten */}
      <div className="space-y-1 px-6 py-6">
        {card.emails.map((email) => (
          <ContactRow
            key={`mail-${email.value}`}
            icon="mail"
            label={EMAIL_LABEL[email.type] ?? 'E-Mail'}
            value={email.value}
            href={`mailto:${email.value}`}
          />
        ))}
        {card.phones.map((phone) => (
          <ContactRow
            key={`tel-${phone.value}`}
            icon="call"
            label={PHONE_LABEL[phone.type] ?? 'Telefon'}
            value={phone.value}
            href={`tel:${phone.value.replace(/\s+/g, '')}`}
          />
        ))}
        {card.url && (
          <ContactRow
            icon="language"
            label="Website"
            value={card.url.replace(/^https?:\/\//, '')}
            href={card.url}
          />
        )}
        {addressLine && (
          <ContactRow icon="location_on" label="Adresse" value={addressLine} />
        )}
        {card.links?.map((link) => (
          <ContactRow
            key={`link-${link.href}`}
            icon="link"
            label={link.label}
            value={link.href.replace(/^https?:\/\//, '')}
            href={link.href}
          />
        ))}
      </div>

      {/* Karte speichern */}
      <div className="px-6 pb-6">
        <a
          href={`/c/${card.slug}/vcard`}
          download={`${card.slug}.vcf`}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-white transition-colors hover:bg-primary-light focus-visible:bg-primary-light"
        >
          <span className="material-symbols-outlined text-[20px]" aria-hidden="true">
            person_add
          </span>
          <span className="label-large">Kontakt speichern</span>
        </a>
      </div>

      {/* QR-Code */}
      <div className="flex flex-col items-center gap-3 border-t border-border-light bg-bg-light px-6 py-7">
        <div className="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-border-light">
          <QrCode value={cardUrl} size={176} className="h-44 w-44" />
        </div>
        <p className="body-small max-w-xs text-center text-text-medium">
          Scannen, um diese Karte auf einem anderen Gerät zu öffnen.
        </p>
      </div>
    </article>
  );
}
