// pages/patient/PatientChat.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import PatientLayout from '../../components/layout/PatientLayout';
import DoctorSelectionModal from '../../components/modals/DoctorSelectionModal';
import { ArrowUpRight, Mic, Bot, User, X } from 'lucide-react';
import { promptTemplates } from '../../data/promptTemplates';
import { chatApiService } from '../../services/chatApi';

const PatientChat = () => {
  const { user } = useAuth();
  const [inputMessage, setInputMessage] = useState('');
  const [selectedPrompts, setSelectedPrompts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showInitialView, setShowInitialView] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const messagesEndRef = useRef(null);

  // Select 4 random prompts on page load
  useEffect(() => {
    const shuffled = [...promptTemplates].sort(() => 0.5 - Math.random());
    setSelectedPrompts(shuffled.slice(0, 4));
  }, []);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      sendMessage(inputMessage.trim());
    }
  };

  const handlePromptClick = (prompt) => {
    sendMessage(prompt.text);
  };

  const sendMessage = async (messageText) => {
    setShowInitialView(false);

    // Add user message
    const userMessage = {
      id: Date.now(),
      text: messageText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      let response;
      
      // Send to appropriate agent based on doctor selection
      if (selectedDoctor) {
        console.log('🩺 Sending to converse agent with doctor:', selectedDoctor);
        // response = await chatApiService.sendToConverseAgent(messageText, selectedDoctor);
        response = await chatApiService.sendToConverseAgent({
          question: messageText,
          converse: true,
          doctorName: selectedDoctor
        });
      } else {
        console.log('🔍 Sending to symptoms agent');
        response = await chatApiService.sendToSymptomsAgent(messageText);
      }

      // Add AI response - handle different response formats
      const aiMessage = {
        id: Date.now() + 1,
        text: response.airesponse.airesponse || response.airesponse.message || response.answer || 'I received your message.',
        sender: 'ai',
        timestamp: new Date(),
        agent: selectedDoctor ? 'converse' : 'symptoms'
      };

      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error('Failed to send message:', error);
      
      const errorMessage = {
        id: Date.now() + 1,
        text: 'Sorry, I had trouble processing your request. Please try again.',
        sender: 'ai',
        timestamp: new Date(),
        error: true
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleConverseClick = () => {
    setShowDoctorModal(true);
  };

  const handleSelectDoctor = (doctor) => {
    console.log('👨‍⚕️ Doctor selected:', doctor);
    setSelectedDoctor(doctor);
  };

  const clearDoctorSelection = () => {
    setSelectedDoctor(null);
  };

  return (
    <PatientLayout>
      {/* Show initial view or chat view */}
      {showInitialView ? (
        <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
          <div className="w-full max-w-4xl mx-auto sm:px-4 md:px-12">
            
            {/* Main greeting section */}
            <div className="text-left mb-6">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-[#073641] to-brand-sec bg-clip-text text-transparent mb-2 leading-none pb-2">
                Hi There, {user?.name?.split(' ')[0] || 'User'}
                <br />
                How can i help you today ?
              </h1>
              <p className="text-gray-600 text-lg">
                Use one of the most common prompts below, or use your own to begin.
              </p>
            </div>

            {/* Doctor Selection Banner */}
            {selectedDoctor && (
              <div className="mb-6 p-4 bg-teal-50 border border-teal-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-teal-800">
                      Conversing with Dr. {selectedDoctor}
                    </p>
                    <p className="text-xs text-teal-600">
                      {selectedDoctor.specialization}
                    </p>
                  </div>
                  <button
                    onClick={clearDoctorSelection}
                    className="p-1 hover:bg-teal-100 rounded-full"
                  >
                    <X size={16} className="text-teal-600" />
                  </button>
                </div>
              </div>
            )}

            {/* Prompt cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 mb-12">
              {selectedPrompts.map((prompt, index) => {
                const IconComponent = prompt.icon;
                return (
                  <button
                    key={index}
                    onClick={() => handlePromptClick(prompt)}
                    className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-left hover:shadow-md hover:border-brand-sec transition-all duration-200 group min-h-[140px] flex flex-col justify-between"
                  >
                    <p className="text-sm text-gray-700 leading-relaxed mb-4">
                      {prompt.text}
                    </p>
                    <div className="flex justify-start">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-brand-sec transition-colors">
                        <IconComponent size={16} className="text-gray-600 group-hover:text-white" />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
            
            {/* Input section */}
            <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-2">
              <form onSubmit={handleSubmit}>
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask your question"
                  className="w-full px-2 py-2 bg-transparent border-none focus:outline-none text-gray-700 placeholder-gray-300 text-lg resize-none overflow-y-auto"
                  rows="1"
                  style={{ minHeight: '2.5rem', maxHeight: '6rem' }}
                  onInput={(e) => {
                    e.target.style.height = 'auto';
                    e.target.style.height = Math.min(e.target.scrollHeight, 96) + 'px';
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                />
                
                <div className="flex items-center justify-between h-10">
                  {/* Converse button - Active when doctor selected */}
                  <button
                    type="button"
                    onClick={handleConverseClick}
                    className={`px-4 rounded-full py-1 text-sm transition-colors ${
                      selectedDoctor
                        ? 'bg-teal-100 text-teal-800 hover:bg-teal-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-300'
                    }`}
                  >
                    {selectedDoctor ? `Dr. ${selectedDoctor}` : 'Converse'}
                  </button>
                  
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="p-2 bg-gray-100 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-300 transition-colors"
                    >
                      <Mic size={18} />
                    </button>
                    
                    <button
                      type="submit"
                      disabled={!inputMessage.trim() || isTyping}
                      className="p-2 bg-brand-sec text-white rounded-full hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ArrowUpRight size={18} />
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : (
        // Chat view
        <div className="flex flex-col h-[calc(100vh-8rem)]">
          {/* Doctor Selection Banner in Chat View */}
          {selectedDoctor && (
            <div className="w-full max-w-4xl mx-auto sm:px-4 md:px-12 mb-4">
              <div className="p-3 bg-teal-50 border border-teal-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-teal-800">
                      Conversing with Dr. {selectedDoctor}
                    </p>
                    <p className="text-xs text-teal-600">
                      {selectedDoctor.specialization}
                    </p>
                  </div>
                  <button
                    onClick={clearDoctorSelection}
                    className="p-1 hover:bg-teal-100 rounded-full"
                  >
                    <X size={16} className="text-teal-600" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Chat messages area */}
          <div className="flex-1 overflow-y-auto">
            <div className="w-full max-w-4xl mx-auto sm:px-4 md:px-12 py-4 space-y-6">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start gap-3`}>
                    {/* Avatar */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.sender === 'user' 
                        ? 'bg-brand-sec text-white' 
                        : message.agent === 'converse'
                          ? 'bg-teal-100 text-teal-600'
                          : 'bg-brand-pri text-white'
                    }`}>
                      {message.sender === 'user' ? (
                        <User size={16} />
                      ) : (
                        <Bot size={16} />
                      )}
                    </div>

                    {/* Message content */}
                    <div className={`rounded-2xl p-4 ${
                      message.sender === 'user' 
                        ? 'bg-brand-sec text-white' 
                        : message.agent === 'converse'
                          ? 'bg-teal-50 border border-teal-200 text-gray-800'
                          : 'bg-gray-100 text-gray-800'
                    }`}>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {message.text}
                      </p>

                      {/* Timestamp */}
                      <div className={`text-xs mt-2 ${
                        message.sender === 'user' ? 'text-white/70' : 'text-gray-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString('en-US', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      selectedDoctor ? 'bg-teal-100 text-teal-600' : 'bg-brand-pri text-white'
                    }`}>
                      <Bot size={16} />
                    </div>
                    <div className={`rounded-2xl p-4 ${
                      selectedDoctor ? 'bg-teal-50 border border-teal-200' : 'bg-gray-100'
                    }`}>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input section for chat view */}
          <div className="w-full max-w-4xl mx-auto sm:px-4 md:px-12 mb-4">
            <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-2">
              <form onSubmit={handleSubmit}>
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask your question"
                  className="w-full px-2 py-2 bg-transparent border-none focus:outline-none text-gray-700 placeholder-gray-300 text-lg resize-none overflow-y-auto"
                  rows="1"
                  style={{ minHeight: '2.5rem', maxHeight: '6rem' }}
                  onInput={(e) => {
                    e.target.style.height = 'auto';
                    e.target.style.height = Math.min(e.target.scrollHeight, 96) + 'px';
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                />
                
                <div className="flex items-center justify-between h-10">
                  <button
                    type="button"
                    onClick={handleConverseClick}
                    className={`px-4 rounded-full py-1 text-sm transition-colors ${
                      selectedDoctor
                        ? 'bg-teal-100 text-teal-800 hover:bg-teal-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-300'
                    }`}
                  >
                    {selectedDoctor ? `Dr. ${selectedDoctor}` : 'Converse'}
                  </button>
                  
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="p-2 bg-gray-100 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-300 transition-colors"
                    >
                      <Mic size={18} />
                    </button>
                    
                    <button
                      type="submit"
                      disabled={!inputMessage.trim() || isTyping}
                      className="p-2 bg-brand-sec text-white rounded-full hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ArrowUpRight size={18} />
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Doctor Selection Modal */}
      <DoctorSelectionModal
        isOpen={showDoctorModal}
        onClose={() => setShowDoctorModal(false)}
        onSelectDoctor={handleSelectDoctor}
      />
    </PatientLayout>
  );
};

export default PatientChat;