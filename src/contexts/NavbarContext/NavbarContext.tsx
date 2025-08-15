// @/contexts/NavbarContext.tsx
'use client';
import { createContext, useContext, ReactNode, useState, Dispatch, SetStateAction } from 'react';
import type { SectionType } from '@/components/NavbarSegmented/NavbarSegmented'; // 导入SectionType类型


type NavbarContextType = {
  active: string;
  setActive: Dispatch<SetStateAction<string>>;
  section: SectionType;
  setSection: Dispatch<SetStateAction<SectionType>>;
};

const NavbarContext = createContext<NavbarContextType | undefined>(undefined);

export function NavbarProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState('Profile'); // 默认值和原来保持一致
  const [section, setSection] = useState<SectionType>('Account');
  return (
    <NavbarContext.Provider value={{ active, setActive, section, setSection }}>
      {children}
    </NavbarContext.Provider>
  );
}

export function useNavbar() {
  const context = useContext(NavbarContext);
  if (context === undefined) {
    throw new Error('useNavbar must be used within a NavbarProvider');
  }
  return context;
}
