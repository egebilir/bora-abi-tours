<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Mobile-First Design (MANDATORY)

This project's users are **80% mobile**. Every component, page, and layout MUST be designed **mobile-first**:

- Always start with the mobile layout, then scale up with `sm:`, `md:`, `lg:` breakpoints.
- Touch targets must be at least **44×44px**.
- Text must be readable without zooming (minimum 16px body text on mobile).
- No horizontal scroll on any screen size.
- Test all UI changes at **375px width** (iPhone SE) as the baseline.
- Modals, dropdowns, and menus must be fully usable on small screens.
- Images must use responsive `sizes` attribute with mobile-first values.

# SEO-First Content Strategy (MANDATORY)

Google'da öne çıkmak bu projenin **en kritik hedeflerinden biridir**. Her sayfa, her bileşen ve her içerik parçası SEO odaklı yazılmalıdır:

## Teknik SEO
- Her sayfa için **dinamik `<title>` ve `<meta description>`** zorunludur — genel/boş meta etiketler KABUL EDİLMEZ.
- Her sayfada uygun **JSON-LD yapılandırılmış veri** (Schema.org) bulunmalıdır: `Product`, `AggregateRating`, `BreadcrumbList`, `TouristTrip`, `Organization`.
- **Semantic HTML** kullan: `<article>`, `<section>`, `<nav>`, `<header>`, `<footer>`, `<main>` — her sayfada tek `<h1>`, doğru heading hiyerarşisi (`h1 > h2 > h3`).
- Görsellerde **anlamlı `alt` metni** zorunlu, dosya isimleri SEO-uyumlu olmalı (örn: `efes-antik-kenti-turu.png`).
- `next/image` ile **lazy loading**, `priority` flag ve uygun `sizes` kullanılmalı — LCP skoru kritik.
- **Canonical URL** ve **Open Graph / Twitter Card** meta etiketleri her sayfada bulunmalı.

## İçerik SEO
- Tur açıklamaları, sayfa metinleri ve tüm kullanıcıya görünen içerikler **anahtar kelime odaklı** yazılmalıdır.
- Hedef anahtar kelimeler: "Kuşadası turları", "Efes turu", "Pamukkale günübirlik", "Kuşadası tekne turu", "Kuşadası excursions", "Ephesus tour from Kuşadası" vb.
- Her tur detay sayfasında **SEO-zengin genişletilmiş açıklama** (`fullDescription`) bulunmalı — doğal dilde, keyword stuffing yapmadan, bilgilendirici ve ikna edici.
- İçerikler hem **Türkçe** hem **İngilizce** olarak hazırlanmalı (i18n desteği ile).
- Internal linking stratejisi uygulanmalı — ilgili turlar birbirine link vermeli.

## Performans (Core Web Vitals)
- **LCP < 2.5s**: Hero görselleri `priority={true}` ve `fetchPriority="high"` ile yüklenmeli.
- **CLS < 0.1**: Görseller ve dinamik içerikler için boyut tanımları zorunlu.
- **INP < 200ms**: Etkileşimli öğeler hızlı yanıt vermeli, ağır hesaplamalar memoize edilmeli.
