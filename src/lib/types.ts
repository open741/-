export interface GeneratedImage {
  id: string;
  imageUrl: string;
  taskId: string;
}

export interface AITask {
  id: string;
  taskName: string;
  prompt: string;
  style: string;
  size: string;
  quantity?: number;
  isGroupImage?: boolean;
  creator: string;
  createdAt: Date;
  status: 'pending' | 'generating' | 'completed' | 'failed';
  images: GeneratedImage[];
}

export interface DialogueWord {
  text: string;
  partOfSpeech: 'noun' | 'verb' | 'adj' | 'pronoun' | 'other';
  img?: string;
  isGenerating?: boolean;
}

export interface DialogueLine {
  speaker: 'teacher' | 'student';
  words: DialogueWord[];
}

export interface Activity {
  id: string;
  name: string;
  dialogues: DialogueLine[];
  wordCards: Card[];
  createdAt: Date;
}

export interface Card {
  id: string;
  type: 'graphic' | 'word';
  title: string;
  imageUrl: string;
  tags: string[];
  publishStatus: 'published' | 'unpublished';
  sourceType: 'upload' | 'ai' | 'activity';
  sourceActivity?: string;
  activityId?: string;
  posColor?: string;
  creator: string;
  partOfSpeech?: string;
  taskId?: string;
  taskName?: string;
}
