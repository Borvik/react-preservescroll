import React from 'react';

interface PreserveScrollProps extends React.HTMLProps<HTMLDivElement> {
  id: string
  preserveScrollDisabled?: boolean
}

export const PreserveScroll: React.FC<PreserveScrollProps> = function PreserveScroll({ children, preserveScrollDisabled, ...props }) {
  return <div {...props}>{children}</div>
}