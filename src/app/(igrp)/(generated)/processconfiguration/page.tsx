'use client';

/* THIS FILE WAS GENERATED AUTOMATICALLY BY iGRP STUDIO. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { use, useState, useEffect, useRef } from 'react';
import { cn, useIGRPMenuNavigation, useIGRPToast } from '@igrp/igrp-framework-react-design-system';
import { AreasList } from '@/app/(myapp)/processconfiguration/components/areas-list';
import AreaModal from '@/app/(igrp)/(generated)/processconfiguration/components/areamodal';
import ProcessModal from '@/app/(igrp)/(generated)/processconfiguration/components/processmodal';
import {
  IGRPPageHeader,
  IGRPButton,
  IGRPInputSearch,
} from '@igrp/igrp-framework-react-design-system';
import { useProcessConfiguration } from '@/app/(myapp)/processconfiguration/hooks/use-process-configuration';

export default function PageProcessconfigurationComponent() {
  const { igrpToast } = useIGRPToast();

  /*---------------------------------Reserved area begin------------------------------*/
  const pc = useProcessConfiguration();
  /*---------------------------------Reserved area end------------------------------*/

  return (
    <div className={cn('page', 'space-y-6')}>
      <div className={cn('section', ' space-x-6 space-y-6')}>
        <IGRPPageHeader
          name={`pageHeader1`}
          title={`Configuração do Processo`}
          description={`Gerencie áreas, subáreas e processos do sistema`}
          iconBackButton={`Search`}
          variant={`h3`}
          className={cn('')}
        >
          <div className="flex items-center gap-2">
            <IGRPButton
              name={`button1`}
              variant={`default`}
              size={`lg`}
              showIcon={true}
              iconName={`Plus`}
              className={cn()}
              onClick={() => {
                pc.areaForm.openModal();
              }}
            >
              Nova Área
            </IGRPButton>
          </div>
        </IGRPPageHeader>
      </div>
      <div className={cn('section', ' space-x-6 space-y-6')}></div>
      <div className={cn('section')}>
        <IGRPInputSearch
          name={`inputSearch1`}
          label={undefined}
          showStartIcon={true}
          startIcon={`Search`}
          submitIcon={`ArrowRight`}
          required={false}
          setValueChange={pc.setSearchTerm}
          value={pc.searchTerm}
        ></IGRPInputSearch>
        <AreasList
          areas={pc.filteredAreas}
          expandedAreas={pc.expansion.expandedAreas}
          onEdit={pc.areaForm.openModal}
          onDelete={pc.areaOperations.handleDeleteArea}
          onAddProcess={pc.processForm.openModal}
          onRemoveProcess={pc.processOperations.handleRemoveProcess}
          onToggleExpansion={(areaId) =>
            pc.expansion.toggleAreaExpansion(areaId, pc.areaOperations.loadSubareas)
          }
          onAddSubarea={(parentAreaId) => pc.areaForm.openModal(undefined, parentAreaId)}
        ></AreasList>
      </div>
      <AreaModal
        isEditing={!!pc.areaForm.modalState.editingArea}
        formData={pc.areaForm.formData}
        areas={pc.allAreasFlat}
        open={pc.areaForm.modalState.isOpen}
        setOpen={(open) => (open ? pc.areaForm.openModal() : pc.areaForm.closeModal())}
        onFormChange={pc.areaForm.setFormData}
        onSave={pc.areaForm.modalState.editingArea ? pc.handleUpdateArea : pc.handleCreateArea}
        onClose={pc.areaForm.closeModal}
      ></AreaModal>
      <ProcessModal
        availableProcesses={pc.getAvailableProcesses(
          pc.processForm.modalState.selectedAreaId || '',
        )}
        open={pc.processForm.modalState.isOpen}
        onAssociate={pc.handleAssociateProcess}
        onClose={pc.processForm.closeModal}
        setOpen={(open) =>
          open
            ? pc.processForm.openModal(pc.processForm.modalState.selectedAreaId || '')
            : pc.processForm.closeModal()
        }
      ></ProcessModal>
    </div>
  );
}
