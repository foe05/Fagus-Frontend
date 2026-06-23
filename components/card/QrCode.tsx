// Server-Komponente: rendert einen QR-Code als scharfes SVG.
// Inhalt ist bewusst die URL der Kartenseite (nicht die vCard selbst) — robuster
// beim Scannen und später um Tracking/Updates erweiterbar (Spec Abschnitt 6).

import QRCode from 'qrcode';

interface QrCodeProps {
  /** Der zu kodierende Inhalt — hier die Kartenseiten-URL. */
  value: string;
  /** Kantenlänge in px. */
  size?: number;
  className?: string;
}

export default async function QrCode({ value, size = 200, className }: QrCodeProps) {
  // Olivgrün auf Weiß: ausreichend Kontrast zum zuverlässigen Scannen und
  // passend zur Markenfarbe (--primary).
  const svg = await QRCode.toString(value, {
    type: 'svg',
    errorCorrectionLevel: 'M',
    margin: 1,
    width: size,
    color: { dark: '#3E4E3A', light: '#FFFFFF' },
  });

  return (
    <div
      className={className}
      role="img"
      aria-label="QR-Code zu dieser Kontaktkarte"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
