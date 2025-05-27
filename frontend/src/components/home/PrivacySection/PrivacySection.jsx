import React from 'react';

const PrivacySection = () => {
  const privacyFeatures = [
    {
      id: 1,
      icon: "🎙️",
      title: "Consent-Based Recording"
    },
    {
      id: 2,
      icon: "🔒",
      title: "End-to-End Encryption"
    },
    {
      id: 3,
      icon: "⚕️",
      title: "Built for Compliance"
    },
    {
      id: 4,
      icon: "🎛️",
      title: "You Control Your Data"
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-[#E6F6F9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left order-2 lg:order-1 bg-white rounded-2xl shadow-md p-10">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#026076] leading-tight mb-6">
              Your Privacy<br />
              <span className="text-teal-500">Our Priority</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
              At WeHelp, your health information is treated with the highest standards of 
              security and respect. We are committed to ensuring your data is safe, confidential, 
              and fully under your control.
            </p>
          </div>

          {/* Right Content - Privacy Features */}
          <div className="order-1 lg:order-2">
            <div className="grid grid-cols-2 gap-6 max-w-md mx-auto lg:max-w-none">
              {privacyFeatures.map((feature) => (
                <div 
                  key={feature.id}
                  className="bg-white rounded-2xl p-8 text-center shadow-md card-hover border-2 border-transparent hover:border-teal-300"
                >
                  {/* Icon */}
                  <div className="text-3xl mb-3 text-teal-500">
                    {feature.icon}
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-base font-semibold text-[#026076] leading-tight">
                    {feature.title}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PrivacySection;