"use client"
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { motion } from 'framer-motion';
import { api } from '@/trpc/react';

const Testimonials: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const { data: testimonials } = api.testimonials.getAll.useQuery();

  const nextTestimonial = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-20 bg-primary-700 text-white">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-white">What People Say</h2>
          <p className="text-primary-100 max-w-2xl mx-auto">
            Hear from those who have experienced the positive impact of Cal-me's services and programs.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {(testimonials ?? []).map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                className={`${index === activeIndex ? 'block' : 'hidden'}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <div className="bg-primary-800 rounded-lg p-8 md:p-10 shadow-xl relative">
                  <Quote className="absolute top-6 left-6 w-12 h-12 text-primary-600 opacity-20" />
                  
                  <div className="text-center">
                    <p className="text-lg md:text-xl italic mb-6 relative z-10 text-primary-100">
                      "{testimonial.content}"
                    </p>
                    
                    <div className="flex items-center justify-center">
                      {testimonial.imageUrl ? (
                        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary-500 mr-4">
                          <img
                            src={testimonial.imageUrl ?? undefined}
                            alt={testimonial.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-primary-600 flex items-center justify-center text-white text-xl font-bold mr-4">
                          {testimonial.name.charAt(0)}
                        </div>
                      )}
                      <div className="text-left">
                        <h4 className="font-bold text-white">{testimonial.name}</h4>
                        <p className="text-primary-300">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
            
            {/* Navigation arrows */}
            <button
              onClick={prevTestimonial}
              className="absolute top-1/2 -left-4 md:-left-6 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md text-primary-700 hover:bg-primary-50 transition-colors focus:outline-none"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <button
              onClick={nextTestimonial}
              className="absolute top-1/2 -right-4 md:-right-6 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md text-primary-700 hover:bg-primary-50 transition-colors focus:outline-none"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          
          {/* Dots indicators */}
          <div className="flex justify-center space-x-2 mt-6">
            {(testimonials ?? []).map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === activeIndex ? 'bg-white' : 'bg-primary-500'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;