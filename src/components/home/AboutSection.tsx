'use client'
import React from 'react';
import Link from 'next/link';
import { Heart, BookOpen, Users, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

const AboutSection: React.FC = () => {
  const features = [
    {
      icon: <Heart className="w-6 h-6 text-primary-600" />,
      title: 'Professional Support',
      description: 'Our team of qualified mental health professionals provides compassionate care tailored to your needs.'
    },
    {
      icon: <BookOpen className="w-6 h-6 text-primary-600" />,
      title: 'Educational Resources',
      description: 'Access evidence-based information and guides to help you understand and manage mental health challenges.'
    },
    {
      icon: <Users className="w-6 h-6 text-primary-600" />,
      title: 'Community Programs',
      description: 'Join our workshops, support groups, and community events designed to foster connection and growth.'
    },
    {
      icon: <Calendar className="w-6 h-6 text-primary-600" />,
      title: 'Flexible Scheduling',
      description: 'Book appointments that fit your schedule with our convenient online booking system.'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4">About Calme</h2>
            <p className="text-neutral-600 mb-6">
              Calme was founded with a simple but powerful mission: to make quality mental health care 
              accessible to everyone. We believe that mental wellbeing is a fundamental right, not a privilege.
            </p>
            <p className="text-neutral-600 mb-6">
              Our team of experienced professionals is dedicated to providing compassionate support, 
              evidence-based treatment, and practical resources to help individuals and communities 
              thrive mentally and emotionally.
            </p>
            <Link href="/about" className="btn-primary">
              Learn More About Us
            </Link>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {features.map((feature, index) => (
              <motion.div 
                key={index} 
                className="bg-neutral-50 p-6 rounded-lg shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="bg-primary-50 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold mb-2 text-primary-700">{feature.title}</h3>
                <p className="text-neutral-600">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;