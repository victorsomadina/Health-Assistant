import React from 'react';
import Header from '../../components/common/Header/Header';
import HeroSection from '../../components/home/HeroSection/HeroSection';
import ServicesSection from '../../components/home/ServicesSection/ServicesSection';
import AIInsightsSection from '../../components/home/AIInsightsSection/AIInsightsSection';
import PrivacySection from '../../components/home/PrivacySection/PrivacySection';
import Footer from '../../components/common/Footer/Footer';

const Home = () => {
  return (
    <div className="home-page">
      <Header />
      <main>
        <HeroSection />
        <ServicesSection />
        <AIInsightsSection />
        <PrivacySection />
      </main>
      <Footer />
    </div>
  );
};

export default Home;