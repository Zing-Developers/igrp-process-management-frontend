'use client';

/* THIS FILE WAS GENERATED AUTOMATICALLY BY iGRP STUDIO. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { use, useState, useEffect, useRef } from 'react';
import { cn, useIGRPMenuNavigation, useIGRPToast } from '@igrp/igrp-framework-react-design-system';
import { ProcessList } from '@/app/(myapp)/processconfiguration/components/process-list';
import {
  IGRPModalDialog,
  IGRPModalDialogContent,
  IGRPModalDialogHeader,
  IGRPModalDialogTitle,
  IGRPModalDialogDescription,
  IGRPInputSearch,
} from '@igrp/igrp-framework-react-design-system';

export default function Processmodal({
  availableProcesses,
  onAssociate,
  onClose,
  open,
  setOpen,
  modalDescription,
}: {
  availableProcesses: any[];
  onAssociate: (processKey: string) => void;
  onClose: () => void;
  open: boolean;
  setOpen: (prompt: boolean) => void;
  modalDescription?: string;
}) {
  const { igrpToast } = useIGRPToast();

  const [searchTerm, setSearchTerm] = useState('');
  const filteredProcesses = availableProcesses
    ? availableProcesses.filter(
        (process) =>
          process.processKey?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          process.statusDesc?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : [];

  return (
    <div className={cn('component')}>
      <IGRPModalDialog onOpenChange={setOpen} open={open}>
        <IGRPModalDialogContent size={`xl`} className={cn()}>
          <IGRPModalDialogHeader className={cn('')}>
            <IGRPModalDialogTitle  className={cn('', 'overflow-visible')}>
              Associar Processo
            </IGRPModalDialogTitle>
            <IGRPModalDialogDescription
            ></IGRPModalDialogDescription>
          </IGRPModalDialogHeader>
          <>
            <IGRPInputSearch
              name={`inputSearch1`}
              label={undefined}
              showStartIcon={true}
              startIcon={`Search`}
              submitIcon={`ArrowRight`}
              required={false}
              placeholder={`Encontrar Processos...`}
              setValueChange={(e) => setSearchTerm(e)}
              value={searchTerm}
            ></IGRPInputSearch>
            <ProcessList
              availableProcesses={availableProcesses}
              processes={filteredProcesses}
              onAssociate={onAssociate}
            ></ProcessList>
          </>
        </IGRPModalDialogContent>
      </IGRPModalDialog>
    </div>
  );
}
