'use client'

/* THIS FILE WAS GENERATED AUTOMATICALLY BY iGRP STUDIO. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useRef } from 'react';
import { cn, useIGRPMenuNavigation, useIGRPToast } from '@igrp/igrp-framework-react-design-system';
import { IGRPFormHandle } from "@igrp/igrp-framework-react-design-system";
import { z } from "zod"
import { ProcessItem } from '@/app/(myapp)/config/components/process-item'
import { AddChecklistItem } from '@/app/(myapp)/config/components/add-checklist-item'
import { AddItem } from '@/app/(myapp)/config/components/add-item'
import {
  IGRPPageHeader,
  IGRPForm,
  IGRPCard,
  IGRPCardHeader,
  IGRPHeadline,
  IGRPCardContent,
  IGRPRepetitiveComponent,
  IGRPTabs,
  IGRPTabItem,
  IGRPSeparator,
  IGRPCardFooter,
  IGRPButton
} from "@igrp/igrp-framework-react-design-system";
import { useProcessConfiguration } from '@/app/(myapp)/process-configuration/use-process-configuration'


export default function PageConfigComponent() {



  z.config(z.locales.en());

  const form1 = z.object({
  })

  type Form1ZodType = typeof form1;

  const initForm1: z.infer<Form1ZodType> = {
  }


  const [form1Data, setForm1Data] = useState<any>(initForm1);
  const formform1Ref = useRef<IGRPFormHandle<Form1ZodType> | null>(null);

  const [selectedProcess, setSelectedProcess] = useState<any | undefined>(undefined);

  const { igrpToast } = useIGRPToast()
  const { allProcesses, assignGroups } = useProcessConfiguration();

  const [newGroupInput, setNewGroupInput] = useState('');

  const handleAddGroup = (value: string) => {
    const trimmed = value?.trim();
    if (!trimmed) return;
    const current = assignGroups.form.getValues('groups') || '';
    const next = current ? `${current}, ${trimmed}` : trimmed;
    assignGroups.form.setValue('groups', next);
    setNewGroupInput('');
  };

  const handleSaveConfiguration = async () => {
    if (!selectedProcess?.id) {
      igrpToast({ type: 'error', title: 'Erro', description: 'Selecione um processo.' });
      return;
    }
    await assignGroups.handleAssignGroupsToProcess(
      selectedProcess.id,
      assignGroups.form.getValues('groups') ?? '',
    );
  };

  const groupsString = assignGroups.form.watch('groups') ?? '';
  const candidateGroupsList = groupsString.split(',').map((s) => s.trim()).filter(Boolean);

  const handleAddGroupToChecklist = (group: string) => {
    if (!candidateGroupsList.includes(group)) {
      assignGroups.form.setValue('groups', [...candidateGroupsList, group].join(', '));
    }
  };

  const handleRemoveGroupFromChecklist = (group: string) => {
    assignGroups.form.setValue(
      'groups',
      candidateGroupsList.filter((g) => g !== group).join(', '),
    );
  };


  return (
    <div className={cn('page', 'space-y-6',)}    >
      <div className={cn('section', ' space-y-6',)}    >
        <IGRPPageHeader
          id={`pageHeader1`}
          title={`Process Configuration`}
          description={`Configure process numbering, candidate groups, and task settings`}
          iconBackButton={`Settings`}
          showBackButton={true}
          urlBackButton={`/#`}
          variant={`h3`}

        >
          <div className="flex items-center gap-2">
          </div>
        </IGRPPageHeader>

        <IGRPForm
          schema={form1}
          validationMode={`onBlur`}
          formRef={formform1Ref}
          onSubmit={() => { }}
          defaultValues={form1Data}
        >
          <>
            <div className={cn('grid', 'lg:grid-cols-4 ', ' gap-4',)}    >
              <div className={cn('col-span-1 flex flex-col gap-6 ',)}    >
                <IGRPCard
                  id={`card1`}

                  className={cn()}


                >
                  <IGRPCardHeader

                  >
                    <IGRPHeadline
                      id={`headline2`}
                      title={`Processes`}
                      description={`Select a process to configure`}
                      variant={`h6`}
                      roleColor={`solid`}
                      color={`primary`}
                      showIcon={false}


                    >
                    </IGRPHeadline>
                  </IGRPCardHeader>
                  <IGRPCardContent
                    className={cn('space-y-4 px-0', 'space-x-3', 'space-y-3',)}

                  >
                    <IGRPRepetitiveComponent<any>
                      id={`repetitiveList1`}
                      keyExtractor={(item) => item.id}
                      items={allProcesses}
                    >
                      {(item) =>
                        <>
                          <ProcessItem process={item} selectedProcess={selectedProcess} setSelectedProcess={() => setSelectedProcess(item)
                          } ></ProcessItem>
                        </>
                      }
                    </IGRPRepetitiveComponent>

                  </IGRPCardContent>
                </IGRPCard></div>
              <div className={cn('col-span-1 flex flex-col gap-6 ', 'md:col-span-3 flex flex-col gap-6 ', 'lg:col-span-3 flex flex-col gap-6 ', 'xl:col-span-3 flex flex-col gap-6 ',)}    >
                {selectedProcess?.name && (<IGRPHeadline
                  id={`headline1`}
                  variant={`h6`}
                  roleColor={`solid`}
                  color={`primary`}
                  showIcon={false}
                  className={cn()}

                  title={selectedProcess?.name}
                  description={selectedProcess?.processKey + ' - ' + selectedProcess?.version}
                >
                </IGRPHeadline>)}
                <IGRPTabs
                  variant={`default`}
                  tabContentClassName={`space-y-4`}
                  showIcon={true}
                  iconPlacement={`start`}
                  contentBorder={true}
                  badgePlacement={`end`}
                  orientation={`horizontal`}


                  tabListClassName={cn()}
                  items={
                    [

                      {
                        value: `tabsItem1-bwOE`,
                        label: `General Settings`,
                        icon: `Settings2`,
                        badgeVariant: `solid`,
                        badgeColor: `primary`,
                        content: (<>
                          <IGRPCard
                            id={`card2`}

                            className={cn()}


                          >
                            <IGRPCardHeader

                            >
                              <IGRPHeadline
                                id={`headline3`}
                                title={`Process-Level Candidate Groups`}
                                description={`Groups that have access to this process. These groups apply to all tasks unless overridden at the task level.`}
                                variant={`h6`}
                                roleColor={`solid`}
                                color={`primary`}
                                showIcon={false}


                              >
                              </IGRPHeadline>
                            </IGRPCardHeader>
                            <IGRPCardContent
                              className={cn('space-y-4', 'space-x-3', 'space-y-3',)}

                            >
                              <IGRPSeparator
                                id={`separator2`}
                                orientation={`horizontal`}


                              >
                              </IGRPSeparator>
                              <AddChecklistItem
                              label="Available Groups"
                              value=""
                              placeholder=""
                              availableItems={[]}
                              config={{ candidateGroups: candidateGroupsList }}
                              addItem={handleAddGroupToChecklist}
                              removeItem={handleRemoveGroupFromChecklist}
                            />
                              <IGRPSeparator
                                id={`separator1`}
                                orientation={`horizontal`}


                              >
                              </IGRPSeparator>
                              <AddItem
                label="Add Custom Group"
                placeholder="Enter group name..."
                value={newGroupInput}
                setValue={setNewGroupInput}
                addItem={handleAddGroup}
              />
                            </IGRPCardContent>
                          </IGRPCard>
                          <IGRPCard
                            id={`card3`}

                            className={cn()}


                          >
                            <IGRPCardHeader

                            >
                              <IGRPHeadline
                                id={`headline4`}
                                title={`Priority Options`}
                                description={`Define the priority levels available for tasks in this process. Each option has a label and numeric value.`}
                                variant={`h6`}
                                roleColor={`solid`}
                                color={`primary`}
                                showIcon={false}


                              >
                              </IGRPHeadline>
                            </IGRPCardHeader>
                            <IGRPCardContent
                              className={cn('space-y-4', 'space-x-3', 'space-y-3',)}

                            >
                            </IGRPCardContent>
                            <IGRPCardFooter

                            >
                            </IGRPCardFooter>
                          </IGRPCard>
                        </>),
                      },

                      {
                        value: `tabsItem2-niex`,
                        label: `Process Numbering`,
                        icon: `Hash`,
                        badgeVariant: `solid`,
                        badgeColor: `primary`,
                        content: (<>
                          <IGRPCard
                            id={`card4`}

                            className={cn()}


                          >
                            <IGRPCardHeader

                            >
                              <IGRPHeadline
                                id={`headline5`}
                                title={`Process Numbering Configuration`}
                                description={`Configure how process instance numbers are generated. Example: LOAN-2026-001`}
                                variant={`h6`}
                                roleColor={`solid`}
                                color={`primary`}
                                showIcon={false}


                              >
                              </IGRPHeadline>
                            </IGRPCardHeader>
                            <IGRPCardContent
                              className={cn('space-y-4', 'space-x-3', 'space-y-3',)}

                            >
                            </IGRPCardContent>
                            <IGRPCardFooter

                            >
                            </IGRPCardFooter>
                          </IGRPCard>
                        </>),
                      },

                      {
                        value: `tabsItem3-perT`,
                        label: `Task Configuration`,
                        icon: `Users`,
                        badgeVariant: `solid`,
                        badgeColor: `primary`,
                        content: (<>
                          <IGRPCard
                            id={`card5`}

                            className={cn()}


                          >
                            <IGRPCardHeader

                            >
                              <IGRPHeadline
                                id={`headline6`}
                                title={`User Tasks`}
                                description={`Configure candidate groups and settings for each task in this process`}
                                variant={`h6`}
                                roleColor={`solid`}
                                color={`primary`}
                                showIcon={false}


                              >
                              </IGRPHeadline>
                            </IGRPCardHeader>
                            <IGRPCardContent
                              className={cn('space-y-4', 'space-x-3', 'space-y-3',)}

                            >
                            </IGRPCardContent>
                            <IGRPCardFooter

                            >
                            </IGRPCardFooter>
                          </IGRPCard>
                        </>),
                      },
                    ]
                  }
                />
                <div className={cn('flex', ' flex justify-end gap-2',)}    >
                  <IGRPButton
                    id={`button2`}
                    variant={`secondary`}
                    size={`default`}
                    showIcon={false}
                    className={cn()}
                    onClick={() => { }}

                  >
                    Cancel
                  </IGRPButton>
                  <IGRPButton
                    id="button1"
                    variant="default"
                    size="default"
                    showIcon={false}
                    className={cn()}
                    onClick={handleSaveConfiguration}
                  >
                    Save Configuration
                  </IGRPButton></div></div></div>
          </>
        </IGRPForm></div></div>
  );
}
