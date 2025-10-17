import type { PropsWithChildren } from 'react';

interface PageContainerProps extends PropsWithChildren {
  className?: string;
}

export function PageContainer({ children, className }: PageContainerProps) {
  const classes = ['mx-auto', 'w-full', 'max-w-5xl', 'px-4', 'py-10', 'sm:px-6', 'lg:px-8'];

  if (className) {
    classes.push(className);
  }

  return <div className={classes.join(' ')}>{children}</div>;
}
