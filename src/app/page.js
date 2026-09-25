import { Suspense } from "react";

import HeroBanner from "./../components/Home/HeroBanner";
import FeatureStrip from "./../components/Home/FeatureStrip";
import ShopByCategory from "./../components/Home/ShopByCategory";
import Bestsellers from "./../components/Home/Bestsellers";
import ResponsiveBanner from "./../components/Home/ResponsiveBanner";
import WhyChooseUs from "./../components/Home/WhyChooseUs";
import Testimonials from "./../components/Home/Testimonials";

const SERVER = process.env.NEXT_PUBLIC_SERVER;

const REVALIDATE = {
  next: {
    revalidate: 300,
  },
};

async function getCategories() {
  try {
    const res = await fetch(
      `${SERVER}/variation/category/get`,
      REVALIDATE
    );

    if (!res.ok) {
      throw new Error("Failed to fetch categories");
    }

    const data = await res.json();

    return data.categories || [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

async function getBestsellers() {
  try {
    const res = await fetch(
      `${SERVER}/product/get-products`,
      REVALIDATE
    );

    if (!res.ok) {
      throw new Error("Failed to fetch products");
    }

    const data = await res.json();

    return data.products || [];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

async function getTestimonials() {
  try {
    const res = await fetch(
      `${SERVER}/testimonial/get-active-testimonials`,
      REVALIDATE
    );

    if (!res.ok) {
      throw new Error("Failed to fetch testimonials");
    }

    const data = await res.json();

    return data.testimonials || [];
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return [];
  }
}

async function getBanner() {
  try {
    const res = await fetch(`${SERVER}/variation/banner/get`, REVALIDATE);
    if (!res.ok) throw new Error("Failed to fetch banner");
    const data = await res.json();
    return data.banners || data.banner || [];
  } catch (error) {
    console.error("Error fetching banner:", error);
    return [];
  }
}

async function ShopByCategorySection() {
  const categories = await getCategories();

  return <ShopByCategory categories={categories} />;
}

async function BestsellersSection() {
  const products = await getBestsellers();

  return <Bestsellers products={products} />;
}

async function TestimonialsSection() {
  const testimonials = await getTestimonials();

  return <Testimonials testimonials={testimonials} />;
}
  const bannerImages = await getBanner();

  
  const slides = bannerImages.map((b) => ({
    src: b.image || b.imageUrl || b.url,
    alt: b.alt || b.title || "Banner image",
  }));
  
  export default async function Home() {
  return (
    <>
      <HeroBanner images={slides} />

      <FeatureStrip />

      <Suspense fallback={null}>
        <ShopByCategorySection />
      </Suspense>

      <ResponsiveBanner
        desktopImg="/bannerImages/homeImage.jpg"
        mobileImg="/bannerImages/homeImageMobile.webp"
        desktopAlt="Premium Quality Products"
        mobileAlt="Premium Quality Products"
        title="Discover"
        highlight="Pure Quality"
        subtitle="Authentic pulses, oils, spices & dry fruits sourced from Indian farms"
        highlightColor="#c1552c"
        desktopHeight={400}
        mobileHeight={420}
      />

      <Suspense fallback={null}>
        <BestsellersSection />
      </Suspense>

      <Suspense fallback={null}>
        <TestimonialsSection />
      </Suspense>

      <WhyChooseUs />
    </>
  );
}