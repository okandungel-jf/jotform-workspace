# Product List — Spec (Phase 0 / 1 / 2)

> **Bu dosya nedir:** Jotform App Builder klonundaki `ProductList` element'ine variant + stock yetenekleri eklemek için yapılandırılmış spec. Müşteri talep analizinden (144 talep, 21 tema) damıtılmış ilk 3 phase'i kapsar.
>
> **Kapsam:** Phase 0 (cleanup) + Phase 1 (parent-variant architecture) + Phase 2 (stock control). Variant pricing, multi-variant cart, shipping/tax/coupons, email customization sonraki spec dosyalarına bırakıldı.
>
> **Hedef format:** Hybrid — pragmatik PRD + kritik type definitions. Edge case'leri ve UI detaylarını Claude Code çözer; data model ve mutlak kurallar burada.

> **⚠️ Proje doğası:** `jotform-workspace` bir **experience prototype'ı** — production değil. Buradaki geliştirmeler, production developer'larının asıl Jotform koduna deneyimi + feature'ları taşıyabilmesi için bir referans. **Backend bağlantısı YOK** — DB persistence, API, server-side logic yok. Backend gerektiren her şeyin (stok concurrency, sipariş kalıcılığı) config-time / session-local / mock versiyonu kurulur ve kısıt olarak not edilir.

> **Revizyon notu (kodbase doğrulamasından sonra uygulanan 4 düzeltme):**
> 1. Verify gate'i `pnpm build` (zaten `tsc -b` içerir; Vercel bunu koşar). `pnpm typecheck` scripti yok. Repo geneli `pnpm lint` pre-existing hatalarla kırık (`app-builder`'da eslint config yok; `design-system`+`app-elements`'te `set-state-in-effect` borcu) — phase doğrulaması yalnızca değişen dosyaları `npx eslint` ile lint'ler, repo lint temizliği ayrı bir iş.
> 2. `Product.price` tipi `string` (number değil) — mevcut inline-edit currency-prefix UX string-native, Phase 0-2 aritmetik gerektirmez.
> 3. `Product.id` opsiyonel (`id?: string`) — eski JSON'larda id yok; eksikse element seçiminde lazy atanır, migration scripti yok.
> 4. Variant editör UI = AppDesigner "Edit Theme" tarzı drill-down (slide + geri ok), expandable section/dialog değil.

---

## Kullanım workflow

Her phase **bağımsız bir Claude Code cycle**'ı olarak çalıştırılır:

```
@PRODUCT_LIST_SPEC.md Phase 0 ile başla. Önce planı kendi cümlelerinle özetle,
sonuna kadar git, build geçince commit at.
```

Tek phase başlat → bitir → commit → sonraki phase. **Phase'leri zincirleme tek prompt'la verme** — Claude Code bir sonraki phase'de önceki kararları unutur veya çakıştırır.

Phase sırası **mutlak** — Phase 1 Phase 0'a, Phase 2 Phase 1'e bağımlıdır. Atlanamaz.

---

## Kodbase Bağlamı

**Tech stack:** pnpm workspace monorepo · Vite 8 · TypeScript 5.9 · React 19.2 · SCSS + CSS custom properties.

**Paketler:**
- `design-system` — Builder shell UI (`--ds-*` tokens)
- `app-elements` — Canvas component'leri (`--fg-*` / `--bg-*` / `--space-*` / `--app-*` tokens, `.app-scope` içine sarılı)
- `app-builder` — Ana uygulama

**Product List konumu:** `packages/app-elements/src/components/ProductList/`
- `ProductList.tsx` — Component (render + state)
- `ProductList.scss` — Styles (token-only)
- `register.tsx` — ComponentRegistry kaydı (variants + properties + propDocs + colorTokens + render)

**Runtime context'ler (zaten mevcut, kullan):**
- `useCart()` — sepet state ve mutations
- `useFavorites()` — favori toggle

**Mevcut yetenekler:** 3 layout (ThreeColumns/TwoColumns/SingleColumn) — *ama sadece 2'si kayıtlı, bak Phase 0*, toolbar (search + layout switch), inline edit (contentEditable), skeleton state, "Add New Product" kartı, JSON sync via `onProductsChange`.

