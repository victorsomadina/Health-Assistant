// pages/patient/PatientChat.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import PatientLayout from '../../components/layout/PatientLayout';
import { ArrowUpRight, Mic, Bot, User, AlertTriangle, Copy, Check } from 'lucide-react';
import { promptTemplates } from '../../data/promptTemplates';
import { getRandomResponse, simulateTyping } from '../../data/dummyChatData';

const PatientChat = () => {
  const { user } = useAuth();
  const [inputMessage, setInputMessage] = useState('');
  const [selectedPrompts, setSelectedPrompts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showInitialView, setShowInitialView] = useState(true);
  const [copiedMessageId, setCopiedMessageId] = useState(null);
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

  const sendMessage = (messageText) => {
    // Hide initial view when first message is sent
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

    // Simulate AI response with typing delay
    simulateTyping(() => {
      const response = getRandomResponse();
      const aiMessage = {
        id: Date.now() + 1,
        text: response.message,
        sender: 'ai',
        timestamp: new Date(),
        suggestions: response.suggestions,
        followUpQuestions: response.followUpQuestions,
        urgent: response.urgent || false
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleFollowUpClick = (question) => {
    sendMessage(question);
  };

  const handleCopyMessage = async (messageId, messageText) => {
    try {
      await navigator.clipboard.writeText(messageText);
      setCopiedMessageId(messageId);
      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setCopiedMessageId(null);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = messageText;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopiedMessageId(messageId);
        setTimeout(() => {
          setCopiedMessageId(null);
        }, 2000);
      } catch (fallbackErr) {
        console.error('Fallback copy failed: ', fallbackErr);
      }
      document.body.removeChild(textArea);
    }
  };



  return (
    <PatientLayout>
      <style>
        {`
          @keyframes slideInFromBottom {
            from {
              transform: translateY(20%);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }
          .animate-slideInFromBottom {
            animation: slideInFromBottom 1s ease-out forwards;
          }
        `}
      </style>

      {/* Show initial view or chat view */}
      {showInitialView ? (
        // Original layout preserved exactly
        <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
          <div className="w-full max-w-4xl mx-auto sm:px-4 md:px-12">
            
            {/* Main greeting section */}
            <div className="text-left mb-6">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-[#073641] to-brand-sec bg-clip-text text-transparent mb-2 leading-none pb-2 opacity-0 translate-y-[20%] animate-[slideInFromBottom_1s_ease-out_forwards]">
                Hi There, {user?.name?.split(' ')[0] || 'Abdullahi'}
                <br />
                How can i help you today ?
              </h1>
              <p className="text-gray-600 text-lg">
                Use one of the most common prompts below, or use your own to begin.
              </p>
            </div>

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
            
            {/* Original Input section */}
            <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-2">
              <form onSubmit={handleSubmit}>
                {/* Input field - full width */}
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
                
                {/* Bottom row - controls */}
                <div className="flex items-center justify-between h-10">
                  {/* Left side - Converse button */}
                  <button
                    type="button"
                    className="px-4 bg-gray-100 rounded-full py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-300 transition-colors transition-ease-in-out"
                  >
                    Converse
                  </button>
                  
                  {/* Right side - Icons */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="p-2 bg-gray-100 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-300 transition-colors transition-ease-in-out"
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
        // Chat view - matching the same width as landing page
        <div className="flex flex-col h-[calc(100vh-8rem)]">
          {/* Chat messages area with same width constraints */}
          <div className="flex-1 overflow-y-auto">
            <div className="w-full max-w-4xl mx-auto sm:px-4 md:px-12 py-4 space-y-6">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start gap-3`}>
                    {/* Avatar */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.sender === 'user' 
                        ? 'bg-brand-sec text-white' 
                        : message.urgent 
                          ? 'bg-red-100 text-red-600' 
                          : 'bg-brand-pri text-white'
                    }`}>
                      {message.sender === 'user' ? (
                        <User size={16} />
                      ) : message.urgent ? (
                        <AlertTriangle size={16} />
                      ) : (
                        <Bot size={16} />
                      )}
                    </div>

                    {/* Message content */}
                    <div className={`rounded-2xl p-4 relative group ${
                      message.sender === 'user' 
                        ? 'bg-brand-sec text-white' 
                        : message.urgent
                          ? 'bg-red-50 border border-red-200 text-gray-800'
                          : 'bg-gray-100 text-gray-800'
                    }`}>
                      {/* Copy button - positioned at top right */}
                      <button
                        onClick={() => handleCopyMessage(message.id, message.text)}
                        className={`absolute top-2 right-2 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity ${
                          message.sender === 'user'
                            ? 'hover:bg-white/10 text-white/70 hover:text-white'
                            : 'hover:bg-gray-200 text-gray-500 hover:text-gray-700'
                        }`}
                        title="Copy message"
                      >
                        {copiedMessageId === message.id ? (
                          <Check size={14} />
                        ) : (
                          <Copy size={14} />
                        )}
                      </button>

                      <p className="text-sm leading-relaxed whitespace-pre-wrap pr-8">
                        {message.text}
                      </p>

                      {/* AI Suggestions */}
                      {message.sender === 'ai' && message.suggestions && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <h4 className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wider">
                            Recommendations:
                          </h4>
                          <ul className="space-y-1">
                            {message.suggestions.map((suggestion, index) => (
                              <li key={index} className="text-xs text-gray-700 flex items-start">
                                <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                                {suggestion}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Follow-up Questions */}
                      {message.sender === 'ai' && message.followUpQuestions && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <h4 className="text-xs font-semibold text-gray-600 mb-3 uppercase tracking-wider">
                            Follow-up Questions:
                          </h4>
                          <div className="space-y-2">
                            {message.followUpQuestions.map((question, index) => (
                              <button
                                key={index}
                                onClick={() => handleFollowUpClick(question)}
                                className="block w-full text-left text-xs p-2 bg-white border border-gray-200 rounded-lg hover:border-brand-sec hover:bg-gray-50 transition-colors"
                              >
                                {question}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

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
                    <div className="w-8 h-8 bg-brand-pri text-white rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot size={16} />
                    </div>
                    <div className="bg-gray-100 rounded-2xl p-4">
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

          {/* Input section for chat view - same structure as landing page */}
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
                    className="px-4 bg-gray-100 rounded-full py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-300 transition-colors transition-ease-in-out"
                  >
                    Converse
                  </button>
                  
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="p-2 bg-gray-100 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-300 transition-colors transition-ease-in-out"
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
    </PatientLayout>
  );
};

export default PatientChat;