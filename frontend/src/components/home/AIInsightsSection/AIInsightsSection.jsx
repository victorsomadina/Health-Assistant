import React from 'react';

const AIInsightsSection = () => {
  const features = [
    {
      id: 1,
      icon: "🎙️",
      title: "Consent-Based Recording",
      description: "Secure and transparent recording of medical consultations with explicit patient consent."
    },
    {
      id: 2,
      icon: "🔒",
      title: "End-to-End Encryption",
      description: "Your health data is protected with military-grade encryption ensuring complete privacy."
    },
    {
      id: 3,
      icon: "⚕️",
      title: "Built for Compliance",
      description: "Fully compliant with HIPAA and other healthcare regulations for your peace of mind."
    },
    {
      id: 4,
      icon: "🎛️",
      title: "You Control Your Data",
      description: "Complete control over your health information with granular privacy settings."
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-[#E6F6F9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#026076] mb-6">
            Take Control of Your Health with AI Insights
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
            Get real-time, personalized health guidance powered by intelligent 
            algorithms that understand your needs.
          </p>
        </div>
        
        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div 
              key={feature.id}
              className="bg-white rounded-2xl p-8 text-center card-hover border border-teal-100 hover:border-teal-300 shadow-md"
            >
              {/* Icon */}
              <div className="w-20 h-20 bg-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl text-white">{feature.icon}</span>
              </div>
              
              {/* Content */}
              <h3 className="text-xl font-semibold text-[#026076] mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AIInsightsSection;