// Sitemap generation utility
export const generateSitemap = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL || 'https://panchroma.com';
  
  const routes = [
    { path: '/', priority: '1.0', changefreq: 'daily' },
    { path: '/about', priority: '0.8', changefreq: 'weekly' },
    { path: '/services', priority: '0.9', changefreq: 'weekly' },
    { path: '/portfolio', priority: '0.8', changefreq: 'weekly' },
    { path: '/contact', priority: '0.7', changefreq: 'monthly' },
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(route => `
  <url>
    <loc>${baseUrl}${route.path}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('')}
</urlset>`;

  return sitemap;
};

// Structured data for different page types
export const getStructuredData = (type: 'website' | 'organization' | 'service' | 'breadcrumb', data?: any) => {
  const baseUrl = process.env.REACT_APP_BASE_URL || 'https://panchroma.com';
  
  switch (type) {
    case 'website':
      return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Panchroma",
        "url": baseUrl,
        "description": "Premium web development and digital marketing solutions",
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": `${baseUrl}/search?q={search_term_string}`
          },
          "query-input": "required name=search_term_string"
        }
      };

    case 'organization':
      return {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Panchroma",
        "url": baseUrl,
        "logo": `${baseUrl}/logo.png`,
        "description": "Leading web development and digital marketing agency",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "New York",
          "addressCountry": "US"
        },
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+1-800-PANCHROMA",
          "contactType": "customer service",
          "email": "contact@panchroma.com"
        },
        "sameAs": [
          "https://twitter.com/panchroma",
          "https://linkedin.com/company/panchroma",
          "https://facebook.com/panchroma"
        ]
      };

    case 'service':
      return {
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        "name": data?.name || "Web Development Services",
        "description": data?.description || "Custom web development and digital solutions",
        "provider": {
          "@type": "Organization",
          "name": "Panchroma",
          "url": baseUrl
        },
        "serviceType": "Web Development",
        "areaServed": "Worldwide",
        "offers": {
          "@type": "Offer",
          "availability": "https://schema.org/InStock"
        }
      };

    case 'breadcrumb':
      return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": data?.breadcrumbs?.map((item: any, index: number) => ({
          "@type": "ListItem",
          "position": index + 1,
          "name": item.name,
          "item": `${baseUrl}${item.path}`
        })) || []
      };

    default:
      return {};
  }
};