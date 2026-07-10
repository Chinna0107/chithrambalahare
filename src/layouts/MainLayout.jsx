import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';
import FlashNews from '../components/FlashNews';
import PopupAdModal from '../components/PopupAdModal';

const MainLayout = () => {
  const location = useLocation();

  useEffect(() => {
    let visitorId = localStorage.getItem('tolly_visitor_id');
    if (!visitorId) {
      // Use crypto.randomUUID if available, else fallback
      visitorId = window.crypto && window.crypto.randomUUID 
        ? window.crypto.randomUUID() 
        : Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('tolly_visitor_id', visitorId);
    }

    axios.post('/api/track-visit', {
      visitorId,
      path: location.pathname
    }).catch(err => console.warn('Visitor tracking disabled or failed', err));
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen bg-brand-light text-gray-100 font-inter">
      {location.pathname === '/' && <PopupAdModal />}
      <FlashNews />
      <ScrollToTop />
      <Header />
      <main className="flex-grow mt-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;


