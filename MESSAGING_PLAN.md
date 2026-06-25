# Messaging — Implementation Plan (Wave 6)

**Status:** Planned 2026-06-23. **Branch:** `feat/messaging-capability` (from `origin/main`).
**Companion:** `OPERATIONAL-MODEL.md` → Wave 6. This doc is the file-level map.

> The #1 requested copilot feature: chat/DM/social/group messaging between app users.
> Prototype only — **no backend, ever**. Session-local mock (IndexedDB + optimistic echo + canned reply).

---

## Philosophy (locked in discussion)

1. Messaging is a **capability**, not a canvas element — the social sibling of the Manage page.
2. **Enablement** lives in **Settings → its own "Messaging" menu** (sibling to AI Chatbot, **not nested** — different jobs, disjoint config).
3. **Identity** comes from App Users (Wave 2, mostly unbuilt → we bootstrap a mock subset).
4. **Data** lives in `appData` (`conversations`/`messages`/`appUsers`), bootstrapped here.
5. **Surfaces** = a "Chat" system page (inbox) + a per-conversation Thread page that **reuses the shipped Open Dynamic Page** mechanism.
6. **JF-native, reuse-first:** runtime pages compose existing **app-elements** primitives + tokens; the Settings panel composes **design-system** primitives + `--ds-*`. No hardcoded values, no builder-side overrides — missing variants are added **at source**.

---

## Reality check from the code audit

| Area | State today | Implication for messaging |
|---|---|---|
| **Open Dynamic Page** | ✅ Shipped. `applyDynamicBinding`, `reconcileDynamicPage`, `openDynamicDetailFor`, `createDynamicDetailPage`, `resolveFieldTokens` in `BuildPage.tsx`. `AppPage.dynamic` + `dynamicSourceElementId`. | ♻️ Reuse for the Thread page. Coupled to `List`'s Click Action → needs a parallel path or a new action option. |
| **app-elements List** | `ListItemData = {title, description, image?}`. No avatar/subtitle/timestamp/badge. | ⚠️ Needs a **Chat row variant** (avatar + subtitle + trailing time + unread badge). |
| **app-elements AppHeader** | Layouts Left/Center/Right, sizes only. No back button / compact variant. | ⚠️ Needs a **compact/thread header** variant (back + avatar + name). |
| **app-elements Button / Icon** | ✅ Full-featured. Icon has `MessageCircle`, `MessageSquare`, `User`, `Bell`, `Archive` in `NAME_MAP`. | ♻️ Reuse as-is. |
| **Avatar / Input / Badge / Bubble** | ❌ **None exist** in app-elements (Testimonial inlines an avatar; Form inlines HTML inputs). | 🆕 Build as proper app-elements primitives (reusable beyond chat). |
| **`appData`** | ❌ Not in code — `PresetSnapshot` has only `appTitle/appSubtitle/pages/headerActions/appHeader`. Plan-only. | 🆕 Bootstrap a minimal `appData` root (de-risks Wave 1). |
| **Runtime contexts** | ✅ `CartContext`/`CollectionsContext`/`FavoritesContext`/`ProductDetailContext` — proven Provider+hook pattern. | ♻️ Model `MessagesContext` on these. |
| **Identity (App Users)** | ⚠️ Preview-only. `PreviewRole` (anyone/admin/user) visual; single hardcoded `PROFILE_USER`; pages have binary `requireLogin`; PublishPage "App Users" tab is a **stub**. No runtime `AuthContext`, no multi-user identity. | 🆕 Seed a **mock app-users directory** + pick a current user. |
| **Settings tab** | `SettingsPage.tsx` `NAV_ITEMS` + `SideNav` + `PanelHeader`; panels use DS (`FormField`/`Toggle`/`DropdownSingle`/`Button`) + `settings-panel__*` CSS. `push-notifications`/`ai-chatbot` are NAV entries with **no panel** (the screenshot card is production, not in this repo). | ♻️ Add a NAV item + a real `MessagingPanel`; mirror `AppSettingsPanel`. |
| **System pages** | Profile renders via `LivePreviewProfilePage` (app-elements only), toggled by `isPreviewProfileOpen`, `renderTopHeaderBack` shared. **TWO duplicated render paths** (`phoneScreenContent` 3577–3991 + right-panel 7859–8145). | ♻️ Mirror Profile for Chat. **Wire BOTH paths.** |
| **Component registration** | `ComponentRegistry.register()` (requires `propDocs`); `BASIC_GROUPS` (348), `ELEMENT_ICON_MAP` (318), `createCanvasElement` (361), `cardActionOptions` (4779). `Button` has an `Action` prop + `ButtonWithAction`. | ♻️ Register new elements + a new action option the same way. |

