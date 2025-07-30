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
  IGRPInputSearch,
} from '@igrp/igrp-framework-react-design-system';

export default function Processmodal({
  availableProcesses,
  onAssociate,
  onClose,
  open,
  setOpen,
}: {
  availableProcesses: any[];
  onAssociate: (processKey: string) => void;
  onClose: () => void;
  open: boolean;
  setOpen: (prompt: boolean) => void;
}) {
  const { igrpToast } = useIGRPToast();

  const [searchTerm, setSearchTerm] = useState('');
  const filteredProjects = availableProcesses
    ? availableProcesses.filter(
        (process) =>
          process.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          process.statusDesc?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : [];

  return (
    <div className={cn('component')}>
      <IGRPModalDialog onOpenChange={setOpen} open={open}>
        <IGRPModalDialogContent size={`md`} className={cn()}>
          <IGRPModalDialogHeader>
            <IGRPModalDialogTitle name={`modalDialogTitle1`} className={cn('', 'overflow-visible')}>
              Associar Projeto
            </IGRPModalDialogTitle>
          </IGRPModalDialogHeader>
          <>
            <IGRPInputSearch
              name={`inputSearch1`}
              label={undefined}
              showStartIcon={true}
              startIcon={`Search`}
              submitIcon={`ArrowRight`}
              required={false}
              placeholder={`Encontrar Projetos...`}
              setValueChange={(e) => setSearchTerm(e)}
              value={searchTerm}
            ></IGRPInputSearch>
            <ProcessList
              availableProcesses={availableProcesses}
              processes={filteredProjects}
              onAssociate={onAssociate}
            ></ProcessList>
          </>
        </IGRPModalDialogContent>
      </IGRPModalDialog>
    </div>
  );
}
