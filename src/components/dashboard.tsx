'use client'

/* THIS FILE WAS GENERATED AUTOMATICALLY BY iGRP STUDIO. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { use, useState, useEffect, useRef } from 'react';
import { cn, useIGRPMenuNavigation, useIGRPToast } from '@igrp/igrp-framework-react-design-system';
import {RecentItemsCard} from '@/app/(myapp)/components/recent-items-card'
import { 
  IGRPPageHeader,
	IGRPStatsCard 
} from "@igrp/igrp-framework-react-design-system";
import {useDashboard} from '@/app/(myapp)/dashboard/hooks/use-dashboard'

export default function Dashboard() {

  
  const [statstatsCard1Value, setStatstatsCard1Value] = useState<string | number>(0);
  const [statstatsCard2Value, setStatstatsCard2Value] = useState<string | number>(0);
  const [statstatsCard4Value, setStatstatsCard4Value] = useState<string | number>(0);
  const [statstatsCard3Value, setStatstatsCard3Value] = useState<string | number>(0);
  
const { igrpToast } = useIGRPToast()

// Use the dashboard hook to get real data
  const { stats, processInstancesItems, taskItems, loading, error, refreshData } = useDashboard();

  // Show error toast if there's an error
  useEffect(() => {
    setStatstatsCard1Value(stats.processInstances.totalInstances);
    setStatstatsCard2Value(stats.processInstances.totalRunning);
    setStatstatsCard3Value(stats.processInstances.totalCompleted);
    setStatstatsCard4Value(stats.processInstances.totalCancelled);
    if (error) {
      igrpToast({
        type: 'error',
        title: 'Erro',
        description: error,
      });
    }
  }, [error, igrpToast, stats]);


  return (
<div className={ cn('component',)}    >
	<div className={ cn(' space-y-6',)}    >
	<IGRPPageHeader
  id={ `pageHeader1` }
  title={ `Dashboard` }
  description={ `Visão geral do sistema de gestão de processos` }
  iconBackButton={ `Search` }
  variant={ `h3` }
  className={ cn('',) }
  
>
  <div className="flex items-center gap-2">
</div>
</IGRPPageHeader>

<div className={ cn('grid','grid-cols-2 ','md:grid-cols-2 ','lg:grid-cols-4 ',' gap-4',)}    >
	<IGRPStatsCard
  id={ `statsCard1` }
  cardBorderPosition={ `top` }
cardBorder={ `rounded-lg` }
cardVariant={ `info` }
iconBackground={ `square` }
title={ `Total de Processos` }
titleSize={ `sm` }
valueSize={ `2xl` }
showIcon={ true }
iconName={ `Settings` }
iconSize={ `md` }
iconVariant={ `info` }
iconPlacement={ `end` }
itemPlacement={ `start` }
showIconBorder={ false }
showIconBackground={ true }
  className={ cn('col-span-1',) }
  onClick={ () => {} }
  value={ statstatsCard1Value }
>
</IGRPStatsCard>
<IGRPStatsCard
  id={ `statsCard2` }
  cardBorderPosition={ `top` }
cardBorder={ `rounded-lg` }
cardVariant={ `warning` }
iconBackground={ `square` }
title={ `Total em Execução` }
titleSize={ `sm` }
valueSize={ `2xl` }
showIcon={ true }
iconName={ `Play` }
iconSize={ `md` }
iconVariant={ `warning` }
iconPlacement={ `end` }
itemPlacement={ `start` }
showIconBackground={ true }
showIconBorder={ false }
  className={ cn('col-span-1',) }
  onClick={ () => {} }
  value={ statstatsCard2Value }
>
</IGRPStatsCard>
<IGRPStatsCard
  id={ `statsCard4` }
  cardBorderPosition={ `top` }
cardBorder={ `rounded-lg` }
cardVariant={ `destructive` }
iconBackground={ `square` }
title={ `Total Cancelados` }
titleSize={ `sm` }
valueSize={ `2xl` }
showIcon={ true }
iconName={ `CalendarX2` }
iconSize={ `md` }
iconVariant={ `destructive` }
iconPlacement={ `end` }
itemPlacement={ `start` }
showIconBackground={ true }
  className={ cn('col-span-1',) }
  onClick={ () => {} }
  value={ statstatsCard4Value }
>
</IGRPStatsCard>
<IGRPStatsCard
  id={ `statsCard3` }
  cardBorderPosition={ `top` }
cardBorder={ `rounded-lg` }
cardVariant={ `success` }
iconBackground={ `square` }
title={ `Total Finalizados` }
titleSize={ `sm` }
valueSize={ `2xl` }
showIcon={ true }
iconName={ `CheckCheck` }
iconSize={ `md` }
iconVariant={ `success` }
iconPlacement={ `end` }
itemPlacement={ `start` }
showIconBackground={ true }
showIconBorder={ false }
  className={ cn('col-span-1',) }
  onClick={ () => {} }
  value={ statstatsCard3Value }
>
</IGRPStatsCard></div>
<div className={ cn('grid','grid-cols-1 ','md:grid-cols-2 ','lg:grid-cols-2 ',' gap-4',)}    >
	<RecentItemsCard  iconName={ `Play` } title={ `Processos Recentes` } emptyMessage={ `Nenhum processo disponível` } items={ processInstancesItems }   ></RecentItemsCard>
<RecentItemsCard  title={ `Tarefas Recentes` } iconName={ `SquareCheckBig` } emptyMessage={ `Nenhuma tarefa disponível` } items={ taskItems }   ></RecentItemsCard></div></div></div>
  );
}