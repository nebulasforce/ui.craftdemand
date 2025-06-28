import React from 'react';
import { Group, Image, Text, rem, TextProps, useMantineTheme } from '@mantine/core';
import styles from './Logo.module.css';

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
      {text && (
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
              ...textProps.style, // 保留用户可能传入的style
            }}
          >
            {text}
          </Text>
        </div>
      )}
    </Group>
  );
};
