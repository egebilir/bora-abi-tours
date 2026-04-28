'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdminStore } from '@/lib/admin-store';
import AdminShell from '@/components/admin/AdminShell';

export default function AdminBlogPage() {
  const { blogPosts, deleteBlogPost, addBlogPost } = useAdminStore();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleNewPost = () => {
    const newId = `post-${Date.now()}`;
    addBlogPost({
      id: newId,
      slug: 'yeni-yazi',
      title: 'Yeni Blog Yazısı',
      titleEn: 'New Blog Post',
      excerpt: '',
      excerptEn: '',
      content: '',
      contentEn: '',
      coverImage: '',
      author: 'Bora Abi Tours',
      category: 'Genel',
      tags: [],
      seoTitle: '',
      seoDescription: '',
      canonicalUrl: '',
      publishedAt: new Date().toISOString().split('T')[0],
      status: 'draft',
    });
  };

  return (
    <AdminShell currentPath="/admin/blog">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900">Blog Yönetimi</h2>
            <p className="text-sm text-neutral-500 mt-1">{blogPosts.length} yazı</p>
          </div>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleNewPost}
            className="px-5 py-2.5 bg-ice-500 hover:bg-ice-600 text-white font-semibold rounded-xl text-sm min-h-[44px]">
            + Yeni Yazı
          </motion.button>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="bg-neutral-50 text-left">
                  {['Başlık', 'Kategori', 'Durum', 'Tarih', 'Aksiyonlar'].map(h => (
                    <th key={h} className="px-5 py-3 text-xs font-semibold text-neutral-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {blogPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-ice-50/30 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-medium text-neutral-900 text-sm">{post.title}</div>
                      <div className="text-xs text-neutral-400 mt-0.5">{post.slug}</div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-khaki-50 text-khaki-700 border border-khaki-200">
                        {post.category}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {post.status === 'published' ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">Yayında</span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">Taslak</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-sm text-neutral-500">{post.publishedAt}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Link href={`/admin/blog/${post.id}`}
                          className="px-3 py-1.5 text-xs font-medium text-ice-600 bg-ice-50 hover:bg-ice-100 rounded-lg transition-colors">
                          Düzenle
                        </Link>
                        <button onClick={() => setDeleteId(post.id)}
                          className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
                          Sil
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {deleteId && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setDeleteId(null)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl" onClick={e => e.stopPropagation()}>
              <h3 className="text-lg font-bold mb-2">Yazıyı Sil</h3>
              <p className="text-sm text-neutral-500 mb-6">Bu blog yazısını silmek istediğinize emin misiniz?</p>
              <div className="flex gap-3 justify-end">
                <button onClick={() => setDeleteId(null)} className="px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-100 rounded-lg min-h-[44px]">İptal</button>
                <button onClick={() => { deleteBlogPost(deleteId); setDeleteId(null); }} className="px-4 py-2 text-sm text-white bg-red-500 hover:bg-red-600 rounded-lg min-h-[44px]">Sil</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminShell>
  );
}
