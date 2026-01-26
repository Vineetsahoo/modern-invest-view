
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FileText, User, Bell, Search, TrendingUp, Menu } from 'lucide-react';
import { ProfileDropdown } from './ProfileDropdown';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export const Navbar: React.FC = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-slate-700/50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-8">
            <Link to="/dashboard" className="flex items-center group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 h-11 w-11 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-3">
                <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Portfolio Manager
                </span>
                <div className="text-xs text-gray-400">Investment Tracking</div>
              </div>
            </Link>

            <div className="hidden md:flex items-center gap-1.5">
              <Link to="/dashboard">
                <Button 
                  variant={isActive('/dashboard') ? 'secondary' : 'ghost'} 
                  size="sm"
                  className={isActive('/dashboard') 
                    ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 hover:from-blue-500/30 hover:to-purple-500/30 border border-blue-500/30' 
                    : 'hover:bg-white/5'
                  }
                >
                  Dashboard
                </Button>
              </Link>
              <Link to="/mutual-fund">
                <Button 
                  variant={isActive('/mutual-fund') ? 'secondary' : 'ghost'} 
                  size="sm"
                  className={isActive('/mutual-fund') 
                    ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 hover:from-blue-500/30 hover:to-purple-500/30 border border-blue-500/30' 
                    : 'hover:bg-white/5'
                  }
                >
                  Mutual Funds
                </Button>
              </Link>
              <Link to="/reit">
                <Button 
                  variant={isActive('/reit') ? 'secondary' : 'ghost'} 
                  size="sm"
                  className={isActive('/reit') 
                    ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 hover:from-blue-500/30 hover:to-purple-500/30 border border-blue-500/30' 
                    : 'hover:bg-white/5'
                  }
                >
                  REITs
                </Button>
              </Link>
              <Link to="/tax-details">
                <Button 
                  variant={isActive('/tax-details') ? 'secondary' : 'ghost'} 
                  size="sm"
                  className={isActive('/tax-details') 
                    ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 hover:from-blue-500/30 hover:to-purple-500/30 border border-blue-500/30' 
                    : 'hover:bg-white/5'
                  }
                >
                  Tax Details
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {searchOpen ? (
              <div className="relative animate-slideIn">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search investments..."
                  className="w-64 pl-9 glass-card border-slate-600/50 focus:border-blue-500/50"
                  autoFocus
                  onBlur={() => setSearchOpen(false)}
                />
              </div>
            ) : (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setSearchOpen(true)}
                className="hover:bg-white/5 hover:text-blue-400 transition-colors"
              >
                <Search className="h-4 w-4" />
              </Button>
            )}

            <div className="relative">
              <Button 
                variant="ghost" 
                size="sm"
                className="hover:bg-white/5 hover:text-blue-400 transition-colors"
              >
                <Bell className="h-4 w-4" />
              </Button>
              <div className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-xs font-bold text-white shadow-lg animate-glow">
                3
              </div>
            </div>
            
            <div className="relative">
              <Button 
                variant="outline" 
                onClick={() => setIsProfileOpen(!isProfileOpen)} 
                className="border-slate-600/50 bg-slate-800/30 hover:bg-slate-700/50 hover:border-blue-500/50 transition-all duration-300"
                size="sm"
              >
                <User className="h-4 w-4 mr-2" />
                <span>Profile</span>
              </Button>
              {isProfileOpen && <ProfileDropdown />}
            </div>

            <Button variant="ghost" size="sm" className="md:hidden hover:bg-white/5">
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

