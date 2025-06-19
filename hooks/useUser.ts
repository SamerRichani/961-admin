import { useAppSelector } from '@/redux/hooks';
import { useMemo } from 'react';
import { type User } from '@/app/features/users/types';

export function useUser() {
  const userId = useAppSelector((state) => state.navigation.userId);
  const users = useAppSelector((state) => state.users.users);

  const user = useMemo(() => {
    if (!userId) return null;
    return users.find(u => u._id === userId);
  }, [userId, users]);

  return user;
} 