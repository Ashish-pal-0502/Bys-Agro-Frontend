
import Image from "next/image";

const features = [
  {
    number: "01",
    title: "Farm sourced",
    text: "Straight from trusted Indian farms.",
    image:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1200&auto=format&fit=crop",
  },
  {
    number: "02",
    title: "Quality tested",
    text: "Checked for purity before it reaches you.",
    image:
      "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=1200&auto=format&fit=crop",
  },
  {
    number: "03",
    title: "Packed fresh",
    text: "Carefully packed to preserve freshness.",
    image:
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=1200&auto=format&fit=crop",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-[#faf4ea] py-5">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">

        {/* Header */}
        <div className="max-w-2xl mb-5">
          <p className="text-[#c1552c] text-xs font-semibold uppercase tracking-[0.2em] mb-2 md:mb-4">
            Why Bys Agro
          </p>

                  <h2 className="font-serif text-2xl md:text-3xl font-semibold text-[#1D241D]">

            Good food starts
            <br />
            with good sourcing.
          </h2>

      
        </div>

        {/* Main Image */}
        <div className="relative h-80 md:h-120 rounded-[28px] overflow-hidden mb-5">
          <Image
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2000&auto=format&fit=crop"
            alt="Fresh produce sourced from Indian farms"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 1200px"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-black/45 via-black/5 to-transparent" />

          {/* Image Caption */}
          <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10">
            <p className="text-white text-xs uppercase tracking-[0.18em] font-medium mb-2">
              From farm to kitchen
            </p>

            <p className="text-white font-serif text-2xl md:text-3xl font-semibold">
              Sourced with care.
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 border-t border-[#dcd0c2]">

          {features.map((feature, index) => (
            <div
              key={feature.number}
              className={`
                group py-8 md:py-10
                ${index !== 0 ? "md:border-l border-[#dcd0c2] md:pl-8" : ""}
                ${index !== 2 ? "border-b md:border-b-0 border-[#dcd0c2]" : ""}
                ${index !== 0 ? "md:ml-8" : ""}
              `}
            >
              <div className="flex gap-5">

                {/* Number */}
                <span className="text-xs font-medium text-[#c1552c] pt-1">
                  {feature.number}
                </span>

                <div className="flex-1">

                  <h3 className="font-serif text-xl md:text-2xl font-semibold text-[#2b1b12]">
                    {feature.title}
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-[#6b5b4c] max-w-xs">
                    {feature.text}
                  </p>

                </div>
              </div>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}