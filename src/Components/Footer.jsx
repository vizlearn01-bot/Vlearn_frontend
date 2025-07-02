// import { Link } from "react-router";
// import AnchorLink from 'react-anchor-link-smooth-scroll';
import { Microscope } from 'lucide-react';


function Footer() {
  return (
    <>
    <footer className="bg-slate-100 text-black p-6">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Microscope className="h-10 w-10" />
                <span className="text-4xl font-bold">VizLearn</span>
              </div>
              <p className="text-black">Making science education interactive and engaging.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-black">
                <li className="hover:text-white hover:cursor-pointer transition-colors">Features</li>
                <li className="hover:text-white hover:cursor-pointer transition-colors">Experiments</li>
                <li className="hover:text-white hover:cursor-pointer transition-colors">Testimonials</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-black">
                <li className="hover:text-white hover:cursor-pointer transition-colors">Blog</li>
                <li className="hover:text-white hover:cursor-pointer transition-colors">Documentation</li>
                <li className="hover:text-white hover:cursor-pointer transition-colors">Support</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-black">
                <li>info@vizlearn.co</li>
                <li>+254 794 771 949</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-2 pt-2 text-center text-black text-xs">
            <p>&copy; {new Date().getFullYear()} VizLearn. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;
