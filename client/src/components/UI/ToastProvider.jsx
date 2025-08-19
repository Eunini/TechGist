import { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { ToastContext } from '../../contexts/ToastContext';

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
      <div className='fixed z-[9999] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-2 w-72'>
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

ToastProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Note: useToast hook moved to hooks/useToast.js for better fast refresh support
