import React from 'react';
import OpenInNewIcon from '../../../assets/icons/open_in_new_icon.svg';
import chatBubble from '/src/assets/icons/chat-bubble.svg';
import chatMic from '/src/assets/icons/chat-mic.svg';
import voiceIcon from '/src/assets/icons/voice-icon.svg';

const ICONS = {
  chat: (
    <>
      <span className="material-symbols-outlined text-3xl text-[#026076]">chat_bubble</span>
      <span className="material-symbols-outlined text-3xl text-[#026076] ml-4">mic</span>
    </>
  ),
  record: (
    <svg width="48" height="48" fill="none" viewBox="0 0 48 48"><rect width="48" height="48" rx="12" fill="url(#a)"/><g fill="#fff"><rect x="21" y="12" width="6" height="24" rx="3"/><rect x="12" y="21" width="6" height="6" rx="3"/><rect x="30" y="21" width="6" height="6" rx="3"/></g><defs><linearGradient id="a" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse"><stop stopColor="#20B2AA"/><stop offset="1" stopColor="#026076"/></linearGradient></defs></svg>
  ),
  // connect: (
  //   <span className="material-symbols-outlined text-4xl text-[#026076]">person</span>
  // ),
};

const ServiceCard = ({ service, emphasized }) => {
  if (service.type === 'doctor-image') {
    return null; // handled in parent
  }

  return (
    <div
      className={
        `${emphasized
          ? 'bg-gradient-to-b from-[#20B2AA] to-[#026076] text-white shadow-2xl scale-105 z-10'
          : 'bg-[#EAF6F8] text-[#026076] shadow-lg hover:shadow-2xl hover:scale-105 hover:-translate-y-2'}
        rounded-2xl p-8 flex flex-col items-center justify-center h-full transition-all duration-300 ease-in-out relative cursor-pointer
        ${!emphasized ? 'hover:bg-gradient-to-b hover:from-[#20B2AA] hover:to-[#026076] hover:text-white' : ''}`
      }
    >
      {/* Top-right arrow for chat card */}
      {service.type === 'assistant' && (
        <span className={`absolute top-4 right-4 rounded-full p-1 shadow flex items-center justify-center transition-all duration-300 ${
          emphasized 
            ? 'bg-white text-[#026076]' 
            : 'bg-white text-[#026076] group-hover:bg-[#026076] group-hover:text-white'
        }`}>
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
          </svg>
        </span>
      )}
      
      {/* Icon(s) */}
      <div className="flex items-center justify-center mb-6">
        <div className={`transition-colors duration-300 ${
          emphasized 
            ? '' 
            : 'hover:text-white [&>span]:hover:text-white [&>svg]:hover:[&_stop:first-child]:stop-color-white [&>svg]:hover:[&_stop:last-child]:stop-color-white'
        }`}>
          {/* For record type, show voiceIcon above the title */}
          {service.type === 'record' ? (
            <div className="bg-[#026076] p-3 rounded-full flex items-center justify-center mb-2">
              <img src={voiceIcon} alt="Voice Icon" className="w-6 h-6" />
            </div>
          ) : null}
          {ICONS[service.icon]}
        </div>
      </div>
      
      {/* Title */}
      <h3 className="text-xl font-semibold text-center mb-2 leading-tight transition-colors duration-300">
        {service.title}
      </h3>
      
      {/* Subtitle or Button for Chat */}
      {service.type === 'assistant' && (
        <>
          {/* Icons row above the button */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <img src={chatBubble} alt="Chat Bubble" className="w-8 h-8" />
            <img src={chatMic} alt="Chat Mic" className="w-8 h-8" />
          </div>
          <button className={`mt-2 px-6 py-2 border rounded-full font-medium transition-all duration-300 ${
            emphasized
              ? 'border-white text-white bg-transparent hover:bg-white hover:text-[#026076]'
              : 'border-[#20B2AA] text-[#20B2AA] bg-white hover:bg-[#e6f6f9] hover:border-white hover:text-white hover:bg-transparent'
          }`}>
            {service.buttonText}
          </button>
        </>
      )}
      
      {/* Avatars for Record card */}
      {service.type === 'record' && (
        <div className="flex justify-center mt-8 gap-2">
          {service.avatars && service.avatars.map((src, i) => (
            <img
              key={i}
              src={src}
              alt="Doctor"
              className="w-10 h-10 rounded-full border-2 border-white object-cover -ml-2 first:ml-0 transition-transform duration-300 hover:scale-110"
            />
          ))}
        </div>
      )}
      
      {/* Button for Connect card */}
      {service.type === 'connect' && (
        <button className={`mt-8 px-10 py-2 rounded-lg font-medium text-lg transition-all duration-300 ${
          emphasized
            ? 'bg-white text-[#026076] hover:bg-gray-100'
            : 'bg-[#4CB7B3] text-white hover:bg-[#026076] hover:text-white'
        }`}>
          {service.buttonText}
        </button>
      )}
    </div>
  );
};

export default ServiceCard;