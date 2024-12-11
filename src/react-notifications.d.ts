declare module 'react-notifications' {
    export const NotificationContainer: React.ComponentType;
    export const NotificationManager: {
      success: (message: string, title?: string, timeOut?: number, callback?: () => void) => void;
      error: (message: string, title?: string, timeOut?: number, callback?: () => void) => void;
      warning: (message: string, title?: string, timeOut?: number, callback?: () => void) => void;
      info: (message: string, title?: string, timeOut?: number, callback?: () => void) => void;
    };
  }
  