import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  canonical?: string;
  noindex?: boolean;
  structuredData?: object;
}

const SEO: React.FC<SEOProps> = ({
  title = 'Panchroma - Premium Web Development & Digital Marketing',
  description = 'Transform your business with cutting-edge web development, mobile apps, and digital marketing strategies. Custom solutions for modern businesses.',
  keywords = 'web development, mobile apps, digital marketing, SEO, e-commerce, custom software, React, Node.js',
  image = '/og-image.jpg',
  url = 'https://panchroma.com',
  type = 'website',
  canonical,
  noindex = false,
  structuredData
}) => {
  const siteTitle = title.includes('Panchroma') ? title : `${title} | Panchroma`;
  
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      {canonical && <link rel="canonical" href={canonical} />}
      {noindex && <meta name="robots" content="noindex,nofollow" />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Panchroma" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={siteTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
      
      {/* Additional Meta Tags */}
      <meta name="author" content="Panchroma Team" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#10B981" />
      <meta name="msapplication-TileColor" content="#10B981" />
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;