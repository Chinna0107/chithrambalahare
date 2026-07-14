import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FaSearch, FaBars, FaFilm } from 'react-icons/fa';
import logoImg from '../../assets/cb1.png';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header>
      <div className="h-top">
        <Link to="/" className="logo" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img src={logoImg} alt="CB Logo" style={{ height: '48px', width: 'auto' }} />
          <div>Chitram<span>Bhalare</span></div>
        </Link>
        <div className="h-right">
          <button className="sbtn" onClick={() => navigate('/search')}><FaSearch /></button>
          <button className="ham" onClick={() => setIsMenuOpen(!isMenuOpen)}><FaBars /></button>
          <nav id="nav" className={`nav-drawer ${isMenuOpen ? 'open' : ''}`}>
            <NavLink 
              to="/main" 
              end 
              className={({ isActive }) => isActive ? 'act' : ''} 
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </NavLink>
            <NavLink 
              to="/movie-news" 
              end 
              className={({ isActive }) => isActive ? 'act' : ''} 
              onClick={() => setIsMenuOpen(false)}
            >
              Movie News
            </NavLink>
            <NavLink 
              to="/telugu-news" 
              end 
              className={({ isActive }) => isActive ? 'act' : ''} 
              onClick={() => setIsMenuOpen(false)}
            >
              Telugu News
            </NavLink>
            <NavLink 
              to="/box-office" 
              end 
              className={({ isActive }) => isActive ? 'act' : ''} 
              onClick={() => setIsMenuOpen(false)}
            >
              Box Office
            </NavLink>
            <NavLink 
              to="/reviews" 
              end 
              className={({ isActive }) => isActive ? 'act' : ''} 
              onClick={() => setIsMenuOpen(false)}
            >
              Reviews
            </NavLink>
            <NavLink 
              to="/galleries" 
              className={({ isActive }) => isActive ? 'act' : ''} 
              onClick={() => setIsMenuOpen(false)}
            >
              Galleries
            </NavLink>
            <NavLink 
              to="/movie-news/archive" 
              className={({ isActive }) => isActive ? 'act' : ''} 
              onClick={() => setIsMenuOpen(false)}
            >
              Archive
            </NavLink>
            <NavLink 
              to="/ott" 
              className={({ isActive }) => isActive ? 'act' : ''} 
              onClick={() => setIsMenuOpen(false)}
            >
              OTT
            </NavLink>

            <NavLink 
              to="/live-tracking" 
              className="nav-hot-m" 
              style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
              onClick={() => setIsMenuOpen(false)}
            >
              <FaFilm /> Live Tracking
            </NavLink>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
