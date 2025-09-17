'use client'
import React, { useState } from 'react';
// import Layout from '../components/layout/Layout';
import { Heart, CreditCard, Calendar, Check } from 'lucide-react';
import { motion } from 'framer-motion';

const DonatePage: React.FC = () => {
  const [donationAmount, setDonationAmount] = useState<number | string>(50);
  const [isMonthly, setIsMonthly] = useState(false);
  
  const predefinedAmounts = [25, 50, 100, 250];
  
  const handleAmountClick = (amount: number) => {
    setDonationAmount(amount);
  };
  
  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDonationAmount(value === '' ? '' : parseFloat(value));
  };

  return (
    <>
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-b from-primary-700 to-primary-800 text-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              className="mb-6 inline-block"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Heart className="w-16 h-16 text-white" />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">Support Our Mission</h1>
            <p className="text-lg text-primary-100">
              Your donation helps us provide mental health services to those who need it most and supports our community programs.
            </p>
          </div>
        </div>
      </section>

      {/* Donation Form */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Donation Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-8 text-primary-700">Make a Donation</h2>
              
              {/* Donation Type */}
              <div className="mb-8">
                <h3 className="text-lg font-bold mb-4 text-neutral-700">Donation Type</h3>
                <div className="flex border border-neutral-300 rounded-lg overflow-hidden">
                  <button
                    className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
                      !isMonthly ? 'bg-primary-600 text-white' : 'bg-white text-neutral-600 hover:bg-neutral-50'
                    }`}
                    onClick={() => setIsMonthly(false)}
                  >
                    One-time Donation
                  </button>
                  <button
                    className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
                      isMonthly ? 'bg-primary-600 text-white' : 'bg-white text-neutral-600 hover:bg-neutral-50'
                    }`}
                    onClick={() => setIsMonthly(true)}
                  >
                    Monthly Donation
                  </button>
                </div>
              </div>
              
              {/* Donation Amount */}
              <div className="mb-8">
                <h3 className="text-lg font-bold mb-4 text-neutral-700">Donation Amount</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                  {predefinedAmounts.map(amount => (
                    <button
                      key={amount}
                      className={`py-3 px-4 rounded-md border ${
                        donationAmount === amount
                          ? 'bg-primary-600 text-white border-primary-600'
                          : 'bg-white text-neutral-700 border-neutral-300 hover:border-primary-400'
                      } transition-colors`}
                      onClick={() => handleAmountClick(amount)}
                    >
                      ${amount}
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500">$</span>
                  <input
                    type="number"
                    placeholder="Other amount"
                    value={donationAmount === '' ? '' : donationAmount}
                    onChange={handleCustomAmountChange}
                    className="w-full pl-8 pr-4 py-3 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
              
              {/* Payment Information */}
              <div className="mb-8">
                <h3 className="text-lg font-bold mb-4 text-neutral-700">Payment Information</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <label htmlFor="cardNumber" className="block text-sm font-medium text-neutral-700 mb-1">
                      Card Number *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="cardNumber"
                        name="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        required
                        className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                      <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="expiryDate" className="block text-sm font-medium text-neutral-700 mb-1">
                        Expiry Date *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="expiryDate"
                          name="expiryDate"
                          placeholder="MM/YY"
                          required
                          className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="cvv" className="block text-sm font-medium text-neutral-700 mb-1">
                        CVV *
                      </label>
                      <input
                        type="text"
                        id="cvv"
                        name="cvv"
                        placeholder="123"
                        required
                        className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Submit Button */}
              <button type="submit" className="btn-primary w-full py-3 text-lg">
                {isMonthly ? 'Donate Monthly' : 'Donate Now'} {donationAmount !== '' && `$${donationAmount}`}
              </button>
              
              {/* Secure Payment Note */}
              <p className="text-center text-neutral-500 text-sm mt-4">
                <span className="inline-flex items-center">
                  <Check className="w-4 h-4 mr-1 text-success-500" />
                  Secure payment
                </span>
              </p>
            </motion.div>
            
            {/* Impact Information */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-8 text-primary-700">Your Impact</h2>
              
              <div className="bg-primary-50 rounded-lg p-6 mb-8">
                <h3 className="text-xl font-bold mb-4 text-primary-700">How Your Donation Helps</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="bg-primary-100 p-2 rounded-full mr-3 mt-1">
                      <Heart className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-primary-800">$25</h4>
                      <p className="text-neutral-600">Provides educational materials for a mental health workshop</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-primary-100 p-2 rounded-full mr-3 mt-1">
                      <Heart className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-primary-800">$50</h4>
                      <p className="text-neutral-600">Sponsors a therapy session for someone who cannot afford it</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-primary-100 p-2 rounded-full mr-3 mt-1">
                      <Heart className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-primary-800">$100</h4>
                      <p className="text-neutral-600">Funds a community mental health training session</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-primary-100 p-2 rounded-full mr-3 mt-1">
                      <Heart className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-primary-800">$250</h4>
                      <p className="text-neutral-600">Provides a full month of therapy for an individual in need</p>
                    </div>
                  </li>
                </ul>
              </div>
              
              {/* Testimonial */}
              <div className="bg-white border border-neutral-200 rounded-lg p-6 shadow-sm">
                <p className="text-neutral-600 italic mb-4">
                  "Thanks to the generous donations received by Cal-me, I was able to access mental health 
                  services that I otherwise couldn't afford. The therapy and resources provided have been 
                  life-changing for me and my family."
                </p>
                <p className="font-medium text-neutral-800">— Jessica R., Program Recipient</p>
              </div>
              
              {/* Other Ways to Give */}
              <div className="mt-8">
                <h3 className="text-xl font-bold mb-4 text-primary-700">Other Ways to Give</h3>
                <ul className="space-y-3 text-neutral-600">
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-primary-600 mr-2 mt-0.5" />
                    <span>Mail a check to our office address</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-primary-600 mr-2 mt-0.5" />
                    <span>Corporate matching gift programs</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-primary-600 mr-2 mt-0.5" />
                    <span>In-kind donations of supplies or services</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-primary-600 mr-2 mt-0.5" />
                    <span>Planned giving and bequests</span>
                  </li>
                </ul>
                <p className="mt-4 text-neutral-600">
                  For more information on these options, please <a href="/contact" className="text-primary-600 hover:text-primary-800">contact us</a>.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-16 bg-primary-700 text-white">
        <div className="container">
          <h2 className="text-3xl font-bold mb-12 text-white text-center">Your Support Makes a Difference</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="text-4xl font-bold mb-2 text-white">5,000+</div>
              <p className="text-primary-100">Individuals supported through therapy sessions</p>
            </motion.div>
            
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="text-4xl font-bold mb-2 text-white">50+</div>
              <p className="text-primary-100">Community mental health workshops conducted</p>
            </motion.div>
            
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="text-4xl font-bold mb-2 text-white">20+</div>
              <p className="text-primary-100">Schools reached through youth mental health programs</p>
            </motion.div>
            
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="text-4xl font-bold mb-2 text-white">85%</div>
              <p className="text-primary-100">Of funds directly support mental health programs</p>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

export default DonatePage;