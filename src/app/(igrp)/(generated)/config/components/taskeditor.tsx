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

export default function Taskeditor({ open, setOpen, editingTask, onSave }: { open: boolean, setOpen: (open: boolean) => void, editingTask: any, onSave: (req: any) => string }) {





  const { igrpToast } = useIGRPToast()


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
                {editingTask.name}
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
                onChange={() => { }}
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


              >
              </IGRPInputText></div>
            <IGRPInputText
              id={`inputText2`}
              label={`Form Key`}
              showIcon={false}
              required={false}
              className={cn('',)}


            >
            </IGRPInputText>
            <IGRPSeparator
              id={`separator1`}
              orientation={`horizontal`}
              className={cn('',)}


            >
            </IGRPSeparator>
            <SelectedItems    ></SelectedItems>
            <AddChecklistItem    ></AddChecklistItem>
            <AddItem label={`Add Custom Group`} placeholder={`Enter group name...`}   ></AddItem>
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
                  onClick={() => onSave(editingTask)}

                >
                  Save Changes
                </IGRPButton></div>
            </IGRPModalDialogFooter>
          </IGRPModalDialogContent>
        </IGRPModalDialog></div></div>
  );
}