import { Link } from "react-router-dom";
import { Car, Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-muted border-t border-border mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary mb-4">
              <Car className="h-6 w-6" />
              <span>AutoNepal</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              Nepal's premier marketplace for buying and selling bikes, scooters, and cars.
            </p>
            <div className="flex gap-3">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/listings" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Browse Listings
                </Link>
              </li>
              <li>
                <Link to="/sell" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Sell Your Vehicle
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/listings?category=bike" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Bikes
                </Link>
              </li>
              <li>
                <Link to="/listings?category=scooter" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Scooters
                </Link>
              </li>
              <li>
                <Link to="/listings?category=car" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Cars
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>Lakeside, Pokhara, Nepal</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <span>+977 98XX-XXXXXX</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span>info@autonepal.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 AutoNepal. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
