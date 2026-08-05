import { MetadataRoute } from 'next';
import { BLOG_POSTS } from '@/lib/blogs';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://contextskeleton.com';

  const blogUrls = BLOG_POSTS.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(),
  }));

  return [
    { url: `${baseUrl}/`, lastModified: new Date() },
    { url: `${baseUrl}/consent`, lastModified: new Date() },
    { url: `${baseUrl}/security-questionnaire`, lastModified: new Date() },
    { url: `${baseUrl}/skeletonizer`, lastModified: new Date() },
    { url: `${baseUrl}/knowledge`, lastModified: new Date() },
    { url: `${baseUrl}/blog`, lastModified: new Date() },
    ...blogUrls,
    { url: `${baseUrl}/privacy`, lastModified: new Date() },
    { url: `${baseUrl}/terms`, lastModified: new Date() },
  ];
}
