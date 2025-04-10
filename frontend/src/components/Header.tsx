import React from 'react';
import Link from 'next/link';

const Header = () => {
  return (
    <header className="bg-white shadow-md py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-primary text-3xl font-bold">👕</span>
          <h1 className="text-xl font-bold">Fashion Discovery Assistant</h1>
        </Link>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-gray-700 hover:text-primary transition-colors">
            Home
          </Link>
          <Link href="/about" className="text-gray-700 hover:text-primary transition-colors">
            About
          </Link>
          <Link href="/trending" className="text-gray-700 hover:text-primary transition-colors">
            Trending
          </Link>
        </nav>
        
        <div className="flex items-center gap-4">
          <button className="btn btn-primary">
            Sign In
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;