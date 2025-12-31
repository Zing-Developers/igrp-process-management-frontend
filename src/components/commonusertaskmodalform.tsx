"use client";

/* THIS FILE WAS GENERATED AUTOMATICALLY BY iGRP STUDIO. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { use, useState, useEffect, useRef } from "react";
import {
  cn,
  useIGRPMenuNavigation,
  useIGRPToast,
} from "@igrp/igrp-framework-react-design-system";
import { IGRPFormHandle } from "@igrp/igrp-framework-react-design-system";
import { z } from "zod";
import { IGRPOptionsProps } from "@igrp/igrp-framework-react-design-system";
import {
  IGRPModalDialog,
  IGRPModalDialogContent,
  IGRPModalDialogHeader,
  IGRPModalDialogTitle,
  IGRPModalDialogDescription,
  IGRPForm,
  IGRPRadioGroup,
  IGRPCombobox,
  IGRPInputText,
  IGRPTextarea,
  IGRPModalDialogFooter,
  IGRPButton,
} from "@igrp/igrp-framework-react-design-system";
import { PRIORITY_OPTIONS } from "../app/(myapp)/enum/priority";

export default function Commonusertaskmodalform({
  open,
  setOpen,
  onSave,
  modalTitle,
  modalSubTitle,
  userRequired,
  showPriority,
}: {
  open: boolean;
  setOpen: (prompt: boolean) => void;
  onSave: (data: any) => void;
  modalTitle: string;
  modalSubTitle: string;
  userRequired?: boolean;
  showPriority?: boolean;
}) {
  const form1 = z.object({
    user: z.string().optional(),
    candidateGroups: z.string().optional(),
    priority: z.string().optional(),
    note: z.string().optional(),
  });

  type Form1ZodType = typeof form1;

  const initForm1: z.infer<Form1ZodType> = {
    user: ``,
    candidateGroups: ``,
    priority: ``,
    note: ``,
  };

  const formform1Ref = useRef<IGRPFormHandle<Form1ZodType> | null>(null);
  const [form1Data, setForm1Data] = useState<any>(initForm1);
  const [radioatribuirTaskOptions, setRadioatribuirTaskOptions] = useState<
    IGRPOptionsProps[]
  >([]);
  const [selectuserOptions, setSelectuserOptions] = useState<
    IGRPOptionsProps[]
  >([]);
  const [selectpriorityOptions, setSelectpriorityOptions] = useState<
    IGRPOptionsProps[]
  >([]);

  const [atribuirTask, setAtribuirTask] = useState<string>("user");

  const { igrpToast } = useIGRPToast();

  useEffect(() => {
    // Populate select options with dummy data
    const dummyUsers = [
      { value: "demo@nosi.cv	", label: "demo@nosi.cv" },
      { value: "igrp@nosi.cv", label: "igrp@nosi.cv" },
      { value: "Sistema", label: "Sistema" },
    ];
    setSelectpriorityOptions(PRIORITY_OPTIONS);
    setSelectuserOptions(dummyUsers);

    setRadioatribuirTaskOptions([
      { value: "user", label: "Utilizador" },
      { value: "group", label: "Grupo" },
    ]);

    setAtribuirTask("user");
  }, []);

  return (
    <div className={cn("component")}>
      <IGRPModalDialog onOpenChange={setOpen} open={open}>
        <IGRPModalDialogContent size={`xl`} className={cn()}>
          <IGRPModalDialogHeader className={cn("")}>
            <IGRPModalDialogTitle id={`modalDialogTitle1`}>
              {modalTitle}
            </IGRPModalDialogTitle>
            <IGRPModalDialogDescription id={`modalDialogDescription1`}>
              {modalSubTitle}
            </IGRPModalDialogDescription>
          </IGRPModalDialogHeader>
          <IGRPForm
            schema={form1}
            validationMode={`onBlur`}
            formRef={formform1Ref}
            className={cn("")}
            onSubmit={async (data) => {
              onSave({ ...data, assigneTo: atribuirTask });
            }}
            defaultValues={form1Data}
          >
            <>
              <div
                className={cn(
                  "grid",
                  "grid-cols-1 ",
                  "md:grid-cols-1 ",
                  "lg:grid-cols-1 ",
                  " gap-4",
                )}
              >
                {userRequired && (
                  <IGRPRadioGroup
                    id={`atribuirTask`}
                    dir={`ltr`}
                    orientation={`horizontal`}
                    variant={`default`}
                    size={`md`}
                    gridSize={`default`}
                    label={`Atruibuir tarefa a:`}
                    required={true}
                    className={cn("col-span-1")}
                    onValueChange={(e) => {
                      setAtribuirTask(e);
                    }}
                    options={radioatribuirTaskOptions}
                  ></IGRPRadioGroup>
                )}
                {userRequired && atribuirTask === "user" && (
                  <IGRPCombobox
                    id={`user`}
                    label={`Utilizador`}
                    variant={`single`}
                    placeholder={`Select an option...`}
                    required={true}
                    selectLabel={`No option found`}
                    showSearch={true}
                    showIcon={false}
                    iconName={`CornerDownRight`}
                    className={cn("col-span-1")}
                    onChange={() => {}}
                    options={selectuserOptions}
                  ></IGRPCombobox>
                )}
                {atribuirTask === "group" && (
                  <IGRPInputText
                    id={`candidateGroups`}
                    label={`Grupo`}
                    showIcon={false}
                    required={true}
                    className={cn("col-span-1")}
                  ></IGRPInputText>
                )}
                {showPriority && (
                  <IGRPCombobox
                    id={`priority`}
                    label={`Prioridade`}
                    variant={`single`}
                    placeholder={`Select an option...`}
                    required={false}
                    selectLabel={`No option found`}
                    showSearch={true}
                    showIcon={false}
                    iconName={`CornerDownRight`}
                    className={cn("col-span-1")}
                    onChange={() => {}}
                    options={selectpriorityOptions}
                  ></IGRPCombobox>
                )}
                <IGRPTextarea
                  id={`note`}
                  label={`Nota`}
                  rows={3}
                  required={false}
                  className={cn("col-span-1")}
                ></IGRPTextarea>
              </div>
            </>
          </IGRPForm>
          <IGRPModalDialogFooter className={cn("")}>
            <div
              className={cn(
                "flex",
                "flex-1",
                "flex flex-row flex-nowrap items-stretch justify-end gap-2",
              )}
            >
              <IGRPButton
                id={`button1`}
                variant={`default`}
                size={`default`}
                showIcon={false}
                className={cn()}
                onClick={() => formform1Ref.current?.submit()}
              >
                Submeter
              </IGRPButton>
            </div>
          </IGRPModalDialogFooter>
        </IGRPModalDialogContent>
      </IGRPModalDialog>
    </div>
  );
}
