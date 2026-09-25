'use client'

/* THIS FILE WAS GENERATED AUTOMATICALLY BY iGRP STUDIO. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { use, useState, useEffect, useRef } from 'react';
import { cn, useIGRPMenuNavigation, useIGRPToast } from '@igrp/igrp-framework-react-design-system';
import { IGRPFormHandle } from "@igrp/igrp-framework-react-design-system";
import { z } from "zod"
import { IGRPOptionsProps } from "@igrp/igrp-framework-react-design-system";
import { AddChecklistItem } from '@/app/(myapp)/config/components/add-checklist-item'
import {
  IGRPModalDialog,
  IGRPModalDialogContent,
  IGRPModalDialogHeader,
  IGRPModalDialogTitle,
  IGRPModalDialogDescription,
  IGRPForm,
  IGRPInputText,
  IGRPInputColor,
  IGRPTextarea,
  IGRPSelect,
  IGRPInputHidden,
  IGRPModalDialogFooter,
  IGRPButton,
  IGRPModalDialogClose
} from "@igrp/igrp-framework-react-design-system";

export default function Areamodal({ open, setOpen, isEditing, formData, onFormChange, onSave, onClose, options, allProcesses }: { open: boolean, setOpen: (prompt: boolean) => void, isEditing: boolean, formData: any, onFormChange: (data: any) => void, onSave: (data: any) => any, onClose: () => void, options: any, allProcesses: any }) {



  z.config(z.locales.en());

  const form1 = z.object({
    applicationBase: z.string().nonempty(),
    name: z.string().nonempty(),
    code: z.string().nonempty(),
    color: z.string().optional(),
    description: z.string().optional(),
    parentId: z.string().optional(),
    processes: z.array(z.object()).optional()
  })

  type Form1ZodType = typeof form1;

  const initForm1: z.infer<Form1ZodType> = {
    applicationBase: ``,
    name: ``,
    code: ``,
    color: `#3b82f6`,
    description: ``,
    parentId: ``,
    processes: []
  }


  const formform1Ref = useRef<IGRPFormHandle<Form1ZodType> | null>(null);
  const [form1Data, setForm1Data] = useState<any>(initForm1);

  const [editingArea, setEditingArea] = useState<void | undefined>(undefined);

  const { igrpToast } = useIGRPToast()

  async function handleFormSubmit(data: z.infer<any>): Promise<void | undefined> {

    const formProcesses = (formData as { processes?: unknown[] })?.processes;
    const next = { ...data, processes: formProcesses };

    onFormChange(next)
    const response = onSave(next)
    if (response)
      onClose()

  }

  function handleAddItem(item: any): void {


    const data = formform1Ref.current?.getValues();

    const nextProcesses = [...(data?.processes || []), item];
    const next = { ...data, processes: nextProcesses };
    setForm1Data(next);
    onFormChange(next);

    formform1Ref.current?.setValue("processes", nextProcesses);


  }

  function handleRemoveItem(item: any): void {

    const key = item?.key ?? item?.processKey;
    const nextProcesses = (form1Data.processes || []).filter(
      (p: any) => (p?.key ?? p?.processKey) !== key
    );
    const next = { ...form1Data, processes: nextProcesses };
    setForm1Data(next);
    onFormChange(next);

  }

  useEffect(() => {
    if (formData)
      setForm1Data(formData);
  }, [formData]);

  const title = isEditing ? 'Editar Área' : 'Adicionar Nova Área';
  const modalDescription = isEditing ? 'Atualize os detalhes da área e as atribuições de processos' : 'Crie uma nova área ou sub-área no mapa de processos';


  const processesItems = (allProcesses || []).map((process: any) => ({
    ...process,
    key: process.id
  }));

  const itemsChecked = (formData.processes || []).map((process: any) => ({
    ...process,
    key: process.releaseId ?? process.id
  }));




  return (
    <div className={cn('component',)}    >
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
              {title}
            </IGRPModalDialogTitle>
            <IGRPModalDialogDescription
              id={`modalDialogDescription1`}



            >
              {modalDescription}
            </IGRPModalDialogDescription>
          </IGRPModalDialogHeader>
          <IGRPForm
            schema={form1}
            validationMode={`onBlur`}
            formRef={formform1Ref}
            className={cn('',)}
            onSubmit={handleFormSubmit}
            defaultValues={form1Data}
          >
            <>
              <IGRPInputText
                id={`applicationBase`}
                label={`Aplicação`}
                showIcon={false}
                required={true}
                className={cn()}


              >
              </IGRPInputText>
              <IGRPInputText
                id={`name`}
                label={`Nome`}
                showIcon={false}
                required={true}
                placeholder={`e.g., Finance & Accounting`}
                className={cn()}


              >
              </IGRPInputText>
              <div className={cn('grid', 'lg:grid-cols-2 ', ' gap-4',)}    >
                <IGRPInputText
                  id={`code`}
                  label={`Código`}
                  showIcon={false}
                  required={true}
                  placeholder={`e.g., FIN & RH`}
                  className={cn('', 'col-span-1',)}


                >
                </IGRPInputText>
                <IGRPInputColor
                  id={`color`}
                  label={`Cor`}
                  defaultValue={`#3b82f6`}
                  showHexValue={true}
                  required={false}
                  className={cn('col-span-1',)}


                >
                </IGRPInputColor></div>
              <IGRPTextarea
                id={`description`}
                label={`Descrição`}
                rows={3}
                required={false}
                placeholder={`Pesquena descriçåo da área`}
                className={cn()}


              >
              </IGRPTextarea>
              <IGRPSelect
                id={`parentId`}
                label={`Área Pai (Optional)`}
                placeholder={`Select an option...`}
                className={cn()}

                options={options?.areas || []}
              >
              </IGRPSelect>
              <IGRPInputHidden
                id={`processes`}
                label={`processes`}
                required={false}
                className={cn()}


              >
              </IGRPInputHidden>
              <AddChecklistItem label={`Associar Processos`} availableItems={processesItems} items={itemsChecked} addItem={handleAddItem}
                removeItem={handleRemoveItem} ></AddChecklistItem>
            </>
          </IGRPForm>
          <IGRPModalDialogFooter
            className={cn('', '',)}


          >
            <div className={cn('flex', 'flex-1', 'flex flex-row flex-nowrap items-center justify-end gap-2',)}    >
              <IGRPButton
                id={`button1`}
                variant={`default`}
                size={`default`}
                showIcon={false}
                className={cn('',)}
                onClick={() => formform1Ref.current?.submit()}

              >
                Gravar
              </IGRPButton></div>
            <IGRPModalDialogClose
              id={`modalDialogClose1`}

              className={cn()}
              onClick={() => { }}

            >
            </IGRPModalDialogClose>
          </IGRPModalDialogFooter>
        </IGRPModalDialogContent>
      </IGRPModalDialog></div>
  );
}