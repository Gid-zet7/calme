"use client"
import React from 'react';
import Link from 'next/link';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { api } from '@/trpc/react';

const UpcomingPrograms: React.FC = () => {
  const { data: upcomingPrograms } = api.programs.getUpcoming.useQuery({ limit: 4 });
  
  return (
    <section className="py-16 bg-white">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Upcoming Programs</h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            Join our upcoming events and workshops designed to support mental health and wellbeing in our community.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {(upcomingPrograms ?? []).map((program, index) => (
            <motion.div
              key={program.id}
              className="card overflow-hidden flex flex-col md:flex-row"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="md:w-2/5 h-48 md:h-auto">
                <img
                  src={program.imageUrl ?? undefined}
                  alt={program.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 md:w-3/5">
                <h3 className="text-xl font-bold mb-2 text-primary-700">{program.title}</h3>
                <div className="flex items-center text-neutral-500 mb-3 text-sm">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>{new Date(program.date as any).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric'
                  })}</span>
                </div>
                <div className="flex items-center text-neutral-500 mb-4 text-sm">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{program.location}</span>
                </div>
                <p className="text-neutral-600 mb-4">{program.description}</p>
                <Link href={`/programs/${program.id}`} className="text-primary-600 hover:text-primary-800 font-medium inline-flex items-center">
                  Learn more
                  <ArrowRight className="ml-1 w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="text-center mt-10">
          <Link 
            href="/programs" 
            className="btn-outline"
          >
            View All Programs
          </Link>
        </div>
      </div>
    </section>
  );
};

export default UpcomingPrograms;