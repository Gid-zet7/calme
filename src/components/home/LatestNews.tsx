"use client"
import React from 'react';
import Link from 'next/link';
import { Calendar, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { api } from '@/trpc/react';

const LatestNews: React.FC = () => {
  const { data: latestNews } = api.news.getLatest.useQuery({ limit: 3 });
  
  return (
    <section className="py-16 bg-neutral-50">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Latest News</h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            Stay informed with the latest updates, articles, and announcements from Cal-me.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {(latestNews ?? []).map((news, index) => (
            <motion.div
              key={news.id}
              className="card h-full flex flex-col"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={news.imageUrl ?? undefined}
                  alt={news.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center text-neutral-500 mb-3 text-sm">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>{new Date((news.publishedAt ?? news.createdAt) as any).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric'
                  })}</span>
                </div>
                <h3 className="text-xl font-bold mb-2 text-primary-700">{news.title}</h3>
                <p className="text-neutral-600 mb-4 flex-grow">{news.summary}</p>
                <Link 
                  href={`/news/${news.id}`} 
                  className="inline-flex items-center text-primary-600 hover:text-primary-800 font-medium transition-colors group"
                >
                  Read more
                  <ArrowRight className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="text-center mt-10">
          <Link 
            href="/news" 
            className="btn-outline"
          >
            View All News
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LatestNews;