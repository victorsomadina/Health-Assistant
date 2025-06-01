# WeHelp Application  
*Your intelligent health companion for medication access and doctor consultations*

---

## 🔶 Problem

Nigeria’s healthcare system faces critical challenges:

- **Patients** often forget key details from consultations due to short appointment durations and lack of structured records.
- **Doctors** are burdened by staff shortages and outdated paper-based documentation systems.
- This results in **miscommunication**, **poor follow-up**, and **fragmented continuity of care**.

---

## 🟩 Proposed Solution

**WeHelp** is an AI-powered virtual health assistant designed to:

- **Record and organize doctor-patient conversations** (with patient consent).
- Allow **patients to revisit and query** previous consultations.
- Reduce **documentation load** on healthcare providers.
- Ensure **continuity of care** while strictly adhering to **data privacy laws**.

---

## 🟦 Key Features

### 1. Symptom Checker & Guidance
- Conversational interface for collecting symptoms.
- Provides step-by-step health guidance.
- Escalates to human healthcare personnel when needed.

### 2. Conversation Recording & Transcription
- Records real-time conversations (with consent).
- Transcribes and stores them securely.
- Enables intelligent querying of past discussions.

### 3. Chat & Voice Activated Interface
- Voice-enabled chat for ease of use.
- Speaking wave modal when voice button is activated.
- Audio waveform and timer displayed during recordings.

### 4. Data Privacy & Access Control
- **JWT-based** authentication for secure access.
- Role-based access control (doctor, patient, admin).
- Metadata tagging: `conversation_id`, `doctor_id`, `patient_id`, `timestamp`.
- **NER-based anonymization** of sensitive personal information.
- Explicit **user consent** for anonymized data usage in research.

---

## ⚙️ Process Flow & System Design

### Frontend

#### Users:
- Welcome Page
- Chat & Recording Interfaces
- Medication Management Tools
- Personalized Dashboard

#### Doctors:
- Pre-signed up by admin
- Login and access chat interface to consult and review past conversations

#### Admins / Super Admins:
- Admins: Add and manage doctor accounts
- Super Admins: Manage hospitals and admin accounts

---

### Backend

- **Authentication Services** using JWT
- **Conversation Handling** via REST APIs
  - Store, tag, and retrieve records
  - Integration with MCP Server for transcription
- **Database**: MySQL with SnowFlake ERD schema

---

## 🛠 Tools & Techniques

- **Frontend**: Web-based interfaces with voice and chat support
- **Backend**: Node.js services and REST APIs
- **Authentication**: JWT tokens
- **Database**: MySQL
- **AI/ML**:
  - Named Entity Recognition (NER) for anonymization
  - AI assistant architecture (for querying and interaction)
- **Security**:
  - Metadata tagging for conversations
  - Access control middleware
  - User consent management

---

## 🚀 Future Works

- **Chat & Video Call Integration**  
  Enable real-time **chatting and video consultations** for enhanced doctor-patient interactions.

- **Doctor Voice Cloning for Playback**  
  Incorporate **voice cloning technology** to allow **recorded sessions to be replayed in the doctor's own voice**, giving users the impression of a live consultation.

---

