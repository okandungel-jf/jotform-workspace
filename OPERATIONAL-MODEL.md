# Operational Model — JotForm App Builder

**Status:** Active architectural plan. **Plan locked:** 2026-05-18. Living doc — update as waves land.

**Supersedes:** `/Users/okandungel/Desktop/HACKWEEK.md` (in-app admin mode model, deprecated).

---

## Vision

> "Manage" is not a special construct. It is just a role-restricted page.

The operational/admin experience inside a published JotForm App emerges from four layered infrastructure pieces. Each layer is independently valuable; the Manage page is the natural composition on top.

---

## Architectural Principles

1. **Data lives at app level**, not in element properties. Elements bind to `appData`.
2. **Users have roles.** Mock auth via localStorage now, real auth later. The role concept is reused everywhere (page access, element conditions).
3. **Pages declare visibility** — `requiresAuth`, `allowedRoles` in page properties.
4. **Elements declare conditions** — render or hide based on role/data/state.
5. **Manage page = a regular page** with `allowedRoles: ['admin']`, reading from `appData`. Auto-scaffolded on operational element add (Hybrid C), then owner-editable.

---

## Build Plan (5 Waves)

Each wave is independently shippable. Each unlocks more than just "the next wave" — they have standalone value even if subsequent waves never land.

### Wave 1 — Data Tab (builder, top header)

A new top-header tab next to **Builder / Settings / Publish**.

**Adds:**
- `PresetSnapshot.appData` schema at snapshot root:
  ```ts
  appData: {
    products?: Product[]
    orders?:   Order[]
    coupons?:  Coupon[]
    // extends as new operational element types arrive
  }
  ```
- Data tab UI in builder: entity list per type, CRUD on each
- ProductList refactored to bind to `appData.products` instead of owning `properties.items`
- Persists to existing IndexedDB snapshot pipeline (no new storage)

**Open questions**
- Schema for `Product`, `Order`, `Coupon` (fields + types)
- Migration: read `appData.products` if present, fall back to legacy element-owned `items`? Or one-shot migration on snapshot load?
- Entity IDs — auto-generated (uuid) or user-controlled (sku)?

**Standalone value:** Owner manages products from builder, even before any admin page exists.

**Out of scope for Wave 1:** Orders entity stays empty (no submission flow yet). Wave 1.5 wires `CartContext.submit()` → `appData.orders`.

---

### Wave 2 — App Users (Publish tab)

- New section in Publish tab: **App Users**
- Table of users: name/email + role assignment (`admin` / `user` / `anyone`)
- Mock auth bridge: localStorage stores current device's user identity → resolved role
- Existing `PreviewRole` enum (in `AppPreviewScreen.tsx`) wired to real role state, not visual-only

**Open questions**
- User schema (minimum fields — email, name, role?)
- Is `anyone` = unauthenticated visitor, or a third explicit role tier?
- One `admin` role, or tiers (admin / editor / viewer)?

**Standalone value:** Role-based visibility becomes possible for ANY page or element — premium content, members-only, etc.

**Out of scope:** Real OAuth / email login. Mock user list only.

---

### Wave 3 — Page Properties → Access

Page properties panel gains an **Access** section.

**Adds:**
- `requiresAuth: boolean`
- `allowedRoles: ('anyone' | 'admin' | 'user')[]`
- Runtime respects access:
  - Navigation: hide unauthorized pages from nav by default
  - Direct access: block + redirect to home (or login when real auth lands)

**Open questions**
- Where does Page Properties panel live today? (Codebase check needed when this wave starts.)
- Hide-from-nav vs block-direct-access — separate toggles or one rule?
- Behavior when current user's role changes mid-session and they're on a now-inaccessible page?

**Standalone value:** Members-only content. Premium pages. The whole role mechanic becomes useful even before Manage exists.

---

### Wave 4 — Element Conditions

The currently empty Conditions tab in element properties gets real content.

**Adds:**
- Condition types:
  - **Role-based:** "show if `role === 'admin'`"
  - **Data-based:** "show if `cart.count > 0`", "hide if `products.length === 0`"
  - **State-based:** "show if logged in"
- Runtime: evaluate at render time; skip element if false
- Visual rule builder (predefined operators), not a DSL

**Open questions**
- Context available to conditions (data, role, cart, favorites, user, page state)
- AND/OR composition, or single condition per element?
- Default rendering when condition can't evaluate (missing data, undefined context)?

**Standalone value:** Empty-state elements, role-conditional CTAs, anything dependent on state.

---

### Wave 5 — Manage Page (Hybrid C scaffolding)

**Not new infrastructure** — composition over Waves 1-4.

