
// pages/patient/PatientChat.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import PatientLayout from '../../components/layout/PatientLayout';
import DoctorSelectionModal from '../../components/modals/DoctorSelectionModal';
import { 
  ArrowUpRight, 
  Mic, 
  Bot, 
  User, 
  X, 
  Stethoscope,
  Send,
  PhoneOff,
  MessageCircle,
  Activity,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { promptTemplates } from '../../data/promptTemplates';
import { chatApiService } from '../../services/chatApi';
import { 
  LiveKitRoom, 
  RoomAudioRenderer, 
  useVoiceAssistant,
  BarVisualizer,
  VoiceAssistantControlBar,
  useTrackTranscription,
  useLocalParticipant,
} from '@livekit/components-react';
import { Track } from "livekit-client";
import { useConnectionManager } from './ConnectionManager';

// This component contains all the LiveKit-dependent functionality (from commented code)
const ConnectedVoiceChat = ({
  inputMessage,
  setInputMessage,
  selectedPrompts,
  selectedDoctor,
  setSelectedDoctor,
  setShowInitialView,
  showInitialView,
  showDoctorModal,
  setShowDoctorModal,
  handleConverseClick,
  onEndVoiceMode // New prop to handle ending voice mode
}) => {
  // --- LiveKit hooks ---
  const { state, audioTrack, agentTranscriptions } = useVoiceAssistant();
  const localParticipant = useLocalParticipant();
  const { segments: userTranscriptions } = useTrackTranscription({
    publication: localParticipant?.microphoneTrack,
    source: Track.Source.Microphone,
    participant: localParticipant?.localParticipant,
  });

  // --- Chat state ---
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // --- Scroll to bottom on new messages ---
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // --- Handle agent voice transcriptions (LiveKit) ---
  useEffect(() => {
    if (!agentTranscriptions?.length) return;
    const lastTranscription = agentTranscriptions[agentTranscriptions.length - 1];
    setShowInitialView(false);
    setMessages(prev => {
      const existingIndex = prev.findIndex(
        m => m.firstReceivedTime && m.firstReceivedTime === lastTranscription.firstReceivedTime && m.type === "ai"
      );
      if (existingIndex >= 0) {
        const newMessages = [...prev];
        newMessages[existingIndex] = {
          ...lastTranscription,
          sender: 'ai',
          type: "ai",
          isText: false,
          isVoice: true,
          timestamp: Date.now(),
        };
        return newMessages;
      } else {
        return [
          ...prev,
          {
            ...lastTranscription,
            sender: 'ai',
            type: "ai",
            isText: false,
            isVoice: true,
            timestamp: Date.now(),
          },
        ];
      }
    });
  }, [agentTranscriptions, setShowInitialView]);

  // --- Handle user voice transcriptions (LiveKit) ---
  useEffect(() => {
    if (!userTranscriptions?.length) return;
    const lastTranscription = userTranscriptions[userTranscriptions.length - 1];
    setShowInitialView(false);
    setMessages(prev => {
      const existingIndex = prev.findIndex(
        m => m.firstReceivedTime && m.firstReceivedTime === lastTranscription.firstReceivedTime && m.type === "user"
      );
      if (existingIndex >= 0) {
        const newMessages = [...prev];
        newMessages[existingIndex] = {
          ...lastTranscription,
          sender: 'user',
          type: "user",
          isText: false,
          isVoice: true,
          timestamp: Date.now(),
        };
        return newMessages;
      } else {
        return [
          ...prev,
          {
            ...lastTranscription,
            sender: 'user',
            type: "user",
            isText: false,
            isVoice: true,
            timestamp: Date.now(),
          },
        ];
      }
    });
  }, [userTranscriptions, setShowInitialView]);

  // --- Handle LiveKit text messages ---
  useEffect(() => {
    const room = localParticipant?.localParticipant?.room;
    if (!room) return;

    const handleTextMessage = async (reader, participant) => {
      try {
        setIsTyping(true);
        const message = await reader.readAll();
        setTimeout(() => {
          setMessages(prev => {
            const isDuplicate = prev.some(
              m => m.isText && m.text === message && m.type === (participant.identity === room.localParticipant.identity ? "user" : "ai")
            );
            if (isDuplicate) return prev;
            return [
              ...prev,
              {
                text: message,
                sender: participant.identity === room.localParticipant.identity ? "user" : "ai",
                type: participant.identity === room.localParticipant.identity ? "user" : "ai",
                isText: true,
                isVoice: false,
                timestamp: Date.now(),
              }
            ];
          });
          setIsTyping(false);
          setShowInitialView(false);
        }, 500);
      } catch (err) {
        setIsTyping(false);
      }
    };

    room.registerTextStreamHandler("lk.transcription", handleTextMessage);
    room.registerTextStreamHandler("lk.chat", handleTextMessage);

    return () => {
      room.unregisterTextStreamHandler("lk.transcription", handleTextMessage);
      room.unregisterTextStreamHandler("lk.chat", handleTextMessage);
    };
  }, [localParticipant?.localParticipant, setShowInitialView]);

  // --- Send text message via LiveKit ---
  const sendTextMessage = async () => {
    if (!inputMessage.trim() || !localParticipant?.localParticipant) return;
    try {
      const timestamp = Date.now();
      const messageText = inputMessage.trim();
      setShowInitialView(false);
      setMessages(prev => [
        ...prev,
        {
          text: messageText,
          sender: "user",
          type: "user",
          isText: true,
          isVoice: false,
          timestamp,
        }
      ]);
      await localParticipant.localParticipant.sendText(messageText, {
        topic: "lk.chat"
      });
      setInputMessage('');
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  // --- Input keypress handler ---
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendTextMessage();
    }
  };

  // --- Prompt button click ---
  const handlePromptClick = (prompt) => {
    setInputMessage(prompt.text);
    setTimeout(() => sendTextMessage(), 100);
  };

  // --- Doctor selection ---
  const clearDoctorSelection = () => {
    setSelectedDoctor(null);
  };

  // --- Time formatting for chat bubbles ---
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      <RoomAudioRenderer />
      
      {/* Voice visualizer and assistant bar */}
      <div className="mb-4 p-4 bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg border border-teal-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-teal-600" />
            <span className="text-sm font-medium text-teal-800">Voice Assistant Active</span>
            <div className={`w-2 h-2 rounded-full ${
              state === 'listening' ? 'bg-green-500 animate-pulse' : 
              state === 'speaking' ? 'bg-blue-500 animate-pulse' : 
              'bg-gray-400'
            }`}></div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-teal-600 capitalize">{state}</span>
            <button
              onClick={onEndVoiceMode}
              className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm"
            >
              <PhoneOff className="w-4 h-4" />
              End Voice Mode
            </button>
          </div>
        </div>
        
        <div className="mb-3">
          <BarVisualizer 
            state={state} 
            barCount={12} 
            trackRef={audioTrack}
            className="h-8"
          />
        </div>
        
        <VoiceAssistantControlBar />
      </div>

      {/* UI: initial prompt view */}
      {showInitialView ? (
        <div className="flex items-center justify-center min-h-[calc(100vh-20rem)]">
          <div className="w-full max-w-4xl mx-auto sm:px-4 md:px-12">
            <div className="text-left mb-6">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-[#073641] to-brand-sec bg-clip-text text-transparent mb-2 leading-none pb-2">
                Voice Mode Active! <br /> How can I help you today?
              </h1>
              <p className="text-gray-600 text-lg">
                Speak directly or use text - I can handle both! Use the prompts below to get started.
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
            {/* Input section */}
            <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-2">
              <form onSubmit={e => { e.preventDefault(); sendTextMessage(); }}>
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type your question or speak directly..."
                  className="w-full px-2 py-2 bg-transparent border-none focus:outline-none text-gray-700 placeholder-gray-300 text-lg resize-none overflow-y-auto"
                  rows="1"
                  style={{ minHeight: '2.5rem', maxHeight: '6rem' }}
                  onInput={(e) => {
                    e.target.style.height = 'auto';
                    e.target.style.height = Math.min(e.target.scrollHeight, 96) + 'px';
                  }}
                  onKeyDown={handleKeyPress}
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
                    <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                      <Mic size={12} />
                      Voice Active
                    </div>
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
        <div className="flex flex-col h-[calc(100vh-12rem)]">
          {/* Doctor banner */}
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
          {/* Chat messages */}
          <div className="flex-1 overflow-y-auto">
            <div className="w-full max-w-4xl mx-auto sm:px-4 md:px-12 py-4 space-y-6">
              {messages.map((message, idx) => (
                <div key={idx + '-' + (message.text || message?.words?.[0]?.text || '')}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start gap-3`}>
                    {/* Avatar */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.sender === 'user'
                        ? 'bg-brand-sec text-white'
                        : selectedDoctor
                          ? 'bg-teal-100 text-teal-600'
                          : 'bg-brand-pri text-white'
                    }`}>
                      {message.sender === 'user' ? (
                        message.isVoice ? <Mic size={16} /> : <User size={16} />
                      ) : (
                        <Bot size={16} />
                      )}
                    </div>
                    {/* Message content */}
                    <div className={`rounded-2xl p-4 ${
                      message.sender === 'user'
                        ? 'bg-brand-sec text-white'
                        : selectedDoctor
                          ? 'bg-teal-50 border border-teal-200 text-gray-800'
                          : 'bg-gray-100 text-gray-800'
                    }`}>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {message.text || (message.words && message.words.map(w => w.text).join(' '))}
                      </p>
                      
                      {/* Voice indicator */}
                      {message.isVoice && (
                        <div className="flex items-center gap-1 mt-2">
                          <Mic className="w-3 h-3" />
                          <span className={`text-xs ${
                            message.sender === 'user' ? 'text-white/70' : 'text-gray-500'
                          }`}>
                            Voice message
                          </span>
                        </div>
                      )}
                      
                      <div className={`text-xs mt-2 ${
                        message.sender === 'user' ? 'text-white/70' : 'text-gray-500'
                      }`}>
                        {formatTime(message.timestamp || Date.now())}
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
                    <div className={`rounded-2xl p-4 ${selectedDoctor ? 'bg-teal-50 border border-teal-200' : 'bg-gray-100'}`}>
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
          {/* Chat input */}
          <div className="w-full max-w-4xl mx-auto sm:px-4 md:px-12 mb-4">
            <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-2">
              <form onSubmit={e => { e.preventDefault(); sendTextMessage(); }}>
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type your question or speak directly..."
                  className="w-full px-2 py-2 bg-transparent border-none focus:outline-none text-gray-700 placeholder-gray-300 text-lg resize-none overflow-y-auto"
                  rows="1"
                  style={{ minHeight: '2.5rem', maxHeight: '6rem' }}
                  onInput={(e) => {
                    e.target.style.height = 'auto';
                    e.target.style.height = Math.min(e.target.scrollHeight, 96) + 'px';
                  }}
                  onKeyDown={handleKeyPress}
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
                    <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                      <Mic size={12} />
                      Voice Active
                    </div>
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
        onSelectDoctor={setSelectedDoctor}
      />
    </>
  );
};

// Main component
const PatientChat = () => {
  const { user } = useAuth();
  
  // Connection management
  const connectionManager = useConnectionManager();
  const { isConnected, connect, disconnect, token, isConnecting, connectionError, retry } = connectionManager;

  // UI state
  const [inputMessage, setInputMessage] = useState('');
  const [selectedPrompts, setSelectedPrompts] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showInitialView, setShowInitialView] = useState(true);
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [voiceMode, setVoiceMode] = useState(false); // New state for voice mode
  const messagesEndRef = useRef(null);

  // Initialize prompts
  useEffect(() => {
    const shuffled = [...promptTemplates].sort(() => 0.5 - Math.random());
    setSelectedPrompts(shuffled.slice(0, 4));
  }, []);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Handle microphone click - this activates voice mode
  const handleMicrophoneClick = async () => {
    if (!voiceMode) {
      setVoiceMode(true);
      await connect();
    } else {
      setVoiceMode(false);
      disconnect();
    }
  };

  // Handle ending voice mode
  const handleEndVoiceMode = () => {
    setVoiceMode(false);
    disconnect();
  };

  // Handle converse button click
  const handleConverseClick = () => {
    // If in voice mode, disconnect first
    if (voiceMode) {
      setVoiceMode(false);
      disconnect();
    }
    setShowDoctorModal(true);
  };

  // Handle doctor selection
  const handleSelectDoctor = (doctor) => {
    console.log('👨‍⚕️ Doctor selected:', doctor);
    setSelectedDoctor(doctor);
  };

  // Clear doctor selection
  const clearDoctorSelection = () => {
    if (voiceMode) {
      setVoiceMode(false);
      disconnect();
    }
    setSelectedDoctor(null);
  };

  // Regular text chat functionality (when not in voice mode)
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
        response = await chatApiService.sendToConverseAgent({
          question: messageText,
          converse: true,
          doctorName: selectedDoctor
        });
      } else {
        console.log('🔍 Sending to symptoms agent');
        response = await chatApiService.sendToSymptomsAgent(messageText);
      }

      // Add AI response
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

  // Connection Screen Component for voice mode
  const ConnectionScreen = () => (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-full max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg border border-gray-200">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Stethoscope className="w-8 h-8 text-teal-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Voice Medical Assistant</h2>
          <p className="text-gray-600">
            Connecting to voice assistant...
          </p>
        </div>
        
        {connectionError && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-red-800">{connectionError}</p>
                <button 
                  onClick={retry} 
                  className="mt-2 flex items-center gap-2 text-sm text-red-600 hover:text-red-700"
                >
                  <RefreshCw className="w-4 h-4" />
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}
        
        {isConnecting && (
          <div className="flex items-center justify-center gap-2 text-teal-600">
            <div className="w-4 h-4 border-2 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
            Connecting...
          </div>
        )}
      </div>
    </div>
  );

  // If voice mode is active and connected, show the voice interface
  if (voiceMode && isConnected) {
    return (
      <PatientLayout>
        <LiveKitRoom
          serverUrl={import.meta.env.VITE_LIVEKIT_URL}
          token={token}
          video={false}
          audio={true}
          connectOptions={{
            autoSubscribe: true,
            maxRetries: 3,
            retryInterval: 1000
          }}
        >
          <ConnectedVoiceChat
            inputMessage={inputMessage}
            setInputMessage={setInputMessage}
            selectedPrompts={selectedPrompts}
            selectedDoctor={selectedDoctor}
            setSelectedDoctor={setSelectedDoctor}
            showInitialView={showInitialView}
            setShowInitialView={setShowInitialView}
            showDoctorModal={showDoctorModal}
            setShowDoctorModal={setShowDoctorModal}
            handleConverseClick={handleConverseClick}
            onEndVoiceMode={handleEndVoiceMode}
          />
        </LiveKitRoom>
      </PatientLayout>
    );
  }

  // If voice mode is active but not connected, show connection screen
  if (voiceMode && !isConnected) {
    return (
      <PatientLayout>
        <ConnectionScreen />
      </PatientLayout>
    );
  }


  // Regular chat mode (default)
  return (
    <PatientLayout>
      {/* Show initial view or chat view */}
      {showInitialView ? (
        <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
          <div className="w-full max-w-4xl mx-auto sm:px-4 md:px-12">
            <div className="text-left mb-6">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-[#073641] to-brand-sec bg-clip-text text-transparent mb-2 leading-none pb-2">
                Hi There! <br /> How can I help you today?
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
                    if (e.key === "Enter" && !e.shiftKey) {
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
                      onClick={handleMicrophoneClick}
                      className={`p-2 rounded-full transition-colors ${
                        voiceMode
                          ? 'bg-green-100 text-green-600 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-400 hover:text-gray-600 hover:bg-gray-300'
                      }`}
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
          {/* Doctor banner */}
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
          {/* Chat messages */}
          <div className="flex-1 overflow-y-auto">
            <div className="w-full max-w-4xl mx-auto sm:px-4 md:px-12 py-4 space-y-6">
              {messages.map((message, idx) => (
                <div key={idx} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start gap-3`}>
                    {/* Avatar */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.sender === 'user'
                        ? 'bg-brand-sec text-white'
                        : selectedDoctor
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
                        : selectedDoctor
                          ? 'bg-teal-50 border border-teal-200 text-gray-800'
                          : 'bg-gray-100 text-gray-800'
                    }`}>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {message.text}
                      </p>
                      <div className={`text-xs mt-2 ${
                        message.sender === 'user' ? 'text-white/70' : 'text-gray-500'
                      }`}>
                        {new Date(message.timestamp).toLocaleTimeString('en-US', { 
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
                    <div className={`rounded-2xl p-4 ${selectedDoctor ? 'bg-teal-50 border border-teal-200' : 'bg-gray-100'}`}>
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
          {/* Chat input */}
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
                    if (e.key === "Enter" && !e.shiftKey) {
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
                      onClick={handleMicrophoneClick}
                      className={`p-2 rounded-full transition-colors ${
                        voiceMode
                          ? 'bg-green-100 text-green-600 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-400 hover:text-gray-600 hover:bg-gray-300'
                      }`}
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
  