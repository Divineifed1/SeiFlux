export type SeiAddressType = 'cosmos' | 'evm';

export interface SeiAddressValidation {
  valid: boolean;
  type: SeiAddressType | null;
  normalized: string;
}

const COSMOS_RE = /^sei1[qpzry9x8gf2tvdw0s3jn54khce6mua7l]{38,58}$/;
const EVM_RE = /^0x[a-fA-F0-9]{40}$/;

export function validateSeiAddress(raw: string): SeiAddressValidation {
  const normalized = (raw ?? '').trim();
  if (!normalized) {
    return { valid: false, type: null, normalized };
  }
  if (COSMOS_RE.test(normalized)) {
    return { valid: true, type: 'cosmos', normalized };
  }
  if (EVM_RE.test(normalized)) {
    return { valid: true, type: 'evm', normalized };
  }
  return { valid: false, type: null, normalized };
}

export function formatSeiAddress(addr: string, lead = 8, tail = 6): string {
  if (!addr) return '';
  if (addr.length <= lead + tail + 1) return addr;
  return `${addr.slice(0, lead)}…${addr.slice(-tail)}`;
}

export function seiAddressTypeLabel(type: SeiAddressType | null): string {
  if (type === 'cosmos') return 'Sei native';
  if (type === 'evm') return 'Sei EVM';
  return '';
}
