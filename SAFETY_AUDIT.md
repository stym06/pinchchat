# Repository Safety Audit

**Date:** 2026-02-13
**Verdict:** SAFE to clone and run locally

## Summary

PinchChat is a TypeScript/React SPA (Vite-based) serving as a webchat UI for the OpenClaw AI agent framework. MIT licensed, actively maintained. No security concerns found.

## Checklist

| Category | Status | Notes |
|----------|--------|-------|
| npm lifecycle scripts | CLEAN | No preinstall/postinstall hooks |
| Dependencies | CLEAN | All well-known, high-download-count packages |
| Secrets/credentials | CLEAN | No .env files or hardcoded secrets committed |
| Shell scripts | CLEAN | None present |
| eval()/Function() | CLEAN | Not used anywhere in source |
| dangerouslySetInnerHTML | SAFE | 2 uses, both properly sanitized (syntax highlighting) |
| Obfuscated/minified source | CLEAN | None checked in |
| Docker config | CLEAN | Standard multi-stage build with security headers |
| CI/CD workflows | CLEAN | 4 standard GitHub Actions using official actions only |
| Git hooks | CLEAN | Only default .sample hooks, no active hooks |

## Details

### Scripts (package.json)

- `dev` — `vite` (local dev server)
- `build` — `tsc -b && vite build` (type-check and bundle)
- `lint` — `eslint .`
- `test` — `vitest run`
- `preview` — `vite preview`
- `lint:fix` — `eslint . --fix`

No suspicious or hidden scripts.

### Dependencies

**Runtime:** React 19, Vite 7, Tailwind CSS 4, react-markdown, lucide-react, rehype/remark plugins, clsx, tailwind-merge

**Dev:** ESLint 9, TypeScript 5.9, Vitest 4, @vitejs/plugin-react

All packages are mainstream with active maintenance.

### Configuration Files

- `vite.config.ts` — Standard Vite config with a custom SW version injection plugin (reads/writes only dist/sw.js at build time)
- `vitest.config.ts` — Standard test configuration
- `eslint.config.js` — Flat config with TypeScript and React plugins
- `tsconfig.json` — Strict TypeScript settings
- `nginx.conf` — Includes security headers (X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy)

### Potential Considerations (non-blocking)

- Credentials stored in `localStorage` at runtime — standard practice, but requires HTTPS in production
- Service worker for PWA offline support — properly versioned with cache busting
