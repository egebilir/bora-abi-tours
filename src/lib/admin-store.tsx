'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Tour, Guide, Bus, Review, Booking, MockData } from '@/types';
import { BlogPost } from '@/types/blog';
import mockDataJson from '@/data/mockData.json';
import mockBlogJson from '@/data/mockBlogData.json';
import toast from 'react-hot-toast';

// =============================================
// Admin Store — Central state for CRUD operations
// Modular design: ready for API/DB replacement
// =============================================

interface AdminStoreContextType {
  // Data
  tours: Tour[];
  guides: Guide[];
  buses: Bus[];
  blogPosts: BlogPost[];
  bookings: Booking[];
  reviews: Review[];

  // Tour CRUD
  addTour: (tour: Tour) => void;
  updateTour: (id: string, data: Partial<Tour>) => void;
  deleteTour: (id: string) => void;

  // Guide CRUD
  addGuide: (guide: Guide) => void;
  updateGuide: (id: string, data: Partial<Guide>) => void;
  deleteGuide: (id: string) => void;

  // Bus CRUD
  addBus: (bus: Bus) => void;
  updateBus: (id: string, data: Partial<Bus>) => void;
  deleteBus: (id: string) => void;

  // Blog CRUD
  addBlogPost: (post: BlogPost) => void;
  updateBlogPost: (id: string, data: Partial<BlogPost>) => void;
  deleteBlogPost: (id: string) => void;

  // Bookings
  createBooking: (booking: Booking) => void;
  cancelBooking: (bookingId: string) => void;
  getAllBookings: () => Booking[];
  getManifesto: (tourId: string) => Booking[];
  getTourCapacity: (tourId: string) => { total: number; booked: number; available: number };
  addBooking: (tourId: string, count: number, language: string) => void;
  getOccupancy: (tourId: string) => number;
  getOccupancyByLanguage: (tourId: string) => Record<string, number>;

  // Reviews
  addReview: (review: Review) => void;
  getReviewsForTour: (tourId: string) => Review[];
  deleteReview: (reviewId: string) => void;

  // Stats
  totalRevenue: number;
  todayBookings: number;
  todayVisitors: number;
  averageOccupancy: number;
  monthlyRevenue: { month: string; revenue: number }[];
}

const AdminStoreContext = createContext<AdminStoreContextType | null>(null);

