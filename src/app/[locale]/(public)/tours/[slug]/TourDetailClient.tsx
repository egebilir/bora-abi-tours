'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Tour, LANGUAGE_LABELS } from '@/types';
import { getCategoryIcon, getStarRating } from '@/lib/utils';
import { useCurrency } from '@/lib/currency';
import { useAdminStoreSafe } from '@/lib/admin-store';
import TourCard from '@/components/tours/TourCard';
import { useTranslations, useLocale } from 'next-intl';
import { Link, useRouter } from '@/i18n/routing';
import { getLocalizedTourContent } from '@/lib/tour-translations';

interface TourDetailClientProps {
  tour: Tour;
  relatedTours?: Tour[];
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

const generatedComments = [
  { 
    id: "c1", name: "John M.", countryTr: "Birleşik Krallık", countryEn: "United Kingdom", countryCode: "gb", dateTr: "9 Mayıs 2026", dateEn: "May 9, 2026", rating: 5, color: "bg-blue-600", 
    originalText: "To be honst i didnt expect much but it was so good!! Our guide Berk knew literally everything about the ruins. we walked a bit too much tho, my feet are killing me lol. bus was cold.",
    translations: {
      tr: "Dürüst olmak gerekirse çok bir şey beklemiyordum ama harikaydı!! Rehberimiz Berk harabeler hakkında kelimenin tam anlamıyla her şeyi biliyordu. biraz fazla yürüdük, ayaklarım koptu lol. otobüs soğuktu.",
      en: "To be honst i didnt expect much but it was so good!! Our guide Berk knew literally everything about the ruins. we walked a bit too much tho, my feet are killing me lol. bus was cold.",
      ru: "Честно говоря, я не ожидал многого, но это было так здорово!! Наш гид Берк знал о руинах буквально всё. Правда, мы слишком много ходили, мои ноги просто отваливаются лол. В автобусе было холодно.",
      de: "Ehrlich gesagt habe ich nicht viel erwartet, aber es war so gut!! Unser Reiseführer Berk wusste buchstäblich alles über die Ruinen. Wir sind allerdings etwas zu viel gelaufen, meine Füße bringen mich um lol. Der Bus war kalt.",
      es: "Para ser honesto, no esperaba mucho, ¡pero fue genial! Nuestro guía Berk sabía literalmente todo sobre las ruinas. Caminamos un poco demasiado, mis pies me matan jajaja. El autobús estaba frío."
    }
  },
  { 
    id: "c2", name: "Sara T.", countryTr: "Amerika Birleşik Devletleri", countryEn: "United States", countryCode: "us", dateTr: "8 Mayıs 2026", dateEn: "May 8, 2026", rating: 5, color: "bg-amber-500", 
    originalText: "omg ephesus is breathtaking... def recommend!! the terrace houses are a MUST see. the lunch could be better but overall it was a gret trip. Mehtap was an amazing guide, she took so many photos of us. driver was very freindly",
    translations: {
      tr: "Aman tanrım efes nefes kesici... kesinlikle tavsiye ederim!! yamaç evler GÖRÜLMESİ GEREKEN bir yer. öğle yemeği daha iyi olabilirdi ama genel olarak harika bir geziydi. Mehtap harika bir rehberdi, bizim bir sürü fotoğrafımızı çekti. şoför çok cana yakındı.",
      en: "omg ephesus is breathtaking... def recommend!! the terrace houses are a MUST see. the lunch could be better but overall it was a gret trip. Mehtap was an amazing guide, she took so many photos of us. driver was very freindly",
      ru: "о боже, эфес захватывает дух... определенно рекомендую!! террасные дома ОБЯЗАТЕЛЬНЫ к посещению. обед мог бы быть и лучше, но в целом это была отличная поездка. Мехтап была потрясающим гидом, она сделала для нас столько фотографий. водитель был очень дружелюбен",
      de: "omg ephesus ist atemberaubend... kann es definitiv empfehlen!! die terrassenhäuser MUSS man gesehen haben. das mittagessen hätte besser sein können, aber insgesamt war es ein toller ausflug. Mehtap war eine erstaunliche reiseführerin, sie hat so viele fotos von uns gemacht. der fahrer war sehr freundlich",
      es: "omg éfeso es impresionante... definitivamente lo recomiendo!! las casas adosadas son una visita OBLIGADA. el almuerzo podría ser mejor, pero en general fue un gran viaje. Mehtap fue una guía increíble, nos tomó muchas fotos. el conductor fue muy amable"
    }
  },
  { 
    id: "c3", name: "Klaus W.", countryTr: "Almanya", countryEn: "Germany", countryCode: "de", dateTr: "5 Mayıs 2026", dateEn: "May 5, 2026", rating: 4, color: "bg-teal-600", 
    originalText: "Sehr schöne Tour. Ismail hat sehr gutes Englisch gesprochen. Alles war pünktlich. Die Abholung war 10 Minuten zu spät, aber kein großes Problem. Würde es wieder tun.",
    translations: {
      en: "Very nice tour. Ismail was speaking very good english. everything was on time. the pick up was 10 mins late but no big deal. would do it again.",
      tr: "Çok güzel bir tur. İsmail çok iyi İngilizce konuşuyordu. her şey zamanındaydı. araç 10 dakika geç geldi ama sorun değil. tekrar yapardım.",
      ru: "Очень хорошая экскурсия. Исмаил очень хорошо говорил по-английски. Все было вовремя. Трансфер опоздал на 10 минут, но это не страшно. Поехал бы снова.",
      de: "Sehr schöne Tour. Ismail hat sehr gutes Englisch gesprochen. Alles war pünktlich. Die Abholung war 10 Minuten zu spät, aber kein großes Problem. Würde es wieder tun.",
      es: "Muy bonito tour. Ismail hablaba muy buen inglés. Todo fue puntual. La recogida llegó 10 minutos tarde, pero no es un gran problema. Lo volvería a hacer."
    }
  },
  { 
    id: "c4", name: "Maria G.", countryTr: "İtalya", countryEn: "Italy", countryCode: "it", dateTr: "2 Mayıs 2026", dateEn: "May 2, 2026", rating: 5, color: "bg-rose-500", 
    originalText: "Magnifico!!! Le rovine sono così belle. Ho fatto tipo 1000 foto. Faceva caldissimo quindi portatevi l'acqua. La nostra guida Berk è stata molto dolce e divertente.",
    translations: {
      en: "magnifico!!! the ruins are so beautiful. i took like 1000 pictures. it was super hot so bring water. our guide Berk was very sweet and funny.",
      tr: "Muhteşem!!! harabeler çok güzel. 1000 falan fotoğraf çektim. hava çok sıcaktı o yüzden su getirin. rehberimiz Berk çok tatlı ve komikti.",
      ru: "Великолепно!!! руины такие красивые. Я сделал около 1000 фотографий. Было очень жарко, поэтому берите воду. Наш гид Берк был очень милым и забавным.",
      de: "Prächtig!!! Die Ruinen sind so schön. Ich habe gefühlt 1000 Fotos gemacht. Es war super heiß, also bringt Wasser mit. Unser Guide Berk war sehr süß und lustig.",
      es: "¡¡¡Magnífico!!! Las ruinas son tan hermosas. Tomé como 1000 fotos. Hacía mucho calor, así que traigan agua. Nuestro guía Berk fue muy dulce y divertido."
    }
  },
  { 
    id: "c5", name: "Liam O.", countryTr: "İrlanda", countryEn: "Ireland", countryCode: "ie", dateTr: "28 Nisan 2026", dateEn: "April 28, 2026", rating: 5, color: "bg-indigo-500", 
    originalText: "brilliant day out with Mehtap. the theater is massive mate. well worth the money. easy to book and no stress.",
    translations: {
      tr: "Mehtap ile harika bir gün. tiyatro devasa dostum. parasına kesinlikle değer. rezervasyonu kolay ve stressiz.",
      en: "brilliant day out with Mehtap. the theater is massive mate. well worth the money. easy to book and no stress.",
      ru: "отличный день с Мехтап. театр просто огромный, приятель. однозначно стоит своих денег. легко забронировать и никакого стресса.",
      de: "brillanter Tag mit Mehtap. das Theater ist riesig, Kumpel. auf jeden Fall das Geld wert. einfach zu buchen und kein Stress.",
      es: "un día brillante con Mehtap. el teatro es masivo, amigo. bien vale la pena el dinero. fácil de reservar y sin estrés."
    }
  },
  {
    id: "c6", name: "Carlos R.", countryTr: "Meksika", countryEn: "Mexico", countryCode: "mx", dateTr: "20 Nisan 2026", dateEn: "April 20, 2026", rating: 5, color: "bg-orange-500",
    originalText: "¡Increíble experiencia! El guía Ismail sabía muchísimo de historia y nos explicó todo con mucha paciencia. Las ruinas de Éfeso te dejan sin palabras. Muy recomendado.",
    translations: {
      en: "Incredible experience! The guide Ismail knew a lot of history and explained everything to us with great patience. The ruins of Ephesus leave you speechless. Highly recommended.",
      tr: "İnanılmaz bir deneyim! Rehberimiz İsmail tarihi çok iyi biliyordu ve bize her şeyi büyük bir sabırla anlattı. Efes harabeleri insanı suskun bırakıyor. Şiddetle tavsiye edilir.",
      ru: "Невероятный опыт! Гид Исмаил много знал об истории и объяснял нам всё с большим терпением. Руины Эфеса оставляют вас без слов. Очень рекомендую.",
      de: "Unglaubliche Erfahrung! Der Reiseleiter Ismail wusste viel über Geschichte und erklärte uns alles mit großer Geduld. Die Ruinen von Ephesus lassen einen sprachlos zurück. Sehr empfehlenswert.",
      es: "¡Increíble experiencia! El guía Ismail sabía muchísimo de historia y nos explicó todo con mucha paciencia. Las ruinas de Éfeso te dejan sin palabras. Muy recomendado."
    }
  },
  {
    id: "c7", name: "Fernanda L.", countryTr: "Brezilya", countryEn: "Brazil", countryCode: "br", dateTr: "15 Nisan 2026", dateEn: "April 15, 2026", rating: 5, color: "bg-green-600",
    originalText: "Lugar maravilhoso!! Fiquei apaixonada por Éfeso. A nossa guia Mehtap foi super atenciosa o tempo todo. O ônibus era bem confortável também. Voltaria com certeza!",
    translations: {
      en: "Wonderful place!! I fell in love with Ephesus. Our guide Mehtap was super attentive all the time. The bus was very comfortable too. I would definitely come back!",
      tr: "Harika bir yer!! Efes'e aşık oldum. Rehberimiz Mehtap her zaman çok ilgiliydi. Otobüs de çok rahattı. Kesinlikle tekrar gelirdim!",
      ru: "Замечательное место!! Я влюбилась в Эфес. Наш гид Мехтап была очень внимательна всё время. Автобус тоже был очень удобным. Я обязательно вернусь!",
      de: "Wundervoller Ort!! Ich habe mich in Ephesus verliebt. Unsere Reiseführerin Mehtap war die ganze Zeit super aufmerksam. Der Bus war auch sehr komfortabel. Ich würde definitiv wiederkommen!",
      es: "¡¡Lugar maravilloso!! Me enamoré de Éfeso. Nuestra guía Mehtap fue súper atenta todo el tiempo. El autobús también era muy cómodo. ¡Definitivamente regresaría!"
    }
  }
];

export default function TourDetailClient({ tour, relatedTours = [] }: TourDetailClientProps) {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('tourDetail');
  const tc = useTranslations('categories');
  const tcom = useTranslations('common');
  const tcard = useTranslations('tourCard');
  const tsp = useTranslations('socialProof');

  const starData = getStarRating(tour.rating);
  const starsStr = '★'.repeat(starData.full) + (starData.half ? '½' : '') + '☆'.repeat(starData.empty);
  const categoryLabel = tc(tour.category);
  const categoryIcon = getCategoryIcon(tour.category);
  const { formatPrice } = useCurrency();
  const store = useAdminStoreSafe();
  const [descExpanded, setDescExpanded] = useState(false);
  const [showAllComments, setShowAllComments] = useState(false);
  const [translatedComments, setTranslatedComments] = useState<Record<string, boolean>>({});

  const toggleTranslation = (id: string) => {
    setTranslatedComments(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const content = getLocalizedTourContent(tour, locale);
  const { title, description, fullDescription, duration, meetingPoint, highlights, inclusions, exclusions, importantInfo, itinerary } = content;

  const capacity = store?.getTourCapacity(tour.id) ?? { total: 0, booked: 0, available: 999 };
  const isSoldOut = capacity.available <= 0;
  const isPopular = tour.rating >= 4.7 && tour.reviewCount >= 200;

  // Simulated social proof (deterministic per tour, not random on every render)
  const viewerCount = useMemo(() => {
    const hash = tour.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    return 5 + (hash % 18); // 5-22 viewers
  }, [tour.id]);
  const bookedTodayCount = useMemo(() => {
    const hash = tour.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    return 2 + (hash % 8); // 2-9 booked today
  }, [tour.id]);

  const handleReserve = () => {
    if (isSoldOut || !tour.isOpen) return;
    router.push(`/checkout/${tour.id}`);
  };

  return (
    <main className="min-h-screen pt-16 lg:pt-20">
      {/* Breadcrumb */}
      <motion.div className="bg-khaki-50 border-b border-khaki-100" initial="hidden" animate="visible" variants={fadeUp} custom={0}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-sm text-neutral-400">
            <Link href="/" className="hover:text-ice-500 transition-colors">{tcom('home')}</Link>
            <span>/</span>
            <Link href="/#tours" className="hover:text-ice-500 transition-colors">{tcom('tours')}</Link>
            <span>/</span>
            <span className="text-neutral-700 font-medium truncate">{title}</span>
          </nav>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        <div className="lg:grid lg:grid-cols-3 lg:gap-10">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Image */}
            <motion.div className="relative aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden shadow-xl" initial="hidden" animate="visible" variants={fadeUp} custom={1}>
              <Image src={tour.image} alt={tour.imageAlt || title} fill className="object-cover" priority sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 800px" />
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm text-sm font-semibold text-neutral-700 shadow-sm">
                  {categoryIcon} {categoryLabel}
                </span>
                {tour.featured && (
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-amber-400/90 backdrop-blur-sm text-sm font-semibold text-amber-900 shadow-sm">
                    👑 {tcard('featured')}
                  </span>
                )}
              </div>
              {!tour.isOpen && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="px-6 py-3 bg-red-600 text-white font-bold rounded-full text-lg shadow-lg">{t('closedSale')}</span>
                </div>
              )}
            </motion.div>

            {/* Social Proof Banner */}
            {tour.isOpen && (
              <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={1.5}
                className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-50 border border-orange-100 text-xs font-semibold text-orange-700">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500" />
                  </span>
                  {viewerCount} {tsp('viewing')}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-xs font-semibold text-emerald-700">
                  ✓ {tsp('bookedToday', { count: bookedTodayCount })}
                </span>
                {isPopular && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 border border-red-100 text-xs font-semibold text-red-600">
                    🔥 {tsp('likelySellOut')}
                  </span>
                )}
              </motion.div>
            )}

            {/* Title & quick info */}
            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={2}>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-900 mb-3 leading-tight">{title}</h1>
              <div className="flex flex-wrap items-center gap-3 sm:gap-5 text-sm text-neutral-500 mb-4">
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-khaki-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  {duration}
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-khaki-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  {meetingPoint}
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-khaki-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  {t('startTime')}: {tour.startTime}
                </span>
              </div>
              <div className="flex items-center gap-2 mb-6">
                <span className="text-amber-400 text-lg">{starsStr}</span>
                <span className="font-bold text-neutral-800">{tour.rating}</span>
                <span className="text-neutral-400">({tour.reviewCount})</span>
              </div>
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <span className="text-sm font-medium text-neutral-600 mr-1">{t('languages')}:</span>
                {tour.languages.map((lang) => (
                  <span key={lang} className="inline-flex items-center px-2.5 py-1 rounded-full bg-ice-50 text-ice-700 text-xs font-medium border border-ice-100">
                    {LANGUAGE_LABELS[lang] || lang}
                  </span>
                ))}
              </div>
              <p className="text-neutral-600 leading-relaxed text-base sm:text-lg">{description}</p>
            </motion.div>

            {/* Full Description — Expandable */}
            {fullDescription && (
              <motion.div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden" initial="hidden" animate="visible" variants={fadeUp} custom={2.5}>
                <button onClick={() => setDescExpanded(!descExpanded)} className="w-full flex items-center justify-between px-5 py-4 sm:px-6 sm:py-5 text-left group min-h-[56px]">
                  <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                    <span className="w-1 h-6 bg-ice-500 rounded-full" />
                    {t('readMore')}
                  </h2>
                  <motion.div animate={{ rotate: descExpanded ? 180 : 0 }} transition={{ duration: 0.3 }}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-ice-50 text-ice-600 group-hover:bg-ice-100 transition-colors shrink-0 ml-3">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </motion.div>
                </button>
                <AnimatePresence initial={false}>
                  {descExpanded ? (
                    <motion.div key="full" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }} className="overflow-hidden">
                      <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-0">
                        <div className="prose prose-neutral max-w-none">
                          {fullDescription.split('\n\n').map((paragraph, i) => (
                            <p key={i} className="text-neutral-600 leading-relaxed text-[15px] sm:text-base mb-4 last:mb-0">{paragraph}</p>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div key="preview" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                      <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-0 relative">
                        <p className="text-neutral-500 leading-relaxed text-sm line-clamp-3">{fullDescription.split('\n\n')[0]}</p>
                        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent pointer-events-none" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {/* Highlights */}
            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={3}>
              <h2 className="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-ice-500 rounded-full" />
                {t('highlights')}
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {highlights.map((h, i) => (
                  <div key={i} className="flex items-center gap-2.5 px-4 py-3 bg-white rounded-xl border border-neutral-100 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-ice-400 shrink-0" />
                    <span className="text-sm font-medium text-neutral-700">{h}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Itinerary */}
            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={4}>
              <h2 className="text-xl font-bold text-neutral-900 mb-6 flex items-center gap-2">
                <span className="w-1 h-6 bg-ice-500 rounded-full" />
                {t('itinerary')}
              </h2>
              <div className="relative">
                <div className="absolute left-[19px] top-3 bottom-3 w-0.5 bg-gradient-to-b from-ice-400 via-ice-300 to-khaki-300 rounded-full" />
                <div className="space-y-6">
                  {itinerary.map((step, i) => (
                    <motion.div key={i} className="relative flex gap-4 pl-0" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.6 + i * 0.1 }}>
                      <div className="relative z-10 shrink-0 w-10 h-10 rounded-full bg-white border-2 border-ice-400 flex items-center justify-center shadow-sm">
                        <span className="text-xs font-bold text-ice-600">{step.time}</span>
                      </div>
                      <div className="flex-1 pb-2">
                        <h3 className="font-semibold text-neutral-800 mb-1">{step.title}</h3>
                        <p className="text-sm text-neutral-500 leading-relaxed">{step.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Inclusions / Exclusions */}
            <motion.div className="grid grid-cols-1 sm:grid-cols-2 gap-6" initial="hidden" animate="visible" variants={fadeUp} custom={5}>
              <div className="bg-white rounded-2xl p-5 border border-neutral-100 shadow-sm">
                <h3 className="font-bold text-neutral-900 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                  </span>
                  {t('included')}
                </h3>
                <ul className="space-y-2.5">
                  {inclusions.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-neutral-600">
                      <svg className="w-4 h-4 text-green-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white rounded-2xl p-5 border border-neutral-100 shadow-sm">
                <h3 className="font-bold text-neutral-900 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                  </span>
                  {t('notIncluded')}
                </h3>
                <ul className="space-y-2.5">
                  {exclusions.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-neutral-600">
                      <svg className="w-4 h-4 text-red-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Packages */}
            {content.packages && content.packages.length > 0 && (
              <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={5.2} className="pt-6">
                <h2 className="text-xl font-bold text-neutral-900 mb-6 flex items-center gap-2">
                  <span className="w-1 h-6 bg-ice-500 rounded-full" />
                  {t('packages') || 'Packages'}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {content.packages.map((pkg, i) => {
                    const isVip = pkg.isLink;
                    return (
                      <div key={pkg.id} className={`rounded-2xl p-5 border relative flex flex-col ${isVip ? 'bg-neutral-900 border-neutral-800 shadow-xl shadow-neutral-900/20 text-white' : pkg.popular ? 'bg-white border-amber-400 shadow-md ring-1 ring-amber-400' : 'bg-white border-neutral-100 shadow-sm'}`}>
                        {pkg.popular && !isVip && (
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-950 text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap shadow-sm">
                            {t('popularChoice') || 'Popular'}
                          </div>
                        )}
                        {isVip && (
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-200 to-amber-400 text-amber-950 text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap shadow-sm flex items-center gap-1">
                            ✨ VIP
                          </div>
                        )}
                        <h3 className={`text-lg font-bold mb-1 mt-1 ${isVip ? 'text-white' : 'text-neutral-900'}`}>{pkg.name}</h3>
                        {!isVip && (
                          <div className="flex flex-col items-start gap-1 mb-3">
                            {pkg.originalPrice && (
                              <span className="text-sm font-bold text-red-500 line-through decoration-1 decoration-red-400 whitespace-nowrap">
                                {formatPrice(pkg.originalPrice)}
                              </span>
                            )}
                            <span className="text-2xl font-bold text-ice-600 whitespace-nowrap">{formatPrice(pkg.price)}</span>
                          </div>
                        )}
                        <p className={`text-sm mb-6 flex-grow leading-relaxed ${isVip ? 'text-neutral-400 mt-2' : 'text-neutral-500'}`}>{pkg.description}</p>
                        <ul className="space-y-3 mb-6">
                          {pkg.features.map((f, fi) => (
                            <li key={fi} className="flex items-start gap-2.5 text-sm">
                              {f.included ? (
                                <svg className={`w-4 h-4 shrink-0 mt-0.5 ${isVip ? 'text-amber-400' : 'text-green-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                              ) : (
                                <svg className={`w-4 h-4 shrink-0 mt-0.5 ${isVip ? 'text-neutral-700' : 'text-neutral-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                              )}
                              <span className={f.included ? (isVip ? 'text-neutral-200 font-medium' : 'text-neutral-700 font-medium') : (isVip ? 'text-neutral-600 line-through' : 'text-neutral-400 line-through')}>{f.name}</span>
                            </li>
                          ))}
                        </ul>
                        {isVip && pkg.link ? (
                          <Link href={pkg.link} className="block text-center w-full py-2.5 rounded-xl text-sm font-bold transition-colors mt-auto bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-amber-950 shadow-[0_0_15px_rgba(251,191,36,0.3)] hover:shadow-[0_0_20px_rgba(251,191,36,0.5)]">
                            {t('learnMore') || 'Learn More'}
                          </Link>
                        ) : (
                          <button onClick={handleReserve} className={`w-full py-2.5 rounded-xl text-sm font-bold transition-colors mt-auto ${pkg.popular ? 'bg-amber-400 hover:bg-amber-500 text-amber-950' : 'bg-ice-50 hover:bg-ice-100 text-ice-700 border border-ice-100'}`}>
                            {t('selectPackage') || 'Select'}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Meeting Point */}
            <motion.div className="bg-white rounded-2xl p-5 sm:p-6 border border-neutral-100 shadow-sm" initial="hidden" animate="visible" variants={fadeUp} custom={5.5}>
              <h2 className="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-ice-500 rounded-full" />
                📍 {t('meetingPoint')}
              </h2>
              <p className="text-neutral-600 mb-3">{meetingPoint}</p>
              {tour.meetingPointLat && tour.meetingPointLng && (
                <a href={`https://www.google.com/maps?q=${tour.meetingPointLat},${tour.meetingPointLng}`} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-ice-50 hover:bg-ice-100 text-ice-700 font-medium rounded-xl text-sm transition-colors border border-ice-100 min-h-[44px]">
                  📍 {t('mapLink')} →
                </a>
              )}
            </motion.div>

            {/* Important Info */}
            {tour.importantInfo && tour.importantInfo.length > 0 && (
              <motion.div className="bg-amber-50/50 rounded-2xl p-5 sm:p-6 border border-amber-100" initial="hidden" animate="visible" variants={fadeUp} custom={6}>
                <h2 className="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 bg-amber-400 rounded-full" />
                  ⚠️ {t('importantInfo')}
                </h2>
                <ul className="space-y-2.5">
                  {importantInfo.map((info, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-neutral-700">
                      <span className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shrink-0 mt-0.5 text-xs font-bold">{i + 1}</span>
                      {info}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
            {/* AI Comments Section (GetYourGuide Style) */}
            <motion.div className="mt-12 pt-8 border-t border-neutral-200" initial="hidden" animate="visible" variants={fadeUp} custom={7}>
              <h2 className="text-2xl font-bold text-neutral-900 mb-6">
                {t('reviewsTitle') || 'Customer reviews'}
              </h2>
              
              {/* Score Summary */}
              <div className="flex flex-col md:flex-row gap-8 mb-8 pb-8 border-b border-neutral-200">
                <div className="md:w-1/3 text-center md:text-left">
                  <div className="text-5xl font-bold text-neutral-900 mb-2 tracking-tight">4,8<span className="text-2xl text-neutral-500 font-normal">/5</span></div>
                  <div className="flex justify-center md:justify-start text-amber-500 mb-2 gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                    ))}
                  </div>
                  <div className="font-bold text-neutral-900 text-lg mb-0.5">{t('exceptional') || 'Exceptional'}</div>
                  <div className="text-sm text-neutral-500">{t('basedOnReviews') || 'Based on 1,173 reviews'}</div>
                </div>
                <div className="md:w-2/3 space-y-3.5 text-sm font-semibold text-neutral-700">
                  <div className="flex items-center justify-between">
                    <span>{t('guide') || 'Guide'}</span>
                    <div className="flex items-center gap-4 w-2/3 md:w-1/2">
                      <div className="h-2 flex-grow bg-neutral-200 rounded-full overflow-hidden"><div className="h-full bg-neutral-800 w-[98%] rounded-full"></div></div>
                      <span className="w-8 text-right">4,9/5</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>{t('transportation') || 'Transportation'}</span>
                    <div className="flex items-center gap-4 w-2/3 md:w-1/2">
                      <div className="h-2 flex-grow bg-neutral-200 rounded-full overflow-hidden"><div className="h-full bg-neutral-800 w-[98%] rounded-full"></div></div>
                      <span className="w-8 text-right">4,9/5</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>{t('valueForMoney') || 'Value for money'}</span>
                    <div className="flex items-center gap-4 w-2/3 md:w-1/2">
                      <div className="h-2 flex-grow bg-neutral-200 rounded-full overflow-hidden"><div className="h-full bg-neutral-800 w-[96%] rounded-full"></div></div>
                      <span className="w-8 text-right">4,8/5</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reviews List */}
              <div className="space-y-6">
                <AnimatePresence initial={false}>
                  {(showAllComments ? generatedComments : generatedComments.slice(0, 2)).map((c, idx) => (
                    <motion.div 
                      key={idx} 
                      className="pb-6 border-b border-neutral-200 last:border-0 last:pb-0"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* Rating */}
                      <div className="flex items-center gap-1.5 mb-3">
                        <div className="flex text-amber-500 gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} className={`w-3.5 h-3.5 ${i < c.rating ? 'fill-current' : 'text-neutral-300 fill-current'}`} viewBox="0 0 24 24">
                              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                            </svg>
                          ))}
                        </div>
                        <span className="text-sm font-bold text-neutral-900">{c.rating}</span>
                      </div>
                      
                      {/* Author */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-lg font-bold shrink-0 ${c.color}`}>
                          {c.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-sm text-neutral-900 flex items-center gap-1.5">
                            {c.name} – {locale === 'tr' ? c.countryTr : c.countryEn}
                            <img src={`https://flagcdn.com/w20/${c.countryCode}.png`} alt={c.countryCode} className="w-4 h-auto rounded-[2px] shadow-sm inline-block" />
                          </div>
                          <div className="text-xs text-neutral-500 mt-0.5">{locale === 'tr' ? c.dateTr : c.dateEn} – {t('verifiedBooking') || 'Verified booking'}</div>
                        </div>
                      </div>
                      
                      {/* Text */}
                      <p className="text-sm text-neutral-800 leading-relaxed mb-4 font-medium">
                        {translatedComments[c.id] ? ((c.translations as Record<string, string>)[locale] || (c.translations as Record<string, string>)['en'] || c.originalText) : c.originalText}
                      </p>
                      
                      {/* Footer Actions */}
                      <div className="flex items-center justify-between text-xs font-semibold text-neutral-600">
                        <button className="flex items-center gap-1.5 hover:text-neutral-900 transition-colors">
                          {t('helpful') || 'Helpful?'} 
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"/></svg>
                        </button>
                        <button onClick={() => toggleTranslation(c.id)} className="underline hover:text-neutral-900 transition-colors">
                          {translatedComments[c.id] 
                            ? (t('showOriginal') || 'Show original') 
                            : (t('translate') || 'Translate')}
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {!showAllComments && (
                <button 
                  onClick={() => setShowAllComments(true)}
                  className="mt-6 w-full md:w-auto px-6 py-2.5 text-sm font-bold text-neutral-900 hover:bg-neutral-100 rounded-full transition-colors border border-neutral-900"
                >
                  {t('showMoreReviews') || 'Show more reviews'}
                </button>
              )}
            </motion.div>
          </div>

          {/* Right column — Sticky Reservation Card */}
          <div className="lg:col-span-1 mt-8 lg:mt-0">
            <motion.div className="lg:sticky lg:top-24" initial="hidden" animate="visible" variants={fadeUp} custom={2}>
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-neutral-100 shadow-xl shadow-neutral-200/40">
                <div className="flex flex-col items-start gap-1 mb-1">
                  {tour.originalPrice && (
                    <span className="text-xl font-bold text-red-500 line-through decoration-1 decoration-red-400 whitespace-nowrap">
                      {formatPrice(tour.originalPrice)}
                    </span>
                  )}
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-ice-600 whitespace-nowrap">{formatPrice(tour.price)}</span>
                    <span className="text-neutral-400 text-sm whitespace-nowrap">{t('perPerson')}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-6 pb-5 border-b border-neutral-100">
                  <span className="text-amber-400">{starsStr}</span>
                  <span className="font-semibold text-neutral-700">{tour.rating}</span>
                  <span className="text-neutral-400 text-sm">({tour.reviewCount})</span>
                </div>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-500">{t('duration')}</span>
                    <span className="font-medium text-neutral-700">{duration}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-500">{t('startTime')}</span>
                    <span className="font-medium text-neutral-700">{tour.startTime}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-500">{t('meetingPoint')}</span>
                    <span className="font-medium text-neutral-700 text-right max-w-[180px] truncate">{meetingPoint}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-500">{t('languages')}</span>
                    <span className="font-medium text-neutral-700">{tour.languages.map(l => LANGUAGE_LABELS[l] || l).join(', ')}</span>
                  </div>
                </div>
                <motion.button whileHover={!isSoldOut && tour.isOpen ? { scale: 1.02 } : {}} whileTap={!isSoldOut && tour.isOpen ? { scale: 0.98 } : {}}
                  onClick={handleReserve} disabled={isSoldOut || !tour.isOpen}
                  className={`w-full py-3.5 font-bold rounded-xl text-base transition-colors min-h-[48px] ${isSoldOut || !tour.isOpen ? 'bg-neutral-300 text-neutral-500 cursor-not-allowed' : 'bg-ice-500 hover:bg-ice-600 text-white shadow-lg shadow-ice-500/20'}`}>
                  {isSoldOut ? `🚫 ${t('soldOut')}` : !tour.isOpen ? `🔴 ${t('closedSale')}` : t('reserve')}
                </motion.button>
                <p className="text-center text-xs text-neutral-400 mt-3">{t('freeCancel')}</p>
                <motion.a href="https://wa.me/902560000000" target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="mt-3 w-full py-3 border-2 border-green-500 text-green-600 font-semibold rounded-xl text-sm flex items-center justify-center gap-2 hover:bg-green-50 transition-colors min-h-[48px]">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                  {t('whatsapp')}
                </motion.a>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Related Tours */}
        {relatedTours.length > 0 && (
          <motion.div className="mt-16" initial="hidden" animate="visible" variants={fadeUp} custom={7}>
            <h2 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center gap-2">
              <span className="w-1 h-7 bg-ice-500 rounded-full" />
              🎯 {t('related')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedTours.map((rt, i) => (
                <TourCard key={rt.id} tour={rt} index={i} />
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Mobile sticky bottom bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-ice-100 px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <span className="text-xl font-bold text-ice-600">{formatPrice(tour.price)}</span>
            <span className="text-neutral-400 text-xs ml-1">{tcard('perPerson')}</span>
          </div>
          <motion.button whileTap={!isSoldOut && tour.isOpen ? { scale: 0.96 } : {}}
            onClick={handleReserve} disabled={isSoldOut || !tour.isOpen}
            className={`flex-1 max-w-[200px] py-3 font-bold rounded-xl text-sm transition-colors min-h-[48px] ${isSoldOut || !tour.isOpen ? 'bg-neutral-300 text-neutral-500' : 'bg-ice-500 hover:bg-ice-600 text-white'}`}>
            {isSoldOut ? t('soldOut') : !tour.isOpen ? t('closedSale') : t('reserve')}
          </motion.button>
        </div>
      </div>
    </main>
  );
}
