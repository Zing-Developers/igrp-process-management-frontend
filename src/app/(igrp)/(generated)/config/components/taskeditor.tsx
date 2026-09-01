'use client'

/* THIS FILE WAS GENERATED AUTOMATICALLY BY iGRP STUDIO. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { use, useState, useEffect, useRef } from 'react';
import { cn, useIGRPMenuNavigation, useIGRPToast } from '@igrp/igrp-framework-react-design-system';
import { IGRPOptionsProps } from "@igrp/igrp-framework-react-design-system";
import { SelectedItems } from '@/app/(myapp)/config/components/selected-items'
import { AddChecklistItem } from '@/app/(myapp)/config/components/add-checklist-item'
import { AddItem } from '@/app/(myapp)/config/components/add-item'
import {
  IGRPModalDialog,
  IGRPModalDialogContent,
  IGRPModalDialogHeader,
  IGRPModalDialogTitle,
  IGRPModalDialogDescription,
  IGRPCombobox,
  IGRPInputText,
  IGRPSeparator,
  IGRPModalDialogFooter,
  IGRPButton
} from "@igrp/igrp-framework-react-design-system";
import { PRIORITY_OPTIONS } from '@/app/(myapp)/config/constants'
import { CreateProcessArtifactRequest } from '@igrp/platform-process-management-types';

export default function Taskeditor({ open, setOpen, editingTask, onSave, availableGroups }: { open: boolean, setOpen: (open: boolean) => void, editingTask: any, onSave: (req: any) => string, availableGroups?: string }) {





  const [formKey, setFormKey] = useState<string>('');

  const [candidateGroups, setCandidateGroups] = useState<string>('');

  const [defaultPriority, setDefaultPriority] = useState<string>('');

  const [defaultDueDate, setDefaultDueDate] = useState<string>('');

  const [newGroupInput, setNewGroupInput] = useState<string>('');

  const { igrpToast } = useIGRPToast()

  function handleRemoveGroup(item: string): void {

    const next = groupsArray.filter((g) => g !== item).join(',');
    setCandidateGroups(next);

  }

  function handleAddGroup(value: string): void {

    const trimmed = value?.trim();
    if (!trimmed || groupsArray.includes(trimmed)) return;
    const next = groupsArray.length ? `${candidateGroups},${trimmed}` : trimmed;
    setCandidateGroups(next);
    setNewGroupInput('');

  }

  function handleSave(): void {

    if (!editingTask?.key || !editingTask?.name) return;
    const req: CreateProcessArtifactRequest = {
      key: editingTask.key,
      name: editingTask.name,
      formKey: formKey.trim(),
      candidateGroups: candidateGroups.trim() || undefined,
      dueDate: defaultDueDate.trim(),
      priority: Number(defaultPriority),
    };
    onSave(req);
    setOpen(false);

  }

  useEffect(() => {
    if (editingTask) {
      setFormKey(editingTask.formKey ?? '');
      setCandidateGroups(editingTask.candidateGroupsRaw ?? '');
      setDefaultPriority(editingTask.priority?.toString() ?? '');
      setDefaultDueDate(editingTask.dueDate ?? '');
      setNewGroupInput('');
    }
  }, [editingTask]);

  const groupsArray = candidateGroups ? candidateGroups.split(',').map((s) => s.trim()).filter(Boolean) : [];
  const availableItemsArray = availableGroups ? availableGroups.split(',').map((s) => s.trim()).filter(Boolean) : [];


  return (
    <div className={cn('component',)}    >
      <div className={cn('section', ' space-y-6',)}    >
        <IGRPModalDialog
          onOpenChange={setOpen}
          open={open}
        >
          <IGRPModalDialogContent
            size={`lg`}
            className={cn()}


          >
            <IGRPModalDialogHeader
              className={cn('',)}


            >
              <IGRPModalDialogTitle
                id={`modalDialogTitle1`}



              >
                Editar configuração da tarefa
              </IGRPModalDialogTitle>
              <IGRPModalDialogDescription
                id={`modalDialogDescription1`}



              >
                {editingTask.name}
              </IGRPModalDialogDescription>
            </IGRPModalDialogHeader>
            <div className={cn('grid', 'md:grid-cols-2 ', ' gap-4',)}    >
              <IGRPCombobox
                id={`combobox1`}
                label={`Prioridade predefinida`}
                variant={`single`}
                placeholder={`Selecione uma opção...`}
                selectLabel={`Nenhuma opção encontrada`}
                showSearch={true}
                showIcon={false}
                iconName={`CornerDownRight`}
                className={cn('col-span-1',)}
                onChange={(v) => setDefaultPriority(Array.isArray(v) ? (v[0] ?? '') : String(v ?? ''))}
                options={PRIORITY_OPTIONS}
                value={defaultPriority}
              >
              </IGRPCombobox>
              <IGRPInputText
                id={`inputText1`}
                label={`Prazo predefinido (duração ISO)`}
                showIcon={false}
                required={false}
                placeholder={`ex.: P3D para 3 dias`}
                className={cn('col-span-1',)}
                onChange={(e) => setDefaultDueDate(e.target.value)}
                value={defaultDueDate}
              >
              </IGRPInputText></div>
            <IGRPInputText
              id={`inputText2`}
              label={`Chave do formulário`}
              showIcon={false}
              required={false}
              className={cn('',)}
              onChange={(e) => setFormKey(e.target.value)}
              value={formKey}
            >
            </IGRPInputText>
            <IGRPSeparator
              id={`separator1`}
              orientation={`horizontal`}
              className={cn('',)}


            >
            </IGRPSeparator>
            <SelectedItems items={candidateGroups} removeItem={handleRemoveGroup} ></SelectedItems>
            <AddChecklistItem label={`Grupos candidatos`} availableItems={availableItemsArray} items={groupsArray} addItem={handleAddGroup}
              removeItem={handleRemoveGroup} ></AddChecklistItem>
            <AddItem label={`Adicionar grupo personalizado`} placeholder={`Introduza o nome do grupo...`} value={newGroupInput} addItem={handleAddGroup}
              setValue={setNewGroupInput} ></AddItem>
            <IGRPModalDialogFooter
              className={cn('',)}


            >
              <div className={cn('flex', ' flex-1 justify-end gap-2',)}    >
                <IGRPButton
                  id={`button2`}
                  variant={`outline`}
                  size={`default`}
                  showIcon={false}
                  className={cn()}
                  onClick={(open) => setOpen(!open)}

                >
                  Cancelar
                </IGRPButton>
                <IGRPButton
                  id={`button1`}
                  variant={`default`}
                  size={`default`}
                  showIcon={false}
                  className={cn()}
                  onClick={handleSave}

                >
                  Guardar alterações
                </IGRPButton></div>
            </IGRPModalDialogFooter>
          </IGRPModalDialogContent>
        </IGRPModalDialog></div></div>
  );
}
