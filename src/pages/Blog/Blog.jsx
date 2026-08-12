import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import {
  FaCalendar, FaClock, FaSearch, FaArrowRight, FaCheck
} from 'react-icons/fa';
import { RiBookOpenLine } from 'react-icons/ri';

import { BLOG_POSTS as FALLBACK_POSTS } from '../../data/blogData';
import { fetchLiveBlogs } from '../../services/blogService';

const titleContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 }
  }
};

const titleWordVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
  }
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] }
  }
};

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let isMounted = true;
    const loadBlogs = async () => {
      setLoading(true);
      const liveData = await fetchLiveBlogs();
      if (isMounted) {
        if (liveData && liveData.length > 0) {
          setBlogs(liveData);
        } else {
          setBlogs(FALLBACK_POSTS);
        }
        setLoading(false);
      }
    };
    loadBlogs();
    return () => { isMounted = false; };
  }, []);

  const categories = useMemo(() => {
    const cats = new Set(blogs.map(b => b.category).filter(Boolean));
    return ["All", ...Array.from(cats)];
  }, [blogs]);

  const filteredPosts = useMemo(() => {
    return blogs.filter((post) => {
      const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
      const matchesSearch =
        post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.category?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [blogs, selectedCategory, searchQuery]);

  const featuredPost = useMemo(() => {
    return blogs.find(p => p.featured) || blogs[0];
  }, [blogs]);

  return (
    <>
      <Helmet>
        <title>Journal & Insights — Royal Rays BV</title>
        <meta name="description" content="Explore master craftsmanship, diamond grading 4Cs, ethical sourcing, and market insights from Royal Rays Antwerp." />
      </Helmet>

      <style>{`
        .blog-root {
          background-color: #FAFAF8;
          color: #111111;
          min-height: 100vh;
          padding-top: 105px;
          padding-bottom: 70px;
          font-family: 'Inter', sans-serif;
          position: relative;
        }

        .blog-container-1500 {
          width: 100%;
          max-width: 1500px !important;
          margin-left: auto !important;
          margin-right: auto !important;
        }

        .blog-hero-section {
          position: relative;
          padding: 1.5rem 0 2.5rem;
        }

        .blog-hero-title {
          font-family: 'Cormorant Garamond', 'Playfair Display', serif;
          font-size: clamp(2.5rem, 5.8vw, 4.8rem);
          font-weight: 300;
          letter-spacing: -0.03em;
          line-height: 1.02;
          text-transform: uppercase;
          color: #111111;
        }

        .blog-card {
          background: #FFFFFF;
          border: 1px solid rgba(0, 0, 0, 0.06);
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.02);
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
          transform: none !important;
        }

        .blog-card:hover {
          transform: none !important;
          border-color: rgba(0, 0, 0, 0.2);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.06);
        }

        .blog-tag-pill {
          display: inline-block;
          padding: 4px 14px;
          border-radius: 9999px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          background: #111111;
          color: #FFFFFF;
        }

        .category-tab {
          position: relative;
          padding: 8px 20px;
          border-radius: 9999px;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: #555555;
          transition: all 0.25s ease;
          cursor: pointer;
          border: 1px solid rgba(0, 0, 0, 0.08);
          background: #FFFFFF;
        }

        .category-tab:hover {
          color: #111111;
          border-color: #111111;
        }

        .category-tab.active {
          color: #FFFFFF;
          border-color: #111111;
          background: #111111;
          font-weight: 600;
        }

        .blog-search-input {
          background: #FFFFFF;
          border: 1px solid rgba(0, 0, 0, 0.1);
          border-radius: 9999px;
          padding: 12px 24px 12px 48px;
          color: #111111;
          width: 100%;
          font-size: 14px;
          outline: none;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.02);
          transition: all 0.3s ease;
        }

        .blog-search-input:focus {
          border-color: #111111;
          box-shadow: 0 6px 24px rgba(0, 0, 0, 0.07);
        }
      `}</style>

      <div className="blog-root">
        <div className="blog-container-1500 px-6 md:px-12 lg:px-16">

          <div className="blog-hero-section">
            <motion.div
              className="text-center max-w-3xl mx-auto mb-10"
              initial="hidden"
              animate="visible"
              variants={titleContainerVariants}
            >
              <motion.h1 className="blog-hero-title mb-4" variants={titleWordVariants}>
                Insights, Stories &amp; <em className="italic font-normal text-[#333333]">Mastery</em>
              </motion.h1>

              <motion.p
                variants={titleWordVariants}
                className="text-[#555555] text-sm md:text-lg leading-relaxed max-w-xl mx-auto mb-6 font-normal"
              >
                Discover Antwerp diamond manufacturing, gemological 4Cs guides,
                ethical sourcing standards, and high-jewelry market trends.
              </motion.p>

              <motion.div variants={titleWordVariants} className="relative max-w-lg mx-auto mb-6">
                <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-[#888888]" size={15} />
                <input
                  type="text"
                  placeholder="Search articles by title, topic, or keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="blog-search-input"
                />
              </motion.div>

              <motion.div variants={titleWordVariants} className="flex flex-wrap items-center justify-center gap-2.5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`category-tab ${selectedCategory === cat ? "active" : ""}`}
                  >
                    {cat}
                  </button>
                ))}
              </motion.div>
            </motion.div>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-xs uppercase tracking-widest font-mono text-[#777777]">Loading Journal Articles...</p>
            </div>
          ) : (
            <>
              {selectedCategory === "All" && !searchQuery && featuredPost && (
                <motion.div
                  className="mb-12"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  variants={fadeInUp}
                >
                  <div className="blog-card grid lg:grid-cols-12 gap-0 group">
                    <div className="lg:col-span-7 overflow-hidden h-[320px] md:h-[400px] relative">
                      <img
                        src={featuredPost.image}
                        alt={featuredPost.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1200&h=800&fit=crop";
                        }}
                      />
                      <div className="absolute top-5 left-5">
                        <span className="blog-tag-pill">{featuredPost.category || "Featured"}</span>
                      </div>
                    </div>

                    <div className="lg:col-span-5 p-6 md:p-10 flex flex-col justify-between bg-white">
                      <div>
                        <div className="flex items-center gap-3 text-xs text-[#777777] mb-3 font-mono uppercase tracking-wider">
                          <span className="flex items-center gap-1.5"><FaCalendar size={11} /> {featuredPost.date}</span>
                          {featuredPost.readTime && (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-1.5"><FaClock size={11} /> {featuredPost.readTime}</span>
                            </>
                          )}
                        </div>

                        <h2 className="font-serif text-2xl md:text-3xl text-[#111111] font-normal leading-tight mb-3 group-hover:text-[#444444] transition-colors">
                          {featuredPost.title}
                        </h2>

                        <p className="text-[#555555] text-xs md:text-sm leading-relaxed mb-4 line-clamp-3">
                          {featuredPost.excerpt}
                        </p>
                      </div>

                      <div>
                        {featuredPost.author && (
                          <div className="flex items-center gap-3 pt-4 border-t border-black/5 mb-4">
                            <img
                              src={featuredPost.author.image || featuredPost.author.avatar || "https://royalraysbv.com/RRLOGO.png"}
                              alt={featuredPost.author.name}
                              className="w-9 h-9 rounded-full object-cover border border-black/15"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://royalraysbv.com/RRLOGO.png";
                              }}
                            />
                            <div>
                              <div className="text-xs font-semibold text-[#111111]">{featuredPost.author.name}</div>
                              <div className="text-[11px] text-[#777777]">{featuredPost.author.bio || "Royal Rays Specialist"}</div>
                            </div>
                          </div>
                        )}

                        <Link
                          to={`/blog/${featuredPost.slug || featuredPost.id}`}
                          className="inline-flex items-center gap-2.5 text-xs uppercase tracking-[0.18em] font-semibold text-[#111111] hover:text-[#555555] transition-colors group/btn"
                        >
                          <span>Read Full Article</span>
                          <FaArrowRight className="group-hover/btn:translate-x-1.5 transition-transform duration-300" size={11} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {filteredPosts.length > 0 ? (
                <motion.div
                  className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-14"
                  initial="hidden"
                  animate="visible"
                  variants={staggerContainer}
                >
                  {filteredPosts.map((post) => (
                    <motion.div key={post.slug || post.id} variants={cardVariants}>
                      <Link to={`/blog/${post.slug || post.id}`} className="block h-full">
                        <div className="blog-card h-full flex flex-col justify-between group">
                          <div>
                            <div className="h-52 overflow-hidden relative">
                              <img
                                src={post.image}
                                alt={post.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1200&h=800&fit=crop";
                                }}
                              />
                              <div className="absolute top-3.5 left-3.5">
                                <span className="blog-tag-pill">{post.category || "Article"}</span>
                              </div>
                            </div>

                            <div className="p-5 md:p-6">
                              <div className="flex items-center gap-3 text-xs text-[#777777] mb-2.5 font-mono">
                                <span className="flex items-center gap-1"><FaCalendar size={11} /> {post.date}</span>
                                {post.readTime && (
                                  <>
                                    <span>•</span>
                                    <span className="flex items-center gap-1"><FaClock size={11} /> {post.readTime}</span>
                                  </>
                                )}
                              </div>

                              <h3 className="font-serif text-lg md:text-xl font-normal text-[#111111] mb-2 line-clamp-2 group-hover:text-[#444444] transition-colors leading-snug">
                                {post.title}
                              </h3>

                              <p className="text-xs text-[#555555] leading-relaxed line-clamp-2 mb-3">
                                {post.excerpt}
                              </p>
                            </div>
                          </div>

                          <div className="px-5 md:px-6 pb-5 md:pb-6 pt-3 border-t border-black/5 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <img
                                src={post.author?.image || post.author?.avatar || "https://royalraysbv.com/RRLOGO.png"}
                                alt={post.author?.name || "Royal Rays"}
                                className="w-6 h-6 rounded-full object-cover border border-black/10"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = "https://royalraysbv.com/RRLOGO.png";
                                }}
                              />
                              <span className="text-[11px] text-[#555555] font-medium">{post.author?.name || "Royal Rays Team"}</span>
                            </div>

                            <span className="text-xs font-semibold uppercase tracking-wider text-[#111111] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                              Read <FaArrowRight size={10} />
                            </span>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <div className="text-center py-16 bg-white rounded-2xl border border-black/6 mb-14 shadow-sm">
                  <RiBookOpenLine size={44} className="mx-auto text-[#111111] mb-3 opacity-70" />
                  <h3 className="font-serif text-2xl mb-2 text-[#111111]">No Articles Found</h3>
                  <p className="text-[#555555] text-sm max-w-md mx-auto mb-6">
                    We couldn't find any articles matching your search query "{searchQuery}".
                  </p>
                  <button
                    onClick={() => { setSelectedCategory("All"); setSearchQuery(""); }}
                    className="px-6 py-2.5 rounded-full bg-[#111111] text-[#FFFFFF] text-xs font-semibold uppercase tracking-widest hover:bg-[#333333] transition-colors"
                  >
                    Clear Search Filters
                  </button>
                </div>
              )}
            </>
          )}

        </div>
      </div>
    </>
  );
};

export default Blog;