---

## Mutlak Kurallar (anti-patterns)

Bunları **ihlal eden PR build'i koparır.** Claude Code uymadığında uyar ve reddet.

1. **Hardcoded değer yok.** Her renk, spacing, font-size, radius, shadow design token'a referans. `color: '#1F3864'` ❌ → `color: var(--fg-primary)` ✅.
2. **Builder'dan style override yok.** Bir bug fix lazımsa `packages/app-elements/` veya `packages/design-system/` kaynağında yap. App-builder'dan ProductList'in iç stiline dokunma.
3. **Token izolasyonu kesin.** Canvas (`app-elements`) → `--fg-*`/`--bg-*`/`--space-*`/`--app-*`. Shell (`design-system`) → `--ds-*`. Karışmaz.
4. **propDocs zorunlu.** Her property için `propDocs` entry'si olacak. Eksikse Vercel build fail.
5. **Unused import/var = build fail.** Geliştirme sırasında bıraktığın yorum satırı `// const x = ...` veya kullanılmayan import temizlenmeli.
6. **Backward compatibility koru.** Phase 1 öncesi yaratılmış `Product[]` JSON'ları Phase 1 sonrası bozulmadan render etmeli. Migration scripti gerekmemeli — tip extension'ları opsiyonel field olacak.
7. **ComponentRegistry pattern'ini takip et.** Yeni property → register.tsx → propDocs → component render. Aynı sırada, kestirme yok.

---

## Phase 0 — Cleanup

**Amaç:** Mevcut Product List'teki üç teknik borcu temizle, sonraki phase'lerin temiz bir tabanda çalışmasını sağla.

**Bağımlılık:** Yok. Bu phase ilki.

**Süre tahmini:** 1-2 saat.

### Görevler

#### 0.1 — `ThreeColumns` variant'ını tamamla

`ProductListLayout` tipinde `ThreeColumns` değeri var ama `register.tsx`'te sadece 2 variant kayıtlı (List/Grid → SingleColumn/TwoColumns). `LAYOUT_ICONS` da 3. ikonu içermiyor.

**Yapılacak:**
- Registry'ye 3. variant'ı ekle (örn. `Grid3` → `ThreeColumns`)
- `LAYOUT_ICONS`'a ThreeColumns için bir ikon ekle (lucide/phosphor/tabler — paket konvansiyonuna uygun)
- Component render'da ThreeColumns case'ini doğrula

**Acceptance:**
- Builder'da layout switcher 3 ikon gösterir
- Her 3 layout sorunsuz render olur (4+ ürünle test)

> ℹ️ Eğer ThreeColumns mimari olarak istenmiyorsa alternatif: tipi de kaldır. Ama varsayım = istenir, restore et. Çünkü tip zaten yazılmış, sadece registry'den kopmuş.

#### 0.2 — Show Images per-product

`register.tsx:141` civarında "Show Images" toggle açıldığında tüm ürünlere aynı Unsplash URL'i atanıyor. Bu bug.

