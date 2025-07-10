import { Box } from '@mantine/core';
import { CanvasAttributes } from '@/data';
import React from 'react';

interface ComponentPreviewProps {
  children: React.ReactNode;
  canvas: CanvasAttributes['canvas'];
  withSpacing?: boolean;
}

export function ComponentPreview({ children, canvas, withSpacing = false }: ComponentPreviewProps) {
  return (
    <Box
      style={{
        paddingTop: canvas?.maxWidth && withSpacing ? 40 : 0,
        maxWidth: canvas?.maxWidth || '100%',
        marginLeft: canvas?.center ? 'auto' : 'unset',
        marginRight: canvas?.center ? 'auto' : 'unset',
      }}
    >
      {children}
    </Box>
  );
}
