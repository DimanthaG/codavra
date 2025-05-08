interface Window {
  UnicornStudio?: {
    isInitialized: boolean;
    init: (options?: { 
      production?: boolean; 
      includeLogo?: boolean;
      scale?: number;
      dpi?: number;
    }) => Promise<Array<{
      element: HTMLElement;
      destroy: () => void;
      contains?: (element: HTMLElement | null) => boolean;
    }>>;
    destroy: () => void;
    addScene: (options: {
      element?: HTMLElement;
      elementId?: string;
      fps?: number;
      scale?: number;
      dpi?: number;
      projectId?: string;
      lazyLoad?: boolean;
      filePath?: string;
      altText?: string;
      ariaLabel?: string;
      production?: boolean;
      interactivity?: {
        mouse?: {
          disableMobile?: boolean;
        };
      };
    }) => Promise<{
      destroy: () => void;
      resize: () => void;
    }>;
  };
  UNICORN_INITIALIZED?: boolean;
} 