export function AdminStoreProvider({ children }: { children: ReactNode }) {
  const [tours, setTours] = useState<Tour[]>((mockDataJson as unknown as MockData).tours);
  const [guides, setGuides] = useState<Guide[]>((mockDataJson as unknown as MockData).guides);
  const [buses, setBuses] = useState<Bus[]>((mockDataJson as unknown as MockData).buses);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(mockBlogJson.posts as BlogPost[]);
  const [reviews, setReviews] = useState<Review[]>(
    (mockDataJson as unknown as { reviews: Review[] }).reviews || []
  );
  const [bookings, setBookings] = useState<Booking[]>([]);

  // Tour CRUD
  const addTour = useCallback((tour: Tour) => {
    setTours(prev => [...prev, tour]);
    toast.success('Tur başarıyla eklendi');
  }, []);

  const updateTour = useCallback((id: string, data: Partial<Tour>) => {
    setTours(prev => prev.map(t => t.id === id ? { ...t, ...data } : t));
    toast.success('Tur güncellendi');
  }, []);

  const deleteTour = useCallback((id: string) => {
    setTours(prev => prev.filter(t => t.id !== id));
    toast.success('Tur silindi');
  }, []);

  // Guide CRUD
  const addGuide = useCallback((guide: Guide) => {
    setGuides(prev => [...prev, guide]);
    toast.success('Rehber eklendi');
  }, []);

  const updateGuide = useCallback((id: string, data: Partial<Guide>) => {
    setGuides(prev => prev.map(g => g.id === id ? { ...g, ...data } : g));
    toast.success('Rehber güncellendi');
  }, []);

  const deleteGuide = useCallback((id: string) => {
    setGuides(prev => prev.filter(g => g.id !== id));
    toast.success('Rehber silindi');
  }, []);

  // Bus CRUD
  const addBus = useCallback((bus: Bus) => {
    setBuses(prev => [...prev, bus]);
    toast.success('Otobüs eklendi');
  }, []);

  const updateBus = useCallback((id: string, data: Partial<Bus>) => {
    setBuses(prev => prev.map(b => b.id === id ? { ...b, ...data } : b));
    toast.success('Otobüs güncellendi');
  }, []);

  const deleteBus = useCallback((id: string) => {
    setBuses(prev => prev.filter(b => b.id !== id));
    toast.success('Otobüs silindi');
  }, []);

  // Blog CRUD
  const addBlogPost = useCallback((post: BlogPost) => {
    setBlogPosts(prev => [...prev, post]);
    toast.success('Blog yazısı oluşturuldu');
  }, []);

  const updateBlogPost = useCallback((id: string, data: Partial<BlogPost>) => {
    setBlogPosts(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
    toast.success('Blog yazısı güncellendi');
  }, []);

  const deleteBlogPost = useCallback((id: string) => {
    setBlogPosts(prev => prev.filter(p => p.id !== id));
    toast.success('Blog yazısı silindi');
  }, []);

  // =============================================
  // BOOKING SYSTEM
  // =============================================

  const createBooking = useCallback((booking: Booking) => {
    setBookings(prev => [...prev, booking]);

    // Update tourBuses booked count
    setTours(prev => prev.map(t => {
      if (t.id !== booking.tourId) return t;
      const updatedBuses = t.tourBuses.map(tb => {
        if (tb.language === booking.language) {
          return { ...tb, booked: tb.booked + booking.count };
        }
        return tb;
      });
      return { ...t, tourBuses: updatedBuses };
    }));

    toast.success(`${booking.count} kişilik rezervasyon onaylandı!`);
  }, []);

  const cancelBooking = useCallback((bookingId: string) => {
    setBookings(prev => prev.map(b =>
      b.id === bookingId ? { ...b, status: 'cancelled' as const } : b
    ));
    toast.success('Rezervasyon iptal edildi');
  }, []);

  const getAllBookings = useCallback(() => {
    return bookings;
  }, [bookings]);

  const getManifesto = useCallback((tourId: string) => {
    return bookings.filter(b => b.tourId === tourId && b.status === 'confirmed');
  }, [bookings]);

  const getTourCapacity = useCallback((tourId: string) => {
    const tour = tours.find(t => t.id === tourId);
    if (!tour) return { total: 0, booked: 0, available: 0 };
    const total = tour.tourBuses.reduce((s, tb) => {
      const bus = buses.find(b => b.id === tb.busId);
      return s + (bus?.capacity || 0);
    }, 0);
    const booked = tour.tourBuses.reduce((s, tb) => s + tb.booked, 0);
    return { total, booked, available: Math.max(0, total - booked) };
  }, [tours, buses]);

  // Legacy addBooking (for admin quick-add)
  const addBooking = useCallback((tourId: string, count: number, language: string) => {
    const today = new Date().toISOString().split('T')[0];
    const booking: Booking = {
      id: `bk-${Date.now()}`,
      tourId,
      date: today,
      count,
      language,
      customerName: 'Admin Ekleme',
      customerEmail: '',
      customerPhone: '',
      status: 'confirmed',
      totalPrice: 0,
      createdAt: new Date().toISOString(),
    };
    createBooking(booking);
  }, [createBooking]);

  const getOccupancy = useCallback((tourId: string) => {
    const tour = tours.find(t => t.id === tourId);
    if (!tour) return 0;
    return tour.tourBuses.reduce((sum, tb) => sum + tb.booked, 0);
  }, [tours]);

  const getOccupancyByLanguage = useCallback((tourId: string): Record<string, number> => {
    const tour = tours.find(t => t.id === tourId);
    if (!tour) return {};
    const result: Record<string, number> = {};
    for (const tb of tour.tourBuses) {
      result[tb.language] = (result[tb.language] || 0) + tb.booked;
    }
    return result;
  }, [tours]);

  // Reviews
  const addReview = useCallback((review: Review) => {
    setReviews(prev => [...prev, review]);
    toast.success('Yorum eklendi');
  }, []);

  const getReviewsForTour = useCallback((tourId: string) => {
    return reviews.filter(r => r.tourId === tourId);
  }, [reviews]);

  const deleteReview = useCallback((reviewId: string) => {
    setReviews(prev => prev.filter(r => r.id !== reviewId));
    toast.success('Yorum silindi');
  }, []);

  // =============================================
  // STATS
  // =============================================

  const bookingRevenue = bookings
    .filter(b => b.status === 'confirmed')
    .reduce((sum, b) => sum + b.totalPrice, 0);

  const tourBusRevenue = tours.reduce((sum, tour) => {
    const occ = tour.tourBuses.reduce((s, tb) => s + tb.booked, 0);
    return sum + tour.price * occ;
  }, 0);

  const totalRevenue = Math.max(bookingRevenue, tourBusRevenue);

  const today = new Date().toISOString().split('T')[0];
  const todayBookings = bookings.filter(b => b.createdAt?.startsWith(today) && b.status === 'confirmed').length;
  const todayVisitors = 847;

  const totalCapacity = tours.reduce((sum, t) => {
    return sum + t.tourBuses.reduce((s, tb) => {
      const bus = buses.find(b => b.id === tb.busId);
      return s + (bus?.capacity || 0);
    }, 0);
  }, 0);
  const totalBooked = tours.reduce((sum, t) =>
    sum + t.tourBuses.reduce((s, tb) => s + tb.booked, 0), 0);
  const averageOccupancy = totalCapacity > 0
    ? Math.round((totalBooked / totalCapacity) * 100) : 0;

  const monthlyRevenue = [
    { month: 'Oca', revenue: 3200 },
    { month: 'Şub', revenue: 4100 },
    { month: 'Mar', revenue: 6800 },
    { month: 'Nis', revenue: 9200 },
    { month: 'May', revenue: 12450 },
    { month: 'Haz', revenue: 15800 },
  ];

  return (
    <AdminStoreContext.Provider value={{
      tours, guides, buses, blogPosts, bookings, reviews,
      addTour, updateTour, deleteTour,
      addGuide, updateGuide, deleteGuide,
      addBus, updateBus, deleteBus,
      addBlogPost, updateBlogPost, deleteBlogPost,
      createBooking, cancelBooking, getAllBookings, getManifesto, getTourCapacity,
      addBooking, getOccupancy, getOccupancyByLanguage,
      addReview, getReviewsForTour, deleteReview,
      totalRevenue, todayBookings, todayVisitors, averageOccupancy, monthlyRevenue,
    }}>
      {children}
    </AdminStoreContext.Provider>
  );
}

export function useAdminStore() {
  const ctx = useContext(AdminStoreContext);
  if (!ctx) throw new Error('useAdminStore must be used within AdminStoreProvider');
  return ctx;
}

/** Safe version — returns null when provider is absent (e.g. during SSG prerender) */
export function useAdminStoreSafe() {
  return useContext(AdminStoreContext);
}
