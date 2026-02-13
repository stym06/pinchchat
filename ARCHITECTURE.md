# Architecture

A quick map of the PinchChat codebase for contributors.

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | React 19 + TypeScript |
| Build | Vite |
| Styling | Tailwind CSS v4 + CSS custom properties (theming) |
| Icons | Lucide React |
| Markdown | react-markdown + rehype-highlight + remark-gfm |
| State | React hooks + contexts (no external state library) |

## Directory Layout

```
src/
├── App.tsx              # Root: login gate, layout, lazy-loads Chat
├── main.tsx             # Entry point, renders App inside ErrorBoundary
├── types.ts             # Shared TypeScript types (Session, Message, etc.)
├── components/          # React components (see below)
├── hooks/               # Custom React hooks
├── lib/                 # Pure utility modules (no React)
└── contexts/            # React contexts (theme, tool collapse state)
```

## Key Components

| Component | Purpose |
|-----------|---------|
| `LoginScreen` | Gateway URL + token input, credential persistence |
| `Chat` | Main chat view: messages, input, header, search, split-view |
| `ChatMessage` | Single message renderer (user/assistant/system events) |
| `ChatInput` | Message composer with syntax-highlighted textarea + markdown preview |
| `Sidebar` | Session list with search, pin, drag-reorder, delete, split-view |
| `Header` | Top bar: agent name/avatar, model badge, token bar, theme/language switchers |
| `ToolCall` | Expandable tool call card with emoji badges, params, results |
| `ThinkingBlock` | Collapsible reasoning/thinking content display |
| `CodeBlock` | Syntax-highlighted code with copy button |
| `ImageBlock` | Inline image with loading skeleton, error fallback, lightbox |
| `MessageSearch` | Ctrl+F search overlay with result navigation |
| `KeyboardShortcuts` | `?` shortcut help dialog |

## Hooks

| Hook | Purpose |
|------|---------|
| `useGateway` | Core hook: WebSocket connection, message streaming, session management, sending. This is the brain. |
| `useSecondarySession` | Split-view: manages a second session's messages independently |
| `useLocale` | i18n: language state + `t()` translation function |
| `useTheme` | Theme read/write from ThemeContext |
| `useToolCollapse` | Global expand/collapse state for tool calls |
| `useNotifications` | Browser notification permission + sound alerts for new messages |

## Data Flow

```
OpenClaw Gateway ←—WebSocket—→ useGateway hook
                                    │
                         ┌──────────┼──────────┐
                         ▼          ▼          ▼
                      Sidebar    Chat      Header
                    (sessions)  (messages)  (status)
```

1. **Connect**: `LoginScreen` collects gateway URL + token → `useGateway` opens a WebSocket
2. **Sessions**: Gateway pushes session list → stored in hook state → rendered in `Sidebar`
3. **Messages**: On session select, hook requests history → streamed tokens arrive as `delta` events → accumulated into messages → rendered by `ChatMessage`
4. **Sending**: `ChatInput` calls `sendMessage()` from the hook → serialized over WebSocket
5. **Tool calls**: Arrive as structured blocks within assistant messages → rendered by `ToolCall` with collapsible params/results

## Theming

Themes use CSS custom properties defined in `ThemeContext`. All components reference `var(--pc-*)` variables (via Tailwind utility classes like `text-pc-text`, `bg-pc-elevated`, etc.) rather than hardcoded colors.

Available themes: **Dark** (default), **Light**, **OLED Black**, **System** (follows OS preference).

Accent colors: Cyan, Violet, Emerald, Amber, Rose, Blue.

## Bundle Strategy

Vite splits the build into chunks via `manualChunks` in `vite.config.ts`:

| Chunk | Contents |
|-------|----------|
| `react-vendor` | React + ReactDOM |
| `markdown` | react-markdown, remark/rehype plugins, highlight.js |
| `icons` | lucide-react |
| `ui` | @radix-ui primitives |
| `index` | App code |

`Chat` is lazy-loaded (`React.lazy`) so the markdown chunk only loads after login.

## Gateway Protocol

PinchChat communicates with OpenClaw via a WebSocket protocol. Key message types:

- **Outbound**: `auth`, `subscribe`, `send`, `listSessions`, `loadHistory`, `deleteSession`
- **Inbound**: `authenticated`, `sessions`, `history`, `delta` (streaming tokens), `message` (complete), `error`

The protocol is implemented in `src/lib/gateway.ts` (low-level) and `src/hooks/useGateway.ts` (React integration).

## PWA

A service worker (`public/sw.js`) caches static assets for offline shell support. The app is installable via the browser's "Add to Home Screen" prompt.
