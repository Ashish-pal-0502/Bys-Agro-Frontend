'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  RefreshCw, 
  Wallet, 
  Clock, 
  ShieldCheck, 
  Truck, 
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  Calendar,
  CreditCard,
  PackageX,
  MessageCircle
} from 'lucide-react';

function RefundPolicyPage() {
  const router = useRouter();

  const sections = [
    {
      icon: Calendar,
      title: "Return Window",
      content: [
        "You can request a return within 7 days of delivery",
        "Products must be unused, unopened, and in original packaging",
        "Returns requested after 7 days will not be accepted",
        "The return window starts from the date of delivery",
      ],
    },
    {
      icon: PackageX,
      title: "Eligibility for Return",
      content: [
        "Damaged or defective products are eligible for return",
        "Wrong product delivered",
        "Expired or near-expiry products",
        "Products with tampered packaging",
        "Returns are not accepted for products used or opened",
      ],
    },
    {
      icon: Wallet,
      title: "Refund Process",
      content: [
        "Refunds are processed within 5-7 business days after return approval",
        "Refunds are issued to the original payment method",
        "You will receive a confirmation email once refund is initiated",
        "For COD orders, refunds will be processed via bank transfer",
      ],
    },
    {
      icon: Truck,
      title: "Return Shipping",
      content: [
        "For defective or incorrect products, return shipping is free",
        "For other returns, shipping charges may apply",
        "We will provide a return label for eligible returns",
        "Products must be packed securely to avoid damage during return",
      ],
    },
    {
      icon: Clock,
      title: "Refund Timeline",
      content: [
        "Return request approved: Within 24-48 hours",
        "Pickup arranged: Within 2-3 business days",
        "Product inspected: Within 2 business days of receiving",
        "Refund processed: Within 5-7 business days",
        "Total timeline: 7-14 business days",
      ],
    },
    {
      icon: ShieldCheck,
      title: "Quality Guarantee",
      content: [
        "We stand behind the quality of our products",
        "If you're not satisfied, we'll make it right",
        "Full refund or replacement offered for quality issues",
        "100% satisfaction guaranteed",
      ],
    },
  ];

  const refundSteps = [
    {
      step: "Step 1",
      title: "Request Return",
      description: "Contact us via email or phone with your order details",
    },
    {
      step: "Step 2",
      title: "Return Approval",
      description: "We'll review your request and approve within 24-48 hours",
    },
    {
      step: "Step 3",
      title: "Pickup Arranged",
      description: "We'll arrange pickup of the product from your address",
    },
    {
      step: "Step 4",
      title: "Quality Check",
      description: "Product is inspected upon arrival at our facility",
    },
    {
      step: "Step 5",
      title: "Refund Processed",
      description: "Refund is initiated within 5-7 business days",
    },
  ];

  return (
    <div className="min-h-screen bg-[#faf4ea] ">
      
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
              <RefreshCw size={24} className="text-[#c1552c]" />
            </div>
            <div>
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#2b1b12]">
                Refund & Returns Policy
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
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#faf4ea] flex items-center justify-center shrink-0">
                <AlertCircle size={20} className="text-[#c1552c]" />
              </div>
              <div>
                <p className="text-[#5a4a3a] leading-relaxed">
                  At BYS Agro, we want you to be completely satisfied with your purchase. 
                  If you're not happy with any product, we offer a hassle-free return and 
                  refund policy. Please review the details below.
                </p>
              </div>
            </div>
          </div>

          {/* Refund Steps */}
          <div className="mb-10">
            <h2 className="text-2xl font-semibold text-[#2b1b12] mb-6 flex items-center gap-3">
              <span className="w-1 h-8 bg-[#c1552c] rounded-full"></span>
              How Refunds Work
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {refundSteps.map((step, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-5 text-center shadow-sm border border-[#e6ded2] relative"
                >
                  {/* Connector Line */}
                  {index < refundSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-2 w-4 h-0.5 bg-[#c1552c]/30"></div>
                  )}
                  <div className="w-10 h-10 mx-auto rounded-full bg-[#c1552c]/10 flex items-center justify-center mb-3">
                    <span className="text-[#c1552c] font-bold text-sm">
                      {index + 1}
                    </span>
                  </div>
                  <p className="text-xs text-[#c1552c] font-semibold uppercase tracking-wider">
                    {step.step}
                  </p>
                  <h4 className="text-sm font-semibold text-[#2b1b12] mt-1">
                    {step.title}
                  </h4>
                  <p className="text-xs text-[#8a8179] mt-1 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Policy Sections */}
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

          {/* Quick Contact */}
          <div className="mt-8 bg-[#2b1b12] rounded-2xl p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <MessageCircle className="text-[#c1552c]" size={32} />
                <div>
                  <h3 className="text-white font-semibold text-lg">
                    Need Help with a Return?
                  </h3>
                  <p className="text-gray-300 text-sm">
                    We're here to assist you every step of the way
                  </p>
                </div>
              </div>
              <button
                onClick={() => router.push('/contact-us')}
                className="bg-[#c1552c] text-white px-6 py-2.5 rounded-xl font-medium hover:bg-[#ad4825] transition-all duration-300 hover:scale-105 cursor-pointer whitespace-nowrap"
              >
                Contact Support
              </button>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-6 text-center">
            <p className="text-xs text-[#8a8179]">
              BYS Agro reserves the right to update this policy at any time. 
              Changes will be posted on this page.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default RefundPolicyPage;