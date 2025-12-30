'use client'

/* THIS FILE WAS GENERATED AUTOMATICALLY BY iGRP STUDIO. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { use, useState, useEffect, useRef } from 'react';
import { cn, useIGRPMenuNavigation, useIGRPToast } from '@igrp/igrp-framework-react-design-system';
import {TaskInformation} from '@/app/(myapp)/taskmanagement/components/task-information'
import {VariablesView} from '@/app/(myapp)/components/variables-view'
import {TaskInstanceEventsView} from '@/app/(myapp)/components/task-instance-events-view'
import CommonUserTaskModalForm from '@/components/commonusertaskmodalform'
import { 
  IGRPPageHeader,
	IGRPBadge,
	IGRPCard,
	IGRPCardHeader,
	IGRPHeadline,
	IGRPCardContent,
	IGRPButton,
	IGRPSeparator,
	IGRPCardFooter 
} from "@igrp/igrp-framework-react-design-system";
import {useTaskDetails} from '@/app/(myapp)/taskmanagement/hooks/use-task-details'


export default function PageDetalhedatarefaComponent({ params } : { params: Promise<{ taskId: string }> } ) {

  const { taskId } = use(params);

  
  
  
const [libertarTarefa, setLibertarTarefa] = useState<boolean>(false);

const { igrpToast } = useIGRPToast()

const {task} = useTaskDetails(taskId);
console.log(task)

const modalSubtitle = `Libertar a tarefa "${task?.name}" do processo "${task?.processName}"`


  return (
<div className={ cn('page','space-y-6',)}    >
	<div className={ cn('section',' space-y-6',)}    >
	<IGRPPageHeader
  id={ `pageHeader1` }
  iconBackButton={ `ArrowLeft` }
  showBackButton={ true }
  urlBackButton={ `/task-management` }
  variant={ `h3` }
  title={ task?.processName || 'Task name' }
description={ task?.name + " - " + task?.taskKey }
>
  <div className="flex items-center gap-2">
    <IGRPBadge
  id={ `badge1` }
  variant={ `outline` }
size={ `md` }
showIcon={ true }
iconName={ `CircleCheck` }
iconPlacement={ `start` }
  badgeClassName={ cn() }
  
  
color={ task?.priorityVariant || 'primary' }
>
  { task?.priorityLabel }
</IGRPBadge>
</div>
</IGRPPageHeader>

<div className={ cn('grid','grid-cols-3 ','md:grid-cols-2 ','lg:grid-cols-3 ',' gap-4',)}    >
	<div className={ cn('col-span-2 flex flex-col gap-6 ',)}    >
	<IGRPCard
  id={ `card2` }
  
  className={ cn() }
  
  
>
  <IGRPCardHeader
  
>
  <IGRPHeadline
  id={ `headline2` }
  title={ `Task Information` }
description={ undefined }
variant={ `h6` }
roleColor={ `solid` }
color={ `primary` }
showIcon={ false }
  
  
>
</IGRPHeadline>
</IGRPCardHeader>
  <IGRPCardContent
  
>
  <TaskInformation  task={ task }   ></TaskInformation>
</IGRPCardContent>
</IGRPCard></div>
<div className={ cn('col-span-1 flex flex-col gap-6 ',)}    >
	<IGRPCard
  id={ `card3` }
  
  
  
>
  <IGRPCardHeader
  
>
  <IGRPHeadline
  id={ `headline3` }
  title={ `Task Actions` }
description={ `Complete, delegate, or manage this task` }
variant={ `h6` }
roleColor={ `solid` }
color={ `primary` }
showIcon={ false }
  
  
>
</IGRPHeadline>
</IGRPCardHeader>
  <IGRPCardContent
  
>
  <div className={ cn('grid','grid-cols-1 ',' gap-4',)}    >
	<IGRPButton
  id={ `button1` }
  variant={ `default` }
size={ `default` }
showIcon={ true }
iconName={ `CircleCheckBig` }
  className={ cn('flex justify-start','col-span-1',) }
  onClick={ () => {} }
  
>
  Complete Task
</IGRPButton>
<IGRPButton
  id={ `button2` }
  variant={ `outline` }
size={ `default` }
showIcon={ true }
iconName={ `UserPlus` }
  className={ cn('flex justify-start','col-span-1',) }
  onClick={ () => {} }
  
>
  Delegate
</IGRPButton>
<IGRPButton
  id={ `button3` }
  variant={ `outline` }
size={ `default` }
showIcon={ true }
iconName={ `Flag` }
  className={ cn('flex justify-start','col-span-1',) }
  onClick={ () => {} }
  
>
  Change Priority
</IGRPButton>
<IGRPButton
  id={ `button4` }
  variant={ `outline` }
size={ `default` }
showIcon={ true }
iconName={ `RotateCcw` }
  className={ cn('flex justify-start','col-span-1',) }
  onClick={ () => {setLibertarTarefa(!libertarTarefa)
} }
  
>
  Unclaim
</IGRPButton>
<IGRPSeparator
  id={ `separator1` }
  orientation={ `horizontal` }
  className={ cn('col-span-1',) }
  
  
>
</IGRPSeparator>
<IGRPButton
  id={ `button5` }
  variant={ `destructive` }
size={ `default` }
showIcon={ true }
iconName={ `CircleX` }
  className={ cn('flex justify-start','col-span-1',) }
  onClick={ () => {} }
  
>
  Cancel Task
</IGRPButton></div>
</IGRPCardContent>
  <IGRPCardFooter
  
>
</IGRPCardFooter>
</IGRPCard></div></div>
<IGRPCard
  id={ `card1` }
  
  
  
>
  <IGRPCardContent
  
>
  <IGRPHeadline
  id={ `headline1` }
  title={ `Variables` }
description={ undefined }
variant={ `h6` }
roleColor={ `solid` }
color={ `primary` }
showIcon={ true }
iconName={ `FileText` }
  
  
>
</IGRPHeadline>
  <VariablesView  variables={ task?.variables || [] }   ></VariablesView>
</IGRPCardContent>
</IGRPCard>
<IGRPCard
  id={ `card4` }
  
  
  
>
  <IGRPCardContent
  
>
  <IGRPHeadline
  id={ `headline4` }
  title={ `Eventos` }
description={ undefined }
variant={ `h6` }
roleColor={ `solid` }
color={ `primary` }
showIcon={ true }
iconName={ `TimerReset` }
  
  
>
</IGRPHeadline>
  <TaskInstanceEventsView  events={ task?.taskInstanceEvents }   ></TaskInstanceEventsView>
</IGRPCardContent>
</IGRPCard>
<CommonUserTaskModalForm  modalTitle={ `Libertar Tarefa` } open={ libertarTarefa } modalSubTitle={ modalSubtitle }  setOpen={ setLibertarTarefa
 } ></CommonUserTaskModalForm></div></div>
  );
}
