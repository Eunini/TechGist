import { createContext, useCallback, useContext, useState } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const remove = useCallback(id => setToasts(t => t.filter(x => x.id !== id)), []);
  const push = useCallback((message, type = 'info', ttl = 3500) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t.slice(-4), { id, message, type }]);
    setTimeout(() => remove(id), ttl);
  }, [remove]);
  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div className='fixed z-50 top-4 right-4 flex flex-col gap-2 w-72'>
        {toasts.map((t) => (
          <button
            key={t.id}
            onClick={() => remove(t.id)}
            className={`text-left relative overflow-hidden rounded-md px-4 py-3 shadow text-sm font-medium text-white ring-1 ring-black/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 transition bg-opacity-90 backdrop-blur-sm ${
              t.type === 'error' ? 'bg-rose-600/90 hover:bg-rose-600' : t.type === 'success' ? 'bg-emerald-600/90 hover:bg-emerald-600' : t.type === 'warn' ? 'bg-amber-600/90 hover:bg-amber-600' : 'bg-slate-700/90 hover:bg-slate-700'
            }`}
            role='alert'
          >
            <span className='block pr-4'>{t.message}</span>
            <span className='absolute inset-x-0 bottom-0 h-0.5 bg-white/40 animate-[shrink_linear_forwards] origin-left' style={{ animationDuration: '3.4s' }} />
          </button>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

// Tailwind animation (global injection if not already) - consumers add in index.css if desired
