'use client'
import React, { useState } from 'react';
// import Layout from '../components/layout/Layout';
import { resourcesData } from '@/data/resourcesData';
import { Download, Search } from 'lucide-react';
import { motion } from 'framer-motion';

const ResourcesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  
  // Get unique categories from resources
  const categories = ['All', ...new Set(resourcesData.map(resource => resource.category))];
  
  // Filter resources based on search term and active category
  const filteredResources = resourcesData.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All' || resource.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-b from-primary-700 to-primary-800 text-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">Mental Health Resources</h1>
            <p className="text-lg text-primary-100">
              Access our collection of expert-created resources to help you understand and manage various aspects of mental health.
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-white border-b border-neutral-200">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Search Bar */}
            <div className="relative w-full md:w-auto md:flex-grow md:max-w-md">
              <input
                type="text"
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
            </div>
            
            {/* Category Filters */}
            <div className="flex flex-wrap justify-center gap-2 w-full md:w-auto">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeCategory === category
                      ? 'bg-primary-600 text-white'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Resources Grid */}
      <section className="py-16 bg-neutral-50">
        <div className="container">
          {filteredResources.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredResources.map((resource, index) => (
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
                    {resource.downloadUrl && (
                      <a
                        href={resource.downloadUrl}
                        className="btn-primary inline-flex items-center justify-center"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download Resource
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-neutral-500 text-lg mb-4">No resources found matching your criteria.</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setActiveCategory('All');
                }}
                className="btn-outline"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Additional Help Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6 text-primary-700">Need Additional Help?</h2>
            <p className="text-neutral-600 mb-8">
              If you're experiencing a mental health crisis or need immediate support, 
              please don't hesitate to reach out to these emergency resources:
            </p>
            <div className="bg-neutral-50 p-6 rounded-lg shadow-sm">
              <ul className="space-y-3 text-left">
                <li className="flex items-start">
                  <span className="bg-primary-100 text-primary-700 font-medium px-2 py-1 rounded mr-2">Crisis Hotline:</span>
                  <span className="text-neutral-700">1-800-273-TALK (8255)</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary-100 text-primary-700 font-medium px-2 py-1 rounded mr-2">Text Line:</span>
                  <span className="text-neutral-700">Text HOME to 741741</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary-100 text-primary-700 font-medium px-2 py-1 rounded mr-2">Emergency:</span>
                  <span className="text-neutral-700">Call 911 or go to your nearest emergency room</span>
                </li>
              </ul>
            </div>
            <div className="mt-8">
              <a href="/book-appointment" className="btn-primary">
                Book an Appointment With a Professional
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ResourcesPage;