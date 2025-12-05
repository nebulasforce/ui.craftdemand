import React from 'react';
import { Group, Image, Text, rem, TextProps, useMantineTheme } from '@mantine/core';
import styles from './Logo.module.css';


/**
 * <Logo src="data:image/svg+xml;charset=utf-8;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCAxNjMgMTYzIj48cGF0aCBmaWxsPSIjMzM5QUYwIiBkPSJNMTYyLjE2MiA4MS41YzAtNDUuMDExLTM2LjMwMS04MS41LTgxLjA4LTgxLjVDMzYuMzAxIDAgMCAzNi40ODkgMCA4MS41IDAgMTI2LjUxIDM2LjMwMSAxNjMgODEuMDgxIDE2M3M4MS4wODEtMzYuNDkgODEuMDgxLTgxLjV6Ii8+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTY1Ljk4MyA0My4wNDlhNi4yMzQgNi4yMzQgMCAwMC0uMzM2IDYuODg0IDYuMTQgNi4xNCAwIDAwMS42MTggMS43ODZjOS40NDQgNy4wMzYgMTQuODY2IDE3Ljc5NCAxNC44NjYgMjkuNTIgMCAxMS43MjYtNS40MjIgMjIuNDg0LTE0Ljg2NiAyOS41MmE2LjE0NSA2LjE0NSAwIDAwLTEuNjE2IDEuNzg2IDYuMjEgNi4yMSAwIDAwLS42OTQgNC42OTMgNi4yMSA2LjIxIDAgMDAxLjAyOCAyLjE4NiA2LjE1MSA2LjE1MSAwIDAwNi40NTcgMi4zMTkgNi4xNTQgNi4xNTQgMCAwMDIuMTc3LTEuMDM1IDUwLjA4MyA1MC4wODMgMCAwMDcuOTQ3LTcuMzloMTcuNDkzYzMuNDA2IDAgNi4xNzQtMi43NzIgNi4xNzQtNi4xOTRzLTIuNzYyLTYuMTk0LTYuMTc0LTYuMTk0aC05LjY1NWE0OS4xNjUgNDkuMTY1IDAgMDA0LjA3MS0xOS42OSA0OS4xNjcgNDkuMTY3IDAgMDAtNC4wNy0xOS42OTJoOS42NmMzLjQwNiAwIDYuMTczLTIuNzcxIDYuMTczLTYuMTk0IDAtMy40MjItMi43NjItNi4xOTMtNi4xNzMtNi4xOTNIODIuNTc0YTUwLjExMiA1MC4xMTIgMCAwMC03Ljk1Mi03LjM5NyA2LjE1IDYuMTUgMCAwMC00LjU3OC0xLjE1MyA2LjE4OSA2LjE4OSAwIDAwLTQuMDU1IDIuNDM4aC0uMDA2eiIvPjxwYXRoIGZpbGw9IiNmZmYiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTU2LjIzNiA3OS4zOTFhOS4zNDIgOS4zNDIgMCAwMS42MzItMy42MDggOS4yNjIgOS4yNjIgMCAwMTEuOTY3LTMuMDc3IDkuMTQzIDkuMTQzIDAgMDEyLjk5NC0yLjA2MyA5LjA2IDkuMDYgMCAwMTcuMTAzIDAgOS4xNDUgOS4xNDUgMCAwMTIuOTk1IDIuMDYzIDkuMjYyIDkuMjYyIDAgMDExLjk2NyAzLjA3NyA5LjMzOSA5LjMzOSAwIDAxLTIuMTI1IDEwLjAwMyA5LjA5NCA5LjA5NCAwIDAxLTYuMzg4IDIuNjMgOS4wOTQgOS4wOTQgMCAwMS02LjM5LTIuNjMgOS4zIDkuMyAwIDAxLTIuNzU1LTYuMzk1eiIgY2xpcC1ydWxlPSJldmVub2RkIi8+PC9zdmc+" size={32} textProps={{gradient: { from: 'pink', to: 'yellow' },verticalAlign:"bottom"}} />
 */

