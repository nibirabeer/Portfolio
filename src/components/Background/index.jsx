// src/components/Background/index.jsx

import React from 'react';

const Background = ({ children }) => {
  return (
    <div className="relative size-full bg-white">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      {children}
    </div>
  );
};

export default Background;