const BLOG_API_URL = import.meta.env.VITE_BLOG_API_URL || 'https://blogpanel.royalraysbv.com/api/blogs';

let cachedBlogsPromise = null;
let cachedBlogsData = null;

export const fetchLiveBlogs = async (forceRefresh = false) => {
  // 1. If data is already cached in memory, return it instantly
  if (!forceRefresh && cachedBlogsData) {
    return cachedBlogsData;
  }

  // 2. If a request is currently in-flight, reuse the same promise to prevent duplicate API calls
  if (!forceRefresh && cachedBlogsPromise) {
    return cachedBlogsPromise;
  }

  // 3. Initiate single network request
  cachedBlogsPromise = (async () => {
    try {
      const response = await fetch(`${BLOG_API_URL}?per_page=100`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const json = await response.json();
      if (json && json.status && json.data && Array.isArray(json.data.blogs)) {
        cachedBlogsData = json.data.blogs;
        return cachedBlogsData;
      }
      return [];
    } catch (error) {
      console.error("Failed to fetch live blogs from API:", error);
      return null;
    } finally {
      cachedBlogsPromise = null;
    }
  })();

  return cachedBlogsPromise;
};
