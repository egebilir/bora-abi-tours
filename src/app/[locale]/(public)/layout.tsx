import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AuthModal from '@/components/auth/AuthModal';
import WhatsAppFloat from '@/components/shared/WhatsAppFloat';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <AuthModal />
      <WhatsAppFloat />
    </>
  );
}
