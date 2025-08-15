"use client"

import { useNavbar } from '@/contexts/NavbarContext/NavbarContext';
import { useEffect } from 'react';


const SettingsPage = () => {
  const { setActive } = useNavbar();
  //  在需要的地方调用setActive修改导航状态
  useEffect(() => {
    // 例如：页面加载时将active设为当前页面对应的导航项
    setActive('Profile'); // 这里的值要和导航项的name匹配
  }, [setActive]);

  // useEffect(() => {
  //   setSection('System');
  // }, [ setSection]);

  return (
    <>
      测试的内容有很长很多
    </>
  )
}
export default SettingsPage;