**Adds:**
- Operational element registration includes a scaffolding template:
  ```ts
  ComponentRegistry.register({
    name: 'ProductList',
    manageTemplate: {
      pageName: 'Manage Products',
      pageProperties: { allowedRoles: ['admin'] },
      elements: [
        { componentId: 'OrdersList',      properties: { bindTo: 'orders' } },
        { componentId: 'ProductsManager', properties: { bindTo: 'products' } },
        { componentId: 'CouponsManager',  properties: { bindTo: 'coupons' } },
      ],
    },
  })
  ```
- Adding an operational element to canvas → owner prompted *"Create a Manage page for this?"* → page auto-created with template
- After creation, it is a **regular page** — owner can customize, delete, recreate

**Open questions**
- CRUD-flavored elements (`OrdersList`, `ProductsManager`, `CouponsManager`) — do they exist, or need to be built? Are they app-elements or builder-only?
- Two ProductLists added → first scaffolds, second is no-op? (Probably yes.)
- Owner deletes Manage page → adding another operational element re-prompts to scaffold?
- Wave 5 may branch: **5a** — CRUD elements; **5b** — scaffolder/template engine.

---

### Wave 6 — Messaging (Settings tab → new "Messaging" menu)

**The #1 requested copilot feature** (chat/DM/social/group messaging between app users). Positioned as the **social sibling of the Manage page (Wave 5)**: both are compositions over Waves 1–4, scoped by role.

| | Scope | Result |
|---|---|---|
| **Manage page** | `allowedRoles: ['admin']`, reads `appData` | Operational / CRUD |
| **Messaging** | app-user scoped, **user ↔ user** | Social |

Neither is a special construct. Messaging decomposes across existing layers: **enablement** in Settings (its own menu), **identity** from App Users (Wave 2), **data** in `appData`, **surfaces** as role-restricted system pages reusing the shipped **Open Dynamic Page** mechanism.

