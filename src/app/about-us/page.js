import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Truck, 
  Leaf, 
  Award, 
  Users, 
  Heart,
  Star,
  Clock,
  BadgeCheck,
  Sparkles,
  ArrowRight,
  Quote
} from 'lucide-react';

export const metadata = {
  title: "About Us – BYS Agro | Premium Quality Pulses, Spices & Oils",
  description: "Learn about BYS Agro – bringing farm-fresh pulses, cold-pressed oils, authentic spices, and dry fruits directly from Indian farms to your kitchen.",
};

function AboutPage() {
  const stats = [
    { number: "10,000+", label: "Happy Families", icon: Users },
    { number: "50+", label: "Farm Partners", icon: Leaf },
    { number: "100%", label: "Natural Products", icon: ShieldCheck },
    { number: "4.8", label: "Average Rating", icon: Star },
  ];

  const values = [
    {
      icon: ShieldCheck,
      title: "100% Pure & Natural",
      description: "No additives, no preservatives. Just pure, natural staples from Indian farms.",
    },
    {
      icon: Truck,
      title: "Farm to Table",
      description: "Directly sourced from farms, delivered fresh to your doorstep within 24 hours.",
    },
    {
      icon: Leaf,
      title: "Lab-Tested Quality",
      description: "Every product rigorously tested for purity, quality, and safety standards.",
    },
    {
      icon: Award,
      title: "FSSAI Approved",
      description: "All products meet FSSAI standards for safety and quality assurance.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#faf4ea] font-serif">
      
      {/* =========================================
          HERO SECTION - New Design
      ========================================= */}
      
      <section className="relative bg-white overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#c1552c] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#c1552c] rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-5 relative">
          <div className="flex flex-col items-center text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-[#faf4ea] px-4 py-2 rounded-full mb-6">
              <Sparkles size={16} className="text-[#c1552c]" />
              <span className="text-xs font-medium text-[#5a4a3a]">Know Us Better</span>
            </div>

            {/* Main Heading */}
            <h1 className="font-serif text-4xl sm:text-5xl  font-bold text-[#2b1b12] leading-tight max-w-4xl">
              <span className="relative">
                <span className="relative z-10">We're on a mission</span>
                <span className="absolute -bottom-2 left-0 right-0 h-4 bg-[#c1552c]/20 rounded-full blur-sm"></span>
              </span>
              <br />
              <span className="text-[#c1552c] italic">to change</span>
              <br />
              <span>the way India eats</span>
            </h1>

            {/* Description */}
            <p className="mt-6 text-[#5a4a3a] text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              BYS Agro is your trusted source for premium quality pulses, cold-pressed oils, 
              authentic spices, and dry fruits — sourced directly from Indian farms and 
              delivered fresh to your kitchen.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Link
                href="/all-products"
                className="inline-flex items-center gap-2 bg-[#c1552c] text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-[#ad4825] transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg"
              >
                Browse Products
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/contact-us"
                className="inline-flex items-center gap-2 border-2 border-[#c1552c] text-[#c1552c] px-8 py-3.5 rounded-xl font-semibold hover:bg-[#c1552c] hover:text-white transition-all duration-300"
              >
                Talk to Us
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-6 mt-10 pt-10 border-t border-[#e6ded2]">
              <div className="flex items-center gap-2">
                <BadgeCheck size={18} className="text-[#c1552c]" />
                <span className="text-sm text-[#5a4a3a]">100% Natural</span>
              </div>
              <div className="flex items-center gap-2">
                <BadgeCheck size={18} className="text-[#c1552c]" />
                <span className="text-sm text-[#5a4a3a]">Lab Tested</span>
              </div>
              <div className="flex items-center gap-2">
                <BadgeCheck size={18} className="text-[#c1552c]" />
                <span className="text-sm text-[#5a4a3a]">FSSAI Approved</span>
              </div>
              <div className="flex items-center gap-2">
                <BadgeCheck size={18} className="text-[#c1552c]" />
                <span className="text-sm text-[#5a4a3a]">Pan-India Delivery</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================
          STATS SECTION
      ========================================= */}
      
      <section className="bg-white py-12 border-t border-[#e6ded2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#faf4ea] flex items-center justify-center">
                  <stat.icon size={24} className="text-[#c1552c]" />
                </div>
                <p className="text-2xl md:text-3xl font-bold text-[#2b1b12]">
                  {stat.number}
                </p>
                <p className="text-sm text-[#8a8179] mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================
          OUR VALUES
      ========================================= */}
      
      <section className="py-16 bg-[#faf4ea]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center mb-12">
            <p className="text-[#c1552c] text-sm font-semibold uppercase tracking-wider mb-2">
              What We Stand For
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#2b1b12]">
              Our Core Values
            </h2>
            <p className="text-[#5a4a3a] mt-2 max-w-2xl mx-auto">
              Every product we offer is a reflection of our commitment to quality, 
              purity, and trust.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-[#e6ded2] group"
              >
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[#faf4ea] flex items-center justify-center group-hover:bg-[#c1552c]/10 transition-colors">
                  <value.icon size={28} className="text-[#c1552c]" />
                </div>
                <h3 className="text-lg font-semibold text-[#2b1b12] mb-2">
                  {value.title}
                </h3>
                <p className="text-sm text-[#5a4a3a] leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================
          STORY SECTION
      ========================================= */}
      
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="relative h-80 rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src="https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&h=600&fit=crop"
                  alt="Fresh Indian pulses and grains"
                  fill
                  className="object-cover"
                />
              </div>
              {/* Quote Card */}
              <div className="absolute -bottom-6 -right-6 bg-[#2b1b12] rounded-2xl p-5 max-w-xs shadow-2xl">
                <Quote size={20} className="text-[#c1552c] mb-2" />
                <p className="text-white text-sm leading-relaxed">
                  "Quality isn't just a word to us — it's the only thing that matters."
                </p>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-8 h-0.5 bg-[#c1552c]"></span>
                <span className="text-[#c1552c] text-sm font-semibold uppercase tracking-wider">
                  Our Story
                </span>
              </div>
              <h2 className="font-serif text-3xl font-bold text-[#2b1b12]">
                From Indian Farms
                <br />
                <span className="text-[#c1552c] italic">To Your Kitchen</span>
              </h2>
              <p className="mt-4 text-[#5a4a3a] leading-relaxed">
                BYS Agro was born from a simple idea: to make premium quality 
                Indian staples accessible to every household. We work directly with 
                farmers across India to source the freshest pulses, cold-pressed oils, 
                authentic spices, and dry fruits.
              </p>
              <p className="mt-3 text-[#5a4a3a] leading-relaxed">
                Every product is lab-tested for purity and packed with care, ensuring 
                that what reaches your kitchen is nothing but the best.
              </p>
              <div className="flex items-center gap-4 mt-6">
                <div className="flex items-center gap-2 bg-[#faf4ea] px-4 py-2 rounded-lg">
                  <BadgeCheck className="text-[#c1552c]" size={18} />
                  <span className="text-sm text-[#2b1b12] font-medium">100% Natural</span>
                </div>
                <div className="flex items-center gap-2 bg-[#faf4ea] px-4 py-2 rounded-lg">
                  <BadgeCheck className="text-[#c1552c]" size={18} />
                  <span className="text-sm text-[#2b1b12] font-medium">FSSAI Approved</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================
          CTA SECTION
      ========================================= */}
      
      <section className="bg-[#2b1b12] py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 text-center">
          <Heart className="text-[#c1552c] mx-auto mb-4" size={40} />
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-white">
            Ready to Experience the <span className="text-[#c1552c] italic">Difference?</span>
          </h2>
          <p className="mt-4 text-gray-300 max-w-2xl mx-auto">
            Join thousands of families who trust BYS Agro for their daily staples. 
            Shop now and taste the quality!
          </p>
          <Link
            href="/all-products"
            className="inline-block mt-8 bg-[#c1552c] text-white px-10 py-4 rounded-xl font-semibold hover:bg-[#ad4825] transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Start Shopping
          </Link>
        </div>
      </section>
    </div>
  );
}

export default AboutPage;