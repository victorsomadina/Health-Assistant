import React from 'react';
import ServicesSection from '../ServicesSection/ServicesSection';
import doctorHero from '../../../assets/images/doctor-hero-2.svg';

const HeroSection = () => {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="min-h-[80vh] bg-gradient-to-b from-[#90C5D2] to-[#026076] flex items-center relative overflow-hidden pb-32 lg:pb-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left order-2 lg:order-1">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#FFFFFF] leading-tight mb-6">
                The <span className="text-[#026076]">Smartest Way</span>
                <br />
                to Manage Your Health, Anywhere, Anytime
              </h1>
              
              <p className="text-lg sm:text-xl text-white/90 leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0">
                Your intelligent, patient-centered virtual health assistant - 
                ready to help you understand symptoms, manage medications, and 
                connect with care when you need it most.
              </p>
              
              <button className="btn-primary text-lg px-8 py-4 bg-white text-[#026076] hover:bg-gray-50 mb-12 rounded-xl font-medium transition-all duration-300">
                Get Health Support
              </button>
              
              {/* Stats */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-8 sm:gap-12">
                <div className="text-center">
                  <div className="text-4xl lg:text-5xl font-bold text-white leading-none">24/7</div>
                  <div className="text-sm text-white/80 mt-2">Medical Service</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl lg:text-5xl font-bold text-white leading-none">10+</div>
                  <div className="text-sm text-white/80 mt-2">Specialist Doctors</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl lg:text-5xl font-bold text-white leading-none">30+</div>
                  <div className="text-sm text-white/80 mt-2">Happy Patients</div>
                </div>
              </div>
            </div>
            
            {/* Right Content - Doctor Image */}
            <div className="flex justify-center items-center relative order-1 lg:order-2">
              <div className="relative">
                {/* Doctor Image */}
                <img 
                  src={doctorHero} 
                  alt="Professional Healthcare Provider" 
                  className="relative z-10 w-full h-auto max-w-[700px] object-contain mx-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Overlapping Services Section */}
      <div className="absolute bottom-0 left-0 right-0 transform translate-y-1/2 z-20">
        <ServicesSection />
      </div>
    </div>
  );
};

export default HeroSection;