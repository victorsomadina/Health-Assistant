// pages/patient/PatientRecords.jsx
import React, { useState } from 'react';
import { MessageSquare, Calendar, Clock, User, ArrowLeft, Play, Pause, Square, Send } from 'lucide-react';
import PatientLayout from '../../components/layout/PatientLayout';
import { conversations, conversationTypes } from '../../data/patientRecordsData';
import recording_mic from '../../assets/images/recording_mic.png';
import { useAuth } from '../../context/AuthContext';

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
  
  // Audio recording states
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [audioBlob, setAudioBlob] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [microphonePermission, setMicrophonePermission] = useState('prompt');

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
  const getDoctorName = (doctorValue) => {
    const doctorNames = {
      'dr-sarah-johnson': 'Dr. Sarah Johnson',
      'dr-michael-chen': 'Dr. Michael Chen',
      'dr-emily-rodriguez': 'Dr. Emily Rodriguez',
      'dr-james-wilson': 'Dr. James Wilson',
      'dr-lisa-thompson': 'Dr. Lisa Thompson'
    };
    return doctorNames[doctorValue] || doctorValue;
  };

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

  // Reset form when closing recording interface
  const handleCloseRecording = () => {
    // Stop any ongoing recording
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
    }
    
    // Clear timer
    if (window.recordingTimer) {
      clearInterval(window.recordingTimer);
    }
    
    // Reset all states
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
    setAudioChunks([]);
    setAudioBlob(null);
    setIsUploading(false);
    setUploadError(null);
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

      const chunks = [];
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: selectedMimeType });
        setAudioBlob(blob);
        setAudioChunks(chunks);
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };

      setMediaRecorder(recorder);
      recorder.start();
      setIsRecording(true);
      setIsPaused(false);

      // Start timer
      const timer = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      window.recordingTimer = timer;

    } catch (error) {
      console.error('Error starting recording:', error);
      setUploadError('Unable to access microphone. Please check permissions.');
    }
  };

  const handleRestartRecording = async () => {
    // Reset audio data
    setAudioBlob(null);
    setAudioChunks([]);
    setRecordingTime(0);
    
    // Clear any existing timer
    if (window.recordingTimer) {
      clearInterval(window.recordingTimer);
    }
    
    // Start fresh recording
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

    // Check file size (50MB limit)
    const fileSizeMB = audioBlob.size / (1024 * 1024);
    if (fileSizeMB > 50) {
      setUploadError('Recording is too large (max 50MB). Please record a shorter session.');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      // Prepare form data
      const formData = new FormData();
      
      // Get file extension based on audio type
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

      // API call with retry mechanism
      const uploadWithRetry = async (retries = 3) => {
        // Debug logging for environment and user data
        console.log('🔍 DEBUG: Starting upload process');
        console.log('🔍 Environment variables:', {
          VITE_BASE_URL: import.meta.env.VITE_BASE_URL,
          VITE_AUDIO_TRANSCRIBE_ENDPOINT: import.meta.env.VITE_AUDIO_TRANSCRIBE_ENDPOINT,
          MODE: import.meta.env.MODE,
          DEV: import.meta.env.DEV
        });
        console.log('🔍 User object:', user);
        console.log('🔍 Audio blob:', {
          size: audioBlob?.size,
          type: audioBlob?.type,
          sizeMB: audioBlob ? (audioBlob.size / (1024 * 1024)).toFixed(2) : 'N/A'
        });
        console.log('🔍 Form data values:', {
          purpose: selectedPurpose,
          doctorName: getDoctorName(selectedDoctor),
          notes: recordedNotes
        });

        for (let i = 0; i < retries; i++) {
          try {
            console.log(`🚀 Upload attempt ${i + 1}/${retries}`);
            
            // Get endpoint from environment variables
            const baseUrl = import.meta.env.VITE_BASE_URL || '';
            const endpointPath = import.meta.env.VITE_AUDIO_TRANSCRIBE_ENDPOINT || '/patient/audiotranscribe/{id}';
            const patientId = user?.id || user?.patientId || user?.userId;
            
            console.log('🔍 Endpoint construction:', {
              baseUrl,
              endpointPath,
              patientId,
              fullUser: JSON.stringify(user, null, 2)
            });
            
            if (!patientId) {
              console.error('❌ Patient ID not found in user object');
              throw new Error('Patient ID not found. Please login again.');
            }
            
            // Replace {id} placeholder with actual patient ID
            const finalPath = endpointPath.replace('{id}', patientId);
            const endpoint = `${baseUrl}${finalPath}`;
            console.log('🎯 Final endpoint:', endpoint);
            
            // Log FormData contents
            console.log('📦 FormData contents:');
            for (let [key, value] of formData.entries()) {
              if (key === 'audio') {
                console.log(`  ${key}:`, {
                  type: value.type,
                  size: value.size,
                  name: value.name
                });
              } else {
                console.log(`  ${key}:`, value);
              }
            }
            
            console.log('📡 Making fetch request...');
            const response = await fetch(endpoint, {
              method: 'POST',
              body: formData,
              headers: {
                'Accept': 'application/json',
              },
              mode: 'cors',
              credentials: 'include'
            });

            console.log('📨 Response received:', {
              status: response.status,
              statusText: response.statusText,
              ok: response.ok,
              headers: Object.fromEntries(response.headers.entries())
            });

            if (!response.ok) {
              const errorText = await response.text();
              console.error('❌ Response error details:', {
                status: response.status,
                statusText: response.statusText,
                body: errorText
              });
              throw new Error(`Upload failed: ${response.status} ${response.statusText} - ${errorText}`);
            }

            const result = await response.json();
            console.log('✅ Recording saved successfully:', result);
            
            // Handle successful response
            if (result.message && result.conversation) {
              console.log('✅ New conversation created:', result.conversation);
              console.log('✅ Conversation ID:', result.conversation.id);
            }
            
            // Success! Reset and go back to main view
            handleCloseRecording();
            setSelectedConversation(null);
            return result;

          } catch (error) {
            console.error(`❌ Upload attempt ${i + 1} failed:`, {
              message: error.message,
              stack: error.stack,
              name: error.name
            });
            
            if (i === retries - 1) {
              console.error('💥 All retry attempts failed');
              throw error; // Last attempt failed
            }
            
            const waitTime = Math.pow(2, i) * 1000;
            console.log(`⏳ Waiting ${waitTime}ms before retry...`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
          }
        }
      };

      await uploadWithRetry();

    } catch (error) {
      console.error('Failed to save recording:', error);
      
      // User-friendly error messages
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

  return (
    <PatientLayout>
      <div className="h-screen flex flex-col">
        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Medical Records</h1>
          <p className="text-gray-600 mt-1">View your conversation history and medical consultations</p>
        </div>

        {/* Main Content Area with Gradient Background */}
        <div className="flex-1 bg-gradient-to-b from-[#F5F5F5] to-[#C3E9ED] rounded-lg overflow-hidden">
          <div className="flex h-full">
            
            {/* Left Column - Conversation List */}
            <div className="w-1/3 bg-white/50 backdrop-blur-sm border-r border-gray-200 overflow-y-auto">
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <MessageSquare size={20} />
                  My Conversations
                </h2>
                
                <div className="space-y-3">
                  {conversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      onClick={() => setSelectedConversation(conversation)}
                      className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                        selectedConversation?.id === conversation.id
                          ? 'bg-white shadow-md border-2 border-brand-pri'
                          : 'bg-white/70 hover:bg-white hover:shadow-sm'
                      }`}
                    >
                      {/* Type Badge with Title */}
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

            {/* Right Column - Main Content Area (Flexible Container) */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 p-6 overflow-y-auto">
                {selectedConversation ? (
                  /* Selected Conversation Content */
                  <div className="bg-white/70 backdrop-blur-sm rounded-lg h-full flex flex-col">
                    {/* Header Section */}
                    <div className="p-6 border-b border-gray-200/50">
                      {/* Back Button */}
                      <button 
                        onClick={() => setSelectedConversation(null)}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 transition-colors"
                      >
                        <ArrowLeft size={16} />
                        <span className="text-sm">Back to conversations</span>
                      </button>
                      
                      <h2 className="text-xl font-semibold text-gray-900 mb-2">
                        {selectedConversation.title}
                      </h2>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-1">
                          <Calendar size={16} />
                          {formatDate(selectedConversation.date)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock size={16} />
                          {selectedConversation.time}
                        </div>
                        <div className="flex items-center gap-1">
                          <User size={16} />
                          {selectedConversation.doctor}
                        </div>
                      </div>
                      
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(selectedConversation.type)}`}>
                        {selectedConversation.type.charAt(0).toUpperCase() + selectedConversation.type.slice(1)}
                      </span>
                    </div>
                    
                    {/* Content Section - Flexible for future features */}
                    <div className="flex-1 p-6 overflow-y-auto">
                      <div className="mb-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-3">Summary</h3>
                        <p className="text-gray-700 leading-relaxed">
                          {selectedConversation.summary}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : showMainRecording ? (
                  /* Main Recording Interface */
                  <div className="bg-white/70 backdrop-blur-sm rounded-lg flex flex-col min-h-full">
                    {/* Recording Header */}
                    <div className="p-6 border-b border-gray-200/50 flex-shrink-0">
                      <button 
                        onClick={handleCloseRecording}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 transition-colors"
                      >
                        <ArrowLeft size={16} />
                        <span className="text-sm">Back to conversations</span>
                      </button>
                      
                      <h2 className="text-xl font-semibold text-gray-900 mb-2">Recording Session</h2>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <span className="font-medium">Purpose:</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(selectedPurpose)}`}>
                            {selectedPurpose.charAt(0).toUpperCase() + selectedPurpose.slice(1)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User size={16} />
                          <span>{getDoctorName(selectedDoctor)}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Recording Content */}
                    <div className="flex-1 p-6 flex flex-col items-center justify-center space-y-8 min-h-0">
                      {/* Microphone and Timer */}
                      <div className="text-center">
                        <div className="w-40 h-40 mx-auto mb-6 relative">
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
                        
                        {/* Recording Timer */}
                        <div className="text-4xl font-bold text-gray-900 mb-4">
                          {formatTime(recordingTime)}
                        </div>
                        
                        {/* Recording Status */}
                        <div className={`text-lg font-medium ${
                          isRecording && !isPaused ? 'text-red-600' : 
                          isPaused ? 'text-yellow-600' : 'text-gray-600'
                        }`}>
                          {isRecording && !isPaused ? 'Recording...' : 
                           isPaused ? 'Paused' : 'Ready to Record'}
                        </div>
                      </div>
                      
                      {/* Recording Controls */}
                      <div className="flex items-center gap-4">
                        {!isRecording ? (
                          <>
                            <button
                              onClick={recordingTime > 0 ? handleRestartRecording : handleStartActualRecording}
                              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-full font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={isUploading || microphonePermission === 'denied'}
                            >
                              <Play size={20} />
                              {recordingTime > 0 ? 'Restart Recording' : 'Start Recording'}
                            </button>
                            
                            {/* Save Button - Show alongside Start Recording when recording is stopped and has time */}
                            {recordingTime > 0 && (
                              <button
                                onClick={handleSaveRecording}
                                className="flex items-center gap-2 bg-brand-sec hover:bg-teal-600 text-white px-8 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isUploading || !audioBlob}
                              >
                                <Send size={20} />
                                {isUploading ? 'Saving...' : 'Save Recording'}
                              </button>
                            )}
                          </>
                        ) : (
                          <>
                            {!isPaused ? (
                              <button
                                onClick={handlePauseRecording}
                                className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-full font-medium transition-colors"
                              >
                                <Pause size={20} />
                                Pause
                              </button>
                            ) : (
                              <button
                                onClick={handleResumeRecording}
                                className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full font-medium transition-colors"
                              >
                                <Play size={20} />
                                Resume
                              </button>
                            )}
                            
                            <button
                              onClick={handleStopRecording}
                              className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-full font-medium transition-colors"
                            >
                              <Square size={20} />
                              Stop
                            </button>
                          </>
                        )}
                      </div>
                      
                      {/* Error Message */}
                      {uploadError && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-sm text-red-600">{uploadError}</p>
                        </div>
                      )}
                      
                      {/* Microphone Permission Warning */}
                      {microphonePermission === 'denied' && (
                        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <p className="text-sm text-yellow-700">
                            Microphone access denied. Please enable microphone permissions in your browser settings.
                          </p>
                        </div>
                      )}
                      
                      {/* Upload Progress */}
                      {isUploading && (
                        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
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
                    <div className="flex-1 overflow-y-auto p-6">
                      <div className="text-center max-w-xl mx-auto">
                        {/* Microphone Image */}
                        <div className="w-32 h-32 mx-auto mb-6">
                          <img 
                            src={recording_mic} 
                            alt="Recording Microphone" 
                            className="w-full h-full object-contain"
                          />
                        </div>
                        
                        <h3 className="text-lg font-medium text-gray-700 mb-3">
                          + Add New Recording
                        </h3>
                        
                        {/* Colored line */}
                        <div className="w-16 h-0.5 bg-brand-sec mx-auto mb-6"></div>
                        
                        {/* Purpose and Doctor Dropdowns */}
                        <div className="flex gap-4 mb-6">
                          <select 
                            value={selectedPurpose}
                            onChange={(e) => setSelectedPurpose(e.target.value)}
                            className={`flex-1 px-4 py-2 border rounded-lg text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand-pri ${
                              showValidationErrors && !selectedPurpose ? 'border-red-300' : 'border-gray-300'
                            }`}
                          >
                            <option value="">Select Purpose</option>
                            <option value="consultation">Consultation</option>
                            <option value="follow-up">Follow-up</option>
                            <option value="discussion">Discussion</option>
                            <option value="review">Review</option>
                            <option value="check-in">Check-in</option>
                          </select>
                          
                          <select 
                            value={selectedDoctor}
                            onChange={(e) => setSelectedDoctor(e.target.value)}
                            className={`flex-1 px-4 py-2 border rounded-lg text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand-pri ${
                              showValidationErrors && !selectedDoctor ? 'border-red-300' : 'border-gray-300'
                            }`}
                          >
                            <option value="">Select Doctor</option>
                            <option value="dr-sarah-johnson">Dr. Sarah Johnson</option>
                            <option value="dr-michael-chen">Dr. Michael Chen</option>
                            <option value="dr-emily-rodriguez">Dr. Emily Rodriguez</option>
                            <option value="dr-james-wilson">Dr. James Wilson</option>
                            <option value="dr-lisa-thompson">Dr. Lisa Thompson</option>
                          </select>
                        </div>
                        
                        {/* Validation Messages - Only show when showValidationErrors is true */}
                        {showValidationErrors && (!selectedPurpose || !selectedDoctor || !consentChecked) && (
                          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
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
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-pri resize-none"
                            rows="3"
                          />
                        </div>
                        
                        {/* Consent Checkbox */}
                        <div className="mb-6 text-left">
                          <label className="flex items-start gap-3 text-sm text-gray-600 cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={consentChecked}
                              onChange={(e) => setConsentChecked(e.target.checked)}
                              className={`mt-1 w-4 h-4 text-brand-pri border-gray-300 rounded focus:ring-brand-pri ${
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
                        
                        {/* Action Buttons */}
                        <div className="flex gap-3 justify-center">
                          <button 
                            onClick={handleCloseRecording}
                            className="flex-1 max-w-40 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                          >
                            Cancel
                          </button>
                          <button 
                            onClick={handleStartRecording}
                            className="flex-1 max-w-40 bg-gradient-to-r from-[#F5F5F5] to-[#C3E9ED] hover:from-[#E8E8E8] hover:to-[#B8E3E7] text-gray-700 px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 border border-gray-300"
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
                    <div className="text-center max-w-md mx-auto p-8">
                      {/* Microphone Image */}
                      <div className="w-24 h-24 mx-auto mb-6">
                        <img 
                          src={recording_mic} 
                          alt="Recording Microphone" 
                          className="w-full h-full object-contain"
                        />
                      </div>
                      
                      <h3 className="text-lg font-medium text-gray-700 mb-3">
                        Select Conversation
                      </h3>
                      <p className="text-gray-600 mb-6 leading-relaxed">
                        Choose a conversation from the list to view its details
                      </p>
                      
                      {/* Add Conversation Button */}
                      <button 
                        onClick={() => setShowRecordingInterface(true)}
                        className="bg-gradient-to-r from-[#F5F5F5] to-[#C3E9ED] hover:from-[#E8E8E8] hover:to-[#B8E3E7] text-gray-700 px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 border border-gray-300"
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