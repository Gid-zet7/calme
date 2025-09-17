'use client'
import React from 'react';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const CallToAction: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-secondary-600 to-secondary-800 text-white">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            className="mb-8 inline-block"
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Heart className="w-16 h-16 text-white" />
          </motion.div>
          
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-6 text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Support Our Mission to Improve Mental Health
          </motion.h2>
          
          <motion.p 
            className="text-lg text-secondary-100 mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            Your donation helps us provide mental health services to those who need it most. 
            Together, we can create a community where everyone has access to the support they need.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Link 
              href="/donate" 
              className="btn bg-accent-500 hover:bg-accent-600 text-white shadow-lg hover:shadow-xl btn-lg"
            >
              Donate Now
            </Link>
            <Link 
              href="/contact" 
              className="btn bg-white text-secondary-700 hover:bg-neutral-100 btn-lg"
            >
              Get Involved
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;