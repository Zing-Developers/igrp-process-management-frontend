'use client';

/* THIS FILE WAS GENERATED AUTOMATICALLY BY iGRP STUDIO. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { use, useState, useEffect, useRef } from 'react';
import { cn, useIGRPMenuNavigation, useIGRPToast } from '@igrp/igrp-framework-react-design-system';
import { IGRPFormHandle } from '@igrp/igrp-framework-react-design-system';
import { z } from 'zod';
import { IGRPOptionsProps } from '@igrp/igrp-framework-react-design-system';
import {
  IGRPModalDialog,
  IGRPModalDialogContent,
  IGRPModalDialogHeader,
  IGRPModalDialogTitle,
  IGRPModalDialogDescription,
  IGRPForm,
  IGRPCombobox,
  IGRPModalDialogFooter,
  IGRPButton,
} from '@igrp/igrp-framework-react-design-system';
import { PRIORITY_OPTIONS } from '../app/(myapp)/enum/priority';

export default function Prioritymodal({
  open,
  setOpen,
  onSave,
  modalTitle,
  modalSubTitle,
}: {
  open: boolean;
  setOpen: (prompt: boolean) => void;
  onSave: (data: any) => void;
  modalTitle: string;
  modalSubTitle: string;
}) {
  const form1 = z.object({
    priority: z.string().nonempty(),
  });

  type Form1ZodType = typeof form1;

  const initForm1: z.infer<Form1ZodType> = {
    priority: undefined,
  };

  const formform1Ref = useRef<IGRPFormHandle<Form1ZodType> | null>(null);
  const [form1Data, setForm1Data] = useState<any>(initForm1);
  const [selectpriorityOptions, setSelectpriorityOptions] = useState<IGRPOptionsProps[]>([]);

  const { igrpToast } = useIGRPToast();

  useEffect(() => {
    setSelectpriorityOptions(PRIORITY_OPTIONS);
  }, []);

  return (
    <div className={cn('component')}>
      <IGRPModalDialog onOpenChange={setOpen} open={open}>
        <IGRPModalDialogContent size={`lg`} className={cn()}>
          <IGRPModalDialogHeader className={cn('')}>
            <IGRPModalDialogTitle name={`modalDialogTitle1`}>{modalTitle}</IGRPModalDialogTitle>
            <IGRPModalDialogDescription name={`modalDialogDescription1`}>
              {modalSubTitle}
            </IGRPModalDialogDescription>
          </IGRPModalDialogHeader>
          <IGRPForm
            schema={form1}
            validationMode={`onBlur`}
            formRef={formform1Ref}
            className={cn('')}
            onSubmit={async (data) => {
              await onSave(data);
            }}
            defaultValues={form1Data}
          >
            <>
              <div
                className={cn(
                  'grid',
                  'grid-cols-1 ',
                  'md:grid-cols-1 ',
                  'lg:grid-cols-1 ',
                  ' gap-4',
                )}
              >
                <IGRPCombobox
                  name={`priority`}
                  label={`Prioridade`}
                  variant={`single`}
                  placeholder={`Select an option...`}
                  required={true}
                  selectLabel={`No option found`}
                  showSearch={true}
                  showIcon={false}
                  iconName={`CornerDownRight`}
                  className={cn('col-span-1')}
                  onChange={() => {}}
                  options={selectpriorityOptions}
                ></IGRPCombobox>
              </div>
            </>
          </IGRPForm>
          <IGRPModalDialogFooter className={cn('')}>
            <IGRPButton
              name={`button1`}
              variant={`default`}
              size={`default`}
              showIcon={false}
              onClick={() => formform1Ref.current?.submit()}
            >
              Confirmar
            </IGRPButton>
          </IGRPModalDialogFooter>
        </IGRPModalDialogContent>
      </IGRPModalDialog>
    </div>
  );
}
