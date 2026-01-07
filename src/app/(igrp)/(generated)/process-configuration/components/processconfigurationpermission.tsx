'use client'

/* THIS FILE WAS GENERATED AUTOMATICALLY BY iGRP STUDIO. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { use, useState, useEffect, useRef } from 'react';
import { cn, useIGRPMenuNavigation, useIGRPToast } from '@igrp/igrp-framework-react-design-system';
import {LoadingPage} from '@/app/(myapp)/components/loading-page'
import { 
  IGRPModalDialog,
	IGRPModalDialogContent,
	IGRPModalDialogHeader,
	IGRPModalDialogTitle,
	IGRPModalDialogDescription,
	IGRPAlert,
	IGRPText,
	IGRPRepetitiveComponent,
	IGRPHeadline,
	IGRPInputText,
	IGRPModalDialogFooter,
	IGRPButton 
} from "@igrp/igrp-framework-react-design-system";

export default function Processconfigurationpermission({ open, setOpen, processArtifacts, onSave, onFormChange, formData, isSubmiting } : { open: boolean, setOpen: (prompt: boolean) => void, processArtifacts: any, onSave: () => void, onFormChange: (artifactKey: string, formKey: string) => void, formData: any, isSubmiting?: boolean }) {


  
  
  const [repetitiveListrepetitiveList1, setRepetitiveListrepetitiveList1] = useState<any[]>([]);
  
const { igrpToast } = useIGRPToast()

// Load processArtifacts into repetitive list when modal opens or artifacts change
  useEffect(() => {
    if (open && processArtifacts && Array.isArray(processArtifacts)) {
      setRepetitiveListrepetitiveList1(processArtifacts);
    } else {
      setRepetitiveListrepetitiveList1([]);
    }
  }, [open, processArtifacts]);


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
  Configurar Permissões
</IGRPModalDialogTitle>
  <IGRPModalDialogDescription
  id={ `modalDialogDescription1` }
  
  
  
>
  Configure os grupos de candidatos para cada tarefa do processo
</IGRPModalDialogDescription>
</IGRPModalDialogHeader>
  <IGRPAlert
  color={ `info` }
  variant={ `soft` }
  textColored={ true }
  borderColored={ true }
  bgColored={ true }
  showIcon={ true }
  linkIcon={ `ArrowRight` }
  className={ cn('',) }
  
>
  <>
    <IGRPText
  id={ `text1` }
  variant={ `primary` }
weight={ `normal` }
size={ `sm` }
align={ `left` }
spacing={ `normal` }
maxLines={ 1 }
  
  
>
  Separe os grupos por vírgula (ex: admin,manager,user)
</IGRPText>
</>
</IGRPAlert>

  <IGRPRepetitiveComponent<any>
  id={ `repetitiveList1` }
  keyExtractor={ (item) => item.id }
  items={ repetitiveListrepetitiveList1 }
>
{ (item) =>
  <>
  <div className={ cn('flex flex-row flex-nowrap items-center justify-start gap-4',' space-y-1 mb-4',)}    >
	<IGRPHeadline
  id={ `headline1` }
  variant={ `h6` }
roleColor={ `solid` }
color={ `primary` }
showIcon={ false }
  className={ cn() }
  
  title={ item.name }
description={ item.key }
>
</IGRPHeadline>
<IGRPInputText
  id={ `Name` }
  label={ undefined }
showIcon={ false }
required={ false }
disabled={ false }
placeholder={ `admin,manager,user` }
  className={ cn('w-full flex-1',) }
  onChange={ (e)=>onFormChange?.(item.key, e.target.value) }
  value={ item.candidateGroups }
>
</IGRPInputText></div>
</>
}
</IGRPRepetitiveComponent>

  <LoadingPage  isLoading={ processArtifacts.length === 0 }   ></LoadingPage>
  <IGRPModalDialogFooter
  className={ cn('','',) }
  
  
>
  <div className={ cn('flex','flex-1','flex flex-row flex-nowrap items-stretch justify-end gap-2',)}    >
	<IGRPButton
  id={ `button2` }
  variant={ `default` }
size={ `default` }
showIcon={ false }
  className={ cn() }
  onClick={ onSave }
  disabled={ isSubmiting }
>
  Gravar
</IGRPButton></div>
</IGRPModalDialogFooter>
</IGRPModalDialogContent>
</IGRPModalDialog></div>
  );
}