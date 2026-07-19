import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import { useStoreProducts } from '../hooks/useStoreProducts';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

export default function BestSellers() {
  const { bestSellers, loading } = useStoreProducts();

  return (
    <section className="bg-mint-dark py-20 sm:py-28">
      <div className="container-luxe">
        <div className="mb-12 flex flex-col items-center text-center">
          <motion.p
            className="mb-3 font-btn text-xs uppercase tracking-[0.3em] text-gold"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Loved By Thousands
          </motion.p>
          <motion.h2
            className="font-heading text-4xl font-bold text-white sm:text-5xl"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
          >
            Best <span className="italic text-gradient-gold">Sellers</span>
          </motion.h2>
          <div className="gold-divider mt-6 w-40" />
          <p className="mt-5 max-w-xl font-body text-sm text-white/70">
            The pairs our community can't stop reaching for — restocked weekly
            and rarely on the shelf for long.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[4/5] animate-pulse rounded-3xl bg-white/10"
              />
            ))}
          </div>
        ) : (
          <Swiper
            modules={[Pagination, Navigation, Autoplay]}
            spaceBetween={24}
            slidesPerView={1.1}
            centeredSlides={false}
            pagination={{ clickable: true }}
            navigation
            autoplay={{ delay: 3500, disableOnInteraction: true }}
            loop
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 4 },
            }}
            className="!pb-16"
          >
            {bestSellers.map((p, i) => (
              <SwiperSlide key={p.id} className="h-auto">
                <ProductCard product={p} index={i} />
              </SwiperSlide>
            ))}
          </Swiper>
        )}

        <div className="mt-6 flex justify-center">
          <Link
            to="/shop?filter=best"
            className="group inline-flex items-center gap-2 rounded-full border border-white/30 px-8 py-4 font-btn text-xs font-semibold uppercase tracking-[0.18em] text-white transition-all hover:bg-white hover:text-mint-dark"
          >
            Shop All Best Sellers
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
