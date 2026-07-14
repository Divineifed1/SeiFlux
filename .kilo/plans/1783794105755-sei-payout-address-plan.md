# Plan: Manual SEI Payout Address (coexists with wallet-connect)

## Context
Rewards are tracked in `lib/hooks/use-rewards.ts` as mock SEI amounts with a disabled
"Claim" button (`app/(dashboard)/dashboard/rewards/page.tsx`). Today the only way to
associate an on-chain address with a user is **Connect Wallet** (`components/ui/wallet-button.tsx`),
which stores `walletAddress` in `lib/store/auth-store.ts`. Wallet-connect has been fragile
(earlier Keplr "no modular chain info" bug; Cosmos vs EVM complexity) and is unnecessary just
to capture a payout destination. Authentication is already handled by GitHub OAuth + mock
`login()` (`/callback`, `/onboarding`), so wallet is **not** the login mechanism.

**Decision (confirmed with user):**
1. **Coexist** — keep Connect Wallet, but add a manual SEI **payout address** field as the
   primary rewards destination. Connecting a wallet pre-fills the field.
2. Accept **both** Sei address types: native bech32 (`sei1...`) and Sei EVM (`0x...`).
3. Verification = **validate format + explicit confirm** (no signature requirement). Flag the
   irreversibility risk in the UI.

## Goal
Let any user (with or without a wallet) set a validated SEI address that rewards are "sent" to.
Keep wallet-connect working and have it pre-fill the payout address.

## Changes

### 1. Address validation util — NEW `lib/validation/sei-address.ts`
- `validateSeiAddress(raw: string): { valid: boolean; type: 'cosmos' | 'evm' | null; normalized: string }`
  - Trim/lowercase input.
  - Cosmos: regex `^sei1[qpzry9x8gf2tvdw0s3jn54khce6mua7l]{38,58}$`.
  - EVM: regex `^0x[a-fA-F0-9]{40}$` (optionally note EIP-55 checksum mismatch but don't block).
  - Return `type` so UI can label "Sei native" vs "Sei EVM".
- `formatSeiAddress(addr)` helper for truncation in confirm dialogs (`sei1abc…xyz`).

### 2. Auth store — `lib/store/auth-store.ts`
- Add `payoutAddress?: string` to `AuthUser`.
- Add `setPayoutAddress: (addr: string) => void` action (persist via existing `partialize`).
- Keep `walletAddress`/`setWallet` unchanged.

### 3. Wallet connect pre-fill — `components/ui/wallet-button.tsx`
- On successful connect, if `user.payoutAddress` is empty, call `setPayoutAddress(address)`
  (connected address becomes the default payout destination). No behavior change otherwise.

### 4. Reusable input — NEW `components/ui/sei-address-input.tsx`
- Controlled input + inline validation: red border + message when invalid, success chip
  ("Sei native" / "Sei EVM") when valid. Optional `onValidChange` callback. Used by Settings
  and Rewards.

### 5. Settings — `app/(dashboard)/dashboard/settings/page.tsx`
- Add a "Payout Address" card: `SeiAddressInput` + Save button.
- On save: if valid, `setPayoutAddress(normalized)` + success toast; if invalid, error toast.
- Show currently saved address with its type label.

### 6. Rewards — `app/(dashboard)/dashboard/rewards/page.tsx`
- Read `payoutAddress` from auth store.
- Show a "Payout address" summary (type label + truncated). If unset/invalid, prompt user to
  set it (link to Settings) and keep Claim disabled.
- Enable Claim only when a valid `payoutAddress` exists.
- On Claim: open a **confirm dialog** stating amount + destination + "on-chain payouts are
  irreversible" warning. On confirm, optimistically move pending entries to claimed (local
  state in the page tracking claimed IDs; reduce `availableToClaim`). Mock only — no backend call.

## Files touched
- NEW `lib/validation/sei-address.ts`
- EDIT `lib/store/auth-store.ts`
- EDIT `components/ui/wallet-button.tsx`
- NEW `components/ui/sei-address-input.tsx`
- EDIT `app/(dashboard)/dashboard/settings/page.tsx`
- EDIT `app/(dashboard)/dashboard/rewards/page.tsx`

## Out of scope
- Real on-chain payout / backend disbursement (rewards remain mock).
- Signed-message ownership proof (deferred; chosen option is validate+confirm).
- Removing wallet-connect.

## Risks / notes
- On-chain payouts are irreversible → confirm dialog + clear warning is mandatory.
- No ownership proof by design (user choice) → anyone can enter any address; mitigate only via
  format validation + warning. Future: optional signature verification when a wallet is connected.
- EVM checksum mismatches are warned, not blocked, to avoid friction.

## Validation
- `npx tsc --noEmit -p tsconfig.json` and `npx next lint` clean.
- Manual check: enter invalid (`foo`, `0x123`), both valid formats (`sei1…`, `0x…`); Save behaves
  correctly; Rewards Claim disabled until valid address set; confirm dialog shows correct
  destination; claim reduces available amount; connecting a wallet pre-fills the payout field.
