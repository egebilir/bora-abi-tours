import { Metadata } from 'next';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { routing } from '@/i18n/routing';
import { setRequestLocale } from 'next-intl/server';
import blogData from '@/data/mockBlogData.json';

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale !== 'tr';
  return {
    title: isEn ? 'Blog — Shore Excursion Tips & Travel Guides' : 'Blog — Kıyı Turu Rehberleri ve İpuçları',
    description: isEn
      ? 'Travel guides, tips, and insights for your Kuşadası shore excursion. Ephesus, Pamukkale, and more.'
      : 'Kuşadası kıyı turları için gezi rehberleri, ipuçları ve öneriler. Efes, Pamukkale ve daha fazlası.',
    alternates: {
      canonical: `https://weareshorex.com/${locale}/blog`,
      languages: Object.fromEntries(routing.locales.map(l => [l, `https://weareshorex.com/${l}/blog`])),
    },
  };
}

export default async function BlogPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isEn = locale !== 'tr';
  const posts = blogData.posts.filter(p => p.status === 'published');

  return (
    <main className="min-h-screen pt-20 lg:pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ice-50 text-ice-600 text-xs font-semibold tracking-wide uppercase mb-4 border border-ice-100">
            <span className="w-1.5 h-1.5 rounded-full bg-ice-500" />
            Blog
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-3">
            {isEn ? 'Travel Guides & Tips' : 'Gezi Rehberleri ve İpuçları'}
          </h1>
          <p className="text-neutral-500 max-w-xl mx-auto">
            {isEn ? 'Expert insights for your Kuşadası shore excursion experience.' : 'Kuşadası kıyı turu deneyiminiz için uzman önerileri.'}
          </p>
        </div>

        {/* Blog grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`}>
              <article className="group bg-white rounded-2xl overflow-hidden border border-neutral-100 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer">
                <div className="relative h-48 sm:h-56 overflow-hidden">
                  <Image src={post.coverImage} alt={isEn ? post.titleEn : post.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 640px) 100vw, 50vw" />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/90 text-neutral-700 backdrop-blur-sm">{post.category}</span>
                  </div>
                </div>
                <div className="p-5">
                  <time className="text-xs text-neutral-400 mb-2 block">{new Date(post.publishedAt).toLocaleDateString(isEn ? 'en-US' : 'tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</time>
                  <h2 className="text-lg font-bold text-neutral-900 mb-2 group-hover:text-ice-600 transition-colors line-clamp-2">{isEn ? post.titleEn : post.title}</h2>
                  <p className="text-sm text-neutral-500 line-clamp-2 leading-relaxed">{isEn ? post.excerptEn : post.excerpt}</p>
                  <div className="mt-4 flex items-center gap-2 text-ice-600 text-sm font-medium">
                    {isEn ? 'Read More' : 'Devamını Oku'}
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
