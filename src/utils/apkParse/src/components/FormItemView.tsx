import React from 'react';

export default ({
  value,
  ...props
}: { value?: any; defaultValue?: any } & React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>) => <div {...props}>{value}</div>;
