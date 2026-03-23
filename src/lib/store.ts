import { create } from 'zustand';
import { AITask, Activity, Card, GeneratedImage } from './types';
import { initialAITasks, initialActivities, initialCards } from './mockData';

interface StoreState {
  aiTasks: AITask[];
  cards: Card[];
  activities: Activity[];
  
  // Actions
  addAITask: (task: Omit<AITask, 'id' | 'createdAt' | 'status' | 'images'>) => AITask;
  updateCard: (id: string, updates: Partial<Card>) => void;
  deleteCards: (ids: Set<string>) => void;
  deleteAITask: (id: string) => void;
  updateActivity: (activityId: string, updates: Partial<Activity>) => void;
  addActivity: (activity: Omit<Activity, 'createdAt'>) => Activity;
  getCreators: () => string[];
}

// Initialize cards from tasks
const initializeCards = () => {
  const cards = [...initialCards];
  initialAITasks.forEach(task => {
    if (task.status === 'completed' && task.images.length > 0) {
      task.images.forEach((img, index) => {
        cards.push({
          id: img.id,
          type: 'graphic',
          title: `${task.taskName} - ${index + 1}`,
          imageUrl: img.imageUrl,
          tags: [task.style],
          publishStatus: 'unpublished',
          sourceType: 'ai',
          creator: task.creator,
          taskId: task.id,
          taskName: task.taskName
        });
      });
    }
  });
  return cards;
};

export const useStore = create<StoreState>((set, get) => ({
  aiTasks: initialAITasks,
  cards: initializeCards(),
  activities: initialActivities,

  addAITask: (task) => {
    const newTask: AITask = {
      ...task,
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      status: 'generating',
      images: []
    };

    set((state) => ({
      aiTasks: [newTask, ...state.aiTasks]
    }));

    // Simulate AI generation
    setTimeout(() => {
      const generatedImages: GeneratedImage[] = [];
      const quantity = newTask.quantity || 4;
      for (let i = 0; i < quantity; i++) {
        generatedImages.push({
          id: `img-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 9)}`,
          imageUrl: `https://picsum.photos/seed/${newTask.id}-${i}/400/400`,
          taskId: newTask.id
        });
      }

      set((state) => {
        const newCards = generatedImages.map((img, index) => ({
          id: img.id,
          type: 'graphic' as const,
          title: `${task.taskName} - ${index + 1}`,
          imageUrl: img.imageUrl,
          tags: [task.style],
          publishStatus: 'unpublished' as const,
          sourceType: 'ai' as const,
          creator: task.creator,
          taskId: newTask.id,
          taskName: task.taskName
        }));

        return {
          aiTasks: state.aiTasks.map(t => 
            t.id === newTask.id 
              ? { ...t, status: 'completed', images: generatedImages }
              : t
          ),
          cards: [...newCards, ...state.cards]
        };
      });
    }, 3000);

    return newTask;
  },

  updateCard: (id, updates) => {
    set((state) => ({
      cards: state.cards.map(c => c.id === id ? { ...c, ...updates } : c)
    }));
  },

  deleteCards: (ids) => {
    set((state) => ({
      cards: state.cards.filter(c => !ids.has(c.id))
    }));
  },

  deleteAITask: (id) => {
    set((state) => {
      const task = state.aiTasks.find(t => t.id === id);
      if (!task) return state;

      const imageIds = new Set(task.images.map(img => img.id));
      return {
        cards: state.cards.filter(c => !imageIds.has(c.id)),
        aiTasks: state.aiTasks.filter(t => t.id !== id)
      };
    });
  },

  updateActivity: (activityId, updates) => {
    set((state) => ({
      activities: state.activities.map(a => 
        a.id === activityId ? { ...a, ...updates } : a
      )
    }));
  },

  addActivity: (activity) => {
    const newActivity: Activity = {
      ...activity,
      createdAt: new Date()
    };
    set((state) => ({
      activities: [newActivity, ...state.activities]
    }));
    return newActivity;
  },

  getCreators: () => {
    const { cards } = get();
    return Array.from(new Set(cards.map(c => c.creator))).filter(Boolean);
  }
}));

// Export types from types.ts for convenience
export * from './types';
