'use client'

/* THIS FILE WAS GENERATED AUTOMATICALLY BY iGRP STUDIO. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { use, useState, useEffect, useRef } from 'react';
import { cn, useIGRPMenuNavigation, useIGRPToast } from '@igrp/igrp-framework-react-design-system';
import { IGRPFormHandle } from "@igrp/igrp-framework-react-design-system";
import { z } from "@igrp/igrp-framework-react-design-system"
import { IGRPOptionsProps } from "@igrp/igrp-framework-react-design-system";
import { 
  IGRPModalDialog,
	IGRPModalDialogContent,
	IGRPModalDialogHeader,
	IGRPModalDialogTitle,
	IGRPForm,
	IGRPInputText,
	IGRPTextarea,
	IGRPSelect,
	IGRPModalDialogFooter,
	IGRPButton,
	IGRPModalDialogClose 
} from "@igrp/igrp-framework-react-design-system";

export default function Areamodal({ open, setOpen, isEditing, formData, areas, onFormChange, onSave, onClose } : { open: boolean, setOpen: (prompt: boolean) => void, isEditing: boolean, formData: object, areas: object[], onFormChange: (data: any) => void, onSave: (data: any) => void, onClose: () => void }) {

  
  const form1 = z.object({
    code: z.string(),
    name: z.string(),
    description: z.string().optional(),
    area_fk: z.string().optional()
})

type Form1ZodType = typeof form1;

const initForm1: z.infer<Form1ZodType> = {
    code: ``,
    name: ``,
    description: ``,
    area_fk: ``
}


  const formform1Ref = useRef<IGRPFormHandle<Form1ZodType> | null>(null);
  const [form1Data, setForm1Data] = useState<any>(initForm1);
  const [selectarea_fkOptions, setSelectarea_fkOptions] = useState<IGRPOptionsProps[]>([]);
  
const { igrpToast } = useIGRPToast()

async function handleFormSubmit (data: z.infer<any>): Promise<void  | undefined> {

  onFormChange(data)
onSave()

}

useEffect(() => {
  if(formData)
    setForm1Data(formData)
},[formData])

useEffect(() => {
  setSelectarea_fkOptions(areas.map((area) => ({ label: area.name, value: area.id })));
}, [areas]);

const title= isEditing ? 'Editar Área' : 'Nova Área'




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
  name={ `modalDialogTitle1` }
  

  
  
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
  <IGRPInputText
  name={ `code` }
  label={ `Código` }
showIcon={ false }
required={ true }


  className={ cn() }
  
  
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
  name={ `area_fk` }
  label={ `Área Pai` }
placeholder={ `Select an option...` }
gridSize={ `full` }



  className={ cn() }
  
  options={ selectarea_fkOptions }
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