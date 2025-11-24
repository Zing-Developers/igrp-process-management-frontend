'use client';

/* THIS FILE WAS GENERATED AUTOMATICALLY BY iGRP STUDIO. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { use, useState, useEffect, useRef } from 'react';
import { cn, useIGRPMenuNavigation, useIGRPToast } from '@igrp/igrp-framework-react-design-system';
import { IGRPOptionsProps } from '@igrp/igrp-framework-react-design-system';
import {
  IGRPModalDialog,
  IGRPModalDialogContent,
  IGRPModalDialogHeader,
  IGRPModalDialogTitle,
  IGRPModalDialogDescription,
  IGRPLabel,
  IGRPRepetitiveComponent,
  IGRPInputText,
  IGRPCombobox,
  IGRPInputHidden,
  IGRPModalDialogFooter,
  IGRPButton,
} from '@igrp/igrp-framework-react-design-system';

export default function Artifactmodal({
  open,
  setOpen,
  processArtifacts,
  onSave,
  onFormChange,
  formData,
}: {
  open: boolean;
  setOpen: (prompt: boolean) => void;
  processArtifacts: any;
  onSave: () => void;
  onFormChange: (artifactKey: string, formKey: string) => void;
  formData: any;
}) {
  const [repetitiveListrepetitiveList1, setRepetitiveListrepetitiveList1] = useState<any[]>([]);
  const [selectFormKeyOptions, setSelectFormKeyOptions] = useState<IGRPOptionsProps[]>([]);

  const { igrpToast } = useIGRPToast();

  // Load processArtifacts into repetitive list when modal opens or artifacts change
  useEffect(() => {
    if (open && processArtifacts && Array.isArray(processArtifacts)) {
      setRepetitiveListrepetitiveList1(processArtifacts);
    } else {
      setRepetitiveListrepetitiveList1([]);
    }
    setSelectFormKeyOptions([
      { label: 'Form 1', value: 'form1' },
      { label: 'Form 2', value: 'form2' },
      { label: 'Form 3', value: 'form3' },
      { label: 'Custom Form', value: 'custom' },
    ]);
  }, [open, processArtifacts]);

  return (
    <div className={cn('component')}>
      <IGRPModalDialog onOpenChange={setOpen} open={open}>
        <IGRPModalDialogContent size={`xl`} className={cn()}>
          <IGRPModalDialogHeader className={cn('')}>
            <IGRPModalDialogTitle >
              User Tasks - Associar Recurso
            </IGRPModalDialogTitle>
            <IGRPModalDialogDescription >
              Associar recursos ás tarefas dos utilizadores
            </IGRPModalDialogDescription>
          </IGRPModalDialogHeader>
          <div
            className={cn('grid', 'grid-cols-1 ', 'md:grid-cols-2 ', 'lg:grid-cols-2 ', ' gap-4')}
          >
            <IGRPLabel
              label={`Tasks`}
              required={false}
              className={cn('col-span-1')}
            ></IGRPLabel>
            <IGRPLabel
              label={`FormKey`}
              required={false}
              className={cn('col-span-1')}
            ></IGRPLabel>
          </div>
          <IGRPRepetitiveComponent<any>
            keyExtractor={(item) => item.id}
            items={repetitiveListrepetitiveList1}
          >
            {(item) => (
              <>
                <div
                  className={cn(
                    'grid',
                    'grid-cols-2 ',
                    'md:grid-cols-2 ',
                    'lg:grid-cols-2 ',
                    ' gap-4',
                  )}
                >
                  <IGRPInputText
                    name={`Name`}
                    label={undefined}
                    showIcon={false}
                    required={false}
                    disabled={true}
                    className={cn('col-span-1')}
                    value={item.name}
                  ></IGRPInputText>
                  <IGRPCombobox
                    name={`FormKey`}
                    label={undefined}
                    variant={`single`}
                    placeholder={`Select an option...`}
                    required={undefined}
                    selectLabel={`No option found`}
                    showSearch={true}
                    showIcon={false}
                    iconName={`CornerDownRight`}
                    className={cn('col-span-1')}
                    onChange={(value) => onFormChange?.(item.key, value as string)}
                    options={selectFormKeyOptions}
                    value={formData?.[item.key]?.formKey || ''}
                  ></IGRPCombobox>
                  <IGRPInputHidden
                    name={`Key`}
                    label={`key`}
                    required={false}
                    className={cn('col-span-1')}
                  ></IGRPInputHidden>
                </div>
              </>
            )}
          </IGRPRepetitiveComponent>

          <IGRPModalDialogFooter className={cn('', '')}>
            <div
              className={cn('flex', 'flex flex-row flex-nowrap items-stretch justify-end gap-2')}
            >
              <IGRPButton
                name={`button2`}
                variant={`default`}
                size={`default`}
                showIcon={false}
                className={cn()}
                onClick={onSave}
              >
                Gravar
              </IGRPButton>
            </div>
          </IGRPModalDialogFooter>
        </IGRPModalDialogContent>
      </IGRPModalDialog>
    </div>
  );
}
