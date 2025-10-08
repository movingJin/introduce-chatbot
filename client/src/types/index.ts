// API Response Types
export interface AnswerResponse {
  answer: string;
}

// Profile Types
export interface ProfileData {
  [key: string]: string | number | string[];
}

export interface ProfileMap {
  [personId: string]: ProfileData;
}

export interface EditProfileRequest {
  id: string;
  data: ProfileData;
}

// Chat Message Types
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

