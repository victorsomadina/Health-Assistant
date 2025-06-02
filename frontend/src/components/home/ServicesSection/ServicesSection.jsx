import React from 'react';
import ServiceCard from '../../ui/ServiceCard/ServiceCard';
import Debby from '/src/assets/images/debby.svg';
import Victor from '/src/assets/images/victor.svg';
import Yusuf from '/src/assets/images/yusuf.svg';
import MaskDoctor from '/src/assets/images/mask-doctor.svg';
import chatBubbleIcon from '/src/assets/icons/chat-bubble.svg';
import voiceIcon from '/src/assets/icons/voice-icon.svg';

const ServicesSection = () => {
  const services = [
    {
      id: 1,
      type: 'assistant',
      title: "Chat with our Virtual Assistant",
      subtitle: "Text and Voice",
      buttonText: "Text and Voice",
      icon: chatBubbleIcon,
    },
    {
      id: 2,
      type: 'record',
      title: "Record your Consultation",
      subtitle: "",
      buttonText: "",
      icon: voiceIcon,
      avatars: [
        Debby,
        Victor,
        Yusuf,
      ],
    },
    {
      id: 3,
      type: 'connect',
      title: "Connect with our Professional Doctors",
      subtitle: "",
      buttonText: "Connect",
      icon: "connect",
    },
  ];

  return (
    <section className="py-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 items-stretch justify-center">
          {/* Card 1 - Chat Assistant */}
          <div className="flex-1 lg:max-w-sm">
            <ServiceCard service={services[0]} step="step1" />
          </div>
          
          {/* Card 2 - Recording (Center, Emphasized) */}
          <div className="flex-1 lg:max-w-sm">
            <ServiceCard service={services[1]} step="step2"/>
          </div>
          
          {/* Card 3 - Connect with Doctors */}
          <div className="flex-1 lg:max-w-sm">
            <ServiceCard service={services[2]} step="step3" />
          </div>
          
          {/* Card 4 - Doctor Image */}
          <div className="flex-1 lg:max-w-sm lg:-mt-4">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-full min-h-[300px] lg:min-h-[350px]">
              <img 
                src={MaskDoctor} 
                alt="Professional Doctor" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;