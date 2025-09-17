'use client'
import React, { useState } from 'react';
// import Layout from '../components/layout/Layout';
import { psychologistsData } from '@/data/psychologistsData';
import { Calendar, Search, MapPin, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const BookAppointmentPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('All');
  const [selectedDay, setSelectedDay] = useState('Any Day');
  
  // Get unique specializations
  const specializations = ['All', ...new Set(psychologistsData.map(psych => psych.specialization))];
  
  // Get unique days
  const days = ['Any Day', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  // Filter psychologists based on search and filters
  const filteredPsychologists = psychologistsData.filter(psych => {
    const matchesSearch = 
      psych.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      psych.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      psych.bio.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSpecialization = 
      selectedSpecialization === 'All' || 
      psych.specialization === selectedSpecialization;
    
    const matchesDay = 
      selectedDay === 'Any Day' || 
      psych.availability.includes(selectedDay);
    
    return matchesSearch && matchesSpecialization && matchesDay;
  });

  return (
    <>
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-b from-primary-700 to-primary-800 text-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">Book an Appointment</h1>
            <p className="text-lg text-primary-100">
              Find the right mental health professional for your needs and schedule a consultation.
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-white border-b border-neutral-200">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-stretch gap-4">
            {/* Search Bar */}
            <div className="relative w-full md:w-auto md:flex-grow">
              <input
                type="text"
                placeholder="Search by name or specialization..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
            </div>
            
            {/* Specialization Filter */}
            <div className="w-full md:w-auto">
              <select
                value={selectedSpecialization}
                onChange={(e) => setSelectedSpecialization(e.target.value)}
                className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
              >
                {specializations.map((specialization, index) => (
                  <option key={index} value={specialization}>
                    {specialization === 'All' ? 'All Specializations' : specialization}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Day Filter */}
            <div className="w-full md:w-auto">
              <select
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
                className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
              >
                {days.map((day, index) => (
                  <option key={index} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Psychologists Grid */}
      {/* <section className="py-16 bg-neutral-50">
        <div className="container">
          {filteredPsychologists.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPsychologists.map((psych, index) => (
                <motion.div
                  key={psych.id}
                  className="card h-full flex flex-col"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="h-64 overflow-hidden">
                    <img
                      src={psych.imageUrl}
                      alt={psych.name}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold mb-1 text-primary-700">{psych.name}</h3>
                    <p className="text-secondary-600 font-medium mb-3">{psych.specialization}</p>
                    <p className="text-neutral-600 mb-4 flex-grow">{psych.bio}</p>
                    
                    <div className="mb-4">
                      <h4 className="font-medium text-neutral-700 mb-2">Available on:</h4>
                      <div className="flex flex-wrap gap-2">
                        {psych.availability.map((day, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-xs font-medium"
                          >
                            <Calendar className="w-3 h-3 mr-1" />
                            {day}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <button className="btn-primary">
                      Book Appointment
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-neutral-500 text-lg mb-4">No psychologists found matching your criteria.</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedSpecialization('All');
                  setSelectedDay('Any Day');
                }}
                className="btn-outline"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section> */}

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-primary-700">How It Works</h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              Booking an appointment with Cal-me is simple and convenient. Follow these steps to get started.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="bg-primary-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-primary-700">1. Find a Psychologist</h3>
              <p className="text-neutral-600">
                Browse our list of qualified professionals and find someone who matches your needs and preferences.
              </p>
            </motion.div>
            
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="bg-primary-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-primary-700">2. Select a Time</h3>
              <p className="text-neutral-600">
                Choose from available time slots that fit your schedule. Our booking system is integrated with Google Calendar for real-time availability.
              </p>
            </motion.div>
            
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="bg-primary-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-primary-700">3. Attend Your Session</h3>
              <p className="text-neutral-600">
                Attend your session in-person at our facility or via video call, depending on your preference and the psychologist's availability.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-neutral-50">
        


          <div
    className="container relative w-full bg-white px-6 pt-10 pb-8 mt-8 shadow-xl ring-1 ring-gray-900/5 sm:mx-auto sm:max-w-2xl sm:rounded-lg sm:px-10">
    <div className="mx-auto px-5 mb-12">
        <div className="flex flex-col items-center">
            <h2 className=" mb-4 text-primary-700 mt-5 text-center text-3xl font-bold tracking-tight md:text-5xl">FAQ</h2>
            <p className="text-neutral-600 max-w-2xl mx-auto mt-3 text-lg md:text-xl">Find answers to common questions about our booking process and services.
            </p>
        </div>

        <div className="max-w-3xl mx-auto">
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >

              <div className="mx-auto mt-8 grid max-w-xl divide-y divide-neutral-200">
                <details className="group">
                    <summary className="flex cursor-pointer list-none items-center justify-between font-medium">
                        <span className='text-xl font-bold mb-2 text-primary-700'> What should I expect in my first session?</span>
                        <span className="transition group-open:rotate-180">
                                <svg fill="none" height="24" shape-rendering="geometricPrecision"
                                    stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                    stroke-width="1.5" viewBox="0 0 24 24" width="24">
                                    <path d="M6 9l6 6 6-6"></path>
                                </svg>
                            </span>
                    </summary>
                    <p className="group-open:animate-fadeIn mt-3 text-neutral-600">Your first session will typically involve getting to know your psychologist and discussing your 
                concerns and goals for therapy. The psychologist will ask questions about your history, current 
                situation, and what you hope to achieve through therapy. This initial assessment helps tailor 
                the approach to your specific needs.
                    </p>
                </details>
            </div>
            </motion.div>


          </div>

          <div className="max-w-3xl mx-auto">
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >

              <div className="mx-auto mt-8 grid max-w-xl divide-y divide-neutral-200">
                <details className="group">
                    <summary className="flex cursor-pointer list-none items-center justify-between font-medium">
                        <span className='text-xl font-bold mb-2 text-primary-700'> How long are the sessions?</span>
                        <span className="transition group-open:rotate-180">
                                <svg fill="none" height="24" shape-rendering="geometricPrecision"
                                    stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                    stroke-width="1.5" viewBox="0 0 24 24" width="24">
                                    <path d="M6 9l6 6 6-6"></path>
                                </svg>
                            </span>
                    </summary>
                    <p className="group-open:animate-fadeIn mt-3 text-neutral-600"> Standard therapy sessions are 50 minutes long. Initial consultations may be slightly longer 
                to allow time for a comprehensive assessment. Some specialized sessions or assessments may 
                have different durations, which will be communicated to you when booking.
                    </p>
                </details>
            </div>
            </motion.div>
          </div>

           <div className="max-w-3xl mx-auto">
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >

              <div className="mx-auto mt-8 grid max-w-xl divide-y divide-neutral-200">
                <details className="group">
                    <summary className="flex cursor-pointer list-none items-center justify-between font-medium">
                        <span className='text-xl font-bold mb-2 text-primary-700'> What payment methods do you accept?</span>
                        <span className="transition group-open:rotate-180">
                                <svg fill="none" height="24" shape-rendering="geometricPrecision"
                                    stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                    stroke-width="1.5" viewBox="0 0 24 24" width="24">
                                    <path d="M6 9l6 6 6-6"></path>
                                </svg>
                            </span>
                    </summary>
                    <p className="group-open:animate-fadeIn mt-3 text-neutral-600"> We accept various payment methods including credit/debit cards, health savings accounts (HSA), 
                and flexible spending accounts (FSA). We also work with many insurance providers. Please contact 
                our office for specific information about your insurance coverage.
                    </p>
                </details>
            </div>
            </motion.div>
          </div>

           <div className="max-w-3xl mx-auto">
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >

              <div className="mx-auto mt-8 grid max-w-xl divide-y divide-neutral-200">
                <details className="group">
                    <summary className="flex cursor-pointer list-none items-center justify-between font-medium">
                        <span className='text-xl font-bold mb-2 text-primary-700'> What is your cancellation policy?</span>
                        <span className="transition group-open:rotate-180">
                                <svg fill="none" height="24" shape-rendering="geometricPrecision"
                                    stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                    stroke-width="1.5" viewBox="0 0 24 24" width="24">
                                    <path d="M6 9l6 6 6-6"></path>
                                </svg>
                            </span>
                    </summary>
                    <p className="group-open:animate-fadeIn mt-3 text-neutral-600">  We request at least 24 hours' notice for cancellations. Late cancellations or missed appointments 
                may incur a fee. We understand that emergencies happen, so please contact us as soon as possible 
                if you need to reschedule.
                    </p>
                </details>
            </div>
            </motion.div>
          </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default BookAppointmentPage;