'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAdminStore } from '@/lib/admin-store';
import AdminShell from '@/components/admin/AdminShell';

const langTabs = [
  { key: 'tr', label: '🇹🇷 Türkçe' },
  { key: 'en', label: '🇬🇧 English' },
];

export default function AdminBlogEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { blogPosts, updateBlogPost } = useAdminStore();
  const post = blogPosts.find(p => p.id === id);

  const [activeTab, setActiveTab] = useState('tr');
  const [form, setForm] = useState({
    title: '', titleEn: '',
    excerpt: '', excerptEn: '',
    content: '', contentEn: '',
    coverImage: '',
    category: '',
    tags: '',
    seoTitle: '',
    seoDescription: '',
    canonicalUrl: '',
    status: 'draft' as 'draft' | 'published',
    slug: '',
  });

  useEffect(() => {
    if (post) {
      setForm({
        title: post.title, titleEn: post.titleEn,
        excerpt: post.excerpt, excerptEn: post.excerptEn,
        content: post.content, contentEn: post.contentEn,
        coverImage: post.coverImage,
        category: post.category,
        tags: post.tags.join(', '),
        seoTitle: post.seoTitle,
        seoDescription: post.seoDescription,
        canonicalUrl: post.canonicalUrl,
        status: post.status,
        slug: post.slug,
      });
    }
  }, [post]);

  if (!post) {
    return <AdminShell currentPath="/admin/blog"><p className="text-neutral-500">Yazı bulunamadı.</p></AdminShell>;
  }

  const handleSave = () => {
    updateBlogPost(id, {
      title: form.title, titleEn: form.titleEn,
      excerpt: form.excerpt, excerptEn: form.excerptEn,
      content: form.content, contentEn: form.contentEn,
      coverImage: form.coverImage,
      category: form.category,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      seoTitle: form.seoTitle,
      seoDescription: form.seoDescription,
      canonicalUrl: form.canonicalUrl,
      status: form.status,
      slug: form.slug,
    });
  };

  const fieldMap: Record<string, { title: string; excerpt: string; content: string }> = {
    tr: { title: 'title', excerpt: 'excerpt', content: 'content' },
    en: { title: 'titleEn', excerpt: 'excerptEn', content: 'contentEn' },
  };
  const f = fieldMap[activeTab];

  return (
    <AdminShell currentPath="/admin/blog">
      <div className="max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <button onClick={() => router.push('/admin/blog')} className="text-sm text-ice-600 hover:text-ice-700 mb-2 inline-flex items-center gap-1">← Blog</button>
            <h2 className="text-2xl font-bold text-neutral-900">{post.title}</h2>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setForm(prev => ({ ...prev, status: prev.status === 'published' ? 'draft' : 'published' }))}
              className={`px-4 py-2 text-sm font-medium rounded-lg min-h-[44px] ${form.status === 'published' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
              {form.status === 'published' ? '✓ Yayında' : '◻ Taslak'}
            </button>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleSave}
              className="px-6 py-2.5 bg-ice-500 hover:bg-ice-600 text-white font-semibold rounded-xl text-sm min-h-[44px]">
              Kaydet
            </motion.button>
          </div>
        </div>

        {/* Language Tabs */}
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
          <div className="flex border-b border-neutral-100">
            {langTabs.map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                className={`flex-1 py-3.5 text-sm font-medium transition-colors min-h-[48px] ${activeTab === tab.key ? 'text-ice-600 border-b-2 border-ice-500 bg-ice-50/50' : 'text-neutral-500 hover:text-neutral-700'}`}>
                {tab.label}
              </button>
            ))}
          </div>
          <div className="p-5 sm:p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Başlık</label>
              <input type="text" value={(form as Record<string, string>)[f.title]}
                onChange={e => setForm(prev => ({ ...prev, [f.title]: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm outline-none focus:ring-2 focus:ring-ice-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Özet</label>
              <textarea value={(form as Record<string, string>)[f.excerpt]}
                onChange={e => setForm(prev => ({ ...prev, [f.excerpt]: e.target.value }))}
                rows={2} className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm outline-none focus:ring-2 focus:ring-ice-500 resize-y" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">İçerik (Markdown)</label>
              <textarea value={(form as Record<string, string>)[f.content]}
                onChange={e => setForm(prev => ({ ...prev, [f.content]: e.target.value }))}
                rows={14} className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm outline-none focus:ring-2 focus:ring-ice-500 resize-y font-mono text-xs leading-relaxed" />
              <p className="text-xs text-neutral-400 mt-1">Markdown formatı desteklenir: ## Başlık, **kalın**, *italik*, - liste</p>
            </div>
          </div>
        </div>

        {/* Meta & SEO */}
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-5 sm:p-6 space-y-5">
          <h3 className="font-bold text-neutral-900 flex items-center gap-2">
            <span className="w-1 h-5 bg-ice-500 rounded-full" />
            SEO Ayarları
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Slug</label>
              <input type="text" value={form.slug} onChange={e => setForm(prev => ({ ...prev, slug: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm outline-none focus:ring-2 focus:ring-ice-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Kategori</label>
              <input type="text" value={form.category} onChange={e => setForm(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm outline-none focus:ring-2 focus:ring-ice-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">SEO Başlığı</label>
            <input type="text" value={form.seoTitle} onChange={e => setForm(prev => ({ ...prev, seoTitle: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm outline-none focus:ring-2 focus:ring-ice-500" />
            <p className="text-xs text-neutral-400 mt-1">{form.seoTitle.length}/60 karakter</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">SEO Açıklaması</label>
            <textarea value={form.seoDescription} onChange={e => setForm(prev => ({ ...prev, seoDescription: e.target.value }))}
              rows={2} className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm outline-none focus:ring-2 focus:ring-ice-500 resize-y" />
            <p className="text-xs text-neutral-400 mt-1">{form.seoDescription.length}/160 karakter</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">Canonical URL</label>
            <input type="text" value={form.canonicalUrl} onChange={e => setForm(prev => ({ ...prev, canonicalUrl: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm outline-none focus:ring-2 focus:ring-ice-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">Etiketler (virgülle ayırın)</label>
            <input type="text" value={form.tags} onChange={e => setForm(prev => ({ ...prev, tags: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm outline-none focus:ring-2 focus:ring-ice-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">Kapak Görseli URL</label>
            <input type="text" value={form.coverImage} onChange={e => setForm(prev => ({ ...prev, coverImage: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm outline-none focus:ring-2 focus:ring-ice-500" />
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
