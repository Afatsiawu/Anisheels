import { motion } from 'framer-motion';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Categories from '../components/Categories';
import FeaturedProducts from '../components/FeaturedProducts';
import PromoBanner from '../components/PromoBanner';
import BestSellers from '../components/BestSellers';
import NewArrivals from '../components/NewArrivals';
import WhyChooseUs from '../components/WhyChooseUs';
import Testimonials from '../components/Testimonials';
import InstagramGallery from '../components/InstagramGallery';
import Newsletter from '../components/Newsletter';

export default function Home() {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Hero />
      <Features />
      <Categories />
      <FeaturedProducts />
      <PromoBanner />
      <BestSellers />
      <NewArrivals />
      <WhyChooseUs />
      <Testimonials />
      <InstagramGallery />
      <Newsletter />
    </motion.main>
  );
}
