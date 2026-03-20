"use client";

import { useEffect, useState } from "react";

type ToasterToast = {
  id: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
};

const TOAST_LIMIT = 5;

export function Toaster() {
  const [toasts, setToasts] = useState<ToasterToast[]>([]);

  return (
    <div className="fixed bottom-0 right-0 z-50 flex flex-col gap-2 p-4 max-w-md w-full">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="bg-background border rounded-lg shadow-lg p-4 animate-in slide-in-from-bottom"
        >
          {toast.title && <p className="font-medium">{toast.title}</p>}
          {toast.description && (
            <p className="text-sm text-muted-foreground">{toast.description}</p>
          )}
        </div>
      ))}
    </div>
  );
}
