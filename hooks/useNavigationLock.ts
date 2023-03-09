import { useRouter } from 'next/router';
import { useEffect } from 'react';

const useNavigationLock = (
  isEnabled = true,
  warningText = 'You have unsaved changes – are you sure you wish to leave this page?',
  onIgnore?: () => void
) => {
  const router = useRouter();

  useEffect(() => {
    const handleWindowClose = (e: BeforeUnloadEvent) => {
      if (!isEnabled) return;
      e.preventDefault();
    };

    const handleBrowseAway = () => {
      if (!isEnabled) return;
      if (window.confirm(warningText)) {
        if (onIgnore) onIgnore();
        return;
      }
      router.events.emit('routeChangeError');
      // eslint-disable-next-line @typescript-eslint/no-throw-literal
      throw 'routeChange aborted.';
    };

    window.addEventListener('beforeunload', handleWindowClose);

    router.events.on('routeChangeStart', handleBrowseAway);

    return () => {
      window.removeEventListener('beforeunload', handleWindowClose);
      router.events.off('routeChangeStart', handleBrowseAway);
    };
  }, [isEnabled]);
};

export default useNavigationLock;
