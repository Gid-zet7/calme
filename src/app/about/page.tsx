'use client'
import React from 'react';
// import Layout from '../components/layout/Layout';
import { teamData } from '@/data/teamData';
import { partnersData } from '@/data/partnersData';
import { motion } from 'framer-motion';

const AboutPage: React.FC = () => {
  return (
    // <Layout>
    <>
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-b from-primary-700 to-primary-800 text-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">About Calme</h1>
            <p className="text-lg text-primary-100">
              Dedicated to improving mental health through accessible care, resources, and community support.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-6 text-primary-700">Our Mission</h2>
              <p className="text-neutral-600 mb-4">
                At Cal-me, our mission is to make quality mental health care accessible to everyone, 
                regardless of background or circumstances. We believe that mental wellbeing is a 
                fundamental right, not a privilege.
              </p>
              <p className="text-neutral-600">
                We strive to create a world where seeking help for mental health concerns is normalized, 
                stigma is eliminated, and everyone has the resources they need to thrive mentally and emotionally.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-6 text-primary-700">Our Vision</h2>
              <p className="text-neutral-600 mb-4">
                We envision a society where mental health is prioritized just as much as physical health, 
                where barriers to care are removed, and where individuals feel empowered to seek the 
                support they need without fear or hesitation.
              </p>
              <p className="text-neutral-600">
                Cal-me aims to be at the forefront of this transformation, continuously innovating 
                and expanding our services to meet the evolving mental health needs of our community.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 bg-neutral-50">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-primary-700 text-center">Our Story</h2>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <p className="text-neutral-600 mb-4">
                Cal-me was founded in 2015 by Dr. Sarah Johnson, a clinical psychologist who recognized the 
                significant gap in accessible mental health services in our community. After years of working 
                in traditional mental health settings, Dr. Johnson observed how financial constraints, 
                stigma, and lack of resources prevented many individuals from receiving the care they needed.
              </p>
              <p className="text-neutral-600 mb-4">
                What began as a small practice with just three therapists has grown into a comprehensive 
                mental health organization offering a wide range of services, from individual therapy 
                and group programs to community workshops and educational resources.
              </p>
              <p className="text-neutral-600">
                Throughout our growth, we've remained committed to our core values of compassion, 
                accessibility, and evidence-based care. Every decision we make is guided by our 
                dedication to improving the mental wellbeing of our community members and breaking 
                down barriers to quality mental health care.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-16 bg-white">
        <div className="container">
          <h2 className="text-3xl font-bold mb-12 text-primary-700 text-center">Our Leadership Team</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamData.map((member, index) => (
              <motion.div
                key={member.id}
                className="card h-full flex flex-col"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={member.imageUrl}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold mb-1 text-primary-700">{member.name}</h3>
                  <p className="text-secondary-600 font-medium mb-3">{member.position}</p>
                  <p className="text-neutral-600 flex-grow">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Partners */}
      <section className="py-16 bg-neutral-50">
        <div className="container">
          <h2 className="text-3xl font-bold mb-12 text-primary-700 text-center">Our Partners</h2>
          
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
                <div className="w-32 h-32 mb-6 rounded-full overflow-hidden flex items-center justify-center bg-neutral-100">
                  <img
                    src={partner.logoUrl}
                    alt={partner.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold mb-2 text-primary-700">{partner.name}</h3>
                <p className="text-neutral-600">{partner.description}</p>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-primary-700 text-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6 text-white">Join Our Mission</h2>
            <p className="text-primary-100 mb-8">
              Whether you're seeking mental health support, looking to volunteer, or want to partner with us, 
              we welcome you to the Cal-me community.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a href="/contact" className="btn bg-white text-primary-700 hover:bg-neutral-100">
                Contact Us
              </a>
              <a href="/donate" className="btn bg-accent-500 hover:bg-accent-600 text-white">
                Support Our Work
              </a>
            </div>
          </div>
        </div>
      </section>
      </>
  );
};

export default AboutPage;