import React from 'react';

const ICONS = {
  chat: (
    <>
      <span className="material-symbols-outlined text-3xl text-[#026076]">chat_bubble</span>
      <span className="material-symbols-outlined text-3xl text-[#026076] ml-4">mic</span>
    </>
  ),
  record: (
    <svg width="48" height="48" fill="none" viewBox="0 0 48 48"><rect width="48" height="48" rx="12" fill="url(#a)"/><g fill="#fff"><rect x="21" y="12" width="6" height="24" rx="3"/><rect x="12" y="21" width="6" height="6" rx="3"/><rect x="30" y="21" width="6" height="6" rx="3"/></g><defs><linearGradient id="a" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse"><stop stop-color="#20B2AA"/><stop offset="1" stop-color="#026076"/></linearGradient></defs></svg>
  ),
  connect: (
    <span className="material-symbols-outlined text-4xl text-[#026076]">person</span>
  ),
};

const ServiceCard = ({ service, emphasized, step }) => {
  if (service.type === 'doctor-image') {
    return null; // handled in parent
  }

  return (
    <div
      className={
        `${emphasized
          ? 'bg-gradient-to-b from-[#20B2AA] to-[#026076] text-white shadow-2xl scale-105 z-10'
          : 'bg-[#EAF6F8] text-[#026076] shadow-lg'}
        rounded-2xl p-8 flex flex-col items-center justify-center h-full transition-transform duration-300 relative`
      }
    >
      {/* Top-right arrow for chat card */}
      {service.type === 'assistant' && (
        <span className="absolute top-4 right-4 bg-white rounded-full p-1 shadow text-[#026076]">
          <span className="material-symbols-outlined text-lg">open_in_new</span>
        </span>
      )}
      {/* Icon(s) */}
      <div className="flex items-center justify-center mb-6">
        {ICONS[service.icon]}
      </div>
      {/* Title */}
      <h3 className="text-xl font-semibold text-center mb-2 leading-tight">
        {service.title}
      </h3>
      {/* Subtitle or Button for Chat */}
      {service.type === 'assistant' && (
        <button className="mt-6 px-6 py-2 border border-[#20B2AA] text-[#20B2AA] rounded-full font-medium bg-white hover:bg-[#e6f6f9] transition">
          {service.buttonText}
        </button>
      )}
      {/* Avatars for Record card */}
      {service.type === 'record' && (
        <div className="flex justify-center mt-8 gap-2">
          {service.avatars && service.avatars.map((src, i) => (
            <img
              key={i}
              src={src}
              alt="Doctor"
              className="w-10 h-10 rounded-full border-2 border-white object-cover -ml-2 first:ml-0"
            />
          ))}
        </div>
      )}
      {/* Button for Connect card */}
      {service.type === 'connect' && (
        <button className="mt-8 px-10 py-2 rounded-lg bg-[#4CB7B3] text-white font-medium text-lg hover:bg-[#026076] transition">
          {service.buttonText}
        </button>
      )}
    </div>
  );
};

export default ServiceCard;