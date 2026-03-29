import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaPinterestP,
  FaWhatsapp,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-linear-to-br from-[#0f172a] to-[#1e293b] text-gray-300 pt-14 pb-6 shadow-inner">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-6 md:gap-12">
        {/* Logo + Info */}
        <div>
          <div className="flex items-center gap-2 mb-5">
            <div className="bg-red-500 p-2 rounded-lg shadow-md">
              <span className="text-white font-bold text-xl">✒</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Blog<span className="text-red-500">.</span>
            </h2>
          </div>

          <p className="text-sm leading-relaxed text-gray-400 mb-5">
            Sharing insights, tutorials, and ideas on web development and tech.
          </p>

          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <FaMapMarkerAlt className="text-red-400 mt-0.5 shrink-0" />
              <span>XU-3, Greater Noida, UP-201310</span>
            </div>
            <div className="flex items-center gap-3">
              <FaEnvelope className="text-red-400 shrink-0" />
              <a
                href="mailto:sandyyadav7613@gmail.com"
                className="hover:text-white transition-colors duration-200"
              >
                sandyyadav7613@gmail.com
              </a>
            </div>
            <div className="flex items-center gap-3">
              <FaPhoneAlt className="text-red-400 shrink-0" />
              <a
                href="tel:+917503667613"
                className="hover:text-white transition-colors duration-200"
              >
                (750) 366-7613
              </a>
            </div>
            <div className="flex items-center gap-3">
              <FaWhatsapp className="text-green-400 shrink-0" />
              <a
                href="https://wa.me/917503667613?text=Hello%20Sandeep"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors duration-200"
              >
                WhatsApp: (750) 366-7613
              </a>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-semibold text-lg mb-5 border-l-4 border-red-500 pl-3">
            Quick Links
          </h3>
          <ul className="space-y-3 text-sm">
            <li>
              <Link
                href="/"
                className="hover:text-red-400 transition-colors duration-200 flex items-center gap-2"
              >
                <span className="text-red-400">›</span> Home
              </Link>
            </li>
            <li>
              <Link
                href="/blogs"
                className="hover:text-red-400 transition-colors duration-200 flex items-center gap-2"
              >
                <span className="text-red-400">›</span> Blogs
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="hover:text-red-400 transition-colors duration-200 flex items-center gap-2"
              >
                <span className="text-red-400">›</span> About Us
              </Link>
            </li>
            <li>
              <Link
                href="/faqs"
                className="hover:text-red-400 transition-colors duration-200 flex items-center gap-2"
              >
                <span className="text-red-400">›</span> FAQs
              </Link>
            </li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h3 className="text-white font-semibold text-lg mb-5 border-l-4 border-red-500 pl-3">
            Follow Us
          </h3>
          <div className="flex gap-4 mb-6">
            <a
              href="#"
              className="bg-[#2d3a4b] p-3 rounded-full hover:bg-red-500 hover:text-white transition-all duration-300 hover:scale-110"
              aria-label="Facebook"
            >
              <FaFacebookF className="w-4 h-4" />
            </a>
            <a
              href="#"
              className="bg-[#2d3a4b] p-3 rounded-full hover:bg-red-500 hover:text-white transition-all duration-300 hover:scale-110"
              aria-label="Instagram"
            >
              <FaInstagram className="w-4 h-4" />
            </a>
            <a
              href="#"
              className="bg-[#2d3a4b] p-3 rounded-full hover:bg-red-500 hover:text-white transition-all duration-300 hover:scale-110"
              aria-label="Twitter"
            >
              <FaTwitter className="w-4 h-4" />
            </a>
            <a
              href="#"
              className="bg-[#2d3a4b] p-3 rounded-full hover:bg-red-500 hover:text-white transition-all duration-300 hover:scale-110"
              aria-label="Pinterest"
            >
              <FaPinterestP className="w-4 h-4" />
            </a>
          </div>
          {/* Optional: Add a small tagline */}
          <p className="text-xs text-gray-500">
            Join our community for updates
          </p>
        </div>

        {/* Subscribe */}
        <div>
          <h3 className="text-white font-semibold text-lg mb-5 border-l-4 border-red-500 pl-3">
            Stay in the Loop
          </h3>
          <p className="text-sm text-gray-400 mb-4">
            Subscribe to get special offers, free giveaways, and more
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Your email address"
              className="w-full px-4 py-2 rounded-lg bg-[#2d3a4b] text-sm outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
            />
            <button className="bg-red-500 hover:bg-red-600 px-5 py-2 rounded-lg text-white text-sm font-medium transition-colors duration-200 shadow-md hover:shadow-lg">
              Subscribe
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            No spam, unsubscribe anytime.
          </p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 mt-12 pt-6 text-center text-sm text-gray-400">
        <p>
          © 2026 <span className="text-red-500 font-semibold">Blog</span>. All
          rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
