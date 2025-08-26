import { IGRPIcon, cn } from '@igrp/igrp-framework-react-design-system';
import { format } from 'date-fns';

export const getDateTemplate = (date_: string) => {
  return (
    <div className={cn('flex items-center text-sm text-muted-foreground')}>
      <IGRPIcon name="dateIcon" iconName="Clock" size={16} className={cn('mr-1')} />
      <span>{format(new Date(date_), 'MMM dd, yyyy')}</span>
    </div>
  );
};

export const getUserInfo = (assignee: string) => {
  return assignee ? (
    <div className={cn('flex items-center')}>
      <div
        className={cn(
          'flex-shrink-0 h-8 w-8 bg-muted rounded-full flex items-center justify-center',
        )}
      >
        <IGRPIcon
          name="userIcon"
          iconName="User"
          size={16}
          className={cn('text-muted-foreground')}
        />
      </div>
      <div className={cn('ml-2')}>
        <div className={cn('text-sm font-medium text-foreground')}>{assignee}</div>
      </div>
    </div>
  ) : (
    <span className={cn('text-sm text-muted-foreground')}>Unassigned</span>
  );
};

export const getProcessInfo = (processName: string, createdAt: string) => {
  return (
    <div className={cn('flex flex-col space-y-1')}>
      <div className={cn('flex items-center')}>
        <div className={cn('flex flex-col')}>
          <span className={cn('text-sm font-medium text-foreground')}>{processName || 'Unnamed Process'}</span>
        </div>
      </div>
      <div className={cn('flex items-center text-xs text-muted-foreground')}>
        <IGRPIcon name="createdIcon" iconName="Clock" size={12} className={cn('mr-1')} />
        <span>Created: {format(new Date(createdAt), 'MMM dd, yyyy HH:mm')}</span>
      </div>
    </div>
  );
};

export const getText = (text: string) => {
  return <span className={cn('text-sm text-muted-foreground')}>{text}</span>;
};
