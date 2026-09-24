import { useEffect } from "react";

/**
 * Lightweight, zero-dependency SEO component for client-side title,
 * meta description, canonical link, and robots tag management.
 */
export default function SEO({
  title,
  description,
  canonicalPath,
  noindex = false,
  keywords,
}) {
  useEffect(() => {
    const prevTitle = document.title;
    if (title) {
      document.title = title;
    }

    // Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    const prevDesc = metaDesc ? metaDesc.getAttribute("content") : null;
    if (description) {
      if (!metaDesc) {
        metaDesc = document.createElement("meta");
        metaDesc.setAttribute("name", "description");
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute("content", description);
    }

    // Canonical Link (only set when canonicalPath is given or when not noindexed)
    let canonical = document.querySelector('link[rel="canonical"]');
    const prevCanonical = canonical ? canonical.getAttribute("href") : null;
    if (canonicalPath || (!noindex && canonicalPath === undefined)) {
      const path = canonicalPath || "/";
      const canonicalUrl = `https://www.vizlearn.org${path.startsWith("/") ? path : `/${path}`}`;
      if (!canonical) {
        canonical = document.createElement("link");
        canonical.setAttribute("rel", "canonical");
        document.head.appendChild(canonical);
      }
      canonical.setAttribute("href", canonicalUrl);
    }

    // Robots meta tag
    let metaRobots = document.querySelector('meta[name="robots"]');
    const prevRobots = metaRobots ? metaRobots.getAttribute("content") : null;
    if (!metaRobots) {
      metaRobots = document.createElement("meta");
      metaRobots.setAttribute("name", "robots");
      document.head.appendChild(metaRobots);
    }
    metaRobots.setAttribute(
      "content",
      noindex ? "noindex, nofollow" : "index, follow"
    );

    // Meta Keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    const prevKeywords = metaKeywords ? metaKeywords.getAttribute("content") : null;
    if (keywords) {
      if (!metaKeywords) {
        metaKeywords = document.createElement("meta");
        metaKeywords.setAttribute("name", "keywords");
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute("content", keywords);
    }

    // Cleanup on unmount
    return () => {
      document.title = prevTitle;
      if (prevDesc && metaDesc) metaDesc.setAttribute("content", prevDesc);
      if (prevCanonical && canonical) canonical.setAttribute("href", prevCanonical);
      if (prevRobots && metaRobots) metaRobots.setAttribute("content", prevRobots);
      if (prevKeywords && metaKeywords) metaKeywords.setAttribute("content", prevKeywords);
    };
  }, [title, description, canonicalPath, noindex, keywords]);

  return null;
}
