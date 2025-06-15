import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

const socialLinks = [
  { href: 'https://www.facebook.com/', icon: <Facebook size={24} />, label: 'Facebook' },
  { href: 'https://www.instagram.com/', icon: <Instagram size={24} />, label: 'Instagram' },
  { href: 'https://twitter.com/', icon: <Twitter size={24} />, label: 'Twitter' },
  { href: 'https://www.youtube.com/', icon: <Youtube size={24} />, label: 'Youtube' },
];

// Assuming footerLinks are defined elsewhere if not in the provided snippet
const footerLinks = {
  legal: [
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'Terms of Service', path: '/terms' },
    { name: 'Cookie Policy', path: '/cookies' },
  ],
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Column 1: Brand and Social Links */}
          <div>
            <Link to="/" className="text-2xl font-bold text-white mb-4 inline-block">
              Tanvel
            </Link>
            <p className="mt-4 text-gray-400 max-w-md">
              Discover amazing travel experiences and share your adventures with the world. Your journey begins here.
            </p>
            <div className="mt-6 flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="text-gray-400 hover:text-white transition"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Copyright and Legal Links */}
          <div className="flex flex-col items-start md:items-end md:text-right">
            <div className="mb-4">
                <h3 className="text-xl font-semibold text-white mb-4">Legal</h3>
                <ul className="space-y-2">
                    {footerLinks.legal.map((link, index) => (
                        <li key={index}>
                            <Link to={link.path} className="text-gray-400 hover:text-white text-sm transition">
                                {link.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
            <p className="text-gray-400 text-sm mt-auto md:mt-0">
              © {currentYear} TravelBlog. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
} 