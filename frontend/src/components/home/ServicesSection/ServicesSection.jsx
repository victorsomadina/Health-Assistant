import React from 'react';
import ServiceCard from '../../ui/ServiceCard/ServiceCard';
import VoiceIcon from '/src/assets/icons/voice-icon.svg';
import Debby from '/src/assets/images/debby.svg';
import Victor from '/src/assets/images/victor.svg';
import Yusuf from '/src/assets/images/yusuf.svg';
import chat_bubble from '/src/assets/icons/chat-bubble.svg';

const ServicesSection = () => {
  const services = [
    {
      id: 1,
      type: 'assistant',
      title: "Chat with our Virtual Assistant",
      subtitle: "Text and Voice",
      buttonText: "Text and Voice",
      icon: chat_bubble,
    },
    {
      id: 2,
      type: 'record',
      title: "Record your Consultation",
      subtitle: "",
      buttonText: "",
      icon: <VoiceIcon className="w-7 h-7 text-[#026076]" />,
      avatars: [
        '/src/assets/images/debby.svg',
        '/src/assets/images/victor.svg',
        '/src/assets/images/yusuf.svg',
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
    {
      id: 4,
      type: 'doctor-image',
      image: '/src/assets/images/mask-doctor.svg',
    },
  ];

  return (
    <section className="py-16 lg:py-24 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-0 lg:gap-0 items-stretch justify-center">
          {/* Card 1 */}
          <div className="flex-1 -mt-6 lg:-mt-8 z-20">
            <ServiceCard service={services[0]} step="step1" />
          </div>
          {/* Card 2 (center, raised) */}
          <div className="flex-1 z-10">
            <ServiceCard service={services[1]} step="step2" emphasized />
          </div>
          {/* Card 3 */}
          <div className="flex-1 z-10">
            <ServiceCard service={services[2]} step="step3" />
          </div>
          {/* Card 4: Doctor Image */}
          <div className="flex-1 z-0 flex items-end justify-center">
            <div className="w-full h-full flex items-center justify-center">
              <img src="/src/assets/images/mask-doctor.svg" alt="Professional Doctor" className="rounded-2xl object-cover w-full h-full max-h-72" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;