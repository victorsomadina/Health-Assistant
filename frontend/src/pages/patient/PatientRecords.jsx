import React, { useState } from 'react';
import { MessageSquare, Calendar, Clock, User, ArrowLeft, Play, Pause, Square, Send, Menu, X } from 'lucide-react';
import PatientLayout from '../../components/layout/PatientLayout';
import { conversations, conversationTypes } from '../../data/patientRecordsData';
import recording_mic from '../../assets/images/recording_mic.png';
import { useAuth } from '../../context/AuthContext';
import { doctorService } from '../../services/doctorService';
import Select from 'react-select';

const PatientRecords = () => {
  const { user } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [showRecordingInterface, setShowRecordingInterface] = useState(false);
  const [showMainRecording, setShowMainRecording] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);
  const [selectedPurpose, setSelectedPurpose] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [showValidationErrors, setShowValidationErrors] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordedNotes, setRecordedNotes] = useState('');

  // Mobile-specific state
  const [showSidebar, setShowSidebar] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // State for doctors
  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);

  // Audio recording states
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [microphonePermission, setMicrophonePermission] = useState('prompt');

  // Purpose options for React Select
  const purposeOptions = [
    { value: '', label: 'Select Purpose' },
    { value: 'consultation', label: 'Consultation' },
    { value: 'follow-up', label: 'Follow-up' },
    { value: 'discussion', label: 'Discussion' },
    { value: 'review', label: 'Review' },
    { value: 'check-in', label: 'Check-in' },
  ];

  // Check screen size on mount and resize
  React.useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setShowSidebar(false);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  React.useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoadingDoctors(true);
        const doctorsData = await doctorService.getAllDoctors();
        setDoctors(doctorsData);
      } catch (error) {
        console.error('Failed to load doctors');
      } finally {
        setLoadingDoctors(false);
      }
    };

    fetchDoctors();
  }, []);

  // Check microphone permission on component mount
  React.useEffect(() => {
    const checkMicrophonePermission = async () => {
      try {
        const result = await navigator.permissions.query({ name: 'microphone' });
        setMicrophonePermission(result.state);
        
        result.addEventListener('change', () => {
          setMicrophonePermission(result.state);
        });
      } catch (error) {
        console.log('Permission API not supported');
      }
    };

    checkMicrophonePermission();
  }, []);

  const getTypeColor = (type) => {
    return conversationTypes[type] || "text-gray-600 bg-gray-100";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  // Check if all form fields are valid
  const isFormValid = selectedPurpose && selectedDoctor && consentChecked;

  // Get doctor name from selected doctor value
  const getDoctorName = (doctorId) => {
    if (!doctorId) return '';
    
    const doctor = doctors.find(doc => doc.id === doctorId);
    if (doctor) {
      return doctor.name;
    }
    
    const doctorNames = {
      'dr-sarah-johnson': 'Dr. Sarah Johnson',
      'dr-michael-chen': 'Dr. Michael Chen',
      'dr-emily-rodriguez': 'Dr. Emily Rodriguez',
      'dr-james-wilson': 'Dr. James Wilson',
      'dr-lisa-thompson': 'Dr. Lisa Thompson'
    };
    return doctorNames[doctorId] || doctorId;
  };

  // Mobile-specific handlers
  const handleConversationSelect = (conversation) => {
    setSelectedConversation(conversation);
    if (isMobile) {
      setShowSidebar(false);
    }
  };

  const handleBackToConversations = () => {
    setSelectedConversation(null);
    if (isMobile) {
      setShowSidebar(true);
    }
  };

  // Reset form when closing recording interface
  const handleCloseRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
    }
    
    if (window.recordingTimer) {
      clearInterval(window.recordingTimer);
    }
    
    setShowRecordingInterface(false);
    setShowMainRecording(false);
    setConsentChecked(false);
    setSelectedPurpose('');
    setSelectedDoctor('');
    setShowValidationErrors(false);
    setIsRecording(false);
    setIsPaused(false);
    setRecordingTime(0);
    setRecordedNotes('');
    setMediaRecorder(null);
    setAudioBlob(null);
    setIsUploading(false);
    setUploadError(null);
    
    if (isMobile) {
      setShowSidebar(true);
    }
  };

  // Handle start recording button click
  const handleStartRecording = () => {
    if (isFormValid) {
      setShowMainRecording(true);
      setShowRecordingInterface(false);
    } else {
      setShowValidationErrors(true);
    }
  };

  // Format recording time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Recording controls
  const handleStartActualRecording = async () => {
    try {
      setUploadError(null);
      
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true
        }
      });

      // Configure MediaRecorder with optimal settings for transcription
      const mimeTypes = [
        'audio/webm;codecs=opus',
        'audio/mp4;codecs=mp4a.40.2',
        'audio/mpeg',
        'audio/wav'
      ];

      let selectedMimeType = '';
      for (const mimeType of mimeTypes) {
        if (MediaRecorder.isTypeSupported(mimeType)) {
          selectedMimeType = mimeType;
          break;
        }
      }

      const recorder = new MediaRecorder(stream, {
        mimeType: selectedMimeType,
        audioBitsPerSecond: 32000
      });

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          event.data.arrayBuffer().then(buffer => {
            const blob = new Blob([buffer]);
            setAudioBlob(blob);
          });
        }
      };

      recorder.onstop = () => {
        stream.getTracks().forEach(track => track.stop());
      };

      setMediaRecorder(recorder);
      recorder.start();
      setIsRecording(true);
      setIsPaused(false);

      const timer = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      window.recordingTimer = timer;

    } catch (error) {
      setUploadError('Unable to access microphone. Please check permissions.');
    }
  };

  const handleRestartRecording = async () => {
    setAudioBlob(null);
    setRecordingTime(0);
    
    if (window.recordingTimer) {
      clearInterval(window.recordingTimer);
    }
    
    await handleStartActualRecording();
  };

  const handlePauseRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.pause();
      setIsPaused(true);
      
      if (window.recordingTimer) {
        clearInterval(window.recordingTimer);
      }
    }
  };

  const handleResumeRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'paused') {
      mediaRecorder.resume();
      setIsPaused(false);
      
      const timer = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      window.recordingTimer = timer;
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
    }
    
    setIsRecording(false);
    setIsPaused(false);
    
    if (window.recordingTimer) {
      clearInterval(window.recordingTimer);
    }
  };

  const handleSaveRecording = async () => {
    if (!audioBlob) {
      setUploadError('No recording found. Please record audio first.');
      return;
    }

    const fileSizeMB = audioBlob.size / (1024 * 1024);
    if (fileSizeMB > 50) {
      setUploadError('Recording is too large (max 50MB). Please record a shorter session.');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      
      const audioType = audioBlob.type;
      let extension = 'webm';
      if (audioType.includes('mp4')) extension = 'mp4';
      else if (audioType.includes('mpeg') || audioType.includes('mp3')) extension = 'mp3';
      else if (audioType.includes('wav')) extension = 'wav';
      else if (audioType.includes('ogg')) extension = 'ogg';

      formData.append('audio', audioBlob, `recording.${extension}`);
      formData.append('purpose', selectedPurpose);
      formData.append('doctorName', getDoctorName(selectedDoctor));
      formData.append('notes', recordedNotes);

      const uploadWithRetry = async (retries = 3) => {
        for (let i = 0; i < retries; i++) {
          try {
            const baseUrl = import.meta.env.VITE_BASE_URL || '';
            const endpointPath = import.meta.env.VITE_AUDIO_TRANSCRIBE_ENDPOINT || '/patient/audiotranscribe/{id}';
            const patientId = user?.id || user?.patientId || user?.userId;
            
            if (!patientId) {
              throw new Error('Patient ID not found. Please login again.');
            }
            
            const finalPath = endpointPath.replace('{id}', patientId);
            const endpoint = `${baseUrl}${finalPath}`;
            
            const response = await fetch(endpoint, {
              method: 'POST',
              body: formData,
              headers: {
                'Accept': 'application/json',
              },
              mode: 'cors',
              credentials: 'include'
            });

            if (!response.ok) {
              const errorText = await response.text();
              throw new Error(`Upload failed: ${response.status} ${response.statusText} - ${errorText}`);
            }

            const result = await response.json();
            
            handleCloseRecording();
            setSelectedConversation(null);
            return result;

          } catch (error) {
            if (i === retries - 1) {
              throw error;
            }
            
            const waitTime = Math.pow(2, i) * 1000;
            await new Promise(resolve => setTimeout(resolve, waitTime));
          }
        }
      };

      await uploadWithRetry();

    } catch (error) {
      let errorMessage = 'Failed to save recording. ';
      
      if (error.message.includes('Failed to fetch')) {
        errorMessage += 'Please check your internet connection and try again.';
      } else if (error.message.includes('413')) {
        errorMessage += 'File is too large for upload.';
      } else if (error.message.includes('500')) {
        errorMessage += 'Server error. Please try again later.';
      } else {
        errorMessage += 'Please try again.';
      }
      
      setUploadError(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  // Enhanced Select styles for mobile
  const selectStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: '48px',
      fontSize: '16px',
      borderColor: showValidationErrors && (!selectedPurpose || !selectedDoctor) ? '#FCA5A5' : base.borderColor,
      boxShadow: state.isFocused ? '0 0 0 2px #20B2AA33' : base.boxShadow,
    }),
    menu: (base) => ({
      ...base,
      fontSize: '16px',
      zIndex: 9999,
    }),
    option: (base) => ({
      ...base,
      fontSize: '16px',
      padding: '12px 16px',
    }),
  };

  return (
    <PatientLayout>
      <div className="h-screen flex flex-col">
        {/* Mobile Header with Menu Toggle */}
        <div className="flex items-center justify-between mb-4 lg:mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Medical Records</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">View your conversation history and medical consultations</p>
          </div>
          
          {/* Mobile Menu Button */}
          {isMobile && (
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="lg:hidden p-2 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              {showSidebar ? <X size={20} /> : <Menu size={20} />}
            </button>
          )}
        </div>

        {/* Main Content Area with Gradient Background */}
        <div className="flex-1 bg-gradient-to-b from-[#F5F5F5] to-[#C3E9ED] rounded-lg overflow-hidden">
          <div className="flex h-full relative">
            
            {/* Mobile Overlay */}
            {isMobile && showSidebar && (
              <div 
                className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                onClick={() => setShowSidebar(false)}
              />
            )}
            
            {/* Left Column - Conversation List */}
            <div className={`
              ${isMobile 
                ? `fixed top-0 left-0 h-full w-80 max-w-[85vw] transform transition-transform duration-300 ease-in-out z-50 ${
                    showSidebar ? 'translate-x-0' : '-translate-x-full'
                  }`
                : 'w-1/3'
              }
              bg-white/50 backdrop-blur-sm border-r border-gray-200 overflow-y-auto
            `}>
              <div className="p-3 sm:p-4">
                {/* Mobile Close Button */}
                {isMobile && (
                  <div className="flex items-center justify-between mb-4 lg:hidden">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <MessageSquare size={20} />
                      My Conversations
                    </h2>
                    <button
                      onClick={() => setShowSidebar(false)}
                      className="p-1 rounded-md hover:bg-gray-200"
                    >
                      <X size={20} />
                    </button>
                  </div>
                )}
                
                {!isMobile && (
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <MessageSquare size={20} />
                    My Conversations
                  </h2>
                )}
                
                <div className="space-y-3">
                  {conversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      onClick={() => handleConversationSelect(conversation)}
                      className={`p-3 sm:p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                        selectedConversation?.id === conversation.id
                          ? 'bg-white shadow-md border-2 border-brand-pri'
                          : 'bg-white/70 hover:bg-white hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(conversation.type)}`}>
                          {conversation.type.charAt(0).toUpperCase() + conversation.type.slice(1)}
                        </span>
                        <span className="text-gray-600 text-xs">-</span>
                        <span className="font-medium text-gray-900 text-sm">
                          {conversation.title.split(' - ')[1] || conversation.title}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 p-3 sm:p-6 overflow-y-auto">
                {selectedConversation ? (
                  /* Selected Conversation Content */
                  <div className="bg-white/70 backdrop-blur-sm rounded-lg h-full flex flex-col">
                    <div className="p-4 sm:p-6 border-b border-gray-200/50">
                      <button 
                        onClick={handleBackToConversations}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 transition-colors"
                      >
                        <ArrowLeft size={16} />
                        <span className="text-sm">Back to conversations</span>
                      </button>
                      
                      <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                        {selectedConversation.title}
                      </h2>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-1">
                          <Calendar size={16} />
                          <span className="truncate">{formatDate(selectedConversation.date)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock size={16} />
                          <span>{selectedConversation.time}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User size={16} />
                          <span className="truncate">{selectedConversation.doctor}</span>
                        </div>
                      </div>
                      
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(selectedConversation.type)}`}>
                        {selectedConversation.type.charAt(0).toUpperCase() + selectedConversation.type.slice(1)}
                      </span>
                    </div>
                    
                    <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
                      <div className="mb-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-3">Summary</h3>
                        <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                          {selectedConversation.summary}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : showMainRecording ? (
                  /* Main Recording Interface */
                  <div className="bg-white/70 backdrop-blur-sm rounded-lg flex flex-col min-h-full">
                    <div className="p-4 sm:p-6 border-b border-gray-200/50 flex-shrink-0">
                      <button 
                        onClick={handleCloseRecording}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 transition-colors"
                      >
                        <ArrowLeft size={16} />
                        <span className="text-sm">Back to conversations</span>
                      </button>
                      
                      <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Recording Session</h2>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <span className="font-medium">Purpose:</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(selectedPurpose)}`}>
                            {selectedPurpose.charAt(0).toUpperCase() + selectedPurpose.slice(1)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User size={16} />
                          <span className="truncate">{getDoctorName(selectedDoctor)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex-1 p-4 sm:p-6 flex flex-col items-center justify-center space-y-6 sm:space-y-8 min-h-0">
                      <div className="text-center">
                        <div className="w-32 sm:w-40 h-32 sm:h-40 mx-auto mb-4 sm:mb-6 relative">
                          <img 
                            src={recording_mic} 
                            alt="Recording Microphone" 
                            className={`w-full h-full object-contain transition-all duration-300 ${
                              isRecording && !isPaused ? 'animate-pulse' : ''
                            }`}
                          />
                          {isRecording && !isPaused && (
                            <div className="absolute inset-0 rounded-full border-4 border-red-500 animate-ping"></div>
                          )}
                        </div>
                        
                        <div className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                          {formatTime(recordingTime)}
                        </div>
                        
                        <div className={`text-base sm:text-lg font-medium ${
                          isRecording && !isPaused ? 'text-red-600' : 
                          isPaused ? 'text-yellow-600' : 'text-gray-600'
                        }`}>
                          {isRecording && !isPaused ? 'Recording...' : 
                           isPaused ? 'Paused' : 'Ready to Record'}
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full max-w-md">
                        {!isRecording ? (
                          <>
                            <button
                              onClick={recordingTime > 0 ? handleRestartRecording : handleStartActualRecording}
                              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 sm:px-6 py-3 rounded-full font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                              disabled={isUploading || microphonePermission === 'denied'}
                            >
                              <Play size={18} />
                              {recordingTime > 0 ? 'Restart Recording' : 'Start Recording'}
                            </button>
                            
                            {recordingTime > 0 && (
                              <button
                                onClick={handleSaveRecording}
                                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-brand-sec hover:bg-teal-600 text-white px-4 sm:px-8 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                                disabled={isUploading || !audioBlob}
                              >
                                <Send size={18} />
                                {isUploading ? 'Saving...' : 'Save Recording'}
                              </button>
                            )}
                          </>
                        ) : (
                          <>
                            {!isPaused ? (
                              <button
                                onClick={handlePauseRecording}
                                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 sm:px-6 py-3 rounded-full font-medium transition-colors text-sm sm:text-base"
                              >
                                <Pause size={18} />
                                Pause
                              </button>
                            ) : (
                              <button
                                onClick={handleResumeRecording}
                                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 sm:px-6 py-3 rounded-full font-medium transition-colors text-sm sm:text-base"
                              >
                                <Play size={18} />
                                Resume
                              </button>
                            )}
                            
                            <button
                              onClick={handleStopRecording}
                              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-4 sm:px-6 py-3 rounded-full font-medium transition-colors text-sm sm:text-base"
                            >
                              <Square size={18} />
                              Stop
                            </button>
                          </>
                        )}
                      </div>
                      
                      {uploadError && (
                        <div className="w-full max-w-md mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-sm text-red-600">{uploadError}</p>
                        </div>
                      )}
                      
                      {microphonePermission === 'denied' && (
                        <div className="w-full max-w-md mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <p className="text-sm text-yellow-700">
                            Microphone access denied. Please enable microphone permissions in your browser settings.
                          </p>
                        </div>
                      )}
                      
                      {isUploading && (
                        <div className="w-full max-w-md mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <p className="text-sm text-blue-600 flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            Uploading recording to server...
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : showRecordingInterface ? (
                  /* Recording Setup Interface */
                  <div className="bg-white/70 backdrop-blur-sm rounded-lg h-full flex flex-col overflow-hidden">
                    <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                      <div className="text-center max-w-xl mx-auto">
                        <div className="w-24 sm:w-32 h-24 sm:h-32 mx-auto mb-4 sm:mb-6">
                          <img 
                            src={recording_mic} 
                            alt="Recording Microphone" 
                            className="w-full h-full object-contain"
                          />
                        </div>
                        
                        <h3 className="text-lg font-medium text-gray-700 mb-3">
                          + Add New Recording
                        </h3>
                        
                        <div className="w-16 h-0.5 bg-brand-sec mx-auto mb-6"></div>
                        
                        <div className="flex flex-col sm:flex-row gap-4 mb-6">
                          <div className="flex-1">
                            <Select
                              options={purposeOptions}
                              value={purposeOptions.find(option => option.value === selectedPurpose)}
                              onChange={option => setSelectedPurpose(option ? option.value : '')}
                              placeholder="Select Purpose"
                              classNamePrefix="react-select"
                              styles={selectStyles}
                              menuPlacement="auto"
                            />
                          </div>
                          
                          <div className="flex-1">
                            <Select
                              options={doctors.map(doctor => ({
                                value: doctor.id,
                                label: `${doctor.name}${doctor.field && doctor.field !== 'General Practice' ? ` - ${doctor.field}` : ''}${doctor.hospital && doctor.hospital !== 'Hospital not specified' ? ` (${doctor.hospital})` : ''}`
                              }))}
                              value={doctors
                                .map(doctor => ({
                                  value: doctor.id,
                                  label: `${doctor.name}${doctor.field && doctor.field !== 'General Practice' ? ` - ${doctor.field}` : ''}${doctor.hospital && doctor.hospital !== 'Hospital not specified' ? ` (${doctor.hospital})` : ''}`
                                }))
                                .find(option => option.value === selectedDoctor) || null}
                              onChange={option => setSelectedDoctor(option ? option.value : '')}
                              placeholder={loadingDoctors ? 'Loading doctors...' : 'Search or select doctor...'}
                              isLoading={loadingDoctors}
                              isDisabled={loadingDoctors}
                              classNamePrefix="react-select"
                              styles={selectStyles}
                              menuPlacement="auto"
                            />
                          </div>
                        </div>
                        
                        {/* Validation Messages */}
                        {showValidationErrors && (!selectedPurpose || !selectedDoctor || !consentChecked) && (
                          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-left">
                            <p className="text-sm text-red-600 font-medium mb-1">Please complete all required fields:</p>
                            <ul className="text-xs text-red-500 space-y-1">
                              {!selectedPurpose && <li>• Select a purpose for the recording</li>}
                              {!selectedDoctor && <li>• Select a doctor</li>}
                              {!consentChecked && <li>• Agree to the consent terms</li>}
                            </ul>
                          </div>
                        )}
                        
                        {/* Additional Notes Section */}
                        <div className="mb-6 text-left">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Additional Notes (Optional)
                          </label>
                          <textarea
                            value={recordedNotes}
                            onChange={(e) => setRecordedNotes(e.target.value)}
                            placeholder="Add any additional notes about this recording session..."
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-pri resize-none text-base"
                            rows="3"
                            style={{ fontSize: '16px' }}
                          />
                        </div>
                        
                        {/* Mobile-optimized Consent Checkbox */}
                        <div className="mb-6 text-left">
                          <label className="flex items-start gap-3 text-sm text-gray-600 cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={consentChecked}
                              onChange={(e) => setConsentChecked(e.target.checked)}
                              className={`mt-1 w-5 h-5 text-brand-pri border-gray-300 rounded focus:ring-brand-pri ${
                                showValidationErrors && !consentChecked ? 'border-red-300' : 'border-gray-300'
                              }`}
                            />
                            <span className="leading-relaxed">
                              I hereby consent to the recording of this conversation for documentation and 
                              reference purposes. I understand that the recording will be stored securely and 
                              used in accordance with applicable privacy laws.
                            </span>
                          </label>
                        </div>
                        
                        {/* Mobile-optimized Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                          <button 
                            onClick={handleCloseRecording}
                            className="w-full sm:flex-1 sm:max-w-40 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                          >
                            Cancel
                          </button>
                          <button 
                            onClick={handleStartRecording}
                            className="w-full sm:flex-1 sm:max-w-40 bg-gradient-to-r from-[#F5F5F5] to-[#C3E9ED] hover:from-[#E8E8E8] hover:to-[#B8E3E7] text-gray-700 px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 border border-gray-300"
                          >
                            Start Recording
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Default Empty State */
                  <div className="bg-white/70 backdrop-blur-sm rounded-lg h-full flex items-center justify-center">
                    <div className="text-center max-w-md mx-auto p-6 sm:p-8">
                      <div className="w-20 sm:w-24 h-20 sm:h-24 mx-auto mb-4 sm:mb-6">
                        <img 
                          src={recording_mic} 
                          alt="Recording Microphone" 
                          className="w-full h-full object-contain"
                        />
                      </div>
                      
                      <h3 className="text-lg font-medium text-gray-700 mb-3">
                        Select Conversation
                      </h3>
                      <p className="text-gray-600 mb-6 leading-relaxed text-sm sm:text-base">
                        Choose a conversation from the list to view its details
                      </p>
                      
                      <button 
                        onClick={() => {
                          setShowRecordingInterface(true);
                          if (isMobile) setShowSidebar(false);
                        }}
                        className="w-full sm:w-auto bg-gradient-to-r from-[#F5F5F5] to-[#C3E9ED] hover:from-[#E8E8E8] hover:to-[#B8E3E7] text-gray-700 px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 border border-gray-300"
                      >
                        + Add Conversation
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PatientLayout>
  );
};

export default PatientRecords;