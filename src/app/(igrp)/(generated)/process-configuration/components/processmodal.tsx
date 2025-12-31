'use client'

/* THIS FILE WAS GENERATED AUTOMATICALLY BY iGRP STUDIO. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { use, useState, useEffect, useRef } from 'react';
import { cn, useIGRPMenuNavigation, useIGRPToast } from '@igrp/igrp-framework-react-design-system';
import { 
  IGRPModalDialog,
	IGRPModalDialogContent,
	IGRPModalDialogHeader,
	IGRPModalDialogTitle,
	IGRPModalDialogDescription,
	IGRPInputSearch 
} from "@igrp/igrp-framework-react-design-system";

export default function Processmodal({ availableProcesses, onAssociate, onClose, open, setOpen, modalDescription } : { availableProcesses: any[], onAssociate: (processKey: string) => void, onClose: () => void, open: boolean, setOpen: (prompt: boolean) => void, modalDescription?: string }) {


  
  
  
const { igrpToast } = useIGRPToast()

const [searchTerm, setSearchTerm] = useState('')
const filteredProcesses = availableProcesses ? availableProcesses.filter(process =>
  process.processKey?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  process.statusDesc?.toLowerCase().includes(searchTerm.toLowerCase())
) : []


  return (
<div className={ cn('component',)}    >
	<IGRPModalDialog
  onOpenChange={ setOpen }
  open={ open }
>
  <IGRPModalDialogContent
  size={ `xl` }
  className={ cn() }
  
  
>
  <IGRPModalDialogHeader
  className={ cn('',) }
  
  
>
  <IGRPModalDialogTitle
  id={ `modalDialogTitle1` }
  
  className={ cn('','overflow-visible',) }
  
  
>
  Associar Processo
</IGRPModalDialogTitle>
  <IGRPModalDialogDescription
  id={ `modalDialogDescription1` }
  
  
  
>
</IGRPModalDialogDescription>
</IGRPModalDialogHeader>
  <     >
	<IGRPInputSearch
  id={ `inputSearch1` }
  label={ undefined }
showStartIcon={ true }
startIcon={ `Search` }
submitIcon={ `ArrowRight` }
required={ false }
placeholder={ `Encontrar Processos...` }
  setValueChange={ (e) => setSearchTerm(e) }
  value={ searchTerm }
>
</IGRPInputSearch>
<div className="relative inline-block">
  <div
      style={
        {
          background: 'repeating-linear-gradient(45deg, black, black 10px, yellow 10px, yellow 20px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }
      }
      className=""
  >
      <span className="relative text-red-500 px-2 py-1 rounded">ProcessList</span>
  </div>
</div></>
</IGRPModalDialogContent>
</IGRPModalDialog></div>
  );
}