**Adds:**
- **Settings → new "Messaging" `SideNav` item + `MessagingPanel`** (design-system components, `--ds-*`). Enable toggle, DM/group toggles, "who can message whom" policy dropdown. Persists `messagingSettings` in the snapshot. Sibling to AI Chatbot — **not nested** (see Decision Log).
- **`appData` entities** (bootstrapped here since Wave 1 hasn't landed): `conversations[]`, `messages[]`, `appUsers[]` (mock identity directory — prototypes a slice of Wave 2).
- **Runtime `MessagesContext`** (`app-elements/src/runtime/`) — `conversations`/`messages`/`send()`, **optimistic echo + canned auto-reply**, persists to snapshot. Mirrors the proven `CartContext`/`CollectionsContext` Provider+hook pattern.
- **New app-elements primitives** (token-based, dogfood — currently MISSING from app-elements): **Avatar**, **Input/Textarea** (composer), **Badge** (unread count).
- **"Chat" system page** (`LivePreviewChatPage`) — conversation/user list (`List` + `Avatar` + `Badge`). Mirrors the **Profile** system-page pattern (`isPreviewChatOpen`, `chatHeaderEl`, `renderTopHeaderBack`). **Must be wired in BOTH live-preview render paths.**
- **"Message Thread" element** (bubbles + composer) on a per-conversation detail page, **reusing Open Dynamic Page** navigation+binding (binding key = `conversationId`).
- **"Message" entry-point action** (new `cardActionOptions` option, e.g. `'Open Chat'`) attachable to `List`/`Card`/`Button` → opens a thread with a user.

**Open questions**
- `appData` bootstrap: introduce a minimal `appData` root now (Wave 6) or block on Wave 1? (Lean: bootstrap `conversations`/`messages`/`appUsers` now; de-risks Wave 1.)
- Mock identity: how many seed app users, and how is the "current user" chosen in preview? Reuse `PROFILE_USER` as current user?
- Chat page discovery affordance: dedicated nav tab vs top-header chat icon vs avatar-style entry (system pages are excluded from `navPages`). Operational model wants a **single destination**, no nav bloat.
- Thread navigation: reuse `reconcileDynamicPage` (today coupled to `List`'s Click Action) vs a parallel overlay like Profile.
- Home list v1: full app-user **directory** vs **conversation list** (recent + unread). (Lean: directory first, evolve to conversation list.)
- Group chat in Wave 6, or defer to **6b**?

**Standalone value:** Avatar/Input/Badge primitives + `MessagesContext` are reusable far beyond chat. Mock `appUsers` prototypes Wave 2 identity. Ships a reference experience for the most-requested copilot feature.

**Out of scope (Wave 6):** real-time backend/websockets, real auth, cross-device sync, push delivery, moderation/blocking backend, encryption. Prototype = **session-local mock** (IndexedDB + optimistic echo + canned reply).

**Depends on:** conceptually Wave 2 (App Users) for identity — Wave 6 bootstraps a mock subset. Reuses **Open Dynamic Page** (shipped, `340522e`) + the **Profile system-page** pattern. Full file map: `MESSAGING_PLAN.md`.

---

## Decision Log

So future sessions don't relitigate rejected approaches.

### Rejected: "Admin mode" as a separate UI mode
*Long-press elements at runtime, inline edit sheets, owner-mode chrome overlay.*
**Why rejected:** Conflates structural editing (builder's job) with operational editing. Creates a competing editing surface. The narrow view — operational in admin page, structural in builder — is cleaner.

### Rejected: `adminSurface` element contract
*Elements declare their own admin destination with `sections` / `screens`.*
**Why rejected:** Once Manage = a regular page, elements no longer need to declare admin surfaces. They declare data bindings; the page is composed from regular CRUD-flavored elements.

### Rejected: Multiple Manage entries in bottom nav
*Each operational element type gets its own bottom-nav entry.*
**Why rejected:** Bloats bottom nav; inconsistent with real-world admin tools (Shopify, Squarespace use single admin destination); blocks cross-section dashboards.

### Rejected: Element-owned data
*Keep `ProductList.properties.items` as today.*
**Why rejected:** Two ProductLists would duplicate the catalog; orders have no element to belong to; the admin CRUD section can't reach what it can't see.

### Confirmed: Hybrid C scaffolding for Manage page
Auto-scaffold on operational element add. After creation, regular owner-editable page.

### Confirmed: Mock auth in localStorage
localStorage holds current user identity / role. Real auth deferred.

### Confirmed: Narrow view boundary
Builder = structural (layout, new pages, new elements). Admin page = operational (CRUD on data).

### Confirmed: Messaging lives in Settings as its OWN menu (not nested in AI Chatbot)
AI Chatbot = user ↔ AI (a trained support agent); Messaging = user ↔ user (live chat). Different jobs, **disjoint config surfaces** (train-on-data/persona vs who-can-DM/group/moderation) → separate sibling menus in the Settings rail. The runtime **Inbox may surface both** AI and human threads (shared surface), but the **builder config stays separate**. Long-term option (not now): collapse AI Chatbot into Messaging as a "participant type."

### Rejected: Messaging as a regular canvas element
*Drop a "Chat" box on a page.*
**Why rejected:** Works only for user↔owner support. The actual request is user↔user (DM/social/group), which needs identity, an inbox + thread navigation, and inter-user shared state — a multi-surface capability, not a single element. The only true element is the small "Message" entry-point action + the "Message Thread" element inside the thread page.

---

## Codebase Findings

Verified during architectural discussion. May drift — verify against current code before relying on file:line citations.

| Topic | Location | Note |
|---|---|---|
| Snapshot storage | `packages/app-builder/src/presets/storage.ts` | IndexedDB. DB=`jf-app-builder`, store=`preset-snapshots`. Fire-and-forget writes. |
| Snapshot shape | `packages/app-builder/src/pages/BuildPage.tsx` | `AppPage[] → CanvasElement[]`, plain `useState`. |
| Role enum (visual-only today) | `packages/app-builder/src/components/AppPreviewScreen.tsx` | `PreviewRole = 'anyone' \| 'admin' \| 'user'`. UI only; to be wired in Waves 2-3. |
| Runtime cart | `packages/app-elements/src/runtime/CartContext.tsx` | In-memory `CartContextValue` (add/remove/setQuantity). Not persisted. Wave 1.5 adds `submit()` → `appData.orders`. |
| Other runtime contexts | `packages/app-elements/src/runtime/` | `CollectionsContext`, `FavoritesContext`, `FormSheet` exist. |
| No separate published runtime | — | Live preview inside `BuildPage` IS the published view. No `/runtime/` build target. Admin role gating needs to honor the live preview path. |
| Component registry | (codebase check pending) | `ComponentRegistry.register({ propDocs })`. Will be extended with binding declarations (Wave 1) and `manageTemplate` (Wave 5). |

---

## Out of Scope (entire plan)

- Real auth (OAuth, email, SSO)
- Real push notifications, payment processing, email delivery
- Multi-device real-time sync (single device + IndexedDB until backend lands)
- Native iOS/Android shells
- Multi-tenant data (single owner per app)
- Localization
- Large-catalog performance (>1000 products)

---

## Status

- **Plan locked:** 2026-05-18
- **Active wave:** Pre-Wave 1 (no implementation started)
- **Next session:** Wave 1 — Data tab in top header
- **Wave 6 (Messaging):** planned 2026-06-23, depends on Wave 2 identity (bootstraps a mock subset). Detailed file map in `MESSAGING_PLAN.md`. Branch `feat/messaging-capability`.
