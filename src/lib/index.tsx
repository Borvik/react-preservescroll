import React from 'react';

interface PreserveScrollProps extends React.HTMLProps<HTMLDivElement> {
  id: string
}

export const PreserveScroll: React.FC<PreserveScrollProps> = function PreserveScroll({ children, ...props }) {
  return <div {...props}>{children}</div>
}