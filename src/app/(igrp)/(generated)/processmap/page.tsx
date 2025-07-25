'use client'

/* THIS FILE WAS GENERATED AUTOMATICALLY BY iGRP STUDIO. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { use, useState, useEffect, useRef } from 'react';
import { cn, useIGRPMenuNavigation, useIGRPToast } from '@igrp/igrp-framework-react-design-system';
import { 
  IGRPPageHeader 
} from "@igrp/igrp-framework-react-design-system";


export default function PageProcessmapComponent() {


  
  
  
const { igrpToast } = useIGRPToast()


  return (
<div className={ cn('page','space-y-6',)}    >
	<div className={ cn('section',' space-x-6 space-y-6',)}    >
	<IGRPPageHeader
  name={ `pageHeader1` }
  title={ `Mapa de Processos` }
  description={ `Visualize processos organizados por área, subárea e projeto` }
  iconBackButton={ `Search` }
  variant={ `h3` }
  
>
  <div className="flex items-center gap-2">
</div>
</IGRPPageHeader>
</div></div>
  );
}
