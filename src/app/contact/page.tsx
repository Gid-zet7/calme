'use client'
import React from 'react';
// import Layout from '../components/layout/Layout';
import { MapPin, Phone, Mail, Clock, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { motion } from 'framer-motion';

const ContactPage: React.FC = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-b from-primary-700 to-primary-800 text-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">Contact Us</h1>
            <p className="text-lg text-primary-100">
              Have questions or want to get involved? We'd love to hear from you.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-6 text-primary-700">Get in Touch</h2>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-neutral-700 mb-1">
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      required
                      className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-neutral-700 mb-1">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      required
                      className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-neutral-700 mb-1">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-neutral-700 mb-1">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  ></textarea>
                </div>
                <button type="submit" className="btn-primary w-full md:w-auto">
                  Send Message
                </button>
              </form>
            </motion.div>
            
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-6 text-primary-700">Contact Information</h2>
              <div className="bg-neutral-50 p-6 rounded-lg shadow-sm mb-8">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <MapPin className="w-5 h-5 text-primary-600 mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-neutral-800">Address</h3>
                      <p className="text-neutral-600">123 Mental Health Ave, Wellness City, WC 10101</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Phone className="w-5 h-5 text-primary-600 mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-neutral-800">Phone</h3>
                      <p className="text-neutral-600">(123) 456-7890</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Mail className="w-5 h-5 text-primary-600 mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-neutral-800">Email</h3>
                      <p className="text-neutral-600">info@cal-me.org</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Clock className="w-5 h-5 text-primary-600 mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-neutral-800">Hours</h3>
                      <p className="text-neutral-600">Monday - Friday: 9:00 AM - 6:00 PM</p>
                      <p className="text-neutral-600">Saturday: 10:00 AM - 2:00 PM</p>
                      <p className="text-neutral-600">Sunday: Closed</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Social Media */}
              <h3 className="text-xl font-bold mb-4 text-primary-700">Connect With Us</h3>
              <div className="flex space-x-4 mb-8">
                <a href="#" className="bg-neutral-50 hover:bg-primary-50 p-3 rounded-full transition-colors">
                  <Facebook className="w-6 h-6 text-primary-600" />
                </a>
                <a href="#" className="bg-neutral-50 hover:bg-primary-50 p-3 rounded-full transition-colors">
                  <Twitter className="w-6 h-6 text-primary-600" />
                </a>
                <a href="#" className="bg-neutral-50 hover:bg-primary-50 p-3 rounded-full transition-colors">
                  <Instagram className="w-6 h-6 text-primary-600" />
                </a>
                <a href="#" className="bg-neutral-50 hover:bg-primary-50 p-3 rounded-full transition-colors">
                  <Linkedin className="w-6 h-6 text-primary-600" />
                </a>
              </div>
              

            </motion.div>
          </div>
        </div>
      </section>

      {/* Partnership & Volunteer */}
      <section className="py-16 bg-neutral-50">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Partner with Us */}
            <motion.div
              className="bg-white p-8 rounded-lg shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold mb-4 text-primary-700">Partner with Us</h3>
              <p className="text-neutral-600 mb-6">
                Cal-me collaborates with organizations that share our commitment to improving mental health.
                If you represent a business, non-profit, or community group interested in partnering with us,
                we'd love to explore opportunities for collaboration.
              </p>
              <div className="space-y-4">
                <div>
                  <label htmlFor="orgName" className="block text-sm font-medium text-neutral-700 mb-1">
                    Organization Name *
                  </label>
                  <input
                    type="text"
                    id="orgName"
                    name="orgName"
                    className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label htmlFor="partnerEmail" className="block text-sm font-medium text-neutral-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="partnerEmail"
                    name="partnerEmail"
                    className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label htmlFor="partnershipIdea" className="block text-sm font-medium text-neutral-700 mb-1">
                    Partnership Idea *
                  </label>
                  <textarea
                    id="partnershipIdea"
                    name="partnershipIdea"
                    rows={3}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  ></textarea>
                </div>
                <button type="submit" className="btn-primary">
                  Submit Partnership Inquiry
                </button>
              </div>
            </motion.div>
            
            {/* Volunteer */}
            <motion.div
              className="bg-white p-8 rounded-lg shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold mb-4 text-primary-700">Become a Volunteer</h3>
              <p className="text-neutral-600 mb-6">
                Volunteers play a crucial role in supporting our mission. Whether you have professional skills
                to contribute or simply a passion for mental health advocacy, there are many ways to get involved.
              </p>
              <div className="space-y-4">
                <div>
                  <label htmlFor="volunteerName" className="block text-sm font-medium text-neutral-700 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    id="volunteerName"
                    name="volunteerName"
                    className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label htmlFor="volunteerEmail" className="block text-sm font-medium text-neutral-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="volunteerEmail"
                    name="volunteerEmail"
                    className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label htmlFor="volunteerInterests" className="block text-sm font-medium text-neutral-700 mb-1">
                    Areas of Interest *
                  </label>
                  <select
                    id="volunteerInterests"
                    name="volunteerInterests"
                    className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
                  >
                    <option value="">Select an area</option>
                    <option value="events">Event Support</option>
                    <option value="admin">Administrative Assistance</option>
                    <option value="outreach">Community Outreach</option>
                    <option value="marketing">Marketing & Communications</option>
                    <option value="fundraising">Fundraising</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="volunteerMessage" className="block text-sm font-medium text-neutral-700 mb-1">
                    Tell Us About Yourself *
                  </label>
                  <textarea
                    id="volunteerMessage"
                    name="volunteerMessage"
                    rows={3}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  ></textarea>
                </div>
                <button type="submit" className="btn-primary">
                  Submit Volunteer Application
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactPage;