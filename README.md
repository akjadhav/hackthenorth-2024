# Voice-Centric Indoor Navigation Assistant

## Overview
This application is an innovative, voice-first indoor navigation solution designed to enhance mobility and independence for individuals with visual impairments. It leverages advanced voice interaction, real-time computer vision, and intelligent context understanding to provide accessible, spoken navigation guidance in indoor spaces.

## Technologies

- **Frontend**: Next.js
- **Backend**: Convex
- **Indoor Mapping**: MappedIn SDK
- **Computer Vision**: 
  - Real-time video streaming: Multiple TAPO cameras (1080p)
  - Object Detection: YOLOv8
  - Depth Estimation: DPT (Dense Prediction Transformer)
  - Scene Analysis: GPT-4 Vision
- **Agent / LLM**:
   - Voiceflow: Powers the user interaction layer, providing a seamless voice interface for visually impaired users. This forms the core of the agentic and voice-driven user experience.
   - Cohere: Integrated within Voiceflow, it provides embeddings and Retrieval-Augmented Generation (RAG) capabilities for enhanced context understanding and response generation from the real-time computer vision tags, crucial for intelligent voice interactions.
- **Speech Processing**:
  - Speech-to-Text: Whisper (via Groq)
  - Text-to-Speech: Custom model

## Key Features
1. Voice-first user interface optimized for visually impaired users
2. Real-time indoor mapping and navigation with spoken instructions
3. Multi-camera real-time computer vision for environmental awareness
4. Intelligent context understanding using Cohere's RAG within Voiceflow
5. Adaptive, accessible navigation guidance

## How It Works

1. **Agentic Voice Interaction**
   - Users interact with the system entirely through voice commands.
   - Voiceflow manages the conversation flow, interpreting user intents and generating responses.
   - Cohere's embeddings and RAG system, integrated within Voiceflow, process user queries and environmental data for enhanced understanding and context-aware responses.

2. **Real-time Environmental Analysis**
   - Multiple TAPO cameras stream 1080p video throughout the venue.
   - YOLOv7, DPT, and GPT-4 Vision process these streams in real-time to detect objects, estimate depths, and analyze scenes.
   - Visual data is converted into text descriptions and embedded using Cohere for use in the RAG system.

3. **Indoor Mapping and Routing**
   - MappedIn SDK provides indoor map data and routing algorithms.
   - Voiceflow and Cohere translate routing data into clear, spoken instructions.

4. **Navigation Guidance Delivery**
   - The system generates step-by-step navigation instructions based on processed environmental data and user requests.
   - Instructions are conveyed via spoken words, optimized for visually impaired individuals.
   - Guidance is continuously updated based on real-time environmental changes and user movement.

## Setup and Installation

1. Clone the repository
   ```
   git clone [repository-url]
   cd [project-directory]
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Set up environment variables in a `.env.local` file

4. Start the development server
   ```
   npm run dev
   ```

## Contributing
We welcome contributions that enhance accessibility, improve voice interaction, or refine navigation accuracy for visually impaired users. Please submit pull requests or open issues to discuss proposed changes.