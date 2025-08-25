'use client';

/* THIS FILE WAS GENERATED AUTOMATICALLY BY iGRP STUDIO. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { use, useState, useEffect, useRef } from 'react';
import { cn, useIGRPMenuNavigation, useIGRPToast } from '@igrp/igrp-framework-react-design-system';
import { IGRPFormHandle } from '@igrp/igrp-framework-react-design-system';
import { z } from 'zod';
import {
  IGRPModalDialog,
  IGRPModalDialogContent,
  IGRPModalDialogHeader,
  IGRPModalDialogTitle,
  IGRPModalDialogDescription,
  IGRPForm,
  IGRPRepetitiveComponent,
  IGRPInputText,
  IGRPInputHidden,
  IGRPModalDialogFooter,
  IGRPModalDialogClose,
  IGRPButton,
} from '@igrp/igrp-framework-react-design-system';

export default function Artifactmodal({
  open,
  setOpen,
  processArtifacts,
}: {
  open: boolean;
  setOpen: (prompt: boolean) => void;
  processArtifacts: any;
}) {
  const form = z.object({
    name: z.string().optional(),
    formKey: z.string().optional(),
    key: z.string().optional(),
  });

  type FormZodType = typeof form;

  const initForm: z.infer<FormZodType> = {
    name: undefined,
    formKey: undefined,
    key: undefined,
  };

  const formform1Ref = useRef<IGRPFormHandle<FormZodType> | null>(null);
  const [formData, setFormData] = useState<any>(initForm);
  const [repetitiveListrepetitiveList1, setRepetitiveListrepetitiveList1] = useState<any[]>([]);

  const { igrpToast } = useIGRPToast();

  // Load processArtifacts into repetitive list when modal opens or artifacts change
  useEffect(() => {
    console.log('processArtifacts', processArtifacts);
    if (open && processArtifacts && Array.isArray(processArtifacts)) {
      setRepetitiveListrepetitiveList1(processArtifacts);
    } else {
      setRepetitiveListrepetitiveList1([]);
    }
  }, [open, processArtifacts]);

  return (
    <div className={cn('component')}>
      <IGRPModalDialog onOpenChange={setOpen} open={open}>
        <IGRPModalDialogContent size={`md`} className={cn()}>
          <IGRPModalDialogHeader>
            <IGRPModalDialogTitle name={`modalDialogTitle1`}>
              Processo Artifatos
            </IGRPModalDialogTitle>
            <IGRPModalDialogDescription name={`modalDialogDescription1`}>
              Lorem ipsum dolor sit amet
            </IGRPModalDialogDescription>
          </IGRPModalDialogHeader>
          <IGRPForm
            schema={form}
            validationMode={`onBlur`}
            gridClassName={`grid grid-cols-4`}
            formRef={formform1Ref}
            className={cn('')}
            onSubmit={(e) => {}}
            defaultValues={formData}
          >
            <>
              <div
                className={cn(
                  'flex flex-col flex-nowrap items-stretch justify-between gap-2',
                  ' flex-1 min-w-[240px]',
                )}
              >
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
                          name={`name`}
                          label={`Artifato`}
                          showIcon={false}
                          required={false}
                          disabled={true}
                          className={cn('col-span-1')}
                          value={item.name}
                        ></IGRPInputText>
                        <IGRPInputText
                          name={`formKey`}
                          label={`FormKey`}
                          showIcon={false}
                          required={false}
                          className={cn('col-span-1')}
                        ></IGRPInputText>
                        <IGRPInputHidden
                          name={`key`}
                          label={`key`}
                          required={false}
                          className={cn('col-span-1')}
                        ></IGRPInputHidden>
                      </div>
                    </>
                  )}
                </IGRPRepetitiveComponent>
              </div>
            </>
          </IGRPForm>
          <IGRPModalDialogFooter className={cn('')}>
            <div
              className={cn('flex', 'flex flex-row flex-nowrap items-stretch justify-end gap-2')}
            >
              <IGRPModalDialogClose name={`modalDialogClose1`} className={cn()} onClick={() => {}}>
                Close
              </IGRPModalDialogClose>
              <IGRPButton
                name={`button2`}
                variant={`default`}
                size={`default`}
                className={cn()}
                onClick={() => {}}
              >
                Button
              </IGRPButton>
            </div>
          </IGRPModalDialogFooter>
        </IGRPModalDialogContent>
      </IGRPModalDialog>
    </div>
  );
}
