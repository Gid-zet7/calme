"use client"
import React, { useMemo, useState } from 'react';
// import Layout from '../components/layout/Layout';
import { Calendar, User, Tag, Search, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { api } from '@/trpc/react';
import Iridescence from '@/components/Iridescence';

const NewsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: page } = api.news.getAll.useQuery({ limit: 20, search: searchTerm || undefined });
  const items = page?.items ?? [];
  const allTags = useMemo(() => Array.from(new Set(items.flatMap(i => i.tags))), [items]);
  const filteredNews = items;

  return (
    <>
      {/* Hero Section */}
      <section style={{ width: '100%', height: '600px', position: 'relative' }}>
        <Iridescence color={[1, 1, 1]} mouseReact={false} amplitude={0.1} speed={1.0} className="absolute inset-0" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/10 via-background/20 to-background" />
        <div className="absolute inset-0 flex items-center justify-center px-4">
          <div className="max-w-3xl text-center space-y-6">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">
              News & Updates
            </h1>
            <p className="text-base md:text-lg text-muted-foreground">
              Stay informed about Cal-me's latest initiatives, mental health news, and community impact.
            </p>
          </div>
        </div>
      </section>

      {/* News Content */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Search Bar (Mobile Only) */}
              <div className="mb-6 lg:hidden">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search news..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                </div>
              </div>
              
              {/* News Items */}
              {filteredNews.length > 0 ? (
                <div className="space-y-10">
                  {filteredNews.map((item, index) => (
                    <motion.article
                      key={item.id}
                      className="border-b border-neutral-200 pb-10 last:border-0 last:pb-0"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <div className="mb-4 rounded-lg overflow-hidden">
                        <img
                          src={item.imageUrl ?? undefined}
                          alt={item.title}
                          className="w-full h-64 object-cover"
                        />
                      </div>
                      <h2 className="text-2xl font-bold mb-3 text-primary-700">{item.title}</h2>
                      <div className="flex flex-wrap gap-4 mb-4 text-sm text-neutral-500">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>{new Date((item.publishedAt ?? item.createdAt) as any).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric'
                          })}</span>
                        </div>
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-1" />
                          <span>{item.author}</span>
                        </div>
                      </div>
                      <p className="text-neutral-600 mb-4">{item.summary}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {(item.tags || []).map((tag, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-xs font-medium"
                          >
                            <Tag className="w-3 h-3 mr-1" />
                            {tag}
                          </span>
                        ))}
                      </div>
                      <Link 
                        href={`/news/${item.id}`} 
                        className="inline-flex items-center text-primary-600 hover:text-primary-800 font-medium transition-colors group"
                      >
                        Read full article
                        <ArrowRight className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </motion.article>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-neutral-500 text-lg mb-4">No news articles found matching your search.</p>
                  <button
                    onClick={() => setSearchTerm('')}
                    className="btn-outline"
                  >
                    Clear Search
                  </button>
                </div>
              )}
            </div>
            
            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Search Bar (Desktop Only) */}
              <div className="hidden lg:block mb-8">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search news..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                </div>
              </div>
              
              {/* Popular Tags */}
              <div className="bg-neutral-50 p-6 rounded-lg mb-8">
                <h3 className="text-lg font-bold mb-4 text-primary-700">Popular Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {allTags.map((tag, index) => (
                    <button
                      key={index}
                      onClick={() => setSearchTerm(tag)}
                      className="bg-white border border-neutral-200 hover:border-primary-300 text-neutral-700 px-3 py-1 rounded-full text-sm transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Newsletter Signup */}
              <div className="bg-primary-50 p-6 rounded-lg">
                <h3 className="text-lg font-bold mb-4 text-primary-700">Subscribe to Our Newsletter</h3>
                <p className="text-neutral-600 mb-4">
                  Stay updated with our latest news, events, and resources delivered directly to your inbox.
                </p>
                <form className="space-y-3">
                  <div>
                    <input
                      type="email"
                      placeholder="Your email address"
                      className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn-primary w-full"
                  >
                    Subscribe
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default NewsPage;