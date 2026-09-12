'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  ShieldCheck, 
  Eye, 
  Lock, 
  Server, 
  Users, 
  Mail,
  ArrowLeft,
  CheckCircle,
  Info
} from 'lucide-react';

function PrivacyPolicyPage() {
  const router = useRouter();

  const sections = [
    {
      icon: Info,
      title: "Information We Collect",
      content: [
        "Personal information you provide (name, email, phone number, address)",
        "Order history and purchase preferences",
        "Device and browser information",
        "Cookies and usage data",
      ],
    },
    {
      icon: Lock,
      title: "How We Use Your Information",
      content: [
        "Process and fulfill your orders",
        "Send order confirmations and updates",
        "Improve our products and services",
        "Send promotional offers (only with your consent)",
      ],
    },
    {
      icon: ShieldCheck,
      title: "Data Security",
      content: [
        "We use industry-standard encryption (SSL/TLS) for all data transmission",
        "Your payment information is processed securely through trusted payment gateways",
        "We never store your complete credit/debit card details",
        "Regular security audits and updates to protect your data",
      ],
    },
    {
      icon: Users,
      title: "Information Sharing",
      content: [
        "We do not sell your personal information to third parties",
        "We may share data with delivery partners for order fulfillment",
        "We may share data with payment processors for transaction processing",
        "We only share information required to provide our services",
      ],
    },
    {
      icon: Eye,
      title: "Your Rights",
      content: [
        "Access and update your personal information",
        "Request deletion of your data",
        "Opt-out of marketing communications",
        "Request a copy of your data",
      ],
    },
    {
      icon: Server,
      title: "Cookies & Tracking",
      content: [
        "We use cookies to enhance your shopping experience",
        "Essential cookies for site functionality",
        "Analytics cookies to improve our services",
        "You can manage cookie preferences in your browser settings",
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
              <ShieldCheck size={24} className="text-[#c1552c]" />
            </div>
            <div>
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#2b1b12]">
                Privacy Policy
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
              At BYS Agro, we take your privacy seriously. This Privacy Policy explains 
              how we collect, use, disclose, and safeguard your information when you visit 
              our website or make a purchase. Please read this policy carefully.
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

          {/* Contact Section */}
          <div className="mt-8 bg-[#2b1b12] rounded-2xl p-6 md:p-8 text-center">
            <Mail className="text-[#c1552c] mx-auto mb-3" size={28} />
            <h3 className="text-white font-semibold text-lg">
              Have Questions About Your Privacy?
            </h3>
            <p className="text-gray-300 text-sm mt-2 max-w-lg mx-auto">
              If you have any questions or concerns about our privacy policy, 
              feel free to reach out to us.
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
              BYS Agro reserves the right to update this privacy policy at any time. 
              Changes will be posted on this page.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default PrivacyPolicyPage;