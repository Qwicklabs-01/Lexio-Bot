export interface TelegramWebUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
  photo_url?: string;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        initData: string;
        initDataUnsafe?: {
          user?: TelegramWebUser;
          query_id?: string;
          auth_date?: string;
          hash?: string;
        };
        colorScheme: 'light' | 'dark';
        themeParams: Record<string, string>;
        isExpanded: boolean;
        viewportHeight: number;
        viewportStableHeight: number;
        headerColor: string;
        backgroundColor: string;
        BackButton: {
          isVisible: boolean;
          show: () => void;
          hide: () => void;
          onClick: (cb: () => void) => void;
          offClick: (cb: () => void) => void;
        };
        MainButton: {
          text: string;
          color: string;
          textColor: string;
          isVisible: boolean;
          isActive: boolean;
          isProgressVisible: boolean;
          setText: (text: string) => void;
          onClick: (cb: () => void) => void;
          offClick: (cb: () => void) => void;
          show: () => void;
          hide: () => void;
          enable: () => void;
          disable: () => void;
          showProgress: (leaveActive?: boolean) => void;
          hideProgress: () => void;
        };
        HapticFeedback: {
          impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
          notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
          selectionChanged: () => void;
        };
        ready: () => void;
        expand: () => void;
        close: () => void;
        enableClosingConfirmation: () => void;
        showPopup: (params: { title?: string; message: string; buttons?: { id: string; type: string; text: string }[] }, callback?: (buttonId: string) => void) => void;
        openLink: (url: string) => void;
        openTelegramLink: (url: string) => void;
      };
    };
  }
}

export const tg = {
  get app() {
    return typeof window !== 'undefined' ? window.Telegram?.WebApp : undefined;
  },

  init() {
    if (!this.app) return;
    this.app.ready();
    this.app.expand();
    try {
      this.app.enableClosingConfirmation();
    } catch {}
  },

  getUser(): TelegramWebUser {
    return (
      this.app?.initDataUnsafe?.user || {
        id: 12345678,
        first_name: 'Friend',
        username: 'lexio_user',
        language_code: 'en',
      }
    );
  },

  getRawInitData(): string {
    return this.app?.initData || '';
  },

  haptic(
    type: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error' | 'selectionChanged' = 'light'
  ) {
    if (!this.app?.HapticFeedback) return;
    try {
      if (type === 'selectionChanged') {
        this.app.HapticFeedback.selectionChanged();
      } else if (type === 'success' || type === 'warning' || type === 'error') {
        this.app.HapticFeedback.notificationOccurred(type);
      } else {
        this.app.HapticFeedback.impactOccurred(type);
      }
    } catch {}
  },

  close() {
    this.app?.close();
  },

  async copyText(text: string): Promise<boolean> {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        this.haptic('success');
        return true;
      }
    } catch {}
    try {
      const el = document.createElement('textarea');
      el.value = text;
      el.style.position = 'fixed';
      el.style.opacity = '0';
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      this.haptic('success');
      return true;
    } catch {
      return false;
    }
  },

  showPopup(title: string, message: string) {
    if (this.app?.showPopup) {
      this.app.showPopup({ title, message });
    } else {
      alert(`${title}\n\n${message}`);
    }
  },
};

