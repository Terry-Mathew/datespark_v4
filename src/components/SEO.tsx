import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
}

const SEO = ({
  title = "DateSpark - AI-Powered Dating Profile Optimization",
  description = "Transform your dating profile with AI-powered insights. Get personalized feedback, better matches, and expert tips to stand out on dating apps.",
  keywords = "dating profile optimization, AI dating assistant, profile analysis, dating app tips, better matches, dating profile feedback",
  image = "/og-image.jpg", // Make sure to add this image to your public folder
  url = "https://datespark.app",
}: SEOProps) => {
  return (
    <Helmet>
      {/* Basic meta tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Additional SEO tags */}
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <link rel="canonical" href={url} />
    </Helmet>
  );
};

export default SEO; 