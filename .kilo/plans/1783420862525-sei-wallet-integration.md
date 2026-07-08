# Sei Wallet Connection — Real Integration Plan

## Goal
Add real Sei-native wallet connection (Keplr, Compass, Leap) using public RPC endpoints and `@cosmjs/stargate`, replacing mock behavior with on-chain address retrieval and optional real transaction demo.

## Key Decisions
- **Library**: Use `@cosmjs/stargate` + `@cosmjs/crypto` + `@cosmjs/amino`. `@sei-js/core`/`@sei-js/cosmos` are deprecated per npm/seidos.
- **RPC**: Default to public Sei endpoints; make them env-configured. No backend required.
- **Wallet auth path**: Wallet login supplements existing GitHub/email auth. On connect, the user is logged into zustand as a contributor with `walletAddress` and `walletType`.
- **UI visibility**: Wallet connect button appears in `public-header` for all visitors and in dashboard topnav for connected wallet users.

## Scope
- Detect installed Cosmos/Sei wallet extensions
- Connect via `window.keplr.getOfflineSigner`, `window.inplr/Compass/Leap equivalents`
- Retrieve real Sei address from the extension signer
- Show connected address + disconnect action
- Add wallet fields to `AuthUser`/`User` types and path querying

## Out of Scope (not pre-decided)
- Network toggle UI (mainnet vs Atlantic-2). If needed later, add env flipping.
- Broadcaster/faucet integration.

## Tasks (implementation order)
1. **Dependencies**: Add `@cosmjs/stargate`, `@cosmjs/crypto`, `@cosmjs/amino` to package.json.
2. **Chain config**: `lib/chain-config.ts` — Sei chain param (REST + LCD + chain-id).
3. **Wallet hook**: `lib/wallet/use-wallet.ts` — detect extensions, get real `OfflineDirectSigner`, derive address.
4. **Auth store**: Extend `lib/store/auth-store.ts` to accept wallet credentials and clear on disconnect.
5. **Types**: Update `types/index.ts` `User` interface with `walletAddress`, `walletType`.
6. **UI component**: `components/wallet/wallet-button.tsx` — dropdown showing installed wallets, connected state, copy address, disconnect.
7. **Layout integration**: Add `WalletButton` to `components/layout/public-header.tsx` and `components/layout/topnav.tsx`.
8. **Validation**: `npm install`, `next lint`, `npx tsc --noEmit`.

## Validation
- With no wallet installed, only "Not installed" wallet options appear.
- With Keplr/compass/leap installed, clicking connect retrieves a real `sei1...` address from the extension.
- Connected state persists via zustand `persist` middleware.
- Lint/typecheck pass.

## Open Questions
1. **RPC endpoint**: Do you want me to hardcode public Sei mainnet RPCs, or prefer an env var (`NEXT_PUBLIC_SEI_RPC_URL`) so you can override?
2. **Network**: Should the initial integration target mainnet or Atlantic-2 testnet?
3. **Transaction demo**: Do you want a simple "Send 0.001 SEI to self" balance-check demo to prove real connectivity, or is connect + address display enough?
