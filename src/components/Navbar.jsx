import React from 'react';
import { NavLink } from 'react-router-dom';
import { MapPin, Package, Settings, Home, Plane } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="glass sticky top-0 z-50 border-b border-border py-4">
      <div className="container flex justify-between items-center">
        <NavLink to="/" className="flex items-center gap-2 text-2xl font-bold text-primary">
          <Plane className="w-8 h-8" />
          <span>TravelSaaS</span>
        </NavLink>
        
        <div className="flex gap-8 items-center">
          <NavLink to="/" className={({isActive}) => `flex items-center gap-2 font-medium ${isActive ? 'text-primary' : 'text-text-muted hover:text-text-main'}`}>
            <Home size={18} />
            Dashboard
          </NavLink>
          <NavLink to="/create" className={({isActive}) => `flex items-center gap-2 font-medium ${isActive ? 'text-primary' : 'text-text-muted hover:text-text-main'}`}>
            <Package size={18} />
            Create Package
          </NavLink>
          <div className="h-6 w-[1px] bg-border mx-2"></div>
          <NavLink to="/master-data" className={({isActive}) => `flex items-center gap-2 font-medium ${isActive ? 'text-primary' : 'text-text-muted hover:text-text-main'}`}>
            <MapPin size={18} />
            Master Data
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;