'use client'

/* THIS FILE WAS GENERATED AUTOMATICALLY BY iGRP STUDIO. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from 'react';
import { cn } from '@igrp/igrp-framework-react-design-system';
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
import type { CreateProcessArtifactRequest } from '@igrp/platform-process-management-types';

type TaskeditorProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  editingTask: { key?: string; name?: string; formKey?: string; candidateGroupsRaw?: string } | undefined;
  onSave: (req: CreateProcessArtifactRequest) => void;
  availableGroups?: string;
};

export default function Taskeditor({ open, setOpen, editingTask, onSave, availableGroups = '' }: TaskeditorProps) {
  const [formKey, setFormKey] = useState('');
  const [candidateGroups, setCandidateGroups] = useState('');
  const [defaultPriority, setDefaultPriority] = useState('');
  const [defaultDueDate, setDefaultDueDate] = useState('');
  const [newGroupInput, setNewGroupInput] = useState('');

  useEffect(() => {
    if (editingTask) {
      setFormKey(editingTask.formKey ?? '');
      setCandidateGroups(editingTask.candidateGroupsRaw ?? '');
      setDefaultPriority('');
      setDefaultDueDate('');
      setNewGroupInput('');
    }
  }, [editingTask]);

  const groupsArray = candidateGroups ? candidateGroups.split(',').map((s) => s.trim()).filter(Boolean) : [];
  const availableItemsArray = availableGroups ? availableGroups.split(',').map((s) => s.trim()).filter(Boolean) : [];

  const handleRemoveGroup = (item: string) => {
    const next = groupsArray.filter((g) => g !== item).join(',');
    setCandidateGroups(next);
  };

  const handleAddGroup = (value: string) => {
    const trimmed = value?.trim();
    if (!trimmed || groupsArray.includes(trimmed)) return;
    const next = groupsArray.length ? `${candidateGroups},${trimmed}` : trimmed;
    setCandidateGroups(next);
    setNewGroupInput('');
  };

  const handleSave = () => {
    if (!editingTask?.key || !editingTask?.name) return;
    const req: CreateProcessArtifactRequest = {
      key: editingTask.key,
      name: editingTask.name,
      formKey: formKey.trim(),
      candidateGroups: candidateGroups.trim() || undefined,
    };
    onSave(req);
    setOpen(false);
  };

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
                Edit Task Configuration
              </IGRPModalDialogTitle>
              <IGRPModalDialogDescription
                id={`modalDialogDescription1`}



              >
                {editingTask?.name}
              </IGRPModalDialogDescription>
            </IGRPModalDialogHeader>
            <div className={cn('grid', 'md:grid-cols-2 ', ' gap-4',)}    >
              <IGRPCombobox
                id={`combobox1`}
                label={`Default Priority`}
                variant={`single`}
                placeholder={`Select an option...`}
                selectLabel={`No option found`}
                showSearch={true}
                showIcon={false}
                iconName={`CornerDownRight`}
                className={cn('col-span-1',)}
                value={defaultPriority}
                onChange={(v) => setDefaultPriority(Array.isArray(v) ? (v[0] ?? '') : String(v ?? ''))}
                options={PRIORITY_OPTIONS}
              >
              </IGRPCombobox>
              <IGRPInputText
                id={`inputText1`}
                label={`Default Due Date (ISO Duration)`}
                showIcon={false}
                required={false}
                placeholder={`e.g., P3D for 3 days`}
                className={cn('col-span-1',)}
                value={defaultDueDate}
                onChange={(e) => setDefaultDueDate(e.target.value)}
              >
              </IGRPInputText></div>
            <IGRPInputText
              id={`inputText2`}
              label={`Form Key`}
              showIcon={false}
              required={false}
              className={cn('',)}
              value={formKey}
              onChange={(e) => setFormKey(e.target.value)}
            >
            </IGRPInputText>
            <IGRPSeparator
              id={`separator1`}
              orientation={`horizontal`}
              className={cn('',)}


            >
            </IGRPSeparator>
            <SelectedItems items={candidateGroups} removeItem={handleRemoveGroup} />
            <AddChecklistItem
              label="Candidate Groups"
              availableItems={availableItemsArray}
              items={groupsArray}
              addItem={handleAddGroup}
              removeItem={handleRemoveGroup}
            />
            <AddItem
              label="Add Custom Group"
              placeholder="Enter group name..."
              value={newGroupInput}
              setValue={setNewGroupInput}
              addItem={handleAddGroup}
            />
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
                  Cancel
                </IGRPButton>
                <IGRPButton
                  id={`button1`}
                  variant={`default`}
                  size={`default`}
                  showIcon={false}
                  className={cn()}
                  onClick={handleSave}

                >
                  Save Changes
                </IGRPButton></div>
            </IGRPModalDialogFooter>
          </IGRPModalDialogContent>
        </IGRPModalDialog></div></div>
  );
}