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
import { 
  IGRPModalDialog,
	IGRPModalDialogContent,
	IGRPModalDialogHeader,
	IGRPModalDialogTitle,
	IGRPForm,
	IGRPCombobox,
	IGRPInputText,
	IGRPTextarea,
	IGRPSelect,
	IGRPModalDialogFooter,
	IGRPButton,
	IGRPModalDialogClose 
} from "@igrp/igrp-framework-react-design-system";

export default function Areamodal({ open, setOpen, isEditing, formData, onFormChange, onSave, onClose, options } : { open: boolean, setOpen: (prompt: boolean) => void, isEditing: boolean, formData: object, onFormChange: (data: any) => void, onSave: (data: any) => void, onClose: () => void, options: any }) {


  
  z.config(z.locales.en());

const form1 = z.object({
    applicationBase: z.string().nonempty(),
    applicationBaseText: z.string().nonempty(),
    code: z.string().nonempty(),
    name: z.string().nonempty(),
    description: z.string().optional(),
    parentId: z.string().optional()
})

type Form1ZodType = typeof form1;

const initForm1: z.infer<Form1ZodType> = {
    applicationBase: ``,
    applicationBaseText: ``,
    code: ``,
    name: ``,
    description: ``,
    parentId: ``
}


  const formform1Ref = useRef<IGRPFormHandle<Form1ZodType> | null>(null);
  const [form1Data, setForm1Data] = useState<any>(initForm1);
  
const { igrpToast } = useIGRPToast()

async function handleFormSubmit (data: z.infer<any>): Promise<void  | undefined> {

  onFormChange(data)
onSave(data)

}

const isUpdatingRef = useRef<boolean>(false);
useEffect(() => {
  if (formData)
    setForm1Data({
      ...formData,
      applicationBaseText: (formData as any).applicationBase,
    });
}, [formData]);

const title = isEditing ? 'Editar Área' : 'Nova Área';

useEffect(() => {
  let cleanup: (() => void) | undefined;
  let rafId = 0;

  const trySubscribe = () => {
    const handle = formform1Ref.current;
    if (handle && typeof (handle as any).watch === "function") {
      const subscription = (handle as any).watch((value: any) => {
        if (isUpdatingRef.current) return;

        if (options?.applications.length > 0) {
          const currentValue = (value as any)?.applicationBase;
          const currentText = (value as any)?.applicationBaseText;
          if (currentValue && currentValue !== currentText) {
            isUpdatingRef.current = true;
            formform1Ref.current?.setValue(
              "applicationBaseText",
              currentValue
            );
            setTimeout(() => {
              isUpdatingRef.current = false;
            }, 0);
          }
        } else {
          const currentText = (value as any)?.applicationBaseText;
          const currentValue = (value as any)?.applicationBase;
          if (currentText && currentText !== currentValue) {
            isUpdatingRef.current = true;
            formform1Ref.current?.setValue("applicationBase", currentText);
            setTimeout(() => {
              isUpdatingRef.current = false;
            }, 0);
          }
        }
      });

      cleanup = () => {
        if (subscription && typeof subscription.unsubscribe === "function") {
          subscription.unsubscribe();
        }
      };
    } else {
      rafId = window.requestAnimationFrame(trySubscribe);
    }
  };

  trySubscribe();

  return () => {
    if (rafId) window.cancelAnimationFrame(rafId);
    if (cleanup) cleanup();
  };
}, [options.applications]);


  return (
<div className={ cn('component',)}    >
	<IGRPModalDialog
  onOpenChange={ setOpen }
  open={ open }
>
  <IGRPModalDialogContent
  size={ `lg` }
  className={ cn() }
  
  
>
  <IGRPModalDialogHeader
  className={ cn('',) }
  
  
>
  <IGRPModalDialogTitle
  id={ `modalDialogTitle1` }
  
  
  
>
  { title }
</IGRPModalDialogTitle>
</IGRPModalDialogHeader>
  <IGRPForm
  schema={ form1 }
  validationMode={ `onBlur` }
formRef={ formform1Ref }
  className={ cn('',) }
  onSubmit={ handleFormSubmit }
  defaultValues={ form1Data }
>
  <>
  { options?.applications.length > 0  && (<IGRPCombobox
  id={ `applicationBase` }
  label={ `Aplicação` }
variant={ `single` }
placeholder={ `Select an option...` }
required={ true }
selectLabel={ `No option found` }
showSearch={ true }
showIcon={ false }
iconName={ `CornerDownRight` }
  className={ cn() }
  onChange={ () => {} }
  options={ options?.applications || [] }
>
</IGRPCombobox>)}
  { options?.applications.length === 0  && (<IGRPInputText
  id={ `applicationBaseText` }
  label={ `Aplicação` }
showIcon={ false }
required={ true }
  className={ cn() }
  
  
>
</IGRPInputText>)}
  <IGRPInputText
  id={ `code` }
  label={ `Código` }
showIcon={ false }
required={ true }
  className={ cn('',) }
  
  
>
</IGRPInputText>
  <IGRPInputText
  id={ `name` }
  label={ `Nome` }
showIcon={ false }
required={ true }
  className={ cn() }
  
  
>
</IGRPInputText>
  <IGRPTextarea
  id={ `description` }
  label={ `Descrição` }
rows={ 3 }
required={ false }
  className={ cn() }
  
  
>
</IGRPTextarea>
  <IGRPSelect
  id={ `parentId` }
  label={ `Área Pai` }
placeholder={ `Select an option...` }
  className={ cn() }
  
  options={ options?.areas || [] }
>
</IGRPSelect>
</>
</IGRPForm>
  <IGRPModalDialogFooter
  className={ cn('','',) }
  
  
>
  <div className={ cn('flex','flex-1','flex flex-row flex-nowrap items-center justify-end gap-2',)}    >
	<IGRPButton
  id={ `button1` }
  variant={ `default` }
size={ `default` }
showIcon={ false }
  className={ cn('',) }
  onClick={ () => formform1Ref.current?.submit() }
  
>
  Gravar
</IGRPButton></div>
  <IGRPModalDialogClose
  id={ `modalDialogClose1` }
  
  className={ cn() }
  onClick={ () => {} }
  
>
</IGRPModalDialogClose>
</IGRPModalDialogFooter>
</IGRPModalDialogContent>
</IGRPModalDialog></div>
  );
}