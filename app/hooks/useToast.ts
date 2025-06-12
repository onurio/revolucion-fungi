import { useCallback } from 'react';

type ToastType = 'success' | 'error' | 'info';

export function useToast() {
  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    // For now, using alert. You can replace this with a proper toast library
    // like react-hot-toast or react-toastify
    const prefix = type === 'error' ? '❌ ' : type === 'success' ? '✅ ' : 'ℹ️ ';
    alert(prefix + message);
  }, []);

  return { showToast };
}