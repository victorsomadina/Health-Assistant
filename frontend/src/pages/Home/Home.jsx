import React from 'react';
import Header from '../../components/common/Header/Header';
import HeroSection from '../../components/home/HeroSection/HeroSection';
import AIInsightsSection from '../../components/home/AIInsightsSection/AIInsightsSection';
import PrivacySection from '../../components/home/PrivacySection/PrivacySection';
import Footer from '../../components/common/Footer/Footer';

const Home = () => {
  return (
    <div className="home-page">
      <Header />
      <main>
        {/* Hero Section now includes the overlapping Services Section */}
        <HeroSection />
        
        {/* Add spacing to account for the overlapping cards */}
        <div className="pt-32 lg:pt-40">
          <AIInsightsSection />
          <PrivacySection />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;