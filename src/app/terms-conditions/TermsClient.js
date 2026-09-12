'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  FileText, 
  ShoppingBag, 
  CreditCard, 
  Truck, 
  ShieldCheck, 
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  Package,
  RefreshCw,
  Users,
  Scale
} from 'lucide-react';

function TermsPage() {
  const router = useRouter();

  const sections = [
    {
      icon: ShoppingBag,
      title: "Products & Orders",
      content: [
        "All products are subject to availability",
        "We reserve the right to limit quantities",
        "Product descriptions and images are for illustration purposes",
        "Prices are subject to change without notice",
      ],
    },
    {
      icon: CreditCard,
      title: "Pricing & Payment",
      content: [
        "All prices are in Indian Rupees (₹) and inclusive of GST",
        "We accept multiple payment methods including UPI, Cards, and Net Banking",
        "Payment must be completed before order processing",
        "Cash on Delivery (COD) is available for eligible orders",
      ],
    },
    {
      icon: Truck,
      title: "Shipping & Delivery",
      content: [
        "We deliver across India",
        "Delivery timelines may vary based on location",
        "Orders are processed within 24-48 hours",
        "Free delivery on orders above ₹499",
        "Tracking information will be shared once shipped",
      ],
    },
    {
      icon: RefreshCw,
      title: "Returns & Refunds",
      content: [
        "Returns accepted within 7 days of delivery",
        "Products must be unused and in original packaging",
        "Refunds will be processed within 5-7 business days",
        "Return shipping charges may apply",
        "Damaged or defective products are eligible for free replacement",
      ],
    },
    {
      icon: ShieldCheck,
      title: "Quality Guarantee",
      content: [
        "All products are lab-tested for purity",
        "FSSAI approved products",
        "100% natural with no additives",
        "If you're not satisfied, we'll make it right",
      ],
    },
    {
      icon: Users,
      title: "User Accounts",
      content: [
        "You are responsible for maintaining account confidentiality",
        "Provide accurate and complete information",
        "You must be 18 years or older to create an account",
        "We reserve the right to suspend accounts violating terms",
      ],
    },
    {
      icon: Scale,
      title: "Limitation of Liability",
      content: [
        "BYS Agro is not liable for indirect or consequential damages",
        "Our liability is limited to the value of the product purchased",
        "We are not responsible for delays caused by external factors",
        "Products are for personal use only",
      ],
    },
    {
      icon: AlertCircle,
      title: "Governing Law",
      content: [
        "These terms are governed by Indian law",
        "Disputes will be subject to jurisdiction in New Delhi, India",
        "Any legal action must be filed within one year of the claim",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#faf4ea]">
      
      {/* Header */}
      <section className="bg-white border-b border-[#e6ded2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-5">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-[#5a4a3a] hover:text-[#c1552c] transition-colors mb-4 cursor-pointer"
          >
            <ArrowLeft size={18} />
            <span className="text-sm">Back</span>
          </button>
          
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#c1552c]/10 flex items-center justify-center">
              <FileText size={24} className="text-[#c1552c]" />
            </div>
            <div>
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#2b1b12]">
                Terms & Conditions
              </h1>
              <p className="text-[#5a4a3a] mt-1">
                Last updated: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-8">
          {/* Introduction */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-[#e6ded2] mb-8">
            <p className="text-[#5a4a3a] leading-relaxed">
              Welcome to BYS Agro. By using our website and making a purchase, 
              you agree to comply with and be bound by the following terms and conditions. 
              Please read these terms carefully before placing any order.
            </p>
          </div>

          {/* Sections */}
          <div className="space-y-6">
            {sections.map((section, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-[#e6ded2] hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#faf4ea] flex items-center justify-center shrink-0 mt-1">
                    <section.icon size={20} className="text-[#c1552c]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-[#2b1b12]">
                      {section.title}
                    </h2>
                    <ul className="mt-3 space-y-2">
                      {section.content.map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-[#5a4a3a]">
                          <CheckCircle size={16} className="text-[#c1552c] shrink-0 mt-0.5" />
                          <span className="text-sm leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Acceptance Section */}
          <div className="mt-8 bg-[#2b1b12] rounded-2xl p-6 md:p-8 text-center">
            <Package className="text-[#c1552c] mx-auto mb-3" size={28} />
            <h3 className="text-white font-semibold text-lg">
              By Shopping With Us, You Accept These Terms
            </h3>
            <p className="text-gray-300 text-sm mt-2 max-w-lg mx-auto">
              We're committed to providing you with the best quality products 
              and service. If you have any questions, don't hesitate to reach out.
            </p>
            <button
              onClick={() => router.push('/contact-us')}
              className="mt-4 inline-block bg-[#c1552c] text-white px-6 py-2.5 rounded-xl font-medium hover:bg-[#ad4825] transition-all duration-300 hover:scale-105 cursor-pointer"
            >
              Contact Us
            </button>
          </div>

          {/* Disclaimer */}
          <div className="mt-6 text-center">
            <p className="text-xs text-[#8a8179]">
              BYS Agro reserves the right to update these terms at any time. 
              Changes will be posted on this page.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default TermsPage;