// @/contexts/UserContext.tsx
'use client';
import { createContext, useContext, ReactNode, useState } from 'react';
import { User } from '@/api/my/typings';
import { useAuth } from '@/contexts/AuthContext/AuthContext';
// 简化上下文类型，只支持对象形式的更新
type UserContextType = {
  user: User | null;
  updateUser: (newUserData: User) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
  initialUser: User | null;
}

export function UserProvider({ children, initialUser }: UserProviderProps) {
  const [user, setUser] = useState<User | null>(initialUser);
  const {updateAuthedUser } = useAuth()

  // 简化的updateUser方法，只接受Partial<User>对象
  const updateUser = (newUserData: User) => {
    setUser(prevUser => {
      // 如果之前有用户数据，合并更新；否则直接设置新数据
      return prevUser ? { ...prevUser, ...newUserData } : newUserData as User | null;
    });
    updateAuthedUser(newUserData)
  };

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
