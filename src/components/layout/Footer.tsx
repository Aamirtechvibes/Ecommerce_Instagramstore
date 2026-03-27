import { Instagram, Mail, Phone } from 'lucide-react';
import { FounderCredit } from './FounderCredit';

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-2xl font-light tracking-wider mb-4">Bin Hashim</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Premium bags and fashion accessories at affordable prices. Experience luxury without breaking the bank.
            </p>
          </div>

          <div>
            <h4 className="font-medium mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="/products" className="hover:text-white transition-colors">All Products</a>
              </li>
              <li>
                <a href="/products?filter=new" className="hover:text-white transition-colors">New Arrivals</a>
              </li>
              <li>
                <a href="/products?filter=premium" className="hover:text-white transition-colors">Premium Collection</a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-4">Connect With Us</h4>
            <div className="flex space-x-4 mb-4">
              <a
                href="https://www.instagram.com/bin_hashim_0555?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a
                href="mailto:info@binhashim.com"
                className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors"
              >
                <Mail size={20} />
              </a>
              <a
                href="tel:+919833470970"
                className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors"
              >
                <Phone size={20} />
              </a>
            </div>
            <p className="text-sm text-gray-400">
              Available on WhatsApp for instant support
            </p>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Aamir Khan. All rights reserved.</p>
        </div>

        <FounderCredit />
      </div>
    </footer>
  );
};
