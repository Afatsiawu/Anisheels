// Promo codes for the storefront. Kept simple — no DB round-trip needed.
export type PromoCode = {
  code: string;
  type: 'percent' | 'fixed';
  value: number;
  label: string;
};

export const promoCodes: Record<string, PromoCode> = {
  WELCOME10: { code: 'WELCOME10', type: 'percent', value: 10, label: '10% off your first order' },
  FREESHIP: { code: 'FREESHIP', type: 'fixed', value: 30, label: 'Free shipping (GHS 30 off)' },
  LUXE15: { code: 'LUXE15', type: 'percent', value: 15, label: '15% off luxury edit' },
};

export function validatePromo(code: string): PromoCode | null {
  return promoCodes[code.toUpperCase().trim()] ?? null;
}
