import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import { Quote, Star } from 'lucide-react';
import { testimonials } from '../data/store';
import 'swiper/css';
import 'swiper/css/pagination';

export default function Testimonials() {
  return (
    <section className="relative overflow-hidden bg-mint-light py-20 sm:py-28">
      <div className="pointer-events-none absolute left-0 top-0 h-72 w-72 rounded-full bg-white/40 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-mint/30 blur-3xl" />

      <div className="container-luxe relative">
        <div className="mb-14 flex flex-col items-center text-center">
          <motion.p
            className="eyebrow mb-3"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Words From Our Community
          </motion.p>
          <motion.h2
            className="font-heading text-4xl font-bold text-ink sm:text-5xl"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
          >
            Customer <span className="italic text-gradient-gold">Love</span>
          </motion.h2>
          <div className="gold-divider mt-6 w-40" />
        </div>

        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={28}
          slidesPerView={1}
          pagination={{ clickable: true }}
          autoplay={{ delay: 4200, disableOnInteraction: false }}
          loop
          breakpoints={{
            768: { slidesPerView: 2 },
            1100: { slidesPerView: 3 },
          }}
          className="!pb-16"
        >
          {testimonials.map((t) => (
            <SwiperSlide key={t.id} className="h-auto">
              <motion.figure
                className="flex h-full flex-col gap-5 rounded-4xl bg-white p-8 shadow-luxe-sm"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <Quote size={32} className="text-gold" strokeWidth={1.5} />
                <blockquote className="flex-1 font-body text-[15px] leading-relaxed text-ink/75">
                  "{t.text}"
                </blockquote>

                <div className="flex items-center gap-1">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star
                      key={i}
                      size={15}
                      className="fill-gold text-gold"
                      strokeWidth={1.5}
                    />
                  ))}
                </div>

                <figcaption className="flex items-center gap-4 border-t border-mint/20 pt-5">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    loading="lazy"
                    className="h-12 w-12 rounded-full object-cover ring-2 ring-gold/40"
                  />
                  <div>
                    <p className="font-heading text-base font-semibold text-ink">
                      {t.name}
                    </p>
                    <p className="font-body text-xs text-ink/55">
                      {t.location}
                    </p>
                  </div>
                </figcaption>
              </motion.figure>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