**Yapılacak:**
- Her ürünün kendi `image?: string` field'ı üzerinden render
- Image olmayan ürünler için ya placeholder (deterministik, ürün id'sinden seed'li) ya da boş image slot göster (tasarım kararı — placeholder'ı öner)
- "Show Images" toggle artık görsel **görünürlüğünü** kontrol etsin, görsel **kaynağını** değil

**Acceptance:**
- 5 ürünlü liste, hepsinin farklı/uygun görseli var
- Image field boş bırakılan ürün düzgün fallback (placeholder veya boş card) gösterir
- Toggle off → hiç görsel yok, layout bozulmaz

#### 0.3 — `ProductItem.autoScale` temizliği

Tipte tanımlı ama component'te kullanılmıyor. Ölü kod.

**Yapılacak:**
- Tipten kaldır (Type değişikliği breaking gibi görünüyor ama opsiyonel field olduğu için backward compat etkilenmez)
- propDocs varsa kaldır
- Test render'larında referansı temizle

**Acceptance:**
- `grep -r "autoScale" packages/` boş döner
- Build geçer

### Phase 0 Done Kriteri

```bash
pnpm build                                  # passes — gerçek ship gate (Vercel bunu koşar; tsc -b dahil)
npx eslint <bu phase'de değişen dosyalar>   # değişen dosyalar temiz, yeni hata yok
# Repo geneli `pnpm lint` pre-existing hatalarla kırık — ayrı lint-cleanup işi, bu spec dışında.
```

3 layout görsel olarak test edildi, image field her ürün için ayrı çalışıyor, autoScale tamamen silindi. **Commit:** `chore(product-list): cleanup variants, image handling, dead code`

---

## Phase 1 — Parent-Variant Architecture

**Amaç:** Bir ürünün birden çok varyantı olabilsin (Size: S/M/L × Color: Red/Blue). Variant'lar otomatik üretilir, satıcı her variant'ı düzenleyebilir. Phase 2 (stock) ve sonraki phase'ler (variant pricing, multi-variant cart) bu data model üzerine kurulur.

**Bağımlılık:** Phase 0 ✅

**Süre tahmini:** 4-6 saat (asıl iş data model + UI dimension editor).

### Mimari Kararlar (Claude Code bunları çakıştıramaz)

| Karar | Değer | Gerekçe |
|---|---|---|
| Variant üretimi | Otomatik (cartesian product of dimensions) | Manuel ekleme UI karmaşası yaratır |
| Max dimension sayısı | 3 | E-commerce konvansiyonu (Size/Color/Material genelde yeter) |
| Max value/dimension | 20 (soft limit, warning) | Sanity check |
| Variant ID | Deterministic hash: `v_${sortedKey}-${sortedVal}_...` | Stable across edits — Phase 2 stock referansı bozulmaz |
| Product ID | Opsiyonel; eksikse element seçiminde lazy atama (`p_${hash}`) | Eski JSON'larda id yok — migration scripti gerekmesin |
| Fiyat tipi | `string` (number değil) | Mevcut inline-edit currency-prefix UX string-native; Phase 0-2 aritmetik gerektirmez |
| Backward compat | `optionDimensions` undefined ise eski davranış | Hiçbir migration scripti yok |
| Variant fiyat default | Parent `price`'ı inherit eder | Phase 3 override ekleyecek |
| Variant selector UI | Her dimension için dropdown | Form Builder pattern'ı |
| Variant editör UI | AppDesigner "Edit Theme" tarzı drill-down (slide + geri ok) | Property panel'i kalabalıklaştırmadan odaklı düzenleme |

### Type Definitions (kritik)

```typescript
// packages/app-elements/src/components/ProductList/types.ts
// (mevcutta tipler ProductList.tsx içinde olabilir — yeni dosyaya çıkar)

export type ProductOptionDimension = {
  id: string;                    // stable: dimension_${slug(label)}
  label: string;                 // "Size", "Color"
  values: string[];              // ["S", "M", "L"]
};

export type ProductVariant = {
  id: string;                    // deterministic: see "Variant ID" decision above
  optionValues: Record<string, string>;  // { "Size": "M", "Color": "Red" }
  // Phase 2 ekleyecek: stock?: number
  // Phase 3 ekleyecek: price?: string  (parent price'ı override)
};

export type Product = {
  id?: string;                   // opsiyonel — eksikse seçimde lazy atanır (backward compat)
  name: string;
  price: string;                 // base; variants inherit if no override (currency-prefix UX string-native)
  image?: string;

  // Phase 1 additions — OPSİYONEL, backward compat:
  optionDimensions?: ProductOptionDimension[];
  variants?: ProductVariant[];   // auto-generated from optionDimensions
};

// Helper — deterministic variant ID
export const buildVariantId = (optionValues: Record<string, string>): string => {
  const sortedKeys = Object.keys(optionValues).sort();
  const parts = sortedKeys.map(k => `${slug(k)}-${slug(optionValues[k])}`);
  return `v_${parts.join('_')}`;
};

// Helper — cartesian product
export const generateVariants = (
  dimensions: ProductOptionDimension[]
): ProductVariant[] => {
  // returns all combinations as ProductVariant[]
};
```

### Görevler

#### 1.1 — Type extension

- `types.ts` dosyasını oluştur (yukarıdaki tanımlar)
- Mevcut `Product`/`ProductItem` tipi nerede tanımlıysa oradan re-export et veya migrate et
- Helper'ları (`buildVariantId`, `generateVariants`, `slug`, product id lazy-assign helper) yaz, unit-testable saf fonksiyonlar olsun
- Product `id` eksikse element seçiminde stable id atayıp `onProductsChange` ile geri yaz (kodbase'in "seçimde tek seferlik migration" pattern'i)

#### 1.2 — Property panel: "Enable Variants" toggle

`register.tsx`'te yeni properties:

- **`enableVariants`** (boolean, default false) — global toggle, "Bu ürünlerin variant'ları var mı?" başlığında, normal property olarak
- **Per-product variant editor** — drill-down ile açılır (bkz. 1.3)

#### 1.3 — Variant editor UI (canvas inline edit DEĞİL — property panel drill-down)

Variant tanımlama inline edit ile yapılmaz, çok karmaşık. Property panel'de **AppDesigner "Edit Theme" tarzı drill-down** ile:

- Property panel'de bir "Edit Variants" trigger butonu
- Tıklayınca panel yatay slide ile variant editör alt-görünümüne geçer; panel header'da geri ok + başlık değişimi
- Referans pattern: `packages/app-elements/src/layout/AppDesigner.tsx` (~1137+) — `sidebar-panel__slider` + iki `sidebar-panel__slide`, `--editor` modifier, `sidebar-panel__back` butonu
- Alt-görünüm içeriği:
  - Dimension ekle butonu (max 3)
  - Her dimension: label input + tag input (values)
  - Variants otomatik generate edilir, alta tablo olarak görünür: `Size: M, Color: Red | (Phase 2'de: stock 12 | Phase 3'te: price ₺150)`
  - Şu phase'de tablo sadece variant list'ini gösterir, henüz edit alanı yok (Phase 2 stock'u, Phase 3 price'ı ekleyecek)

#### 1.4 — Canvas rendering: variant selector

`ProductList.tsx`'te, eğer ürünün `optionDimensions?.length > 0` ise:

- Her ürün card'ında "Add to Cart" butonunun üstünde her dimension için dropdown göster
- Dropdown default state: "Select Size" / "Select Color" gibi placeholder
- Tüm dimension'lar seçilmeden "Add to Cart" disabled
- Hepsi seçilince → variant resolve et → `useCart().addItem({ productId, variantId, quantity: 1 })` çağır

#### 1.5 — Cart integration

`useCart` mevcutta `{ productId, quantity }` mantığında olabilir; **variant-aware hale getir:**

```typescript
type CartItem = {
  productId: string;
  variantId?: string;   // undefined = no variants
  quantity: number;
};
```

- `addItem(productId, variantId)` → mevcut line item ile match için `(productId + variantId)` key'i kullan
- Aynı productId farklı variantId → ayrı line item'lar (Phase 3'te kritik)
- Backward compat: variant olmayan ürünlerde variantId undefined kalır, davranış değişmez

