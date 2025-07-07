// import { Link } from "react-router";
// import AnchorLink from 'react-anchor-link-smooth-scroll';
import { Mail, PhoneCall, Instagram, Linkedin, Facebook, Twitter } from 'lucide-react';


function Footer() {
  return (
    <>
      <footer className="bg-slate-100 text-black p-6">
        <div className="container mx-auto w-full p-6">
          <div className="grid md:grid-cols-4 gap-8 items-center">
            <div>
              <div className="flex items-center space-x-2 mb-4 bg-">
                <img
                  src='/images/Vlearnlogo.png'
                  alt='vlearn_logo'
                  className='w-fit h-40'
                />
              </div>
              <div className='flex space-x-3 font-light py-2 mb-5'>
                <Instagram
                  strokeWidth={1.5}
                  className='hover:text-custom-orange hover:cursor-pointer' />
                <Linkedin
                  strokeWidth={1.5}
                  className='hover:text-custom-orange hover:cursor-pointer' />
                <Facebook
                  strokeWidth={1.5}
                  className='hover:text-custom-orange hover:cursor-pointer' />
                <Twitter
                  strokeWidth={1.5}
                  className='hover:text-custom-orange hover:cursor-pointer' />
              </div>
              <p className="text-black text-sm font-light">Turn curiosity into discovery. Our platform makes complex science easy to understand.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-black font-light w-fit">
                <li className="hover:text-custom-orange hover:cursor-pointer transition-colors">Home</li>
                <li className="hover:text-custom-orange hover:cursor-pointer transition-colors">Experiments</li>
                <li className="hover:text-custom-orange hover:cursor-pointer transition-colors">Pricing</li>
                <li className="hover:text-custom-orange hover:cursor-pointer transition-colors">FAQs</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-black font-light w-fit">
                <li className="hover:text-custom-orange hover:cursor-pointer transition-colors">About us</li>
                <li className="hover:text-custom-orange hover:cursor-pointer transition-colors">Blog</li>
                <li className="hover:text-custom-orange hover:cursor-pointer transition-colors">Support</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">User support</h3>
              <ul className="space-y-2 text-black font-light">
                <li className='flex gap-5'>
                  <Mail className='text-custom-orange' />
                  info@vizlearn.co</li>
                <li className='flex gap-5'>
                  <PhoneCall className='text-custom-orange' />
                  +254 794 771 949
                </li>
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
