import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Verileri sıfırla (Idempotent seed için)
  await prisma.booking.deleteMany();
  await prisma.tourDate.deleteMany();
  await prisma.tourTranslation.deleteMany();
  await prisma.tour.deleteMany();
  await prisma.user.deleteMany();

  // 1. Kullanıcıları Oluştur (Bcrypt ile şifreleri hash'le)
  const hashedAdminPassword = await bcrypt.hash('ShorexAdmin2026', 10);
  const hashedCustomerPassword = await bcrypt.hash('Customer123', 10);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@toursales.com',
      password: hashedAdminPassword,
      role: 'ADMIN',
    },
  });

  const customer = await prisma.user.create({
    data: {
      email: 'customer@test.com',
      password: hashedCustomerPassword,
      role: 'CUSTOMER',
    },
  });

  console.log('Users created:', admin.email, customer.email);

  // 2. Turları ve Çevirilerini Oluştur
  const efesTour = await prisma.tour.create({
    data: {
      category: 'CULTURAL',
      basePrice: 50.0,
      mainImage: '/images/tours/efes.jpg',
      isActive: true,
      translations: {
        create: [
          {
            locale: 'tr',
            title: 'Efes Antik Kenti Turu',
            slug: 'efes-antik-kenti-turu',
            description: 'Efes Antik Kenti ve Meryem Ana Evi tam gün rehberli turu.',
            seoTitle: 'Efes Antik Kenti Turu | En İyi Rehberli Tur',
            seoDescription: 'Kuşadası çıkışlı Efes Antik Kenti ve Meryem Ana Evi turu ile tarihi keşfedin.',
          },
          {
            locale: 'en',
            title: 'Ephesus Ancient City Tour',
            slug: 'ephesus-ancient-city-tour',
            description: 'Full day guided tour of Ephesus Ancient City and House of Virgin Mary.',
            seoTitle: 'Ephesus Ancient City Tour | Best Guided Tour',
            seoDescription: 'Discover history with Ephesus Ancient City and House of Virgin Mary tour from Kusadasi.',
          },
        ],
      },
    },
  });

  const boatTour = await prisma.tour.create({
    data: {
      category: 'BOAT',
      basePrice: 35.0,
      mainImage: '/images/tours/boat.jpg',
      isActive: true,
      translations: {
        create: [
          {
            locale: 'tr',
            title: 'Mavi Tur (Günlük Tekne Turu)',
            slug: 'mavi-tur',
            description: 'Ege denizinin eşsiz koylarında tam gün yüzme molalı ve öğle yemekli tekne turu.',
            seoTitle: 'Kuşadası Tekne Turu | Öğle Yemekli Mavi Tur',
            seoDescription: 'Kuşadası çıkışlı her gün hareketli, öğle yemekli ve bol yüzme molalı tekne turu.',
          },
          {
            locale: 'en',
            title: 'Blue Cruise (Daily Boat Trip)',
            slug: 'blue-cruise',
            description: 'Full day boat trip in the unique bays of the Aegean Sea with swimming breaks and lunch.',
            seoTitle: 'Kusadasi Boat Trip | Blue Cruise with Lunch',
            seoDescription: 'Daily departure boat trip from Kusadasi with lunch and plenty of swimming breaks.',
          },
        ],
      },
    },
  });

  console.log('Tours and translations created!');

  // 3. Önümüzdeki 30 gün için Tur Tarihlerini (TourDate) Oluştur
  const today = new Date();
  
  for (let i = 1; i <= 4; i++) {
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + (i * 7));

    await prisma.tourDate.create({
      data: {
        tourId: efesTour.id,
        date: futureDate,
        capacity: 45,
        remainingCapacity: 45,
      },
    });

    await prisma.tourDate.create({
      data: {
        tourId: boatTour.id,
        date: futureDate,
        capacity: 100,
        remainingCapacity: 100,
      },
    });
  }

  console.log('Tour dates created successfully!');
  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