#### 1.6 — propDocs

`enableVariants`, `optionDimensions`, `variants` için propDocs entry'leri yaz. Yoksa build fail.

### Acceptance

- Variant'sız ürünler hâlâ **birebir aynı** davranıyor (Phase 0 sonrası testleri tekrarla)
- Variant tanımlanmış ürünlerde:
  - Property panel'de dimension/value editör (drill-down) çalışıyor
  - Variants doğru cartesian product'ı üretiyor (2 dim × 3 val = 6 variant)
  - Canvas'ta variant dropdown'ları render oluyor
  - Tüm dropdown'lar seçilmeden Add to Cart disabled
  - Aynı ürünün farklı variant'ları sepete farklı line item olarak giriyor
- Build, lint geçiyor

### Phase 1 Done

```bash
pnpm build                                  # gerçek ship gate (tsc -b dahil)
npx eslint <bu phase'de değişen dosyalar>   # değişen dosyalar temiz (repo geneli lint ayrı iş)
```

**Commit:** `feat(product-list): parent-variant architecture with dimension editor`

---

## Phase 2 — Stock Control

**Amaç:** Variant veya product bazlı stok takibi. Stok bittiğinde 3 davranış modu (Hide / Sold Out / Continue Selling). Cart, mevcut stok'tan fazla eklenmesine izin vermez.

