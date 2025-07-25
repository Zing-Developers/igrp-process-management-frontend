'use client'

/* THIS FILE WAS GENERATED AUTOMATICALLY BY iGRP STUDIO. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { use, useState, useEffect, useRef } from 'react';
import { cn, useIGRPMenuNavigation, useIGRPToast } from '@igrp/igrp-framework-react-design-system';
import { IGRPDataTableFacetedFilterFn , IGRPDataTableDateRangeFilterFn } from "@igrp/igrp-framework-react-design-system";
import { IGRPDataTableHeaderSortToggle, IGRPDataTableHeaderSortDropdown, IGRPDataTableHeaderRowsSelect } from "@igrp/igrp-framework-react-design-system";
import { 
  IGRPPageHeader,
	IGRPStatsCard,
	IGRPHeadline,
	IGRPDataTable,
	IGRPDataTableRowAction,
	IGRPDataTableButtonLink,
	IGRPDataTableCellBadge 
} from "@igrp/igrp-framework-react-design-system";
import {fetchProcesses} from '@/app/[locale]/(myapp)/store/processStore'
import {fetchInstances} from '@/app/[locale]/(myapp)/store/processStore'
import {fetchTasks} from '@/app/[locale]/(myapp)/store/taskStore'
import { getDateTemplate, getUserInfo, getText } from '@/app/[locale]/(myapp)/store/columnsTemplates'
import { useRouter } from "next/navigation";
import {getTaskStatusColor} from '@/app/[locale]/(myapp)/store/statusBadge'


export default function PageDashboardComponent() {


  const [statstatsCard1Value, setStatstatsCard1Value] = useState<string | number>(0);
  const [statstatsCard2Value, setStatstatsCard2Value] = useState<string | number>(0);
  const [statstatsCard3Value, setStatstatsCard3Value] = useState<string | number>(0);
  const [statstatsCard4Value, setStatstatsCard4Value] = useState<string | number>(0);
  const [contentTabletable2, setContentTabletable2] = useState<any[]>([]);
  const [contentTabletable1, setContentTabletable1] = useState<any[]>([]);
  
  
const { igrpToast } = useIGRPToast()

const router = useRouter()

useEffect(() => {
    const loadProcesses = async () => {
      try {
        const [response, responseInstance, responseTask] = await Promise.all([
          fetchProcesses(0, 3),
          fetchInstances(0, 4),
          fetchTasks(0, 4),
        ]);

        if (response && response.content) {
          const formattedData = response.content.map((proc) => ({
            tableTextCell1: proc.name || 'Untitled Process',
            tableTextCell2: getText(proc.id),
            tableTextCell7: getText(proc.version),
            tableHiddenCell1: proc.id
          }));

          setContentTabletable2(formattedData);
          setStatstatsCard1Value(response.totalElements || 0);
        }

        if (responseInstance && responseInstance.content) {
          const formattedData = responseInstance.content.map((instance) => ({
            tableTextCell3: instance.processDefinitionName,
            tableTextCell4: getText(instance.businessKey || "-"),
            tableTextCell5: getUserInfo(instance.startedBy || ''),
            tableTextCell6: getDateTemplate(instance.startDate),
            tableBadgeCell1: instance.status,
          }));

          setContentTabletable1(formattedData);
          setStatstatsCard2Value(responseInstance.totalElements || 0);
        }
        if (responseTask && responseTask.content) {
          setStatstatsCard3Value(responseTask.totalElements || 0);
        }
      } catch (error) {
        console.error('Failed to fetch processes:', error);
        setContentTabletable2([]);
        setStatstatsCard3Value(0);
      }
    };

    loadProcesses();
  }, []);

function goToprocessMap (row?: any): void {
  router.push(`/processmap`);
}

function goToinstances (row?: any): void {
  router.push(`/instances`);
}

function goTomyTasks (row?: any): void {
  router.push(`/mytasks`);
}

function goTotaskManagement (row?: any): void {
  router.push(`/taskmanagement`);
}

function goTostartProcess (row?: any): void {
  router.push(`/startprocess?pam=cv`);
}


  return (
<div className={ cn('page','space-y-6',)}    >
	<div className={ cn('section',' space-x-3 space-y-3',)}    >
	<IGRPPageHeader
  name={ `pageHeader1` }
  title={ `Dashboard` }
  description={ `Visão geral do sistema de gestão de processos` }
  iconBackButton={ `Search` }
  variant={ `h3` }
  className={ cn() }
  
>
  <div className="flex items-center gap-2">
</div>
</IGRPPageHeader>
</div>
<div className={ cn('section',)}    >
	<div className={ cn('grid','grid-cols-1 ','md:grid-cols-2 ','lg:grid-cols-4 ',' gap-4',)}    >
	<IGRPStatsCard
  name={ `statsCard1` }
  cardBorderPosition={ `none` }
cardBorder={ `rounded-md` }
cardVariant={ `success` }
iconBackground={ `none` }
title={ `Total de Processos` }
titleSize={ `sm` }
valueSize={ `2xl` }
showIcon={ true }
iconName={ `ListChecks` }
iconSize={ `md` }
iconVariant={ `primary` }
iconPlacement={ `end` }
itemPlacement={ `end` }

  className={ cn('','col-span-1',) }
  onClick={ () => goToprocessMap() }
  value={ statstatsCard1Value }
>
</IGRPStatsCard>
<IGRPStatsCard
  name={ `statsCard2` }
  cardBorderPosition={ `none` }
cardBorder={ `rounded-md` }
cardVariant={ `warning` }
iconBackground={ `none` }
title={ `Total de Tarefas` }
titleSize={ `sm` }
valueSize={ `2xl` }
showIcon={ true }
iconName={ `TimerReset` }
iconSize={ `md` }
iconVariant={ `primary` }
iconPlacement={ `end` }
itemPlacement={ `end` }

  className={ cn('col-span-1',) }
  onClick={ () => goToinstances() }
  value={ statstatsCard2Value }
>
</IGRPStatsCard>
<IGRPStatsCard
  name={ `statsCard3` }
  cardBorderPosition={ `none` }
cardBorder={ `rounded-lg` }
cardVariant={ `info` }
iconBackground={ `none` }
title={ `Minhas Tarefas` }
titleSize={ `sm` }
valueSize={ `2xl` }
showIcon={ true }
iconName={ `ClipboardList` }
iconSize={ `sm` }
iconVariant={ `success` }
iconPlacement={ `start` }
itemPlacement={ `end` }

  className={ cn('col-span-1',) }
  onClick={ () => goTomyTasks() }
  value={ statstatsCard3Value }
>
</IGRPStatsCard>
<IGRPStatsCard
  name={ `statsCard4` }
  cardBorderPosition={ `none` }
cardBorder={ `rounded-xl` }
cardVariant={ `destructive` }
iconBackground={ `none` }
title={ `Tarefas Disponíveis` }
titleSize={ `sm` }
valueSize={ `2xl` }
showIcon={ true }
iconName={ `Settings` }
iconSize={ `md` }
iconVariant={ `primary` }
iconPlacement={ `end` }
itemPlacement={ `end` }

  className={ cn('','col-span-1',) }
  onClick={ () => goTotaskManagement() }
  value={ statstatsCard4Value }
>
</IGRPStatsCard></div></div>
<div className={ cn('section',' space-x-6 space-y-6',)}    ></div>
<div className={ cn('section',' space-x-6 space-y-6',)}    >
	<IGRPHeadline
  name={ `headline1` }
  title={ `Recent processes` }
description={ undefined }
variant={ `h6` }
roleColor={ `solid` }
color={ `primary` }
showIcon={ false }

  
  
>
</IGRPHeadline>
<IGRPDataTable<any, any>
  columns={
    [
        {
          header: 'Name'
,accessorKey: 'tableTextCell1',
          cell: ({ row }) => {
          return row.getValue("tableTextCell1")
          },
          filterFn: IGRPDataTableFacetedFilterFn
        },
        {
          header: 'Key'
,accessorKey: 'tableTextCell2',
          cell: ({ row }) => {
          return row.getValue("tableTextCell2")
          },
          filterFn: IGRPDataTableFacetedFilterFn
        },
        {
          header: 'Version'
,accessorKey: 'tableTextCell7',
          cell: ({ row }) => {
          return row.getValue("tableTextCell7")
          },
          filterFn: IGRPDataTableFacetedFilterFn
        },
        {
          header: 'Actions Column'
,accessorKey: 'tableActionListCell1',
          enableHiding: false,cell: ({ row }) => {
          const rowData = row.original;

return (
<IGRPDataTableRowAction>
  <IGRPDataTableButtonLink
  labelTrigger={ `Start` }
  href={ `/processmap/${tableHiddenCell1}/startprocess` }
  variant={ `default` }
  icon={ `Play` }
  className={ cn() }
  action={ () => goTostartProcess() }
>
</IGRPDataTableButtonLink>
  <IGRPDataTableButtonLink
  labelTrigger={ `Instances` }
  href={ `/instances` }
  variant={ `default` }
  icon={ `ChartNoAxesColumn` }
  className={ cn() }
  action={ (e) => {} }
>
</IGRPDataTableButtonLink>
</IGRPDataTableRowAction>
);
          },
          filterFn: IGRPDataTableFacetedFilterFn
        },
]
  }
  clientFilters={
    [
    ]
  }
  
  data={ contentTabletable2 }
/></div>
<div className={ cn('section',)}    >
	<IGRPHeadline
  name={ `headline2` }
  title={ `Active Instances` }
description={ undefined }
variant={ `h6` }
roleColor={ `solid` }
color={ `primary` }
showIcon={ false }

  
  
>
</IGRPHeadline>
<IGRPDataTable<any, any>
  columns={
    [
        {
          header: 'Process'
,accessorKey: 'tableTextCell3',
          cell: ({ row }) => {
          return row.getValue("tableTextCell3")
          },
          filterFn: IGRPDataTableFacetedFilterFn
        },
        {
          header: 'Business Key'
,accessorKey: 'tableTextCell4',
          cell: ({ row }) => {
          return row.getValue("tableTextCell4")
          },
          filterFn: IGRPDataTableFacetedFilterFn
        },
        {
          header: 'Started By'
,accessorKey: 'tableTextCell5',
          cell: ({ row }) => {
          return row.getValue("tableTextCell5")
          },
          filterFn: IGRPDataTableFacetedFilterFn
        },
        {
          header: 'Started At'
,accessorKey: 'tableTextCell6',
          cell: ({ row }) => {
          return row.getValue("tableTextCell6")
          },
          filterFn: IGRPDataTableFacetedFilterFn
        },
        {
          header: 'Status'
,accessorKey: 'tableBadgeCell1',
          cell: ({ row }) => {
          const rowData = row.original;

const { iconName, bgClass, textClass, label, className } = getTaskStatusColor(rowData);

return <IGRPDataTableCellBadge
  label={ label ?? row.original.tableBadgeCell1 }
  variant={ `soft` }
badgeClassName={ `${bgClass} ${textClass} ${className}` }
>

</IGRPDataTableCellBadge>
          },
          filterFn: IGRPDataTableFacetedFilterFn
        },
]
  }
  clientFilters={
    [
    ]
  }
  
  data={ contentTabletable1 }
/></div></div>
  );
}
