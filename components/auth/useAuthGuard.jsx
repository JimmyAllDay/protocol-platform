import { useRouter } from 'next/router';
import { useEffect } from 'react';

const useAuthGuard = (user) => {
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/');
    }
  }, [router, user]);
};

export default useAuthGuard;
