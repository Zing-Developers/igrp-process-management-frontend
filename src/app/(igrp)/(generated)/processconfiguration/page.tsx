'use client'

/* THIS FILE WAS GENERATED AUTOMATICALLY BY iGRP STUDIO. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { use, useState, useEffect, useRef } from 'react';
import { cn, useIGRPMenuNavigation, useIGRPToast } from '@igrp/igrp-framework-react-design-system';
import { IGRPDataTableFacetedFilterFn , IGRPDataTableDateRangeFilterFn } from "@igrp/igrp-framework-react-design-system";
import { IGRPDataTableHeaderSortToggle, IGRPDataTableHeaderSortDropdown, IGRPDataTableHeaderRowsSelect } from "@igrp/igrp-framework-react-design-system";
import { 
  IGRPPageHeader,
	IGRPButton,
	IGRPDataTable 
} from "@igrp/igrp-framework-react-design-system";


export default function PageProcessconfigurationComponent() {


  const [contentTabletable1, setContentTabletable1] = useState<any[]>([]);
  
  
const { igrpToast } = useIGRPToast()


  return (
<div className={ cn('page','space-y-6',)}    >
	<div className={ cn('section',' space-x-6 space-y-6',)}    >
	<IGRPPageHeader
  name={ `pageHeader1` }
  title={ `Configuração do Processo` }
  description={ `Gerencie áreas, subáreas e projetos do sistema` }
  iconBackButton={ `Search` }
  variant={ `h3` }
  
>
  <div className="flex items-center gap-2">
</div>
</IGRPPageHeader>
</div>
<div className={ cn('section',' space-x-6 space-y-6',)}    >
	<IGRPButton
  name={ `button1` }
  
variant={ `default` }
size={ `default` }
showIcon={ false }
iconName={ `Plus` }

  className={ cn() }
  onClick={ () => {} }
  
>
  Nova Área
</IGRPButton></div>
<div className={ cn('section',)}    >
	<IGRPDataTable<any, any>
  columns={
    [
        {
          header: 'Área'
,accessorKey: 'tableTextCell1',
          cell: ({ row }) => {
          return row.getValue("tableTextCell1")
          },
          filterFn: IGRPDataTableFacetedFilterFn
        },
        {
          header: 'Sub-área'
,accessorKey: 'tableTextCell2',
          cell: ({ row }) => {
          return row.getValue("tableTextCell2")
          },
          filterFn: IGRPDataTableFacetedFilterFn
        },
        {
          header: 'Processo'
,accessorKey: 'tableTextCell3',
          cell: ({ row }) => {
          return row.getValue("tableTextCell3")
          },
          filterFn: IGRPDataTableFacetedFilterFn
        },
]
  }
  clientFilters={
    [
    ]
  }
  
  data={ contentTabletable1 }
/></div></div>
  );
}
