// import { Link } from 'react-router-dom';
// import AnchorLink from 'react-anchor-link-smooth-scroll';
import { Microscope } from 'lucide-react';


function Footer() {
  return (
    <>
    <footer className="bg-black text-white p-6">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Microscope className="h-6 w-6" />
                <span className="text-xl font-bold">ScienceLab</span>
              </div>
              <p className="text-gray-400">Making science education interactive and engaging.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#experiments" className="hover:text-white transition-colors">Experiments</a></li>
                <li><a href="#testimonials" className="hover:text-white transition-colors">Testimonials</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-400">
                <li>contact@sciencelab.com</li>
                <li>1-800-SCIENCE</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-2 pt-2 text-center text-gray-400 text-xs">
            <p>&copy; {new Date().getFullYear()} VizLearn. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;
