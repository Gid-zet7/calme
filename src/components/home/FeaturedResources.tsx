'use client'
import React from 'react';
import Link from 'next/link';
import { ArrowRight, Download } from 'lucide-react';
import { resourcesData } from '@/data/resourcesData';
import { motion } from 'framer-motion';

const FeaturedResources: React.FC = () => {
  // Take only first 3 resources for the featured section
  const featuredResources = resourcesData.slice(0, 3);
  
  return (
    <section className="py-16 bg-neutral-50">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Mental Health Resources</h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            Access our collection of expert-created resources to help you understand 
            and manage various aspects of mental health and wellbeing.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredResources.map((resource, index) => (
            <motion.div
              key={resource.id}
              className="card h-full flex flex-col"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={resource.imageUrl}
                  alt={resource.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="mb-2">
                  <span className="inline-block bg-primary-100 text-primary-700 rounded-full px-3 py-1 text-xs font-medium">
                    {resource.category}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-2 text-primary-700">{resource.title}</h3>
                <p className="text-neutral-600 mb-4 flex-grow">{resource.description}</p>
                <div className="flex justify-between items-center">
                  {resource.downloadUrl && (
                    <a 
                      href={resource.downloadUrl} 
                      className="inline-flex items-center text-primary-600 hover:text-primary-800 transition-colors"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      <span>Download</span>
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="text-center mt-10">
          <Link 
            href="/resources" 
            className="inline-flex items-center text-primary-600 hover:text-primary-800 font-medium transition-colors group"
          >
            View all resources
            <ArrowRight className="ml-1 w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedResources;