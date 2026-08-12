import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { 
  FaCalendar, FaClock, FaEye, FaShareAlt, FaFacebook, 
  FaTwitter, FaLinkedin, FaLink, FaArrowLeft, FaCheck,
  FaSearch, FaArrowRight, FaTag, FaBookOpen, FaGlobe, FaPhone
} from 'react-icons/fa';
import { RiDiamondLine, RiBuildingLine } from 'react-icons/ri';

import { BLOG_POSTS as FALLBACK_POSTS } from '../../data/blogData';
import { fetchLiveBlogs } from '../../services/blogService';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  }
};

const POPULAR_TAGS = [
  "Kite Cut", "Portrait Cut", "Step Cut", "Cadillac Cut", 
  "Rose Cut", "Brilliant Cut", "4Cs Grading", "Antwerp Heritage", 
  "Ethical Sourcing", "Fancy Colors"
];

const BlogDetail = () => {
  const params = useParams();
  const targetParam = params.slug || params.id;
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [sidebarSearch, setSidebarSearch] = useState("");
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const post = useMemo(() => {
    if (!blogs || blogs.length === 0) return FALLBACK_POSTS[0];
    const found = blogs.find(
      (p) => p.slug === targetParam || String(p.id) === String(targetParam)
    );
    return found || blogs[0] || FALLBACK_POSTS[0];
  }, [blogs, targetParam]);

  const relatedPosts = useMemo(() => {
    if (!blogs || blogs.length === 0) return FALLBACK_POSTS.slice(1, 4);
    return blogs.filter((p) => p.slug !== post.slug && String(p.id) !== String(post.id)).slice(0, 3);
  }, [blogs, post]);

  const categoriesList = useMemo(() => {
    const catsMap = {};
    blogs.forEach(b => {
      if (b.category) {
        catsMap[b.category] = (catsMap[b.category] || 0) + 1;
      }
    });
    return Object.entries(catsMap).map(([name, count]) => ({ name, count }));
  }, [blogs]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (sidebarSearch.trim()) {
      navigate(`/blog?search=${encodeURIComponent(sidebarSearch)}`);
    }
  };

  const authorName = post.author?.name || "Royal Rays Team";
  const authorImage = post.author?.image || post.author?.avatar || "https://royalraysbv.com/RRLOGO.png";
  const authorBio = post.author?.bio || "Expert diamond specialists with decades of combined experience in the diamond industry.";

  return (
    <>
      <Helmet>
        <title>{post.title} — Royal Rays Journal</title>
        <meta name="description" content={post.excerpt} />
      </Helmet>

      <style>{`
        .blog-detail-root {
          background-color: #FAFAF8;
          color: #111111;
          min-height: 100vh;
          padding-top: 105px;
          padding-bottom: 80px;
          font-family: 'Inter', sans-serif;
        }

        .blog-container-1500 {
          width: 100%;
          max-width: 1500px !important;
          margin-left: auto !important;
          margin-right: auto !important;
        }

        .article-title {
          font-family: 'Cormorant Garamond', 'Playfair Display', serif;
          font-size: clamp(2rem, 4.5vw, 3.8rem);
          font-weight: 300;
          line-height: 1.08;
          letter-spacing: -0.02em;
          text-transform: uppercase;
          color: #111111;
        }

        .article-prose {
          font-size: 1.05rem;
          line-height: 1.85;
          color: #333333;
        }

        .article-prose h2 {
          font-family: 'Cormorant Garamond', 'Playfair Display', serif;
          font-size: 2rem;
          font-weight: 400;
          color: #111111;
          margin-top: 2rem;
          margin-bottom: 0.8rem;
          line-height: 1.2;
          border-bottom: 1px solid rgba(0, 0, 0, 0.08);
          padding-bottom: 0.4rem;
        }

        .article-prose p {
          margin-bottom: 1.4rem;
        }

        .article-prose p.lead {
          font-size: 1.2rem;
          line-height: 1.75;
          color: #111111;
          font-weight: 300;
        }

        .article-prose blockquote {
          border-left: 3px solid #111111;
          padding-left: 1.5rem;
          margin: 1.8rem 0;
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-size: 1.4rem;
          color: #111111;
          line-height: 1.45;
        }

        .article-prose ul {
          list-style: disc;
          padding-left: 1.5rem;
          margin-bottom: 1.4rem;
        }

        .article-prose li {
          margin-bottom: 0.5rem;
        }

        .article-prose strong {
          color: #111111;
        }

        .sidebar-card {
          background: #FFFFFF;
          border: 1px solid rgba(0, 0, 0, 0.06);
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.02);
        }

        .related-card {
          background: #FFFFFF;
          border: 1px solid rgba(0, 0, 0, 0.06);
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.02);
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
          transform: none !important;
        }

        .related-card:hover {
          transform: none !important;
          border-color: rgba(0, 0, 0, 0.2);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
        }

        .blog-tag-pill {
          display: inline-block;
          padding: 4px 14px;
          border-radius: 9999px;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          background: #111111;
          color: #FFFFFF;
        }

        .topic-tag-btn {
          display: inline-block;
          padding: 6px 14px;
          border-radius: 9999px;
          font-size: 11px;
          font-weight: 500;
          color: #444444;
          background: #FAFAF8;
          border: 1px solid rgba(0, 0, 0, 0.08);
          transition: all 0.25s ease;
        }

        .topic-tag-btn:hover {
          background: #111111;
          color: #FFFFFF;
          border-color: #111111;
        }

        .social-share-btn {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          border: 1px solid rgba(0, 0, 0, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #111111;
          background: #FFFFFF;
          transition: all 0.25s ease;
          cursor: pointer;
        }

        .social-share-btn:hover {
          background: #111111;
          color: #FFFFFF;
          border-color: #111111;
        }
      `}</style>

      <div className="blog-detail-root">
        <div className="blog-container-1500 px-6 md:px-12 lg:px-16">

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="mb-6"
          >
            <Link 
              to="/blog" 
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] font-medium text-[#555555] hover:text-[#111111] transition-colors group"
            >
              <FaArrowLeft className="group-hover:-translate-x-1.5 transition-transform" />
              <span>Back to Journal</span>
            </Link>
          </motion.div>

          <div className="grid lg:grid-cols-12 gap-10 lg:gap-12">
            
            <div className="lg:col-span-8">
              <motion.article
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
              >
                <div className="mb-6">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <span className="px-3 py-0.5 rounded-full text-xs uppercase tracking-wider font-semibold bg-[#111111] text-[#FFFFFF]">
                      {post.category || "Article"}
                    </span>
                    {post.date && (
                      <span className="text-xs text-[#666666] flex items-center gap-1.5 font-mono">
                        <FaCalendar size={11} /> {post.date}
                      </span>
                    )}
                    {post.readTime && (
                      <span className="text-xs text-[#666666] flex items-center gap-1.5 font-mono">
                        <FaClock size={11} /> {post.readTime}
                      </span>
                    )}
                  </div>

                  <h1 className="article-title mb-4">
                    {post.title}
                  </h1>

                  <p className="text-base md:text-lg text-[#555555] leading-relaxed mb-6">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between py-4 border-y border-black/8">
                    <div className="flex items-center gap-3">
                      <img 
                        src={authorImage} 
                        alt={authorName}
                        className="w-10 h-10 rounded-full object-cover border border-black/15" 
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://royalraysbv.com/RRLOGO.png";
                        }}
                      />
                      <div>
                        <div className="text-sm font-semibold text-[#111111]">{authorName}</div>
                        <div className="text-xs text-[#666666]">Royal Rays Diamond Specialist</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button onClick={handleCopyLink} className="social-share-btn" title="Copy Link">
                        {copied ? <FaCheck size={13} className="text-[#111111]" /> : <FaLink size={13} />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl overflow-hidden mb-8 border border-black/8 shadow-sm bg-white">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-auto max-h-[550px] object-contain mx-auto"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1200&h=800&fit=crop";
                    }}
                  />
                  <div className="p-3 bg-white border-t border-black/5 text-xs text-[#777777] text-center italic font-serif">
                    Royal Rays Craftsmanship Archive — Antwerp Diamond District
                  </div>
                </div>

                {post.content ? (
                  <div 
                    className="article-prose mb-10"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />
                ) : (
                  <div className="article-prose mb-10">
                    <p className="lead">{post.excerpt}</p>
                    <h2>The Legacy of Antwerp Diamond Excellence</h2>
                    <p>At Royal Rays, every diamond cut is an architectural blueprint for light refraction. Our gemologists evaluate hundreds of geometric options to determine the precise facet orientation that promises peak optical brilliance, fire, and scintillation.</p>
                    <blockquote>"A master cutter does not cut a diamond merely to preserve weight; a master cutter cuts to unleash the stone's eternal soul."</blockquote>
                    <h2>Precision Craftsmanship &amp; Ethical Provenance</h2>
                    <p>From conflict-free Kimberley Process certification to state-of-the-art laser sawing and polishing, our master artisans bring decades of Antwerp heritage to every single diamond piece.</p>
                  </div>
                )}

                <div className="pt-6 border-t border-black/8 mb-12 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs text-[#777777] uppercase tracking-wider mr-1">Category:</span>
                    <span className="px-3 py-1 rounded-md bg-white text-xs font-medium text-[#111111] border border-black/10">
                      {post.category || "Diamond Education"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <span className="text-xs text-[#777777] uppercase tracking-wider">Share:</span>
                    <a 
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                      target="_blank"
                      rel="noopener noreferrer" 
                      className="social-share-btn"
                    >
                      <FaFacebook size={13} />
                    </a>
                    <a 
                      href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}`}
                      target="_blank"
                      rel="noopener noreferrer" 
                      className="social-share-btn"
                    >
                      <FaTwitter size={13} />
                    </a>
                    <a 
                      href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}`}
                      target="_blank"
                      rel="noopener noreferrer" 
                      className="social-share-btn"
                    >
                      <FaLinkedin size={13} />
                    </a>
                    <button onClick={handleCopyLink} className="social-share-btn" title="Copy Link">
                      {copied ? <FaCheck size={13} /> : <FaLink size={13} />}
                    </button>
                  </div>
                </div>

                <div className="sidebar-card flex flex-col sm:flex-row items-center sm:items-start gap-5 mb-12">
                  <img 
                    src={authorImage} 
                    alt={authorName}
                    className="w-16 h-16 rounded-full object-cover border-2 border-black/15" 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://royalraysbv.com/RRLOGO.png";
                    }}
                  />
                  <div>
                    <div className="text-[11px] uppercase tracking-widest text-[#777777] mb-1">About The Author</div>
                    <h4 className="font-serif text-lg font-normal text-[#111111] mb-1.5">{authorName}</h4>
                    <p className="text-xs md:text-sm text-[#555555] leading-relaxed">
                      {authorBio}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-serif text-xl text-[#111111] font-normal mb-5 flex items-center gap-2">
                    <RiDiamondLine className="text-[#111111]" />
                    <span>Related Articles</span>
                  </h3>

                  <div className="grid md:grid-cols-3 gap-5">
                    {relatedPosts.map((rel) => (
                      <Link key={rel.slug || rel.id} to={`/blog/${rel.slug || rel.id}`} className="group">
                        <div className="related-card h-full flex flex-col justify-between group">
                          <div>
                            <div className="h-44 overflow-hidden relative">
                              <img 
                                src={rel.image} 
                                alt={rel.title} 
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" 
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1200&h=800&fit=crop";
                                }}
                              />
                              <div className="absolute top-3 left-3">
                                <span className="blog-tag-pill">{rel.category || "Article"}</span>
                              </div>
                            </div>

                            <div className="p-4 md:p-5">
                              <h4 className="font-serif text-sm md:text-base text-[#111111] font-normal mb-2 line-clamp-2 group-hover:text-[#555555] transition-colors leading-snug">
                                {rel.title}
                              </h4>
                            </div>
                          </div>

                          <div className="px-4 md:px-5 pb-4 pt-2 border-t border-black/5 flex items-center justify-between">
                            <span className="text-[11px] text-[#777777] font-mono">{rel.date}</span>
                            <span className="text-xs font-semibold uppercase tracking-wider text-[#111111] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                              Read <FaArrowRight size={10} />
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

              </motion.article>
            </div>

            <div className="lg:col-span-4">
              <div className="sticky top-28 space-y-7">

                <div className="sidebar-card">
                  <h4 className="font-serif text-lg text-[#111111] mb-3">Search Journal</h4>
                  <form onSubmit={handleSearchSubmit} className="relative">
                    <input 
                      type="text"
                      placeholder="Search by title or topic..."
                      value={sidebarSearch}
                      onChange={(e) => setSidebarSearch(e.target.value)}
                      className="w-full bg-[#FAFAF8] border border-black/10 rounded-full px-4 py-2.5 pr-10 text-xs text-[#111111] outline-none focus:border-black"
                    />
                    <button type="submit" className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#777777] hover:text-[#111111]">
                      <FaSearch size={13} />
                    </button>
                  </form>
                </div>

                <div className="sidebar-card border-black/10 bg-gradient-to-b from-black/[0.02] to-transparent">
                  <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-[#777777] mb-2">
                    <RiDiamondLine size={14} className="text-[#111111]" />
                    <span>Royal Rays BV • Antwerp</span>
                  </div>
                  <h4 className="font-serif text-xl text-[#111111] font-normal mb-2 leading-snug">
                    Mastery in Fancy Cut Diamonds
                  </h4>
                  <p className="text-xs text-[#555555] leading-relaxed mb-4">
                    Crafting precision-cut natural diamonds with light-refraction excellence and 100% ethical Kimberley provenance since 1988.
                  </p>
                  <Link 
                    to="/about"
                    className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#111111] hover:text-[#555555] transition-colors group"
                  >
                    <span>Discover Our Legacy</span>
                    <FaArrowRight size={10} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>

                <div className="sidebar-card">
                  <div className="flex items-center justify-between mb-4 pb-2 border-b border-black/6">
                    <h4 className="font-serif text-lg text-[#111111]">Popular Insights</h4>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#888888]">Top Stories</span>
                  </div>

                  <div className="space-y-4">
                    {blogs.slice(0, 4).map((popular, index) => (
                      <Link 
                        key={popular.slug || popular.id} 
                        to={`/blog/${popular.slug || popular.id}`} 
                        className="flex items-start gap-3.5 group py-1"
                      >
                        <span className="font-serif text-lg font-light text-[#A0A0A0] group-hover:text-[#111111] transition-colors w-5">
                          0{index + 1}
                        </span>
                        <img 
                          src={popular.image} 
                          alt={popular.title} 
                          className="w-14 h-14 rounded-lg object-cover flex-shrink-0 group-hover:scale-105 transition-transform duration-300 border border-black/10"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1200&h=800&fit=crop";
                          }}
                        />
                        <div className="flex-1">
                          <span className="text-[10px] uppercase tracking-wider font-semibold text-[#777777] block mb-0.5">
                            {popular.category || "Education"}
                          </span>
                          <h5 className="text-xs font-serif text-[#111111] line-clamp-2 group-hover:text-[#555555] transition-colors leading-snug">
                            {popular.title}
                          </h5>
                          <span className="text-[10px] text-[#888888] mt-1 block font-mono">{popular.date}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="sidebar-card">
                  <h4 className="font-serif text-lg text-[#111111] mb-3">Trending Topics</h4>
                  <div className="flex flex-wrap gap-2">
                    {POPULAR_TAGS.map((tag) => (
                      <Link 
                        key={tag}
                        to={`/blog?search=${encodeURIComponent(tag)}`}
                        className="topic-tag-btn"
                      >
                        #{tag}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="sidebar-card">
                  <h4 className="font-serif text-lg text-[#111111] mb-3">Categories</h4>
                  <div className="space-y-2">
                    {categoriesList.map((cat) => (
                      <Link 
                        key={cat.name}
                        to={`/blog?category=${encodeURIComponent(cat.name)}`}
                        className="flex items-center justify-between py-2 border-b border-black/5 text-xs text-[#555555] hover:text-[#111111] transition-colors group"
                      >
                        <span className="group-hover:translate-x-1 transition-transform font-medium">{cat.name}</span>
                        <span className="px-2.5 py-0.5 rounded-full bg-black/5 text-[10px] text-[#777777] font-mono">{cat.count}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="sidebar-card text-center">
                  <RiBuildingLine size={28} className="mx-auto text-[#111111] mb-2" />
                  <h4 className="font-serif text-xl text-[#111111] font-normal mb-2">Private Consultation</h4>
                  <p className="text-xs text-[#555555] leading-relaxed mb-4">
                    Book a private appointment with our master Antwerp gemologists.
                  </p>
                  <Link 
                    to="/contact"
                    className="inline-block w-full py-2.5 rounded-full bg-[#111111] hover:bg-[#333333] text-white text-xs font-semibold uppercase tracking-widest transition-colors"
                  >
                    Contact Our Office
                  </Link>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default BlogDetail;