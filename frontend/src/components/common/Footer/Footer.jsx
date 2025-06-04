import React, { useState } from 'react';
import PrivacyPolicyModal from '../../modals/PrivacyPolicyModal';

const Footer = () => {
  const [showPrivacy, setShowPrivacy] = useState(false);
  return (
    <footer className="bg-teal-700 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm opacity-80">
            Copyright © 2025 WeHelp. All rights reserved.
            <button className="ml-4 underline hover:text-brand-sec transition-colors" onClick={() => setShowPrivacy(true)}>
              Privacy Policy
            </button>
          </p>
        </div>
      </div>
      <PrivacyPolicyModal isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} />
    </footer>
  );
};

export default Footer;