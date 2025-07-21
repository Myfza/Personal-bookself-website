import React from 'react';
import { Github, Linkedin, Globe } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center space-y-4">
          {/* Main text */}
          <p className="text-gray-700 font-medium text-center">
            Made by Muhammad Yusuf Aditiya
          </p>
          
          {/* Social media links */}
          <div className="flex items-center space-x-6">
            <a
              href="https://github.com/myfza"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center w-10 h-10 bg-gray-100 hover:bg-gray-900 rounded-full transition-all duration-200"
              aria-label="GitHub Profile"
            >
              <Github className="h-5 w-5 text-gray-600 group-hover:text-white transition-colors" />
            </a>
            
            <a
              href="https://www.linkedin.com/in/myfza/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center w-10 h-10 bg-gray-100 hover:bg-blue-600 rounded-full transition-all duration-200"
              aria-label="LinkedIn Profile"
            >
              <Linkedin className="h-5 w-5 text-gray-600 group-hover:text-white transition-colors" />
            </a>
            
            <a
              href="https://vizdev.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center w-10 h-10 bg-gray-100 hover:bg-orange-600 rounded-full transition-all duration-200"
              aria-label="Personal Website"
            >
              <Globe className="h-5 w-5 text-gray-600 group-hover:text-white transition-colors" />
            </a>
          </div>
          
          {/* Copyright */}
          <p className="text-sm text-gray-500 text-center">
            © {new Date().getFullYear()} BookSelf. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;