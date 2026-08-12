import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// react-router doesn't scroll to #hash anchors on its own — this makes
// links like /#features actually land on the right section, whether
// you're already on that page or navigating there from elsewhere.
const ScrollToHash = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      // Give the page a tick to render before we try to find the element.
      const id = location.hash.replace("#", "");
      const timeout = setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 0);
      return () => clearTimeout(timeout);
    }
    window.scrollTo(0, 0);
  }, [location]);

  return null;
};

export default ScrollToHash;
