
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
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-banking-darkBg/80 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-8">
            <Link to="/dashboard" className="flex items-center group">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 h-10 w-10 rounded-lg flex items-center justify-center mr-3 shadow-lg group-hover:shadow-xl transition-shadow">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  Portfolio Manager
                </span>
                <div className="text-xs text-muted-foreground">Investment Tracking</div>
              </div>
            </Link>

            <div className="hidden md:flex items-center gap-2">
              <Link to="/dashboard">
                <Button 
                  variant={isActive('/dashboard') ? 'secondary' : 'ghost'} 
                  size="sm"
                  className={isActive('/dashboard') ? 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20' : ''}
                >
                  Dashboard
                </Button>
              </Link>
              <Link to="/mutual-fund">
                <Button variant={isActive('/mutual-fund') ? 'secondary' : 'ghost'} size="sm">
                  Mutual Funds
                </Button>
              </Link>
              <Link to="/reit">
                <Button variant={isActive('/reit') ? 'secondary' : 'ghost'} size="sm">
                  REITs
                </Button>
              </Link>
              <Link to="/tax-details">
                <Button variant={isActive('/tax-details') ? 'secondary' : 'ghost'} size="sm">
                  Tax Details
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {searchOpen ? (
              <div className="relative animate-in fade-in slide-in-from-right">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search investments..."
                  className="w-64 pl-9"
                  autoFocus
                  onBlur={() => setSearchOpen(false)}
                />
              </div>
            ) : (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setSearchOpen(true)}
                className="hover:bg-white/5"
              >
                <Search className="h-4 w-4" />
              </Button>
            )}

            <Button 
              variant="ghost" 
              size="sm"
              className="relative hover:bg-white/5"
            >
              <Bell className="h-4 w-4" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-xs">
                3
              </Badge>
            </Button>
            
            <div className="relative">
              <Button 
                variant="outline" 
                onClick={() => setIsProfileOpen(!isProfileOpen)} 
                className="border-white/10 bg-transparent hover:bg-white/5"
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

