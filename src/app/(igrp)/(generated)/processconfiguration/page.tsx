'use client';

/* THIS FILE WAS GENERATED AUTOMATICALLY BY iGRP STUDIO. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { use, useState, useEffect, useRef } from 'react';
import { cn, useIGRPMenuNavigation, useIGRPToast } from '@igrp/igrp-framework-react-design-system';
import { AreasList } from '@/app/(myapp)/processconfiguration/components/areas-list';
import { ArtifactProcessesList } from '@/app/(myapp)/processconfiguration/components/artifact-processes-list';
import AreaModal from '@/app/(igrp)/(generated)/processconfiguration/components/areamodal';
import ProcessModal from '@/app/(igrp)/(generated)/processconfiguration/components/processmodal';
import ArtifactModal from '@/app/(igrp)/(generated)/processconfiguration/components/artifactmodal';
import ProcessNumberModal from '@/app/(igrp)/(generated)/processconfiguration/components/processnumbermodal';
import {
  IGRPPageHeader,
  IGRPTabs,
  IGRPTabItem,
  IGRPInputSearch,
  IGRPButton,
  IGRPAlertDialog,
} from '@igrp/igrp-framework-react-design-system';
import { useProcessConfiguration } from '@/app/(myapp)/processconfiguration/hooks/use-process-configuration';

export default function PageProcessconfigurationComponent() {
  const [tabstabs1Items, setTabstabs1Items] = useState<IGRPTabItem[]>([]);

  const { igrpToast } = useIGRPToast();
 
  /*---------------------------------Reserved area begin------------------------------*/
  const pc = useProcessConfiguration();
  /*---------------------------------Reserved area end------------------------------*/

  return (
    <div className={cn('page', 'space-y-6')}>
      <IGRPPageHeader
        name={`pageHeader1`}
        title={`Configuração do Processo`}
        description={`Gerencie áreas, subáreas e processos do sistema`}
        iconBackButton={`Search`}
        variant={`h3`}
        className={cn('')}
      >
        <div className="flex items-center gap-2"></div>
      </IGRPPageHeader>

      <IGRPTabs
        variant={`default`}
        tabContentClassName={`border rounded-lg border-transparent-none`}
        iconPlacement={`start`}
        tabListClassName={cn('')}
        items={[
          {
            value: `tab_area`,
            label: `Área e Subáreas`,
            icon: `AlarmClockOff`,
            content: (
              <>
                <div className={cn('flex flex-row flex-wrap items-center justify-between gap-2')}>
                  <div className={cn(' flex-1 min-w-[240px]')}>
                    <IGRPInputSearch
                      name={`inputSearch1`}
                      label={undefined}
                      showStartIcon={true}
                      startIcon={`Search`}
                      submitIcon={`ArrowRight`}
                      required={false}
                      className={cn()}
                      setValueChange={pc.setSearchTerm}
                      value={pc.searchTerm}
                    ></IGRPInputSearch>
                  </div>
                  <div className={cn('flex', 'block')}>
                    <IGRPButton
                      name={`button1`}
                      variant={`default`}
                      size={`default`}
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
                </div>
                <AreasList
                  areas={pc.filteredAreas}
                  expandedAreas={pc.expansion.expandedAreas}
                  areaProcesses={pc.areaProcesses}
                  onEdit={pc.areaForm.openModal}
                  onDelete={pc.areaOperations.handleDeleteArea}
                  onAddProcess={pc.handleOpenProcessModal}
                  onRemoveProcess={pc.processOperations.handleRemoveProcess}
                  onToggleExpansion={pc.expansion.handleToggleExpansion}
                  onAddSubarea={(parentAreaId) => pc.areaForm.openModal(undefined, parentAreaId)}
                ></AreasList>
              </>
            ),
          },
          {
            value: `tab_artifato`,
            label: `Artifatos`,
            icon: `ArrowRight`,
            content: (
              <>
                <ArtifactProcessesList
                  processes={pc.allProcesses}
                  onArtifactEdit={(processId) => pc.handleOpenArtifactModal(processId)}
                  onProcessNumberEdit={(processId, processKey, processApplicationBase) =>
                    pc.handleOpenProcessNumberModal(processId, processKey, processApplicationBase ?? '')
                  }
                ></ArtifactProcessesList>
              </>
            ),
          },
        ]}
      />
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
      <ArtifactModal
        open={pc.artifactForm.modalState.isOpen}
        processArtifacts={pc.processArtifacts}
        formData={pc.artifactForm.formData}
        setOpen={(open) =>
          open
            ? pc.handleOpenArtifactModal(pc.artifactForm.modalState.selectedProcessId || '')
            : pc.artifactForm.closeModal()
        }
        onFormChange={pc.artifactForm.updateFormData}
        onSave={pc.handleSaveArtifacts}
      ></ArtifactModal>
      <ProcessNumberModal
        open={pc.processNumberForm.modalState.isOpen}
        formData={pc.processNumberForm.formData}
        setOpen={(open) =>
          open
            ? pc.handleOpenProcessNumberModal(
                pc.processNumberForm.modalState.selectedProcessId || '',
                pc.processNumberForm.modalState.selectedProcessKey || '',
                pc.processNumberForm.modalState.selectedProcessApplicationBase || '',
              )
            : pc.processNumberForm.closeModal()
        }
        onFormChange={pc.processNumberForm.updateFormData}
        onSave={pc.handleSaveProcessNumber}
      ></ProcessNumberModal>
      <IGRPAlertDialog
        variant={`primary`}
        actionLabel={`Confirm`}
        cancelLabel={`Cancel`}
        showCancel={true}
        actionProps={{
          variant: `default`,
          size: `default`,
          disabled: false,
        }}
        cancelProps={{
          variant: `default`,
          size: `default`,
          disabled: false,
        }}
        className={cn()}
        onOpenChange={(open) => !open && pc.alertDialog.area.hideAlert()}
        onCancel={pc.alertDialog.area.handleCancel}
        onAction={pc.alertDialog.area.handleConfirm}
        description={pc.alertDialog.area.alertState.description}
        title={pc.alertDialog.area.alertState.title}
        open={pc.alertDialog.area.alertState.isOpen}
      >
        <></>
      </IGRPAlertDialog>

      <IGRPAlertDialog
        variant={`primary`}
        actionLabel={`Confirm`}
        cancelLabel={`Cancel`}
        showCancel={true}
        actionProps={{
          variant: `default`,
          size: `default`,
          disabled: false,
        }}
        cancelProps={{
          variant: `default`,
          size: `default`,
          disabled: false,
        }}
        className={cn()}
        onOpenChange={(open) => !open && pc.alertDialog.process.hideAlert()}
        onCancel={pc.alertDialog.process.handleCancel}
        onAction={pc.alertDialog.process.handleConfirm}
        title={pc.alertDialog.process.alertState.title}
        description={pc.alertDialog.process.alertState.description}
        open={pc.alertDialog.process.alertState.isOpen}
      >
        <></>
      </IGRPAlertDialog>
    </div>
  );
}
