import React from 'react';
import Link from 'next/link';
import { Heart, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-primary-700 text-white pt-16 pb-8">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Column 1: About */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Heart className="w-6 h-6" />
              <h3 className="text-xl font-bold text-white">Calme</h3>
            </div>
            <p className="text-neutral-200 mb-4">
              Dedicated to improving mental health and wellbeing through accessible, quality care and resources for all.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-primary-300 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-white hover:text-primary-300 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-white hover:text-primary-300 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-white hover:text-primary-300 transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-neutral-200 hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/about" className="text-neutral-200 hover:text-white transition-colors">About Us</Link>
              </li>
              <li>
                <Link href="/programs" className="text-neutral-200 hover:text-white transition-colors">Programs</Link>
              </li>
              <li>
                <Link href="/resources" className="text-neutral-200 hover:text-white transition-colors">Resources</Link>
              </li>
              <li>
                <Link href="/news" className="text-neutral-200 hover:text-white transition-colors">News</Link>
              </li>
              <li>
                <Link href="/contact" className="text-neutral-200 hover:text-white transition-colors">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-white">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-neutral-200">123 Mental Health Ave, Wellness City, WC 10101</span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 mr-2 flex-shrink-0" />
                <a href="tel:+1234567890" className="text-neutral-200 hover:text-white transition-colors">
                  (123) 456-7890
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 mr-2 flex-shrink-0" />
                <a href="mailto:info@calme.org" className="text-neutral-200 hover:text-white transition-colors">
                  info@calme.org
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-white">Stay Updated</h4>
            <p className="text-neutral-200 mb-4">
              Subscribe to our newsletter to receive the latest news and updates.
            </p>
            <form className="space-y-2">
              <div>
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full px-4 py-2 rounded-md bg-primary-800 border border-primary-600 text-white placeholder-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-400"
                />
              </div>
              <button
                type="submit"
                className="w-full btn bg-white text-primary-700 hover:bg-neutral-100"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-primary-600 text-center text-neutral-300 text-sm">
          <p>&copy; {new Date().getFullYear()} Cal-me Mental Health. All rights reserved.</p>
          <div className="mt-2 space-x-4">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;