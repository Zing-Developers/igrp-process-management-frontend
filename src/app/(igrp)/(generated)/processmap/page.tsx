'use client'

/* THIS FILE WAS GENERATED AUTOMATICALLY BY iGRP STUDIO. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { use, useState, useEffect, useRef } from 'react';
import { cn, useIGRPMenuNavigation, useIGRPToast } from '@igrp/igrp-framework-react-design-system';
import {ProcessTreeComponent} from '@/app/(myapp)/processmap/components/process-tree-node'
import ProcessDetail from '@/app/(igrp)/(generated)/processmap/components/processdetail'
import PriorityModal from '@/components/prioritymodal'
import { 
  IGRPPageHeader,
	IGRPInputSearch 
} from "@igrp/igrp-framework-react-design-system";
import {useProcessMap} from '@/app/(myapp)/processmap/hooks/use-process-map'
import { useRouter } from 'next/navigation'


export default function PageProcessmapComponent() {


  
  
  
const { igrpToast } = useIGRPToast()

/*---------------------------------Reserved area begin------------------------------*/
const router = useRouter()
const pm = useProcessMap( router);
/*---------------------------------Reserved area end------------------------------*/


  return (
<div className={ cn('page','space-y-6',)}    >
	<IGRPPageHeader
  name={ `pageHeader1` }
  title={ `Mapa de Processos` }
  description={ `Visualize processos organizados por área e subárea` }
  iconBackButton={ `Search` }
  variant={ `h3` }
  className={ cn() }
  
>
  <div className="flex items-center gap-2">
</div>
</IGRPPageHeader>

<IGRPInputSearch
  name={ `inputSearch1` }
  label={ undefined }
showStartIcon={ true }
startIcon={ `Search` }
submitIcon={ `ArrowRight` }
required={ false }
showSubmitButton={ false }
placeholder={ `Procurar por processos...` }
  className={ cn() }
  setValueChange={ pm.setSearchTerm }
  value={ pm.searchTerm }
>
</IGRPInputSearch>
<ProcessTreeComponent  nodes={ pm.filteredNodes } expandedNodes={ pm.expandedNodes } searchTerm={ pm.searchTerm } onStartProcess={ pm.startProcess }  onToggle={ pm.toggleNode }
onViewDetails={ pm.detailModal.open } ></ProcessTreeComponent>
<ProcessDetail  open={ pm.detailModal.isOpen } process={ pm.detailModal.process }  setOpen={ pm.detailModal.setOpen } ></ProcessDetail>
<PriorityModal  open={ pm.priorityModal.isOpen } modalTitle={ pm.priorityModal.modalTitle } modalSubTitle={ pm.priorityModal.modalSubTitle }  setOpen={ pm.priorityModal.setOpen }
onSave={ pm.priorityModal.onSave } ></PriorityModal></div>
  );
}
