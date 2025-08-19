"use client"

import { useNavbar } from '@/contexts/NavbarContext/NavbarContext';
import { useEffect } from 'react';
import { Title } from '@mantine/core';


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

      {/*面包屑*/}
      {/*页面容器*/}
      {/*页面容器 - 标题*/}
      {/*页面内容 - 表单 */}
      {/*页面内容 - 表单 -  昵称（文本） */}
      {/*页面内容 - 表单 -  个人签名(textarea) */}
      {/*页面内容 - 表单 -  性别 (radio) */}
      {/*页面内容 - 表单 -  出生日期 (datepicker) */}
      {/*页面内容 - 表单 - 位置 -  省市联动 (下拉框) */}
      {/*页面内容 - 表单 - 详细地址 (文本) */}
      {/*页面内容 - 表单按钮 */}

      <Title order={2}>This is h2 title</Title>
    </>
  )
}
export default SettingsPage;