// 提取Mantine主题中的颜色名称
type MantineColor = keyof ReturnType<typeof useMantineTheme>['colors'];

interface LogoProps {
  src?: string;
  alt?: string;
  text?: string;
  size?: number | string;
  color?: MantineColor | string; // 支持主题颜色或自定义颜色字符串
  gap?: number | string;
  radius?: string | number;
  isSvg?: boolean; // 允许手动覆盖检测结果
  wrap?: React.CSSProperties['flexWrap'];
  hideText?: boolean; // 新增：是否隐藏文字
  showTrademark?: boolean; // 新增：是否显示™符号
  textProps?: Omit<TextProps, 'children' | 'size'>& { // 扩展textProps
    gradient?: { from: string; to: string; direction?: number };
    verticalAlign?: 'top' | 'center' | 'bottom';
  }; // 新增：允许自定义Text组件属性
  imageProps?: React.ComponentPropsWithoutRef<typeof Image>; // 新增：自定义Image属性
}

export const Logo = ({
                       src = 'https://picsum.photos/200/200',
                       alt = 'CraftDemand',
                       text = 'craftdemand',
                       size = 32,
                       color = 'dimmed.6',
                       gap = 8,
                       radius = 'md',
                       isSvg: manualIsSvg, // 重命名用于内部逻辑
                       wrap = 'nowrap',
                       hideText = false, // 新增：是否隐藏文字
                       showTrademark = false, // 新增：是否显示™符号
                       textProps = {}, // 默认空对象
                       imageProps = {}, // 默认空对象
                     }: LogoProps) => {
  // 自动检测是否为SVG
  const isSvgSource = React.useMemo(() => {
    if (manualIsSvg !== undefined) {return manualIsSvg;} // 优先使用手动设置
    if (!src) {return false;}
    if (src.trim().startsWith('<svg')) {return true;}
    const extension = src.split('.').pop()?.toLowerCase();
    return extension === 'svg';
  }, [src, manualIsSvg]);

  // 统一处理尺寸，支持数字(px)或字符串(如"1.5rem")
  const sizeValue = typeof size === 'number' ? `${size}px` : size;

  // 处理SVG的特殊逻辑
  const svgContent = isSvgSource && src ? (
    <div
      dangerouslySetInnerHTML={{ __html: src }}
      style={{
        width: sizeValue,
        height: sizeValue,
        borderRadius: radius,
      }}
    />
  ) : null;
// 提取自定义属性
  const { gradient, verticalAlign, ...validTextProps } = textProps;
  // 修改文字容器样式
  const textVerticalStyles = {
    height: sizeValue, // 添加明确的高度
    display: 'flex',
    alignItems: verticalAlign === 'top'
      ? 'flex-start'
      : verticalAlign === 'bottom'
        ? 'flex-end'
        : 'center',
  };
  return (
    <Group gap={gap} align="center" wrap={wrap}>
      {isSvgSource ? (
        svgContent
      ) : (
        <Image
          className={styles.logoImage}
          src={src}
          alt={alt}
          width={sizeValue} // 使用统一尺寸值
          height={sizeValue} // 使用统一尺寸值
          radius={radius}
          fit="contain"
          style={{
            width: sizeValue,
            height: sizeValue,
          }}
          {...imageProps} // 展开所有Image属性
        />
      )}
      {text && !hideText && (
        <div style={textVerticalStyles}>  {/* 包裹文字的容器 */}
          <Text
            size={typeof size === 'number' ? rem(size * 0.8) : size}
            c={color} // 使用c属性设置颜色
            {...validTextProps} // 展开用户自定义属性
            // 当设置gradient时，使用Mantine的内置渐变功能
            variant={gradient? 'gradient' : undefined}
            gradient={gradient}
            style={{
              fontWeight: 800, // 通过style属性设置字体粗细
              overflow:"visible",
              ...textProps.style, // 保留用户可能传入的style
            }}
          >
            {text}
            {showTrademark && (
              <sup className={styles.trademark}>TM</sup>
            )}
          </Text>
        </div>
      )}
    </Group>
  );
};
