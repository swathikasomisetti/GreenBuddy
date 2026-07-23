import "./FooterSection.css";
import { Link } from "react-router-dom";
import { Leaf } from "lucide-react";
import { FaInstagram, FaTwitter, FaFacebook } from "react-icons/fa";

export default function FooterSection() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-brand">
          <div className="footer-logo">
            <Leaf size={22} />
            <span>GreenBuddy</span>
          </div>
          <p>
            Your personal digital greenhouse — track, water, and grow
            with confidence.
          </p>
         <div className="footer-social">
  <a href="#"><FaInstagram size={18} /></a>
  <a href="#"><FaTwitter size={18} /></a>
  <a href="#"><FaFacebook size={18} /></a>
</div>
        </div>

        <div className="footer-links">
          <h4>Product</h4>
          <Link to="/register">Get Started</Link>
          <Link to="/login">Explore Garden</Link>
          <Link to="/encyclopedia">Encyclopedia</Link>
        </div>

        <div className="footer-links">
          <h4>Company</h4>
          <Link to="/about">About</Link>
          <Link to="/journal">Journal</Link>
          <Link to="/contact">Contact</Link>
        </div>

        <div className="footer-links">
          <h4>Legal</h4>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms of Service</Link>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} GreenBuddy. All rights reserved.</span>
      </div>
    </footer>
  );
}