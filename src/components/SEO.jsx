import { Helmet } from 'react-helmet-async'

/**
 * SEO — drop this into every page/route with page-specific values.
 * Usage: <SEO title="Manufacturing — Royal Rays BV" description="..." path="/manufacturing" />
 */
export default function SEO({ title, description, path = '/', image = '/og-image.jpg' }) {
  const url = `https://www.royalraysbv.com${path}`
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  )
}
