import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-surface-dark">
    <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-12 sm:px-6 md:grid-cols-4 lg:px-8">
      <div>
        <h3 className="mb-3 text-lg font-bold text-primary">ProjectForge</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Where student and dev teams plan, build, and ship projects together.
        </p>
      </div>
      <div>
        <h4 className="mb-3 text-sm font-semibold">Product</h4>
        <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
          <li><Link to="/#features">Features</Link></li>
          <li><Link to="/#faq">FAQ</Link></li>
          <li><Link to="/blog">Blog</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="mb-3 text-sm font-semibold">Company</h4>
        <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
          <li><Link to="/about">About</Link></li>
          <li><Link to="/contact">Contact</Link></li>
          <li><Link to="/help">Help / Support</Link></li>
          <li><Link to="/privacy">Privacy & Terms</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="mb-3 text-sm font-semibold">Connect</h4>
        <div className="flex gap-3 text-sm text-slate-500 dark:text-slate-400">
          <a href="https://github.com" target="_blank" rel="noreferrer">GitHub</a>
          <a href="https://twitter.com" target="_blank" rel="noreferrer">Twitter</a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer">LinkedIn</a>
        </div>
        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">hello@projectforge.dev</p>
      </div>
    </div>
    <div className="border-t border-slate-200 py-4 text-center text-xs text-slate-400 dark:border-slate-800">
      © {new Date().getFullYear()} ProjectForge. All rights reserved.
    </div>
  </footer>
);

export default Footer;
