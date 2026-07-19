import { Link } from 'react-router-dom';
import {
  Instagram,
  Facebook,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
} from 'lucide-react';

// Pinterest & TikTok aren't in lucide; use simple inline SVGs
const PinterestIcon = ({ size = 18 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M12 2a10 10 0 0 0-3.6 19.3c-.1-.8-.2-2 0-2.9l1.2-5s-.3-.6-.3-1.5c0-1.4.8-2.4 1.8-2.4.9 0 1.3.6 1.3 1.4 0 .9-.5 2.2-.8 3.4-.2.9.5 1.7 1.4 1.7 1.7 0 2.9-2.2 2.9-4.7 0-1.9-1.3-3.4-3.7-3.4-2.7 0-4.4 2-4.4 4.3 0 .8.2 1.3.6 1.8.2.2.2.3.1.5l-.2.9c-.1.3-.3.4-.6.2-1.2-.5-1.8-1.9-1.8-3.4 0-2.5 2.1-5.5 6.4-5.5 3.4 0 5.6 2.5 5.6 5.1 0 3.5-2 6.1-4.9 6.1-1 0-1.9-.5-2.2-1.1l-.6 2.4c-.2.8-.7 1.7-1 2.3A10 10 0 1 0 12 2Z" />
  </svg>
);

const TikTokIcon = ({ size = 18 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M16.5 3c.3 2.1 1.5 3.6 3.5 3.9v2.6c-1.2.1-2.3-.2-3.5-.8v5.6c0 3.4-2.5 5.7-5.6 5.7-2.8 0-5-2.1-5-4.9 0-3 2.4-5.1 5.4-4.8v2.8c-.4-.1-.8-.2-1.2-.2-1.2 0-2.1.9-2.1 2.1 0 1.2.9 2 2.1 2 1.3 0 2.2-.9 2.2-2.5V3h2.7Z" />
  </svg>
);

const columns = [
  {
    title: 'Shop',
    links: ['New Arrivals', 'Best Sellers', 'Classic Heels', 'Wedding Heels', 'Limited Edition'],
  },
  {
    title: 'Collections',
    links: ['Luxury Collection', 'Party Edit', 'Office Essentials', 'Bridal Boutique', 'Gift Cards'],
  },
  {
    title: 'Customer Care',
    links: ['Returns', 'Shipping Info', 'Size Guide', 'FAQs', 'Track Order'],
  },
  {
    title: 'Company',
    links: ['About Us', 'Sustainability', 'Press', 'Careers', 'Privacy Policy'],
  },
];

const socials = [
  { Icon: Instagram, label: 'Instagram', href: 'https://instagram.com' },
  { Icon: Facebook, label: 'Facebook', href: 'https://facebook.com' },
  { Icon: PinterestIcon, label: 'Pinterest', href: 'https://pinterest.com' },
  { Icon: TikTokIcon, label: 'TikTok', href: 'https://tiktok.com' },
];

export default function Footer() {
  return (
    <footer className="bg-mint-dark text-white">
      {/* Top */}
      <div className="container-luxe py-16 sm:py-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Brand block */}
          <div className="lg:col-span-4">
            <Link to="/" className="font-heading text-2xl font-bold tracking-tight">
              ANISHEELS
              <span className="block text-[9px] font-medium uppercase tracking-[0.45em] text-gold">
                Collection
              </span>
            </Link>
            <p className="mt-5 max-w-sm font-body text-sm leading-relaxed text-white/70">
              Premium handcrafted heels designed for the woman who steps with
              intention. Born in Accra, worn across the world.
            </p>

            <div className="mt-6 space-y-3 font-body text-sm text-white/75">
              <a
                href="mailto:care@anisheels.com"
                className="flex items-center gap-3 transition-colors hover:text-gold"
              >
                <Mail size={16} strokeWidth={1.7} /> care@anisheels.com
              </a>
              <a
                href="tel:+233200000000"
                className="flex items-center gap-3 transition-colors hover:text-gold"
              >
                <Phone size={16} strokeWidth={1.7} /> +233 20 000 0000
              </a>
              <p className="flex items-center gap-3">
                <MapPin size={16} strokeWidth={1.7} /> Osu, Accra — Ghana
              </p>
            </div>

            <div className="mt-6 flex gap-3">
              {socials.map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={label}
                  className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white transition-all hover:scale-110 hover:bg-gold hover:text-mint-dark"
                >
                  <Icon size={17} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-8">
            {columns.map((col) => (
              <div key={col.title}>
                <h4 className="font-btn text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">
                  {col.title}
                </h4>
                <ul className="mt-5 space-y-3">
                  {col.links.map((l) => (
                    <li key={l}>
                      <Link
                        to="/shop"
                        className="group inline-flex items-center gap-1 font-body text-sm text-white/70 transition-colors hover:text-white"
                      >
                        <span>{l}</span>
                        <ArrowRight
                          size={12}
                          className="opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="gold-divider" />

      {/* Bottom */}
      <div className="container-luxe flex flex-col items-center justify-between gap-4 py-6 sm:flex-row">
        <p className="font-body text-xs text-white/60">
          © {new Date().getFullYear()} ANISHEELS Collection. All rights reserved.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 font-body text-xs text-white/60">
          <Link to="/shop" className="transition-colors hover:text-gold">
            Privacy Policy
          </Link>
          <span className="text-white/30">·</span>
          <Link to="/shop" className="transition-colors hover:text-gold">
            Terms
          </Link>
          <span className="text-white/30">·</span>
          <Link to="/admin" className="transition-colors hover:text-gold">
            Admin
          </Link>
          <span className="text-white/30">·</span>
          <span>Designed with care in Accra</span>
        </div>
      </div>
    </footer>
  );
}
