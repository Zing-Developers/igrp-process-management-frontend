'use client'

/* THIS FILE WAS GENERATED AUTOMATICALLY BY iGRP STUDIO. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { use, useState, useEffect, useRef } from 'react';
import { cn, useIGRPMenuNavigation, useIGRPToast } from '@igrp/igrp-framework-react-design-system';
import {ProcessItem} from '@/app/(myapp)/config/components/process-item'
import {ActionsItem} from '@/app/(myapp)/config/components/actions-item'
import { PageHeader } from '@/app/(myapp)/components/PageHeader';
import {SelectedItems} from '@/app/(myapp)/config/components/selected-items'
import {AddChecklistItem} from '@/app/(myapp)/config/components/add-checklist-item'
import {AddItem} from '@/app/(myapp)/config/components/add-item'
import {PriorityForm} from '@/app/(myapp)/config/components/priority-form'
import { IGRPOptionsProps } from "@igrp/igrp-framework-react-design-system";
import { IGRPDataTableFacetedFilterFn , IGRPDataTableDateRangeFilterFn } from "@igrp/igrp-framework-react-design-system";
import { IGRPDataTableHeaderSortToggle, IGRPDataTableHeaderSortDropdown, IGRPDataTableHeaderRowsSelect } from "@igrp/igrp-framework-react-design-system";
import TaskEditor from '@/app/(igrp)/(generated)/config/components/taskeditor'
import { 
	IGRPCard,
	IGRPCardHeader,
	IGRPHeadline,
	IGRPCardContent,
	IGRPInputSearch,
	IGRPRepetitiveComponent,
	IGRPButton,
	IGRPTabs,
	IGRPTabItem,
	IGRPSeparator,
	IGRPInputText,
	IGRPCombobox,
	IGRPInputNumber,
	IGRPDataTable,
	IGRPDataTableRowAction,
	IGRPDataTableButtonLink,
	IGRPDropdownMenu,
	IGRPDropdownMenuTrigger,
	IGRPDropdownMenuContent,
	IGRPDropdownMenuItem
} from "@igrp/igrp-framework-react-design-system";
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

const [filterProcess, setFilterProcess] = useState<string | undefined>(undefined);

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

function onArchiveSuccess (): void {

  loadAllProcesses();
setSelectedProcess(undefined);

}

const { allProcesses, loadAllProcesses, assignGroups, numberingConfig, priorityConfig, userTasks, saveConfigurationMutation } = useConfigPage({ processSelected:selectedProcess, filterProcess });

useEffect(() => {
  if (selectedProcess?.processKey) {
    numberingConfig.loadConfig();
    assignGroups.loadConfig()
    priorityConfig.loadConfig()
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
<PageHeader
  name={ `Configuração de Processos` }
  description={ `Configure a numeração, os grupos candidatos e as definições das tarefas.` }
  badgeCount={ allProcesses.length }
/>

 

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
  title={ `Processos` }
description={ `Selecione um processo para configurar` }
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
  <IGRPInputSearch
  id={ `inputSearch1` }
  label={ undefined }
showStartIcon={ true }
startIcon={ `Search` }
submitIcon={ `ArrowRight` }
required={ false }
submitButtonLabel={ undefined }
placeholder={ `Pesquisar...` }
  className={ cn('pl-3','',) }
  setValueChange={ (value) => setFilterProcess(value)
 }
  value={ filterProcess }
>
</IGRPInputSearch>
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
	<div className={ cn('flex flex-row flex-wrap items-center justify-between gap-2',)}    >
	<div className={ cn('flex',)}    >
	{ selectedProcess?.name  && (<IGRPHeadline
  id={ `headline1` }
  variant={ `h6` }
roleColor={ `solid` }
color={ `primary` }
showIcon={ false }
  
  title={ selectedProcess?.name }
description={ selectedProcess?.processKey + ' - ' + selectedProcess?.version  }
>
</IGRPHeadline>)}
{ !selectedProcess?.name  && (<p className={ cn(' text-muted-foreground',)}    >
	Selecione um processo para configurar</p>)}</div>
<div className={ cn('flex',' flex justify-end gap-2',)}    >
	<ActionsItem  processDefinitionId={ selectedProcess?.id }  onArchiveSuccess={ onArchiveSuccess }
onImportSuccess={ loadAllProcesses } ></ActionsItem>
<IGRPButton
  id={ `button2` }
  variant={ `secondary` }
size={ `default` }
showIcon={ false }
  className={ cn() }
  onClick={ () => {} }
  
>
  Cancelar
</IGRPButton>
<IGRPButton
  id={ `button1` }
  variant={ `default` }
size={ `default` }
showIcon={ false }
  className={ cn() }
  onClick={ handleSaveConfiguration }
  
>
  Guardar configuração
</IGRPButton>

 <IGRPDropdownMenu>
    <IGRPDropdownMenuTrigger asChild>
      <IGRPButton
        id="m2mKeysMenu"
        variant="outline"
        size="default"
        showIcon={true}
        iconName="ChevronDown"
      >
        Segurança
      </IGRPButton>
    </IGRPDropdownMenuTrigger>
    <IGRPDropdownMenuContent align="end">
      <IGRPDropdownMenuItem asChild>
        <a href="/api-keys">Chaves M2M</a>
      </IGRPDropdownMenuItem>
    </IGRPDropdownMenuContent>
  </IGRPDropdownMenu>

</div></div>
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
          label: `Definições gerais`,
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
  title={ `Grupos candidatos do processo` }
description={ `Grupos com acesso a este processo. Aplicam-se a todas as tarefas, salvo se forem substituídos ao nível da tarefa.` }
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
  <AddChecklistItem  label={ `Grupos disponíveis` } availableItems={ [] }  removeItem={ handleRemoveGroup }
addItem={ handleAddGroup } ></AddChecklistItem>
  <IGRPSeparator
  id={ `separator1` }
  orientation={ `horizontal` }
  
  
>
</IGRPSeparator>
  <AddItem  label={ `Adicionar grupo personalizado` } placeholder={ `Introduza o nome do grupo...` } value={ newGroupInput }  setValue={ setNewGroupInput }
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
  title={ `Opções de prioridade` }
description={ `Defina os níveis de prioridade disponíveis para as tarefas deste processo. Cada opção tem uma designação e um valor numérico.` }
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
  <PriorityForm  priorityOptions={ priorityConfig.priorityOptions } newPriorityLabel={ priorityConfig.newPriorityLabel } newPriorityValue={ priorityConfig.newPriorityValue } newPriorityColor={ priorityConfig.newPriorityColor }  updatePriorityOption={ priorityConfig.updatePriority }
removePriorityOption={ priorityConfig.removePriority }
addPriorityOption={ priorityConfig.addPriority }
setNewPriorityLabel={ priorityConfig.setNewPriorityLabel }
setNewPriorityValue={ priorityConfig.setNewPriorityValue }
setNewPriorityColor={ priorityConfig.setNewPriorityColor } ></PriorityForm>
</IGRPCardContent>
</IGRPCard>
</>),
        },
        
        {
          value: `tabsItem2-niex`,
          label: `Numeração do processo`,
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
  title={ `Configuração da numeração do processo` }
description={ `Configure a geração dos números das instâncias do processo. Exemplo: EMP-2026-001` }
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
  label={ `Prefixo` }
showIcon={ false }
required={ false }
placeholder={ `ex.: EMP` }
  className={ cn('col-span-1',) }
  onChange={ (e)=>numberingConfig.addFieldValue('prefix', e.target.value) }
  value={ numberingValues.prefix }
>
</IGRPInputText>
<IGRPCombobox
  id={ `combobox1` }
  label={ `Formato da data` }
variant={ `single` }
placeholder={ `Selecione uma opção...` }
selectLabel={ `Nenhuma opção encontrada` }
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
  label={ `Separador` }
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
  label={ `Comprimento da sequência` }
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
	Exemplo de número gerado</p>
<p className={ cn(' text-2xl font-mono',)}    >
	{generateSampleNumber()}</p></div>
</IGRPCardContent>
</IGRPCard>
</>),
        },
        
        {
          value: `tabsItem3-perT`,
          label: `Configuração das tarefas`,
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
  title={ `Tarefas do utilizador` }
description={ `Configure os grupos candidatos e as definições de cada tarefa deste processo` }
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
          header: 'Nome da tarefa'
,accessorKey: 'name',
          cell: ({ row }) => {
          return row.getValue("name")
          },
          filterFn: IGRPDataTableFacetedFilterFn
        },
        {
          header: 'Chave da tarefa'
,accessorKey: 'key',
          cell: ({ row }) => {
          return row.getValue("key")
          },
          filterFn: IGRPDataTableFacetedFilterFn
        },
        {
          header: 'Grupos candidatos'
,accessorKey: 'candidateGroups',
          cell: ({ row }) => {
          return row.getValue("candidateGroups")
          },
          filterFn: IGRPDataTableFacetedFilterFn
        },
        {
          header: 'Prioridade'
,accessorKey: 'defaultPriority',
          cell: ({ row }) => {
          return row.getValue("defaultPriority")
          },
          filterFn: IGRPDataTableFacetedFilterFn
        },
        {
          header: 'Prazo'
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
  labelTrigger={ `Editar tarefa` }
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
onSave={ (req) => selectedProcess?.id && userTasks.handleSave(req) } ></TaskEditor>)}
</IGRPCardContent>
</IGRPCard>
</>),
        },
      ]
  }
/></div></div></div></div>
  );
}
