import { Context, SessionFlavor } from 'grammy';
import { ConversationFlavor, Conversation } from '@grammyjs/conversations';

export interface SessionData {
  language: string;
  activeMedia?: {
    url: string;
    platform: string;
    title?: string;
    duration?: number;
    thumbnail?: string;
  };
  feedigger?: {
    lastHandle?: string;
    sortBy?: 'views' | 'likes' | 'comments' | 'er';
  };
  toolbox?: {
    activeTool?: string;
    tempValue?: string;
  };
  broadcastDraft?: {
    text?: string;
    targetRole?: string;
  };
}

export interface UserState {
  id: string;
  telegramId: string;
  username?: string | null;
  firstName?: string | null;
  role: 'USER' | 'PREMIUM' | 'ADMIN';
  isAdmin: boolean;
}

export type BotContext = Context &
  SessionFlavor<SessionData> &
  ConversationFlavor<Context & SessionFlavor<SessionData>> & {
    state: {
      user?: UserState;
      isAdmin: boolean;
    };
  };

export type AppConversation = Conversation<BotContext>;
