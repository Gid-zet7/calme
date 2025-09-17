'use client'
import React from 'react';
import Link from 'next/link';
import { psychologistsData } from '@/data/psychologistsData';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const BookingPreview: React.FC = () => {
  // Show only first 3 psychologists
  const featuredPsychologists = psychologistsData.slice(0, 3);
  
  return (
    <section className="py-16 bg-white">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Meet Our Psychologists</h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            Our team of experienced, licensed professionals is here to support your mental health journey.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredPsychologists.map((psychologist, index) => (
            <motion.div
              key={psychologist.id}
              className="card h-full flex flex-col"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="h-64 overflow-hidden">
                <img
                  src={psychologist.imageUrl}
                  alt={psychologist.name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold mb-1 text-primary-700">{psychologist.name}</h3>
                <p className="text-secondary-600 font-medium mb-3">{psychologist.specialization}</p>
                <p className="text-neutral-600 mb-4 flex-grow">{psychologist.bio.substring(0, 120)}...</p>
                <div className="mt-2">
                  <span className="text-sm font-medium text-neutral-700">Available on: </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {psychologist.availability.map((day: string, i: number) => (
                      <span
                        key={i}
                        className="inline-block bg-neutral-100 text-neutral-700 rounded-full px-2 py-1 text-xs"
                      >
                        {day}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="text-center mt-10">
          <Link 
            href="/book-appointment" 
            className="btn-primary inline-flex items-center group hover:text-white"
          >
            Book an Appointment
            <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BookingPreview;