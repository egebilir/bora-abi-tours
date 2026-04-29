import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { routing } from '@/i18n/routing';
import { setRequestLocale } from 'next-intl/server';
import blogData from '@/data/mockBlogData.json';
import { generateBreadcrumbJsonLd } from '@/lib/seo';

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    blogData.posts
      .filter(p => p.status === 'published')
      .map((post) => ({ locale, slug: post.slug }))
  );
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = blogData.posts.find(p => p.slug === slug);
  if (!post) return {};
  const isEn = locale !== 'tr';
  const title = isEn ? post.titleEn : post.title;

  return {
    title: `${title} | WeAreShorex`,
    description: isEn ? post.excerptEn : post.excerpt,
    keywords: post.tags,
    openGraph: {
      title,
      description: isEn ? post.excerptEn : post.excerpt,
      url: `https://weareshorex.com/${locale}/blog/${slug}`,
      images: [{ url: post.coverImage, width: 1200, height: 630 }],
      type: 'article',
      publishedTime: post.publishedAt,
      authors: [post.author],
    },
    alternates: {
      canonical: `https://weareshorex.com/${locale}/blog/${slug}`,
      languages: Object.fromEntries(routing.locales.map(l => [l, `https://weareshorex.com/${l}/blog/${slug}`])),
    },
  };
}

import React from 'react';

function renderMarkdown(md: string) {
  // Simple markdown renderer for blog content
  const lines = md.split('\n');
  const elements: React.JSX.Element[] = [];
  let i = 0;

  for (const line of lines) {
    i++;
    const trimmed = line.trim();
    if (!trimmed) { elements.push(<br key={i} />); continue; }
    if (trimmed.startsWith('## ')) {
      elements.push(<h2 key={i} className="text-xl sm:text-2xl font-bold text-neutral-900 mt-8 mb-4">{trimmed.slice(3)}</h2>);
    } else if (trimmed.startsWith('- ')) {
      elements.push(
        <li key={i} className="text-neutral-600 text-base leading-relaxed ml-4 list-disc">{trimmed.slice(2)}</li>
      );
    } else if (trimmed.match(/^\d+\.\s\*\*/)) {
      const match = trimmed.match(/^\d+\.\s\*\*(.+?)\*\*\s*—?\s*(.*)/);
      if (match) {
        elements.push(
          <div key={i} className="flex gap-3 items-start my-3">
            <span className="text-ice-600 font-bold text-lg shrink-0">{trimmed.match(/^\d+/)?.[0]}.</span>
            <div><span className="font-semibold text-neutral-900">{match[1]}</span>{match[2] && <span className="text-neutral-600"> — {match[2]}</span>}</div>
          </div>
        );
      }
    } else {
      elements.push(<p key={i} className="text-neutral-600 text-base leading-relaxed mb-3">{trimmed}</p>);
    }
  }
  return elements;
}

export default async function BlogDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const post = blogData.posts.find(p => p.slug === slug);
  if (!post || post.status !== 'published') notFound();

  const isEn = locale !== 'tr';
  const title = isEn ? post.titleEn : post.title;
  const content = isEn ? post.contentEn : post.content;
  const otherPosts = blogData.posts.filter(p => p.id !== post.id && p.status === 'published');

  const breadcrumbs = [
    { name: isEn ? 'Home' : 'Ana Sayfa', url: `https://weareshorex.com/${locale}` },
    { name: 'Blog', url: `https://weareshorex.com/${locale}/blog` },
    { name: title, url: `https://weareshorex.com/${locale}/blog/${slug}` },
  ];

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: isEn ? post.excerptEn : post.excerpt,
    image: `https://weareshorex.com${post.coverImage}`,
    author: { '@type': 'Organization', name: post.author },
    publisher: { '@type': 'Organization', name: 'WeAreShorex', url: 'https://weareshorex.com' },
    datePublished: post.publishedAt,
    mainEntityOfPage: `https://weareshorex.com/${locale}/blog/${slug}`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateBreadcrumbJsonLd(breadcrumbs)) }} />

      <main className="min-h-screen bg-white pt-20 lg:pt-24 pb-16">
        {/* Hero */}
        <div className="relative h-64 sm:h-80 lg:h-96">
          <Image src={post.coverImage} alt={title} fill className="object-cover" priority sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 max-w-4xl mx-auto">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-ice-500 text-white mb-3 inline-block">{post.category}</span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">{title}</h1>
            <div className="flex items-center gap-3 mt-3 text-white/70 text-sm">
              <span>{post.author}</span>
              <span>·</span>
              <time>{new Date(post.publishedAt).toLocaleDateString(isEn ? 'en-US' : 'tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</time>
            </div>
          </div>
        </div>

        {/* Content */}
        <article className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-neutral-400 mb-8">
            <Link href="/" className="hover:text-ice-500">{isEn ? 'Home' : 'Ana Sayfa'}</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-ice-500">Blog</Link>
            <span>/</span>
            <span className="text-neutral-600 truncate max-w-[200px]">{title}</span>
          </nav>

          <div className="prose-custom">
            {renderMarkdown(content)}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-10 pt-6 border-t border-neutral-100">
            {post.tags.map(tag => (
              <span key={tag} className="px-3 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-600">#{tag}</span>
            ))}
          </div>
        </article>

        {/* Related */}
        {otherPosts.length > 0 && (
          <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-16">
            <h2 className="text-xl font-bold text-neutral-900 mb-6">{isEn ? 'More Articles' : 'Diğer Yazılar'}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {otherPosts.map(p => (
                <Link key={p.id} href={`/blog/${p.slug}`}>
                  <div className="group flex gap-4 bg-neutral-50 rounded-xl p-4 hover:bg-ice-50 transition-colors">
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0">
                      <Image src={p.coverImage} alt={isEn ? p.titleEn : p.title} fill className="object-cover" sizes="80px" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-neutral-900 group-hover:text-ice-600 transition-colors line-clamp-2">{isEn ? p.titleEn : p.title}</h3>
                      <time className="text-xs text-neutral-400 mt-1 block">{new Date(p.publishedAt).toLocaleDateString(isEn ? 'en-US' : 'tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</time>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </>
  );
}
