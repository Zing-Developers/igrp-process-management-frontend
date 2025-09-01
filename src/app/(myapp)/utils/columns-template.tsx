import { IGRPProgressBarProvider } from '@igrp/framework-next-ui';
import { IGRPIcon, cn } from '@igrp/igrp-framework-react-design-system';
import { format } from 'date-fns';

export const getDateTemplate = (date_: string | Date) => {
  return date_ ? (
    <>
      <div className={cn('flex items-center')}>
      <IGRPIcon name="dateIcon" iconName="Clock" size={16} className={cn('mr-1')} />
      
        <span>{format(new Date(date_), 'MMM dd, yyyy HH:mm')}</span>
      </div>
    </>
  ) : ("");
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

export const getProcessInfo = (processName: string, processNumber: string) => {
  return (
    <div className={cn('flex flex-col space-y-1')}>
      <div className={cn('flex items-center')}>
        <div className={cn('flex flex-col')}>
          <span className={cn('text-sm font-medium text-foreground')}>{processName || 'Unnamed Process'}</span>
        </div>
      </div>
      <div className={cn('flex items-center text-xs text-muted-foreground')}>
        <IGRPIcon name="createdIcon" iconName="Hash" size={12} className={cn('mr-1')} />
        <span>{processNumber}</span>
      </div>
    </div>
  );
};

export const getText = (text: string) => {
  return <span className={cn('text-sm text-muted-foreground')}>{text}</span>;
};

export const getProgressTemplate = (progress: string) => {
  // Parse the progress string "0/3" format
  const [completedStr, totalStr] = progress.split('/');
  const completedTasks = parseInt(completedStr) || 0;
  const totalTasks = parseInt(totalStr) || 0;
  const isComplete = completedTasks === totalTasks && totalTasks > 0;
  
  return (
    <div className={cn('flex items-center space-x-2')}>
      <IGRPIcon 
        name="progressIcon" 
        iconName={isComplete ? "CircleCheck" : "Clock"} 
        size={16} 
        className={cn(isComplete ? 'text-green-600' : 'text-orange-500')} 
      />
      <div className={cn('flex flex-col')}>
        <span className={cn('text-sm font-medium text-foreground')}>
          {progress}
        </span>
      </div>
    </div>
  );
};
