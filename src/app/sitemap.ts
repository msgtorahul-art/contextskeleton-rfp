import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://contextskeleton.com';

  return [
    { url: `${baseUrl}/`, lastModified: new Date() },
    { url: `${baseUrl}/consent`, lastModified: new Date() },
    { url: `${baseUrl}/security-questionnaire`, lastModified: new Date() },
    { url: `${baseUrl}/skeletonizer`, lastModified: new Date() },
    { url: `${baseUrl}/knowledge`, lastModified: new Date() },
    { url: `${baseUrl}/privacy`, lastModified: new Date() },
    { url: `${baseUrl}/terms`, lastModified: new Date() },
  ];
}
