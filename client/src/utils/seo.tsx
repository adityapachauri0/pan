import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
}

export const SEO: React.FC<SEOProps> = ({
  title = 'Panchroma - Building Digital Excellence',
  description = 'Professional web development, mobile apps, and digital solutions for modern businesses. Transform your digital presence with our expert team.',
  keywords = 'web development, mobile apps, e-commerce, UI/UX design, digital transformation, React, TypeScript, modern web solutions',
  image = 'https://panchroma.ca/og-image.jpg',
  url = 'https://panchroma.ca',
  type = 'website',
  author = 'Panchroma',
  publishedTime,
  modifiedTime,
  section,
  tags = []
}) => {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': type === 'article' ? 'Article' : 'Organization',
    name: 'Panchroma',
    url: url,
    logo: 'https://panchroma.ca/logo512.png',
    description: description,
    ...(type === 'article' && {
      headline: title,
      image: image,
      author: {
        '@type': 'Person',
        name: author
      },
      datePublished: publishedTime,
      dateModified: modifiedTime || publishedTime,
      keywords: tags.join(', ')
    }),
    ...(type === 'website' && {
      sameAs: [
        'https://twitter.com/panchroma',
        'https://linkedin.com/company/panchroma',
        'https://github.com/panchroma'
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+1-XXX-XXX-XXXX',
        contactType: 'Customer Service',
        areaServed: 'CA',
        availableLanguage: ['English', 'French']
      }
    })
  };

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <link rel="canonical" href={url} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Panchroma" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
      <meta property="twitter:creator" content="@panchroma" />
      
      {/* Article specific */}
      {type === 'article' && (
        <>
          <meta property="article:author" content={author} />
          {publishedTime && <meta property="article:published_time" content={publishedTime} />}
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
          {section && <meta property="article:section" content={section} />}
          {tags.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag} />
          ))}
        </>
      )}
      
      {/* Additional SEO Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow, max-video-preview:-1, max-image-preview:large, max-snippet:-1" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="Panchroma" />
      
      {/* Theme Color */}
      <meta name="theme-color" content="#6366f1" />
      <meta name="msapplication-TileColor" content="#6366f1" />
      
      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </script>
    </Helmet>
  );
};

export default SEO;