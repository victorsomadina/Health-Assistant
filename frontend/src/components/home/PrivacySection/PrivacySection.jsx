import React from 'react';

const PrivacySection = () => {
  const privacyFeatures = [
    {
      id: 1,
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="11" width="18" height="10" rx="2" stroke="currentColor" strokeWidth="2"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2"/>
          <circle cx="12" cy="16" r="1" fill="currentColor"/>
          <path d="M12 17v2" stroke="currentColor" strokeWidth="2"/>
        </svg>
      ),
      title: "End-to-End\nEncryption",
      bgColor: "from-emerald-400 to-emerald-600"
    },
    {
      id: 2,
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
          <line x1="8" y1="21" x2="16" y2="21" stroke="currentColor" strokeWidth="2"/>
          <line x1="12" y1="17" x2="12" y2="21" stroke="currentColor" strokeWidth="2"/>
          <rect x="6" y="7" width="2" height="6" fill="currentColor"/>
          <rect x="10" y="5" width="2" height="8" fill="currentColor"/>
          <rect x="14" y="8" width="2" height="5" fill="currentColor"/>
          <rect x="18" y="6" width="2" height="7" fill="currentColor"/>
        </svg>
      ),
      title: "You Control\nYour Data",
      bgColor: "from-teal-600 to-teal-800"
    },
    {
      id: 3,
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 1l3 6 6 1-4.5 4.5 1 6.5-5.5-3-5.5 3 1-6.5L3 8l6-1 3-6z" stroke="currentColor" strokeWidth="2" fill="none"/>
          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
        </svg>
      ),
      title: "Built for\nCompliance",
      bgColor: "from-emerald-500 to-emerald-700"
    },
    {
      id: 4,
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
          <line x1="8" y1="21" x2="16" y2="21" stroke="currentColor" strokeWidth="2"/>
          <line x1="12" y1="17" x2="12" y2="21" stroke="currentColor" strokeWidth="2"/>
          <rect x="5" y="6" width="3" height="8" fill="currentColor"/>
          <rect x="8.5" y="4" width="3" height="10" fill="currentColor"/>
          <rect x="12" y="7" width="3" height="7" fill="currentColor"/>
          <rect x="15.5" y="5" width="3" height="9" fill="currentColor"/>
        </svg>
      ),
      title: "Consent-Based\nRecording",
      bgColor: "from-teal-700 to-teal-900"
    }
  ];

  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-8 items-center">
          {/* Left Content */}
          <div className="lg:col-span-2 order-2 lg:order-1 bg-gradient-to-br from-slate-50 to-slate-100 rounded-3xl p-8 lg:p-12">
            <h2 className="text-4xl lg:text-5xl font-bold leading-tight mb-6">
              <span className="text-teal-600">Your Privacy.</span><br />
              <span className="text-teal-600">Our Priority</span>
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              At WeHelp, your health information is treated with the highest standards of 
              security and respect. We are committed to ensuring your data is safe, confidential, 
              and fully under your control.
            </p>
          </div>

          {/* Right Content - Privacy Features */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            <div className="grid grid-cols-2 gap-4 lg:gap-6">
              {privacyFeatures.map((feature) => (
                <div 
                  key={feature.id}
                  className={`bg-gradient-to-br ${feature.bgColor} rounded-2xl lg:rounded-3xl p-6 lg:p-8 text-center text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300`}
                >
                  {/* Icon */}
                  <div className="mb-4 flex justify-center">
                    <div className="text-white opacity-90">
                      {feature.icon}
                    </div>
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-sm lg:text-base font-semibold leading-tight whitespace-pre-line">
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