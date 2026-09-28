export {};

declare global {
  interface PaystackInlineOptions {
    key: string;
    email: string;
    amount: number;
    currency?: string;
    ref?: string;
    metadata?: Record<string, unknown>;
    onClose?: () => void;
    callback?: (response: { reference: string; status: string; trans: string; message: string }) => void;
  }

  interface PaystackInline {
    setup: (options: PaystackInlineOptions) => {
      openIframe: () => void;
    };
  }

  interface Window {
    PaystackPop?: PaystackInline;
  }
}
