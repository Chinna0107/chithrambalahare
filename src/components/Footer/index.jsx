import React from 'react';
import { Link } from 'react-router-dom';
import logoImg from '../../assets/cb1.png';

const Footer = () => {
  return (
    <footer className="mt-20 border-t border-brand-red/10 bg-brand-dark/95 backdrop-blur-md relative z-10">
      <div className="wrap py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8">
          
          {/* Brand Info */}
          <div className="flex flex-col">
            <Link to="/" className="logo mb-6" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <img src={logoImg} alt="CB Logo" style={{ height: '48px', width: 'auto' }} />
              <div>Chitram<span>Bhalare</span></div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 pr-4">
              Your ultimate destination for Tollywood news, reviews, box office updates, and exclusive celebrity interviews. Stay connected with the magic of Telugu cinema.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col">
            <h3 className="text-lg font-poppins font-bold text-gray-100 mb-6 flex items-center">
              <span className="w-2 h-2 rounded-full bg-brand-red mr-2"></span>
              Quick Links
            </h3>
            <div className="flex flex-col space-y-3">
              <Link to="/" className="text-gray-400 hover:text-brand-red transition-colors text-sm w-fit">Home</Link>
              <Link to="/movie-news" className="text-gray-400 hover:text-brand-red transition-colors text-sm w-fit">Movie News</Link>
              <Link to="/telugu-news" className="text-gray-400 hover:text-brand-red transition-colors text-sm w-fit">Telugu News</Link>
              <Link to="/reviews" className="text-gray-400 hover:text-brand-red transition-colors text-sm w-fit">Reviews</Link>
              <Link to="/box-office" className="text-gray-400 hover:text-brand-red transition-colors text-sm w-fit">Box Office</Link>
              <Link to="/galleries" className="text-gray-400 hover:text-brand-red transition-colors text-sm w-fit">Galleries</Link>
            </div>
          </div>

          {/* Company */}
          <div className="flex flex-col">
            <h3 className="text-lg font-poppins font-bold text-gray-100 mb-6 flex items-center">
              <span className="w-2 h-2 rounded-full bg-brand-red mr-2"></span>
              Company
            </h3>
            <div className="flex flex-col space-y-3">
              <Link to="/about" className="text-gray-400 hover:text-brand-red transition-colors text-sm w-fit">About Us</Link>
              <Link to="/advertise" className="text-gray-400 hover:text-brand-red transition-colors text-sm w-fit">Advertise</Link>
              <Link to="/policy" className="text-gray-400 hover:text-brand-red transition-colors text-sm w-fit">Privacy Policy</Link>
              <Link to="/contact" className="text-gray-400 hover:text-brand-red transition-colors text-sm w-fit">Contact Us</Link>
            </div>
          </div>

          {/* Social Media */}
          <div className="flex flex-col">
            <h3 className="text-lg font-poppins font-bold text-gray-100 mb-6 flex items-center">
              <span className="w-2 h-2 rounded-full bg-brand-red mr-2"></span>
              Follow Us On
            </h3>
            <div className="flex items-center space-x-4 mt-2">
              <a href="https://www.facebook.com/chitrambhalarenews/" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-brand-red hover:text-white transition-all">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="https://x.com/chitrambhalareI" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-brand-red hover:text-white transition-all">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
              </a>
              <a href="https://www.instagram.com/chitrambhalare/" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-brand-red hover:text-white transition-all">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>© {new Date().getFullYear()} ChitramBhalare. All rights reserved.</p>
          <p className="mt-2 md:mt-0">Made with ❤️ for Tollywood</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