---

## Architecture map

```
SETTINGS (builder, DS)                 RUNTIME (app, app-elements)
└─ Messaging menu ──enables──►          ┌─ "Chat" system page (inbox)
   • toggle on/off                      │     List<ConversationRow> (Avatar + Badge)
   • DM / group toggles                 │        └─ tap ──► Thread page (Open Dynamic Page)
   • policy dropdown                    │              MessageThread element
   • persists messagingSettings         │                 • bubbles (read messages)
                                        │                 • composer (Input → MessagesContext.send)
APP USERS (Wave 2, mocked)              │     "Message" action on List/Card/Button
└─ appData.appUsers[] (seed)            └─ MessagesContext (optimistic echo + canned reply)

DATA  appData: { appUsers[], conversations[], messages[] }  ──► PresetSnapshot ──► IndexedDB
```

---

## Build phases

### Phase 0 — Foundations (primitives + data + context)
**New app-elements primitives** (`packages/app-elements/src/components/`), each with `register.tsx` + `propDocs`, token-based:
- `Avatar/` — props: `size`, `image?`, `fallbackName?` (initials) / `User` icon fallback, `presence?` dot. (Pattern reference: `Testimonial.tsx` avatar markup.)
- `Input/` — single-line + `multiline` (textarea) mode for the composer. (app-elements has none today.)
- `Badge/` — label/count, for unread. (DS has a Badge; app-elements needs its own token-based one.)

**Data + context:**
- Extend `PresetSnapshot` (`packages/app-builder/src/presets/storage.ts:19`) with `appData?: { appUsers?: AppUser[]; conversations?: Conversation[]; messages?: Message[] }`.
- Wire `appData` into snapshot load (`BuildPage.tsx` ~419) + save (`BuildPage.tsx` ~2244).
- `packages/app-elements/src/runtime/MessagesContext.tsx` — mirror `CartContext.tsx`: `{ conversations, messages, send(convId, text), markRead(convId) }`, optimistic echo + a `setTimeout` canned auto-reply. `useMessages()` returns `null` outside a Provider (inert on canvas, like `useProductDetail`).
- Seed data: a `mockAppUsers` + a couple of seeded conversations (preset or context init).

**Types:** `AppUser {id,name,avatar?}`, `Conversation {id, participantIds[], lastMessageAt}`, `Message {id, conversationId, senderId, text, sentAt}`.

**Acceptance:** primitives render in the component showcase; `MessagesContext` send/echo works in isolation; snapshot round-trips `appData`.

### Phase 1 — Settings enablement
- `SettingsPage.tsx`: add a `messaging` entry to `NAV_ITEMS` (27–72) — icon from `communication` category, `iconBg`, title "Messaging", description.
- New `MessagingPanel` (mirror `AppSettingsPanel` 111–178): `section.settings-panel__card` with `ToggleRow` (enable, "Allow direct messages", "Allow group chat") + `FormField` + `DropdownSingle` ("Who can message whom": Everyone / Connections only). DS components, `--ds-*`.
- Persist `messagingSettings` in `PresetSnapshot`; thread prop through `App.tsx` → `SettingsPage`.
- (Optional) `SideNavItem.divider?` to group Push/AI Chatbot/Messaging.

