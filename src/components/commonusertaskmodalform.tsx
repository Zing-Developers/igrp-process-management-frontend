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
	IGRPModalDialogDescription,
	IGRPForm,
	IGRPCombobox,
	IGRPTextarea,
	IGRPModalDialogFooter,
	IGRPModalDialogClose,
	IGRPButton 
} from "@igrp/igrp-framework-react-design-system";

export default function Commonusertaskmodalform({ open, setOpen, onSave, modalTitle, modalSubTitle } : { open: boolean, setOpen: (prompt: boolean) => void, onSave: (data: any) => void, modalTitle: string, modalSubTitle: string }) {

  
  const form1 = z.object({
    user: z.string().optional(),
    note: z.string().optional()
})

type Form1ZodType = typeof form1;

const initForm1: z.infer<Form1ZodType> = {
    user: undefined,
    note: undefined
}


  const formform1Ref = useRef<IGRPFormHandle<Form1ZodType> | null>(null);
  const [form1Data, setForm1Data] = useState<any>(initForm1);
  const [selectuserOptions, setSelectuserOptions] = useState<IGRPOptionsProps[]>([]);
  
const { igrpToast } = useIGRPToast()


  return (
<div className={ cn('component',)}    >
	<IGRPModalDialog
  onOpenChange={ setOpen }
  open={ open }
>
  <IGRPModalDialogContent
  size={ `md` }
  className={ cn() }
  
  
>
  <IGRPModalDialogHeader
  className={ cn('',) }
  
  
>
  <IGRPModalDialogTitle
  name={ `modalDialogTitle1` }
  

  
  
>
  { modalTitle }
</IGRPModalDialogTitle>
  <IGRPModalDialogDescription
  name={ `modalDialogDescription1` }
  

  
  
>
  { modalSubTitle }
</IGRPModalDialogDescription>
</IGRPModalDialogHeader>
  <IGRPForm
  schema={ form1 }
  validationMode={ `onBlur` }
  gridClassName={ `grid grid-cols-4` }
formRef={ formform1Ref }
  className={ cn('',) }
  onSubmit={ (e) => {} }
  defaultValues={ form1Data }
>
  <>
  <div className={ cn('grid','grid-cols-1 ','md:grid-cols-1 ','lg:grid-cols-1 ',' gap-4',)}    >
	<IGRPCombobox
  name={ `user` }
  label={ `Utilizador` }
variant={ `single` }
placeholder={ `Select an option...` }
selectLabel={ `No option found` }
showSearch={ true }
showIcon={ false }
iconName={ `CornerDownRight` }



  className={ cn('col-span-1',) }
  onChange={ () => {} }
  options={ selectuserOptions }
>
</IGRPCombobox>
<IGRPTextarea
  name={ `note` }
  
label={ `Nota` }
rows={ 3 }
required={ false }


  className={ cn('col-span-1',) }
  
  
>
</IGRPTextarea></div>
</>
</IGRPForm>
  <IGRPModalDialogFooter
  className={ cn('',) }
  
  
>
  <IGRPModalDialogClose
  name={ `modalDialogClose1` }
  

  onClick={ () => {} }
  
>
  Close
</IGRPModalDialogClose>
  <IGRPButton
  name={ `button1` }
  
variant={ `default` }
size={ `default` }
showIcon={ false }

  onClick={ () => {} }
  
>
  Submeter
</IGRPButton>
</IGRPModalDialogFooter>
</IGRPModalDialogContent>
</IGRPModalDialog></div>
  );
}