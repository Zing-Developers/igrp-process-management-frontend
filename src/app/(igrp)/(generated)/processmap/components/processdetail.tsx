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
	IGRPLabel,
	IGRPText 
} from "@igrp/igrp-framework-react-design-system";

export default function Processdetail({ open, setOpen, process } : { open: boolean, setOpen: (prompt: boolean) => void, process: any }) {

  
  
  
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
  Detalhes do Processo
</IGRPModalDialogTitle>
</IGRPModalDialogHeader>
  <     >
	<IGRPLabel
  name={ `label1` }
  label={ `Nome` }
required={ false }

  
  
>
</IGRPLabel>
<IGRPText
  name={ `name` }
  
variant={ `primary` }
weight={ `normal` }
size={ `default` }
align={ `left` }
spacing={ `normal` }
maxLines={ 3 }

  
  
>
  Lorem ipsum dolor sit amet
</IGRPText>
<IGRPLabel
  name={ `label2` }
  label={ `Descrição` }
required={ false }

  
  
>
</IGRPLabel>
<IGRPText
  name={ `description` }
  
variant={ `primary` }
weight={ `normal` }
size={ `default` }
align={ `left` }
spacing={ `normal` }
maxLines={ 3 }

  
  
>
  Lorem ipsum dolor sit amet
</IGRPText></>
</IGRPModalDialogContent>
</IGRPModalDialog></div>
  );
}