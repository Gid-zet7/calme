'use client'
import React from 'react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const Hero: React.FC = () => {
  return (
    <section className="relative bg-gradient-to-br from-primary-700 to-primary-900 text-white py-20 md:py-32">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-5 -top-5 w-64 h-64 md:w-96 md:h-96 rounded-full bg-primary-500 opacity-10 blur-3xl"></div>
        <div className="absolute left-1/4 bottom-0 w-48 h-48 md:w-80 md:h-80 rounded-full bg-secondary-500 opacity-10 blur-3xl"></div>
      </div>
      
      <div className="container relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Your Mental Health<br />Is Our Priority
          </motion.h1>
          
          <motion.p 
            className="text-lg md:text-xl text-neutral-100 mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Calme provides accessible mental health resources, professional support, 
            and community programs to help you navigate life's challenges and thrive.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Link 
              href="/book-appointment" 
              className="btn-primary btn-lg group hover:text-white"
            >
              Book an Appointment
              <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link 
              href="/resources" 
              className="btn bg-white text-primary-700 hover:bg-neutral-100 btn-lg"
            >
              Explore Resources
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;