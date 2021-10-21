import React from 'react';

export default ({
  value,
  ...props
}: { value?: any } & React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>) => <div {...props}>{value}</div>;
