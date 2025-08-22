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
	IGRPModalDialogTrigger,
	IGRPButton,
	IGRPModalDialogFooter,
	IGRPModalDialogClose 
} from "@igrp/igrp-framework-react-design-system";

export default function Artifactmodal({  } : {  }) {

  
  
  
const { igrpToast } = useIGRPToast()


  return (
<div className={ cn('component',)}    >
	<IGRPModalDialog
  
  
>
  <IGRPModalDialogContent
  size={ `md` }
  
  
>
  <IGRPModalDialogHeader
  
  
>
  <IGRPModalDialogTitle
  name={ `modalDialogTitle1` }
  

  
  
>
  Configurar Artifatos 
</IGRPModalDialogTitle>
  <IGRPModalDialogDescription
  name={ `modalDialogDescription1` }
  

  
  
>
  Lorem ipsum dolor sit amet
</IGRPModalDialogDescription>
</IGRPModalDialogHeader>
  <     ></>
</IGRPModalDialogContent>
  <IGRPModalDialogTrigger
  name={ `modalDialogTrigger1` }
  variant={ `default` }
size={ `default` }


  onClick={ () => {} }
  
>
  <IGRPButton
  name={ `button1` }
  
variant={ `default` }
size={ `default` }


  onClick={ () => {} }
  
>
  Button
</IGRPButton>
  <IGRPModalDialogFooter
  
  
>
  <IGRPModalDialogClose
  name={ `modalDialogClose1` }
  

  onClick={ () => {} }
  
>
  Close
</IGRPModalDialogClose>
</IGRPModalDialogFooter>
</IGRPModalDialogTrigger>
</IGRPModalDialog></div>
  );
}