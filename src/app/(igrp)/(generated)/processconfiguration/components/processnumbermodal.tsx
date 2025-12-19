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
	IGRPInputText,
	IGRPCombobox,
	IGRPModalDialogFooter,
	IGRPButton 
} from "@igrp/igrp-framework-react-design-system";

export default function Processnumbermodal({ open, setOpen, formData, onFormChange, onSave } : { open: boolean, setOpen: (prompt: boolean) => void, formData: any, onFormChange: (field: any, value: any) => void, onSave: (data: any) => void }) {


  
  const form1 = z.object({
    prefix: z.string().nonempty(),
    dateFormat: z.string().nonempty(),
    checkdigit: z.string().nonempty()
})

type Form1ZodType = typeof form1;

const initForm1: z.infer<Form1ZodType> = {
    prefix: ``,
    dateFormat: ``,
    checkdigit: ``
}


  const formform1Ref = useRef<IGRPFormHandle<Form1ZodType> | null>(null);
  const [form1Data, setForm1Data] = useState<any>(initForm1);
  const [selectdateFormatOptions, setSelectdateFormatOptions] = useState<IGRPOptionsProps[]>([]);
  const [selectcheckdigitOptions, setSelectcheckdigitOptions] = useState<IGRPOptionsProps[]>([]);
  
const { igrpToast } = useIGRPToast()

/* BEGIN-NOSIRESERVED-AREA */
  // Load combobox options on component mount
  useEffect(() => {
    setSelectdateFormatOptions([
      { label: 'YYYY', value: 'yyyy' },
      { label: 'YYYYMM', value: 'yyyyMM' },
      { label: 'YYYYMMDD', value: 'yyyyMMdd' },
      { label: 'DDMMYYYY', value: 'ddMMyyyy' },
      { label: 'MMDDYYYY', value: 'MMddyyyy' },
    ]);

    setSelectcheckdigitOptions([
      { label: '2', value: '2' },
      { label: '3', value: '3' },
      { label: '4', value: '4' },
    ]);
  }, []);
  
  // Update form data when formData prop changes
  useEffect(() => {
    if (formData) {
      const updatedData = {
        prefix: formData.prefix || '',
        dateFormat: formData.dateFormat || '',
        checkdigit: formData.checkDigit + '' || '',
      };
      setForm1Data(updatedData);
      formform1Ref.current?.reset(updatedData);
    }
  }, [formData]); 

  const handleSubmit = async (data: any) => {
    // Map form data to ProcessNumberConfig format
    const processNumberData = {
      prefix: data.prefix,
      dateFormat: data.dateFormat,
      checkDigit: data.checkdigit,
    };

    // Call onSave with the mapped data
    if (onSave) await onSave(processNumberData);
  };
  /* END-NOSIRESERVED-AREA */


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
  Número Processo
</IGRPModalDialogTitle>
  <IGRPModalDialogDescription
  id={ `modalDialogDescription1` }
  
  
  
>
  Configure o formato do número do processo especificando um prefixo, formato de data e comprimento do dígito verificador
</IGRPModalDialogDescription>
</IGRPModalDialogHeader>
  <IGRPForm
  schema={ form1 }
  validationMode={ `onBlur` }
formRef={ formform1Ref }
  className={ cn('',) }
  onSubmit={ async (data) => await handleSubmit(data) }
  defaultValues={ form1Data }
>
  <>
  <div className={ cn('grid','grid-cols-1 ','md:grid-cols-1 ','lg:grid-cols-1 ',' gap-4',)}    >
	<IGRPInputText
  id={ `prefix` }
  label={ `Prefixo` }
showIcon={ false }
required={ true }
  className={ cn('col-span-1',) }
  
  
>
</IGRPInputText>
<IGRPCombobox
  id={ `dateFormat` }
  label={ `Data Formato` }
variant={ `single` }
placeholder={ `Select an option...` }
required={ true }
selectLabel={ `No option found` }
showSearch={ true }
showIcon={ false }
iconName={ `CornerDownRight` }
  className={ cn('col-span-1',) }
  onChange={ () => {} }
  options={ selectdateFormatOptions }
>
</IGRPCombobox>
<IGRPCombobox
  id={ `checkdigit` }
  label={ `Check Digit` }
variant={ `single` }
placeholder={ `Select an option...` }
required={ true }
selectLabel={ `No option found` }
showSearch={ true }
showIcon={ false }
iconName={ `CornerDownRight` }
  className={ cn('col-span-1',) }
  onChange={ () => {} }
  options={ selectcheckdigitOptions }
>
</IGRPCombobox></div>
</>
</IGRPForm>
  <IGRPModalDialogFooter
  className={ cn('',) }
  
  
>
  <IGRPButton
  id={ `button1` }
  variant={ `default` }
size={ `default` }
showIcon={ false }
  onClick={ () => formform1Ref.current?.submit() }
  
>
  Gravar
</IGRPButton>
</IGRPModalDialogFooter>
</IGRPModalDialogContent>
</IGRPModalDialog></div>
  );
}