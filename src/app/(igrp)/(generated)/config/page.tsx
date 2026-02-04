'use client'

/* THIS FILE WAS GENERATED AUTOMATICALLY BY iGRP STUDIO. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { use, useState, useEffect, useRef } from 'react';
import { cn, useIGRPMenuNavigation, useIGRPToast } from '@igrp/igrp-framework-react-design-system';
import {ProcessItem} from '@/app/(myapp)/config/components/process-item'
import {SelectedItems} from '@/app/(myapp)/config/components/selected-items'
import {AddChecklistItem} from '@/app/(myapp)/config/components/add-checklist-item'
import {AddItem} from '@/app/(myapp)/config/components/add-item'
import {PriorityForm} from '@/app/(myapp)/config/components/priority-form'
import { IGRPOptionsProps } from "@igrp/igrp-framework-react-design-system";
import { IGRPDataTableFacetedFilterFn , IGRPDataTableDateRangeFilterFn } from "@igrp/igrp-framework-react-design-system";
import { IGRPDataTableHeaderSortToggle, IGRPDataTableHeaderSortDropdown, IGRPDataTableHeaderRowsSelect } from "@igrp/igrp-framework-react-design-system";
import TaskEditor from '@/app/(igrp)/(generated)/config/components/taskeditor'
import {ActionsItem} from '@/app/(myapp)/config/components/actions-item'
import { 
  IGRPPageHeader,
	IGRPCard,
	IGRPCardHeader,
	IGRPHeadline,
	IGRPCardContent,
	IGRPRepetitiveComponent,
	IGRPTabs,
	IGRPTabItem,
	IGRPSeparator,
	IGRPInputText,
	IGRPCombobox,
	IGRPInputNumber,
	IGRPDataTable,
	IGRPDataTableRowAction,
	IGRPDataTableButtonLink,
	IGRPButton 
} from "@igrp/igrp-framework-react-design-system";
import { form1 } from "@/app/(myapp)/process-configuration/types/index";
import {useConfigPage} from '@/app/(myapp)/config/hooks/use-config-page'
import { DATE_FORMAT_OPTIONS } from '@/app/(myapp)/config/constants'


export default function PageConfigComponent() {


  
  type Table1 = {
    name: string;
    key: string;
    candidateGroups: string;
    defaultPriority: string;
    defaultDueDate: string;
}

  
  
  
const [selectedProcess, setSelectedProcess] = useState<any | undefined>(undefined);

const [newGroupInput, setNewGroupInput] = useState<string>('');

const [editingTask, setEditingTask] = useState<any | undefined>(undefined);

const [editingTaskIndex, setEditingTaskIndex] = useState<number>(-1);

const [taskNewGroup, setTaskNewGroup] = useState<string>("");

const { igrpToast } = useIGRPToast()

function handleAddGroup (value: string): void {

  const trimmed = value?.trim();
if (!trimmed) return;
const current = assignGroups.form.getValues('groups') || '';
const next = current ? `${current}, ${trimmed}` : trimmed;
assignGroups.form.setValue('groups', next);
setNewGroupInput('');

}

async function handleSaveConfiguration (): Promise<void> {

   if (!selectedProcess?.id) {
      igrpToast({ type: 'error', title: 'Erro', description: 'Selecione um processo.' });
      return;
    }
    saveConfigurationMutation.mutate();

}

function generateSampleNumber (): string {

  const { prefix, dateFormat, separator, sequenceLength } = numberingValues;
const parts: string[] = [prefix || ''];

if (dateFormat && dateFormat !== 'none') {
  const now = new Date();
  const year = now.getFullYear().toString();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  switch (dateFormat) {
    case 'yyyy':
      parts.push(year);
      break;
    case 'yyyyMM':
      parts.push(year + month);
      break;
    case 'yyyyMMdd':
      parts.push(year + month + day);
      break;
  }
}

const sequence = '1'.padStart(sequenceLength || 3, '0');
parts.push(sequence);
return parts.join(separator || '-');

}

function handleRemoveGroup (item: string): void {

  const trimmed = item.trim();
if (!trimmed) return;
const current = assignGroups.form.getValues('groups') ?? '';
const parts = current.split(',').map((s) => s.trim()).filter(Boolean);
const next = parts.filter((p) => p !== trimmed).join(', ');
assignGroups.form.setValue('groups', next);

}

function closeTaskEditor (): void {

  setEditingTask(undefined)
setEditingTaskIndex(-1)
setTaskNewGroup("")

}

function openTaskEditor (task: any): void {

  const { index, ...rest } = task
setEditingTask({ ...rest })
setEditingTaskIndex(index)
setTaskNewGroup("")

}

const { allProcesses, assignGroups, numberingConfig, userTasks, saveConfigurationMutation } = useConfigPage({ processSelected: selectedProcess });

useEffect(() => {
  if (selectedProcess?.processKey) {
    numberingConfig.loadConfig();
    assignGroups.loadConfig()
  } else {
    numberingConfig.form.reset({
      prefix: '',
      dateFormat: 'yyyy',
      separator: '-',
      sequenceLength: 3,
    });
  }
}, [selectedProcess?.processKey]);

  const numberingValues = numberingConfig.form.watch();
  const groupsValue = assignGroups.form.watch('groups') ?? '';


  return (
<div className={ cn('page','space-y-6',)}    >
	<div className={ cn('section',' space-y-6',)}    >
	<IGRPPageHeader
  id={ `pageHeader1` }
  title={ `Process Configuration` }
  description={ `Configure process numbering, candidate groups, and task settings` }
  iconBackButton={ `Settings` }
  showBackButton={ true }
  urlBackButton={ `/#` }
  variant={ `h3` }
  
>
  <div className="flex items-center gap-2">
</div>
</IGRPPageHeader>

<div className={ cn('grid','lg:grid-cols-4 ',' gap-4',)}    >
	<div className={ cn('col-span-1 flex flex-col gap-6 ',)}    >
	<IGRPCard
  id={ `card1` }
  
  className={ cn() }
  
  
>
  <IGRPCardHeader
  
>
  <IGRPHeadline
  id={ `headline2` }
  title={ `Processes` }
description={ `Select a process to configure` }
variant={ `h6` }
roleColor={ `solid` }
color={ `primary` }
showIcon={ false }
  
  
>
</IGRPHeadline>
</IGRPCardHeader>
  <IGRPCardContent
  className={ cn('space-y-4 px-0','space-x-3','space-y-3',) }
  
>
  <IGRPRepetitiveComponent<any>
  id={ `repetitiveList1` }
  keyExtractor={ (item) => item.id }
  items={ allProcesses }
>
{ (item) =>
  <>
  <ProcessItem  process={ item } selectedProcess={ selectedProcess }  setSelectedProcess={ ()=>setSelectedProcess(item)
 } ></ProcessItem>
</>
}
</IGRPRepetitiveComponent>

</IGRPCardContent>
</IGRPCard></div>
<div className={ cn('col-span-1 flex flex-col gap-6 ','md:col-span-3 flex flex-col gap-6 ','lg:col-span-3 flex flex-col gap-6 ','xl:col-span-3 flex flex-col gap-6 ',)}    >
	{ selectedProcess?.name  && (<IGRPHeadline
  id={ `headline1` }
  variant={ `h6` }
roleColor={ `solid` }
color={ `primary` }
showIcon={ false }
  className={ cn() }
  
  title={ selectedProcess?.name }
description={ selectedProcess?.processKey + ' - ' + selectedProcess?.version  }
>
</IGRPHeadline>)}
<IGRPTabs
  variant={ `default` }
  tabContentClassName={ `space-y-4` }
  showIcon={ true }
  iconPlacement={ `start` }
  contentBorder={ true }
  badgePlacement={ `end` }
  orientation={ `horizontal` }
  
  
  tabListClassName={ cn() }
  items={
      [
        
        {
          value: `tabsItem1-bwOE`,
          label: `General Settings`,
          icon: `Settings2`,
          badgeVariant: `solid`,
          badgeColor: `primary`,
content: (<>
            <IGRPCard
  id={ `card2` }
  
  className={ cn() }
  
  
>
  <IGRPCardHeader
  
>
  <IGRPHeadline
  id={ `headline3` }
  title={ `Process-Level Candidate Groups` }
description={ `Groups that have access to this process. These groups apply to all tasks unless overridden at the task level.` }
variant={ `h6` }
roleColor={ `solid` }
color={ `primary` }
showIcon={ false }
  
  
>
</IGRPHeadline>
</IGRPCardHeader>
  <IGRPCardContent
  className={ cn('space-y-4','space-x-3','space-y-3',) }
  
>
  <SelectedItems  items={ groupsValue }  removeItem={ handleRemoveGroup } ></SelectedItems>
  <IGRPSeparator
  id={ `separator2` }
  orientation={ `horizontal` }
  
  
>
</IGRPSeparator>
  <AddChecklistItem  label={ `Available Groups` } availableItems={ [] }  removeItem={ handleRemoveGroup }
addItem={ handleAddGroup } ></AddChecklistItem>
  <IGRPSeparator
  id={ `separator1` }
  orientation={ `horizontal` }
  
  
>
</IGRPSeparator>
  <AddItem  label={ `Add Custom Group` } placeholder={ `Enter group name...` } value={ newGroupInput }  setValue={ setNewGroupInput }
addItem={ handleAddGroup } ></AddItem>
</IGRPCardContent>
</IGRPCard>
            <IGRPCard
  id={ `card3` }
  
  className={ cn() }
  
  
>
  <IGRPCardHeader
  
>
  <IGRPHeadline
  id={ `headline4` }
  title={ `Priority Options` }
description={ `Define the priority levels available for tasks in this process. Each option has a label and numeric value.` }
variant={ `h6` }
roleColor={ `solid` }
color={ `primary` }
showIcon={ false }
  
  
>
</IGRPHeadline>
</IGRPCardHeader>
  <IGRPCardContent
  className={ cn('space-y-4','space-x-3','space-y-3',) }
  
>
  <PriorityForm    ></PriorityForm>
</IGRPCardContent>
</IGRPCard>
</>),
        },
        
        {
          value: `tabsItem2-niex`,
          label: `Process Numbering`,
          icon: `Hash`,
          badgeVariant: `solid`,
          badgeColor: `primary`,
content: (<>
            <IGRPCard
  id={ `card4` }
  
  className={ cn() }
  
  
>
  <IGRPCardHeader
  
>
  <IGRPHeadline
  id={ `headline5` }
  title={ `Process Numbering Configuration` }
description={ `Configure how process instance numbers are generated. Example: LOAN-2026-001` }
variant={ `h6` }
roleColor={ `solid` }
color={ `primary` }
showIcon={ false }
  
  
>
</IGRPHeadline>
</IGRPCardHeader>
  <IGRPCardContent
  className={ cn('space-y-4','space-x-3','space-y-3',) }
  
>
  <div className={ cn('grid','lg:grid-cols-2 ',' gap-4',)}    >
	<IGRPInputText
  id={ `inputText1` }
  label={ `Prefix` }
showIcon={ false }
required={ false }
placeholder={ `e.g., LOAN` }
  className={ cn('col-span-1',) }
  onChange={ (e)=>numberingConfig.addFieldValue('prefix', e.target.value) }
  value={ numberingValues.prefix }
>
</IGRPInputText>
<IGRPCombobox
  id={ `combobox1` }
  label={ `Date Format` }
variant={ `single` }
placeholder={ `Select an option...` }
selectLabel={ `No option found` }
showSearch={ true }
showIcon={ false }
iconName={ `CornerDownRight` }
  className={ cn('col-span-1',) }
  onChange={ (v: string | string[]) => numberingConfig.addFieldValue('dateFormat', Array.isArray(v) ? v[0] ?? '' : v) }
  options={ DATE_FORMAT_OPTIONS }
value={  numberingValues.dateFormat }
>
</IGRPCombobox>
<IGRPInputText
  id={ `inputText2` }
  label={ `Separator` }
showIcon={ false }
required={ false }
placeholder={ `-` }
  className={ cn('col-span-1',) }
  onChange={ (e)=>numberingConfig.addFieldValue('separator', e.target.value) }
  value={ numberingValues.separator }
>
</IGRPInputText>
<IGRPInputNumber
  id={ `inputNumber1` }
  label={ `Sequence Length` }
max={ 10 }
step={ 1 }
required={ false }
min={ 1 }
  className={ cn('col-span-1',) }
  onChange={ (value: number) => numberingConfig.addFieldValue('sequenceLength', value.toString()) }
  value={ numberingValues.sequenceLength }
>
</IGRPInputNumber></div>
  <div className={ cn(' rounded-lg bg-muted p-4',)}    >
	<p className={ cn(' text-sm font-medium mb-2',)}    >
	Sample Generated Number</p>
<p className={ cn(' text-2xl font-mono',)}    >
	{generateSampleNumber()}</p></div>
</IGRPCardContent>
</IGRPCard>
</>),
        },
        
        {
          value: `tabsItem3-perT`,
          label: `Task Configuration`,
          icon: `Users`,
          badgeVariant: `solid`,
          badgeColor: `primary`,
content: (<>
            <IGRPCard
  id={ `card5` }
  
  className={ cn() }
  
  
>
  <IGRPCardHeader
  
>
  <IGRPHeadline
  id={ `headline6` }
  title={ `User Tasks` }
description={ `Configure candidate groups and settings for each task in this process` }
variant={ `h6` }
roleColor={ `solid` }
color={ `primary` }
showIcon={ false }
  
  
>
</IGRPHeadline>
</IGRPCardHeader>
  <IGRPCardContent
  className={ cn('space-y-4','space-x-3','space-y-3',) }
  
>
  <IGRPDataTable<Table1, Table1>
  id={ `table1` }
  pageSizePagination={ [] }
  columns={
    [
        {
          header: 'Task Name'
,accessorKey: 'name',
          cell: ({ row }) => {
          return row.getValue("name")
          },
          filterFn: IGRPDataTableFacetedFilterFn
        },
        {
          header: 'Task Key'
,accessorKey: 'key',
          cell: ({ row }) => {
          return row.getValue("key")
          },
          filterFn: IGRPDataTableFacetedFilterFn
        },
        {
          header: 'Candidate Groups'
,accessorKey: 'candidateGroups',
          cell: ({ row }) => {
          return row.getValue("candidateGroups")
          },
          filterFn: IGRPDataTableFacetedFilterFn
        },
        {
          header: 'Priority'
,accessorKey: 'defaultPriority',
          cell: ({ row }) => {
          return row.getValue("defaultPriority")
          },
          filterFn: IGRPDataTableFacetedFilterFn
        },
        {
          header: 'Due Date'
,accessorKey: 'defaultDueDate',
          cell: ({ row }) => {
          return row.getValue("defaultDueDate")
          },
          filterFn: IGRPDataTableFacetedFilterFn
        },
        {
          id: 'tableActionListCell1',
          enableHiding: false,cell: ({ row }) => {
          const rowData = row.original;

return (
<IGRPDataTableRowAction>
  <IGRPDataTableButtonLink
  labelTrigger={ `Link` }
  variant={ `ghost` }
  icon={ `Pencil` }
  className={ cn() }
  action={ () => openTaskEditor(rowData) }
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
  
  data={ userTasks.list }
/>
  { editingTask !== undefined && (<TaskEditor  open={ editingTask !== undefined } editingTask={ editingTask }  setOpen={ (open) => !open && closeTaskEditor() }
onSave={ (req) => selectedProcess?.id && userTasks.handleSave(selectedProcess.id, req) } ></TaskEditor>)}
</IGRPCardContent>
</IGRPCard>
</>),
        },
      ]
  }
/>
<div className={ cn('flex',' flex justify-end gap-2',)}    >
	<ActionsItem    ></ActionsItem>
<IGRPButton
  id={ `button2` }
  variant={ `secondary` }
size={ `default` }
showIcon={ false }
  className={ cn() }
  onClick={ () => {} }
  
>
  Cancel
</IGRPButton>
<IGRPButton
  id={ `button1` }
  variant={ `default` }
size={ `default` }
showIcon={ false }
  className={ cn() }
  onClick={ handleSaveConfiguration }
  
>
  Save Configuration
</IGRPButton></div></div></div></div></div>
  );
}
