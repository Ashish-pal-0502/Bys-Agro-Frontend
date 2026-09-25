import React from 'react';
import Link from 'next/link';
import { 
  Mail, 
  MapPin, 
  Phone, 
  Clock,
  MessageCircle,
  Send,
  Sparkles
} from 'lucide-react';

export const metadata = {
  title: "Contact Us – BYS Agro | Get in Touch",
  description: "Have questions about our products? Contact BYS Agro for inquiries about pulses, oils, spices, and dry fruits. We're here to help!",
   alternates: {
    canonical: "/contact-us",
  },
};

function ContactPage() {
  const contactInfo = [
    {
      icon: MapPin,
      title: "Visit Us",
      details: ["123 Farm Road", "New Delhi, India 110001"],
    },
    {
      icon: Phone,
      title: "Call Us",
      details: ["+91 98765 43210", "Mon-Sat, 9AM - 9PM"],
    },
    {
      icon: Mail,
      title: "Email Us",
      details: ["support@anaaj.com", "We reply within 24 hours"],
    },
    {
      icon: Clock,
      title: "Working Hours",
      details: ["Monday - Saturday", "9:00 AM - 9:00 PM"],
    },
  ];

  return (
    <div className="min-h-screen bg-[#faf4ea] font-serif">
      
      {/* =========================================
          HERO SECTION
      ========================================= */}
      
      <section className="bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-5">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-[#faf4ea] px-4 py-2 rounded-full mb-6">
              <Sparkles size={16} className="text-[#c1552c]" />
              <span className="text-xs font-medium text-[#5a4a3a]">Get in Touch</span>
            </div>
            
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#2b1b12]">
              We'd Love to <span className="text-[#c1552c] italic">Hear</span> From You
            </h1>
            
            <p className="mt-4 text-[#5a4a3a] text-base sm:text-lg leading-relaxed">
              Have questions about our products, orders, or partnerships? 
              Reach out to us — we're here to help!
            </p>
          </div>
        </div>
      </section>

      {/* =========================================
          CONTACT INFO CARDS
      ========================================= */}
      
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-[#e6ded2]"
              >
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[#faf4ea] flex items-center justify-center">
                  <info.icon size={24} className="text-[#c1552c]" />
                </div>
                <h3 className="text-lg font-semibold text-[#2b1b12]">
                  {info.title}
                </h3>
                {info.details.map((detail, i) => (
                  <p key={i} className="text-sm text-[#5a4a3a] mt-1">
                    {detail}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================
          CONTACT FORM & MAP
      ========================================= */}
      
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            
            {/* Contact Form */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-8 h-0.5 bg-[#c1552c]"></span>
                <span className="text-[#c1552c] text-sm font-semibold uppercase tracking-wider">
                  Send a Message
                </span>
              </div>
              <h2 className="font-serif text-3xl font-bold text-[#2b1b12]">
                Let's Start a <span className="text-[#c1552c] italic">Conversation</span>
              </h2>
              <p className="mt-2 text-[#5a4a3a]">
                Fill in the form below and we'll get back to you within 24 hours.
              </p>

              <form className="mt-8 space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-[#2b1b12] mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="Your full name"
                      className="w-full px-4 py-3 rounded-xl border border-[#e6ded2] bg-[#faf4ea] focus:outline-none focus:border-[#c1552c] focus:ring-2 focus:ring-[#c1552c]/30 transition-all text-[#2b1b12] placeholder:text-[#a0968c]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#2b1b12] mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="you@email.com"
                      className="w-full px-4 py-3 rounded-xl border border-[#e6ded2] bg-[#faf4ea] focus:outline-none focus:border-[#c1552c] focus:ring-2 focus:ring-[#c1552c]/30 transition-all text-[#2b1b12] placeholder:text-[#a0968c]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#2b1b12] mb-1.5">
                    Subject
                  </label>
                  <input
                    type="text"
                    placeholder="What's this about?"
                    className="w-full px-4 py-3 rounded-xl border border-[#e6ded2] bg-[#faf4ea] focus:outline-none focus:border-[#c1552c] focus:ring-2 focus:ring-[#c1552c]/30 transition-all text-[#2b1b12] placeholder:text-[#a0968c]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#2b1b12] mb-1.5">
                    Message
                  </label>
                  <textarea
                    rows="5"
                    placeholder="Tell us how we can help..."
                    className="w-full px-4 py-3 rounded-xl border border-[#e6ded2] bg-[#faf4ea] focus:outline-none focus:border-[#c1552c] focus:ring-2 focus:ring-[#c1552c]/30 transition-all text-[#2b1b12] placeholder:text-[#a0968c] resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="inline-flex  cursor-pointer items-center gap-2 bg-[#c1552c] text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-[#ad4825] transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg"
                >
                  Send Message
                  <Send size={18} />
                </button>
              </form>
            </div>

            {/* Map / Location */}
            <div className="lg:pl-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-8 h-0.5 bg-[#c1552c]"></span>
                <span className="text-[#c1552c] text-sm font-semibold uppercase tracking-wider">
                  Find Us
                </span>
              </div>
              <h2 className="font-serif text-3xl font-bold text-[#2b1b12]">
                Visit Our <span className="text-[#c1552c] italic">Location</span>
              </h2>
              <p className="mt-2 text-[#5a4a3a]">
                We'd love to meet you at our office. Come say hi!
              </p>

              <div className="mt-6 bg-[#faf4ea] rounded-2xl overflow-hidden border border-[#e6ded2] h-80 relative">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.3419385820617!2d77.2235509!3d28.6139391!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce2d1a8c07c43%3A0x6f5af3676e33f0c4!2sNew%20Delhi%2C%20Delhi!5e0!3m2!1sen!2sin!4v1700000000000"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0 w-full h-full"
                  title="BYS Agro Location"
                ></iframe>
              </div>

              <div className="mt-4 flex items-center gap-3 text-sm text-[#5a4a3a]">
                <MapPin size={18} className="text-[#c1552c] shrink-0" />
                <span>123 Farm Road, New Delhi, India 110001</span>
              </div>
            </div>
          </div>
        </div>
      </section>

  
    </div>
  );
}

export default ContactPage;