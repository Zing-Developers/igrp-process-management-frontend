'use client'

/* THIS FILE WAS GENERATED AUTOMATICALLY BY iGRP STUDIO. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { use, useState, useEffect, useRef } from 'react';
import { cn, useIGRPMenuNavigation, useIGRPToast } from '@igrp/igrp-framework-react-design-system';
import {ProcessTreeComponent} from '@/app/(myapp)/process-map/components/process-tree-node'
import {LoadingPage} from '@/app/(myapp)/components/loading-page'
import { 
  IGRPPageHeader,
	IGRPTabs,
	IGRPTabItem,
	IGRPHeadline,
	IGRPInputSearch 
} from "@igrp/igrp-framework-react-design-system";
import { useRouter } from 'next/navigation'
import {useProcessMap} from '@/app/(myapp)/process-map/hooks/use-process-map'


export default function PageProcessmapComponent() {


  
  
  
const { igrpToast } = useIGRPToast()

/*---------------------------------Reserved area begin------------------------------*/
const router = useRouter()
const pm = useProcessMap( router);
/*---------------------------------Reserved area end------------------------------*/


  return (
<div className={ cn('page','space-y-6',)}    >
	<IGRPPageHeader
  id={ `pageHeader1` }
  title={ `Mapa de Processos` }
  description={ ` Navegue, gerencie e organize processos por áreas de negócio.` }
  iconBackButton={ `Map` }
  showBackButton={ true }
  variant={ `h3` }
  backButtonVariant={ `default` }
  backButtonSize={ `lg` }
  className={ cn() }
  
>
  <div className="flex items-center gap-2">
</div>
</IGRPPageHeader>

<IGRPTabs
  variant={ `default` }
  tabContentClassName={ `space-y-3` }
  showIcon={ true }
  iconPlacement={ `start` }
  contentBorder={ true }
  badgePlacement={ `end` }
  orientation={ `horizontal` }
  
  
  tabListClassName={ cn() }
  items={
      [
        
        {
          value: `tabsItem2-vy8A`,
          label: `Ver Mapa`,
          icon: `Eye`,
          badgeVariant: `solid`,
          badgeColor: `primary`,
content: (<>
            <IGRPHeadline
  id={ `headline1` }
  title={ `Mapa de Processo` }
description={ `Navegue pelos processos organizados por áreas.` }
variant={ `h6` }
roleColor={ `solid` }
color={ `primary` }
showIcon={ true }
iconName={ `Map` }
  className={ cn() }
  
  
>
</IGRPHeadline>
            <IGRPInputSearch
  id={ `inputSearch1` }
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
            { !pm.loading && (<ProcessTreeComponent  nodes={ pm.filteredNodes } expandedNodes={ pm.expandedNodes } searchTerm={ pm.searchTerm } onStartProcess={ pm.startProcess }  onToggle={ pm.toggleNode }
onViewDetails={ pm.detailModal.open } ></ProcessTreeComponent>)}
            <LoadingPage  isLoading={ pm.loading }   ></LoadingPage>
</>),
        },
        
        {
          value: `tabsItem1-IAqL`,
          label: `Gerir Área`,
          icon: `Settings`,
          badgeVariant: `solid`,
          badgeColor: `primary`,
content: (<>
</>),
        },
      ]
  }
/></div>
  );
}
