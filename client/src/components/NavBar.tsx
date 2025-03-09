import React from 'react';
import { useWeb3 } from "../contexts/Web3Context";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ChevronDown, Menu, Sprout, LayoutDashboard, Package, History, User,UserPen } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const Navbar = () => {
  const { account, role, connectWallet, disconnectWallet } = useWeb3();
  const [isScrolled, setIsScrolled] = React.useState(false);
  const location = useLocation();

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleWalletConnection = async () => {
    try {
      if (account) {
        await disconnectWallet();
      } else {
        await connectWallet();
      }
    } catch (error) {
      console.error("Wallet connection error:", error);
    }
  };

  interface NavLinkProps {
    to: string;
    icon: React.ComponentType<{ className?: string }>;
    children: React.ReactNode;
  }

  const NavLink: React.FC<NavLinkProps> = ({ to, icon: Icon, children }) => {
    const isActive = location.pathname === to;
    return (
      <Link to={to}>
        <Button
          variant="ghost"
          className={`text-sm font-medium flex items-center gap-2 relative group ${
            isActive ? 'text-green-600' : 'text-gray-600 hover:text-green-600'
          }`}
        >
          <Icon className="w-4 h-4" />
          <span>{children}</span>
          {isActive && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-green-500 rounded-full" />
          )}
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-500 rounded-full transition-all duration-300 group-hover:w-full" />
        </Button>
      </Link>
    );
  };

  return (
    <nav className={`fixed w-full top-0 z-50 transition-all drop-shadow-md duration-300 ${
      isScrolled ? 'bg-white/80 backdrop-blur-md shadow-md' : 'bg-white'
    }`}>
      <div className="max-w-7xl mx-auto drop-shadow-md px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <Sprout className="h-6 w-6 text-green-600 transition-transform duration-300 group-hover:rotate-12" />
            <span className="text-2xl font-bold text-black bg-clip-text">
              AgriChains
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <NavLink to="/" icon={LayoutDashboard}>Dashboard</NavLink>
            <NavLink to="/products" icon={Package}>Products</NavLink>
            <NavLink to="/transactions" icon={History}>Transactions</NavLink>
            <NavLink to="/roles" icon={UserPen}>Roles</NavLink>
            <></>
          </div>

          {/* Wallet */}
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  className={`flex items-center gap-2 transition-all duration-300 ${
                    account ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100' : ''
                  }`}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className={account ? 'bg-green-100 text-green-700' : ''}>
                      {role ? role[0].toUpperCase() : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline">
                    {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : "Connect Wallet"}
                  </span>
                  <ChevronDown className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-bold text-gray-700">My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex items-center justify-between">
                  <span className="font-medium">Role</span>
                  <Badge variant="outline" className={`
                    ${role === 'admin' ? 'bg-purple-50 text-purple-700 border-purple-200' : ''}
                    ${role === 'farmer' ? 'bg-green-50 text-green-700 border-green-200' : ''}
                    ${role === 'distributor' ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}
                  `}>
                    {role || "Unknown"}
                  </Badge>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <Link to="/profile" className="flex-1">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleWalletConnection}
                  className={`cursor-pointer ${
                    account ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'
                  }`}
                >
                  {account ? "Disconnect Wallet" : "Connect Wallet"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col gap-4 mt-8">
                  <NavLink to="/" icon={LayoutDashboard}>Dashboard</NavLink>
                  <NavLink to="/products" icon={Package}>Products</NavLink>
                  <NavLink to="/transactions" icon={History}>Transactions</NavLink>
                  <NavLink to="/roles" icon={UserPen}>Roles</NavLink>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;