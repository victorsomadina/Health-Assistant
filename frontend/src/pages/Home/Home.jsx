import React, { useEffect, useState } from 'react';
import Header from '../../components/common/Header/Header';
import HeroSection from '../../components/home/HeroSection/HeroSection';
import AIInsightsSection from '../../components/home/AIInsightsSection/AIInsightsSection';
import PrivacySection from '../../components/home/PrivacySection/PrivacySection';
import Footer from '../../components/common/Footer/Footer';
import PrivacyPolicyModal from '../../components/modals/PrivacyPolicyModal';

const Home = () => {
  const [showPrivacy, setShowPrivacy] = useState(false);
  useEffect(() => {
    if (!localStorage.getItem('privacyAccepted')) {
      setShowPrivacy(true);
    }
  }, []);
  const handleClosePrivacy = () => {
    setShowPrivacy(false);
    localStorage.setItem('privacyAccepted', 'true');
  };
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
      <PrivacyPolicyModal isOpen={showPrivacy} onClose={handleClosePrivacy} />
    </div>
  );
};

export default Home;