**Bağımlılık:** Phase 1 ✅ (variant ID'leri stable olmadan stok takibi anlamsız)

**Süre tahmini:** 3-4 saat.

### Mimari Kararlar

| Karar | Değer | Gerekçe |
|---|---|---|
| Stock seviyesi | Variant varsa variant-level, yoksa product-level | Tek source of truth |
| Stock değeri | `number` (positive integer) veya `undefined` (unlimited) | Sade |
| Out-of-stock tetikleyici | `(configured stock - cart quantity) ≤ 0` | Cart'taki rezervasyon dahil |
| Display modları | Hide count / Show count / Low-stock warning (threshold) | 3 satıcı tercihi |
| Behavior modları | Hide / Show as Sold Out / Allow (preorder) | 3 satıcı tercihi |
| Cart enforcement | useCart `addItem`'da stock check | Tek noktadan kontrol |
| Reset semantics | Cart clear → effective stock geri döner | Backend yok, session-local |
| **Out of scope** | Gerçek backend persistence, multi-user concurrency | DB entegrasyonu sonraki iş |

> ⚠️ Bu Phase'in **fundamental limitation'ı**: stok config-time bir değerdir, runtime'da kalıcı azalmaz. İki kullanıcı eş zamanlı son ürünü almaya çalışırsa iki sipariş de geçer. Bu **sonraki bir Phase'de backend ile çözülecek** — şimdilik kabul edilen kısıt (prototip doğası gereği).

### Type Extensions

```typescript
// types.ts'e ekle:

export type StockBehavior = 'hide' | 'soldOut' | 'allow';

export type StockDisplay =
  | { mode: 'hidden' }
  | { mode: 'count' }
  | { mode: 'lowStockWarning'; threshold: number };

export type ProductVariant = {
  id: string;
  optionValues: Record<string, string>;
  stock?: number;              // undefined = unlimited
};

export type Product = {
  // ... existing
  stock?: number;              // variant'sız ürünler için
  stockBehavior?: StockBehavior;     // default 'soldOut'
  stockDisplay?: StockDisplay;       // default { mode: 'hidden' }
};
```

### Görevler

#### 2.1 — Type extensions ve helper'lar

```typescript
// Effective stock = configured - cart quantity for this product/variant
export const getEffectiveStock = (
  product: Product,
  variantId: string | undefined,
  cart: CartItem[]
): number | undefined => {
  // undefined = unlimited
  // returns 0 if out of stock
};

export const isOutOfStock = (
  product: Product,
  variantId: string | undefined,
  cart: CartItem[]
): boolean => { /* effective stock <= 0 */ };
```

#### 2.2 — Property panel: stock fields

- Variant editor tablosu (Phase 1'de oluşturuldu) artık her variant satırında **"Stock"** input gösterir
- Variant'sız ürünlerde: per-product "Stock" input'u (Phase 1'in property bölümünde)
- Global ProductList settings'e iki yeni dropdown:
  - **Stock Behavior** (when out of stock): Hide / Show as Sold Out / Allow (preorder)
  - **Stock Display**: Don't show / Show count / Show warning when low + threshold input

#### 2.3 — Canvas rendering: stock-aware UI

ProductList.tsx render'da:

- `effectiveStock` hesaplanır
- `stockBehavior === 'hide'` ve out of stock → product card render edilmez
- `stockBehavior === 'soldOut'` ve out of stock → card render edilir ama Add to Cart disabled, button text "Sold Out", card grayed out (token: opacity veya `--fg-disabled`)
- `stockBehavior === 'allow'` → normal flow (preorder semantic; UI'de "Preorder" badge önerisi)

Stock display:
- `mode: 'count'` → "12 in stock" etiketi (price'ın altına, küçük font, `--fg-secondary`)
- `mode: 'lowStockWarning'` ve `effectiveStock <= threshold` → "Only N left!" etiketi (vurgulu, `--fg-warning`)
- `mode: 'hidden'` → hiçbir şey gösterme

#### 2.4 — Cart enforcement

`useCart().addItem` çağrısı:

```typescript
const addItem = (productId, variantId) => {
  const product = findProduct(productId);
  const effective = getEffectiveStock(product, variantId, cart);
  if (effective !== undefined && effective <= 0) {
    // surface error — toast, return false, throw — design system'de pattern var, kullan
    return { ok: false, reason: 'OUT_OF_STOCK' };
  }
  // ... mevcut add logic
  return { ok: true };
};
```

Caller (ProductList card) `ok: false` durumunda kullanıcıya hata gösterir (mevcut design system toast/alert pattern'ı varsa onu kullan; yoksa basit inline mesaj).

#### 2.5 — Stock = 0 edge cases

- Variant tanımlı ama hiç stock girilmemiş → `undefined` (unlimited), bug değil
- Cart'tan item silinince effective stock anında geri gelir, sold out → available transition'ı render olmalı
- Stock = 0 başlangıçta tanımlı ürün → behavior moduna göre davran
- Cart'ta 3 adet var, stock 5'e düşürüldü → cart aynı kalır (mevcut item'ları zorla çıkarma), ama 4. eklenemez

#### 2.6 — propDocs

`stock`, `stockBehavior`, `stockDisplay` için entry'ler.

### Acceptance

- Variant'sız ürün, stock = 3 → 3 kere Add to Cart geçer, 4.'de hata
- Variant'lı ürün, Size M stock = 2, Size L stock = 5 → M ile 2, L ile 5 sepete ekleyebilirsin (variant-level enforcement)
- `stockBehavior = 'hide'` + stock = 0 → ürün hiç görünmez
- `stockBehavior = 'soldOut'` + stock = 0 → card görünür, Add to Cart disabled, "Sold Out" yazısı
- `stockDisplay = 'count'` → "12 in stock" görünür
- `stockDisplay = 'lowStockWarning'`, threshold = 5, stock = 3 → "Only 3 left!" warning rengiyle görünür
- Cart'tan item çıkar → effective stock anında güncellenir
- Stock undefined ürünlerde hiçbir kısıt yok (unlimited)

### Phase 2 Done

```bash
pnpm build                                  # gerçek ship gate (tsc -b dahil)
npx eslint <bu phase'de değişen dosyalar>   # değişen dosyalar temiz (repo geneli lint ayrı iş)
```

**Commit:** `feat(product-list): variant-aware stock control with display modes`

---

## Sonraki Phase'ler (bu spec dışında)

İlk 3 phase ship olduktan sonra ayrı spec dosyalarıyla:

- **Phase 3** — Variant pricing (variant override price) + Multi-variant cart polishing
- **Phase 4** — Checkout calculator: Shipping cost + Tax + Coupon code (fiyat string → `parsePrice()` helper ile hesap anında parse edilir)
- **Phase 5** — Email & notification customization (sender, subject, body, recipient, autoresponder)
- **Phase 6** — UI customization (Add to Cart button text override, quantity input modes, etc.)

Phase 1+2 ship'lendikten sonra "PRODUCT_LIST_SPEC_PHASE3.md" formatında devam edilir.

---

## Verify checklist (her phase için)

```bash
pnpm build                                  # Vercel'in göreceği build (tsc -b dahil) — gerçek ship gate
npx eslint <bu phase'de değişen dosyalar>   # değişen dosyalar yeni lint hatası eklemiyor
```

> Repo geneli `pnpm lint` şu an pre-existing hatalarla kırık (bkz. üstteki revizyon notu 1). Bu spec'in gate'i `pnpm build`; repo lint temizliği ayrı, bağımsız bir iş olarak ele alınır.

Manuel test:
- Builder'da yeni bir App oluştur, Product List ekle
- Property panel'deki yeni alanları test et
- Live preview (phone/tablet mockup) ile runtime'ı doğrula
- Backward compat: önceden kaydedilmiş bir Product List JSON'ı hâlâ render mu ediyor?

Build geçmeden commit yok. Commit'ten önce `git diff` ile değişen dosyaları gözden geçir — özellikle `register.tsx` `propDocs` block'unu unutmadığından emin ol.
