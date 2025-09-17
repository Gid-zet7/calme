'use client'
import React from 'react';
import { partnersData } from '@/data/partnersData';
import { motion } from 'framer-motion';

const Partners: React.FC = () => {
  return (
    <section className="py-16 bg-neutral-50">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Partners</h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            We collaborate with leading organizations committed to advancing mental health care and resources.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {partnersData.map((partner, index) => (
            <motion.a
              key={partner.id}
              href={partner.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center h-full"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="w-24 h-24 mb-4 rounded-full overflow-hidden flex items-center justify-center bg-neutral-100">
                <img
                  src={partner.logoUrl}
                  alt={partner.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-lg font-bold mb-2 text-primary-700">{partner.name}</h3>
              <p className="text-neutral-600 text-sm">{partner.description}</p>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Partners;