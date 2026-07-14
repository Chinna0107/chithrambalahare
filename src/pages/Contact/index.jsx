import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, Send } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('sending');
    
    // Construct mailto link
    const mailtoLink = `mailto:chitrambhalare1984@gmail.com?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`)}`;
    
    // Open email client
    window.location.href = mailtoLink;

    setTimeout(() => {
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setStatus(null), 3000);
    }, 500);
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="wrap pt-28 pb-12">
      <Helmet>
        <title>Contact Us | CHITRAMBHALARE</title>
        <meta name="description" content="Get in touch with the CHITRAMBHALARE team for tips, feedback, and advertising inquiries." />
      </Helmet>

      {/* Header */}
      <div className="text-center mb-16 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-poppins font-black text-gray-100 mb-4">
            Get in <span className="text-brand-red">Touch</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Have a news tip, feedback, or want to advertise with us? Drop us a message and our team will get back to you shortly.
          </p>
        </motion.div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
        
        {/* Contact Info */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full lg:w-1/3 flex flex-col gap-6"
        >
          <div className="glass-card rounded-3xl p-8 border border-brand-red/10 flex-grow">
            <h3 className="text-2xl font-poppins font-bold text-gray-100 mb-8">Contact Information</h3>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-brand-red/10 p-3 rounded-full mr-4 shrink-0">
                  <Mail className="w-6 h-6 text-brand-red" />
                </div>
                <div>
                  <h4 className="text-gray-200 font-semibold mb-1">Email Us</h4>
                  <a href="mailto:chitrambhalare1984@gmail.com" className="text-gray-400 hover:text-brand-red transition-colors text-sm">
                    chitrambhalare1984@gmail.com
                  </a>
                  <br />
                  {/* <a href="mailto:press@chitrambhalare.in" className="text-gray-400 hover:text-brand-red transition-colors text-sm">
                    press@chitrambhalare.in
                  </a> */}
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-brand-red/10 p-3 rounded-full mr-4 shrink-0">
                  <MapPin className="w-6 h-6 text-brand-red" />
                </div>
                <div>
                  <h4 className="text-gray-200 font-semibold mb-1">Office Location</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Film Nagar, Jubilee Hills<br />
                    Hyderabad, Telangana 500033<br />
                    India
                  </p>
                </div>
              </div>

              {/* <div className="flex items-start">
                <div className="bg-brand-red/10 p-3 rounded-full mr-4 shrink-0">
                  <Phone className="w-6 h-6 text-brand-red" />
                </div>
                <div>
                  <h4 className="text-gray-200 font-semibold mb-1">Call Us</h4>
                  <a href="tel:+919876543210" className="text-gray-400 hover:text-brand-red transition-colors text-sm">
                    +91 98765 43210
                  </a>
                </div>
              </div> */}
            </div>
            
            <hr className="border-white/10 my-8" />
            
            <div>
              <h4 className="text-gray-200 font-semibold mb-4">Follow Us</h4>
              <div className="flex gap-4">
                <a href="https://www.facebook.com/chitrambhalarenews/" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-brand-red hover:text-white transition-all">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="https://x.com/chitrambhalareI" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-brand-red hover:text-white transition-all">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                </a>
                <a href="https://www.instagram.com/chitrambhalare/" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-brand-red hover:text-white transition-all">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                </a>
                {/* <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-brand-red hover:text-white transition-all">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.015 3.015 0 00-2.122 2.136C0 8.07 0 12 0 12s0 3.93.498 5.814a3.016 3.016 0 002.122 2.136c1.871.55 9.377.55 9.377.55s7.505 0 9.377-.55a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </a> */}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="w-full lg:w-2/3"
        >
          <div className="glass-card rounded-3xl p-8 md:p-12 border border-brand-red/10 h-full">
            <h3 className="text-2xl font-poppins font-bold text-gray-100 mb-2">Send us a Message</h3>
            <p className="text-gray-400 mb-8 text-sm">Fill out the form below and we'll get back to you as soon as possible.</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Your Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-brand-dark/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-red/50 focus:border-transparent transition-all"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Your Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-brand-dark/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-red/50 focus:border-transparent transition-all"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full bg-brand-dark/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-red/50 focus:border-transparent transition-all"
                  placeholder="How can we help you?"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full bg-brand-dark/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-red/50 focus:border-transparent transition-all resize-none"
                  placeholder="Your message here..."
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full md:w-auto bg-brand-red text-white font-bold px-8 py-4 rounded-xl flex items-center justify-center hover:bg-red-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(212,43,43,0.3)] hover:shadow-[0_0_25px_rgba(212,43,43,0.6)]"
              >
                {status === 'sending' ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </span>
                ) : status === 'success' ? (
                  <span className="flex items-center text-green-300">
                    Message Sent Successfully!
                  </span>
                ) : (
                  <span className="flex items-center">
                    Send Message <Send className="ml-2 w-4 h-4" />
                  </span>
                )}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
