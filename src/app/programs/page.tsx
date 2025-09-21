"use client"
import React, { useMemo, useState } from 'react';
// import Layout from '../components/layout/Layout';
import { Calendar, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { api } from '@/trpc/react';

const ProgramsPage: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');
  const { data: page } = api.programs.getAll.useQuery({ limit: 100 });
  const programs = page?.items ?? [];

  const filteredPrograms = useMemo(() => {
    if (filter === 'all') return programs;
    if (filter === 'upcoming') return programs.filter(p => p.isUpcoming);
    if (filter === 'past') return programs.filter(p => !p.isUpcoming);
    return programs;
  }, [filter, programs]);

  return (
    <>
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-b from-primary-700 to-primary-800 text-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">Our Programs</h1>
            <p className="text-lg text-primary-100">
              Discover our workshops, events, and initiatives designed to promote mental health and wellbeing in our community.
            </p>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-16 bg-white">
        <div className="container">
          {/* Filter Tabs */}
          <div className="flex justify-center mb-10">
            <div className="inline-flex bg-neutral-100 rounded-lg p-1">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  filter === 'all' 
                    ? 'bg-primary-600 text-white' 
                    : 'text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                All Programs
              </button>
              <button
                onClick={() => setFilter('upcoming')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  filter === 'upcoming' 
                    ? 'bg-primary-600 text-white' 
                    : 'text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                Upcoming
              </button>
              <button
                onClick={() => setFilter('past')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  filter === 'past' 
                    ? 'bg-primary-600 text-white' 
                    : 'text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                Past Programs
              </button>
            </div>
          </div>

          {/* Programs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredPrograms.length > 0 ? (
              filteredPrograms.map((program, index) => (
                <motion.div
                  key={program.id}
                  className="card overflow-hidden flex flex-col"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="relative h-64">
                      <img
                      src={program.imageUrl ?? undefined}
                      alt={program.title}
                      className="w-full h-full object-cover"
                    />
                    {program.isUpcoming && (
                      <div className="absolute top-4 right-4 bg-accent-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Upcoming
                      </div>
                    )}
                  </div>
                  <div className="p-6">
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
                    <p className="text-neutral-600 mb-6">{program.description}</p>
                    
                    {program.videoUrl && !program.isUpcoming && (
                      <div className="mb-4">
                        <h4 className="text-lg font-medium mb-2 text-primary-700">Event Recording</h4>
                        <div className="aspect-video rounded-lg overflow-hidden">
                          <iframe
                            width="100%"
                            height="100%"
                            src={program.videoUrl}
                            title={program.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full"
                          ></iframe>
                        </div>
                      </div>
                    )}
                    
                    {program.isUpcoming && (
                      <button className="btn-primary w-full">
                        Register Now
                      </button>
                    )}
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-1 md:col-span-2 text-center py-12">
                <p className="text-neutral-500 text-lg">No programs found for the selected filter.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-primary-50">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6 text-primary-700">Suggest a Program</h2>
            <p className="text-neutral-600 mb-8">
              Have an idea for a mental health program or workshop that could benefit our community? 
              We'd love to hear from you and explore potential collaborations.
            </p>
            <a href="/contact" className="btn-primary">
              Contact Us With Your Ideas
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProgramsPage;