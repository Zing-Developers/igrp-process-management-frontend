'use client'

/* THIS FILE WAS GENERATED AUTOMATICALLY BY iGRP STUDIO. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { use, useState, useEffect, useRef } from 'react';
import { cn, useIGRPMenuNavigation, useIGRPToast } from '@igrp/igrp-framework-react-design-system';
import { 
  IGRPStatsCard 
} from "@igrp/igrp-framework-react-design-system";
import { useRouter } from "next/navigation";

export default function Processstatscards({ stats, loading } : { stats: any, loading: boolean }) {

  
  const [statstatsCard1Value, setStatstatsCard1Value] = useState<string | number>(0);
  const [statstatsCard2Value, setStatstatsCard2Value] = useState<string | number>(0);
  const [statstatsCard3Value, setStatstatsCard3Value] = useState<string | number>(0);
  const [statstatsCard4Value, setStatstatsCard4Value] = useState<string | number>(0);
  
const { igrpToast } = useIGRPToast()

const router = useRouter()

useEffect(() => {
  setStatstatsCard1Value(stats.totalProcesses);
  setStatstatsCard2Value(stats.totalTasks);
  setStatstatsCard3Value(stats.myTasks);
  setStatstatsCard4Value(stats.availableTasks);
}, [stats])

function goToprocessInstances (row?: any): void {
  router.push(`/processinstances`);
}

function goTotaskManagement (row?: any): void {
  router.push(`/taskmanagement`);
}

function goTomyTasks (row?: any): void {
  router.push(`/mytasks`);
}

function goToavailableTasks (row?: any): void {
  router.push(`/availabletasks`);
}


  return (
<div className={ cn('component',)}    >
	<div className={ cn('grid','grid-cols-1 ','md:grid-cols-2 ','lg:grid-cols-4 ',' gap-4',)}    >
	<IGRPStatsCard
  name={ `statsCard1` }
  cardBorderPosition={ `top` }
cardBorder={ `rounded-md` }
cardVariant={ `info` }
iconBackground={ `square` }
title={ `Total de Processos` }
titleSize={ `sm` }
valueSize={ `2xl` }
showIcon={ true }
iconName={ `ListChecks` }
iconSize={ undefined }
iconVariant={ `info` }
iconPlacement={ `end` }
itemPlacement={ `start` }

showIconBackground={ true }
showIconBorder={ false }
  className={ cn('',) }
  onClick={ () => goToprocessInstances() }
  value={ statstatsCard1Value }
>
</IGRPStatsCard>
<IGRPStatsCard
  name={ `statsCard2` }
  cardBorderPosition={ `top` }
cardBorder={ `rounded-md` }
cardVariant={ `success` }
iconBackground={ `square` }
title={ `Total de Tarefas` }
titleSize={ `sm` }
valueSize={ `2xl` }
showIcon={ true }
iconName={ `TimerReset` }
iconSize={ undefined }
iconVariant={ `success` }
iconPlacement={ `end` }
itemPlacement={ `start` }

showIconBackground={ true }
  onClick={ () => goTotaskManagement() }
  value={ statstatsCard2Value }
>
</IGRPStatsCard>
<IGRPStatsCard
  name={ `statsCard3` }
  cardBorderPosition={ `top` }
cardBorder={ `rounded-lg` }
cardVariant={ `warning` }
iconBackground={ `square` }
title={ `Minhas Tarefas` }
titleSize={ `sm` }
valueSize={ `2xl` }
showIcon={ true }
iconName={ `ClipboardList` }
iconSize={ `md` }
iconVariant={ `warning` }
iconPlacement={ `end` }
itemPlacement={ `start` }

showIconBackground={ true }
  className={ cn('',) }
  onClick={ () => goTomyTasks() }
  value={ statstatsCard3Value }
>
</IGRPStatsCard>
<IGRPStatsCard
  name={ `statsCard4` }
  cardBorderPosition={ `top` }
cardBorder={ `rounded-lg` }
cardVariant={ `indigo` }
iconBackground={ `square` }
title={ `Tarefas Disponíveis` }
titleSize={ `sm` }
valueSize={ `2xl` }
showIcon={ true }
iconName={ `Settings` }
iconSize={ `md` }
iconVariant={ `indigo` }
iconPlacement={ `end` }
itemPlacement={ `start` }

showIconBackground={ true }
  className={ cn('',) }
  onClick={ () => goToavailableTasks() }
  value={ statstatsCard4Value }
>
</IGRPStatsCard></div></div>
  );
}