**Acceptance:** toggling Messaging on persists and gates the Chat page's existence.

### Phase 2 — "Chat" system page (inbox)
- `LivePreviewChatPage.tsx` (mirror `LivePreviewProfilePage.tsx`) — app-elements only: `List` of conversation rows using new `Avatar` + `Badge` (unread) + trailing time.
- State: `isPreviewChatOpen` (copy `isPreviewProfileOpen` 2188), `chatHeaderEl`, `handleChatOpen/Close`, integrate into `renderTopHeaderBack` (2457).
- **Wire in BOTH render paths** (`phoneScreenContent` 3577–3991 **and** right-panel 7859–8145).
- Discovery affordance: chat icon in the top header (single destination; system page excluded from `navPages` 2380).
- v1 home: app-user **directory**; later swap bind source to conversation list.

**Acceptance:** chat icon opens the Chat page in both full-screen + right-panel preview; rows show avatar + unread.

### Phase 3 — Thread page (the conversation)
- New `MessageThread` app-elements element (`components/MessageThread/` + `register.tsx`): bubble list (reads `messages` filtered by `conversationId` via `MessagesContext`) + composer (`Input multiline` + send `Button`). Optimistic echo + canned reply.
- Navigation: reuse **Open Dynamic Page** — tapping a Chat row opens a dynamic detail page bound to the conversation. Either extend `reconcileDynamicPage` (2964) recognition beyond `List`, or add a parallel `openThreadFor` mirroring `openDynamicDetailFor`. Binding key = `conversationId`.
- Thread header: compact `AppHeader` variant (back + avatar + name) via `renderTopHeaderBack`.

**Acceptance:** tap a conversation → thread renders past messages; sending appends a bubble + triggers a canned reply; survives snapshot reload.

### Phase 4 — "Message" entry-point action
- Add `'Open Chat'` to `cardActionOptions` (4779) so `List`/`Card`/`Button` can open a thread with a user (mirror `ButtonWithAction`'s `Open Form`).
- If a standalone "Message" button element is wanted: register it, add to `BASIC_GROUPS` (348) + `ELEMENT_ICON_MAP` (318).
- Role-conditional later via Wave 4 conditions ("show if logged in").

**Acceptance:** a "Message" button on a profile/list opens the right thread.

### Phase 5 — Polish (optional / 6b)
Unread counts + last-message preview on rows · relative-time util ("2m ago") · presence dot (mock) · conversation-list home (swap from directory) · group chat (membership) → likely **6b**.

---

## The TWO-render-path checklist (do not skip)
Every Chat/Thread state must be wired in **both**:
- `phoneScreenContent` — `BuildPage.tsx:3577–3991` (full-screen preview)
- right-panel inline JSX — `BuildPage.tsx:7859–8145` (canvas live preview)
Items: `isPreviewChatOpen` toggle · `chatHeaderEl` · `renderTopHeaderBack` branch · chat icon affordance · `LivePreviewChatPage` mount · Thread/dynamic-page mount.

## Mock identity approach
No real users exist. Seed `appData.appUsers` (e.g. 6–8 fake users w/ avatars). "Current user" = reuse `PROFILE_USER` (`BuildPage.tsx:953`) or a chosen seed user. The directory = `appUsers` minus current user. This intentionally prototypes a slice of Wave 2.

## Open questions (carried from Wave 6)
- Bootstrap `appData` now vs block on Wave 1 → **lean: now.**
- Thread via `reconcileDynamicPage` reuse vs parallel overlay.
- Home = directory vs conversation list for v1 → **lean: directory.**
- Group chat in 6 vs 6b.
- New app-elements `Input` primitive vs composer inlined in `MessageThread` → **lean: primitive.**

## Out of scope
Real-time backend, websockets, real auth, cross-device sync, push delivery, moderation backend, encryption.
