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

export default function Areamodal({ open, setOpen, isEditing, formData, areas, onFormChange, onSave, onClose } : { open: boolean, setOpen: (prompt: boolean) => void, isEditing: boolean, formData: object, areas: any[], onFormChange: (data: any) => void, onSave: (data: any) => void, onClose: () => void }) {

  
  const form1 = z.object({
    applicationBase: z.string().nonempty(),
    code: z.string().nonempty(),
    name: z.string().nonempty(),
    description: z.string().optional(),
    parentId: z.string().optional()
})

type Form1ZodType = typeof form1;

const initForm1: z.infer<Form1ZodType> = {
    applicationBase: ``,
    code: ``,
    name: ``,
    description: undefined,
    parentId: undefined
}


  const formform1Ref = useRef<IGRPFormHandle<Form1ZodType> | null>(null);
  const [form1Data, setForm1Data] = useState<any>(initForm1);
  const [selectapplicationBaseOptions, setSelectapplicationBaseOptions] = useState<IGRPOptionsProps[]>([]);
  const [selectparentIdOptions, setSelectparentIdOptions] = useState<IGRPOptionsProps[]>([]);
  
const { igrpToast } = useIGRPToast()

async function handleFormSubmit (data: z.infer<any>): Promise<void  | undefined> {

  onFormChange(data)
onSave(data)

}

  useEffect(() => {
    if (formData) setForm1Data(formData);
  }, [formData]);

  useEffect(() => {    
    setSelectapplicationBaseOptions([
      { label: 'Cadastro', value: 'CADASTRO' },
      { label: 'Demo', value: 'demo' },
      { label: 'IRN Processo', value: 'IRN' }
    ]);
    setSelectparentIdOptions(areas.map((area) => ({ label: area.name, value: area.id })));
  }, [areas]);

  const title = isEditing ? 'Editar Área' : 'Nova Área';


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
  <IGRPCombobox
  name={ `applicationBase` }
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
  options={ selectapplicationBaseOptions }
>
</IGRPCombobox>
  <IGRPInputText
  name={ `code` }
  label={ `Código` }
showIcon={ false }
required={ true }
  className={ cn('',) }
  
  
>
</IGRPInputText>
  <IGRPInputText
  name={ `name` }
  label={ `Nome` }
showIcon={ false }
required={ true }
  className={ cn() }
  
  
>
</IGRPInputText>
  <IGRPTextarea
  name={ `description` }
  label={ `Descrição` }
rows={ 3 }
required={ false }
  className={ cn() }
  
  
>
</IGRPTextarea>
  <IGRPSelect
  name={ `parentId` }
  label={ `Área Pai` }
placeholder={ `Select an option...` }
gridSize={ `full` }
  className={ cn() }
  
  options={ selectparentIdOptions }
>
</IGRPSelect>
</>
</IGRPForm>
  <IGRPModalDialogFooter
  className={ cn('','',) }
  
  
>
  <IGRPButton
  name={ `button1` }
  variant={ `default` }
size={ `default` }
showIcon={ false }
  className={ cn('',) }
  onClick={ () => formform1Ref.current?.submit() }
  
>
  Gravar
</IGRPButton>
  <IGRPModalDialogClose
  name={ `modalDialogClose1` }
  
  className={ cn() }
  onClick={ () => {} }
  
>
</IGRPModalDialogClose>
</IGRPModalDialogFooter>
</IGRPModalDialogContent>
</IGRPModalDialog></div>
  );
}