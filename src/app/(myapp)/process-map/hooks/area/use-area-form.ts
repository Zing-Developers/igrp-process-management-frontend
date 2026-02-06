import { useState } from "react";
import { AreaFormData, AreaModalState, ExtendedArea } from "../../types";
import { Process } from "@igrp/platform-process-management-types";

export function useAreaForm() {
  const [modalState, setModalState] = useState<AreaModalState>({
    isOpen: false,
    editingArea: null,
  });

  const [formData, setFormData] = useState<AreaFormData>({
    code: "",
    name: "",
    description: "",
    applicationBase: "",
    parentId: undefined, // Changed from area_fk to area_id
    processes: [],
  });

  const openModal = (area?: ExtendedArea, parentAreaId?: string) => {
    if (area) {
      const processes = area.process
        ?.filter((process) => process.status === "ACTIVE")
        .map((process) => ({
          ...process,
          processKey: process.processKey,
          name: process.name,
          releaseId: process.id,
          version: process.version.toString(),
          key: process.processKey,
        }));

      setModalState({
        isOpen: true,
        editingArea: area,
        parentAreaId,
      });
      setFormData({
        code: area.code,
        name: area.name,
        description: area.description || "",
        applicationBase: area.applicationBase || "",
        parentId: area.areaId, // Changed from area_fk to area_id
        processes: processes || [],
      });
    } else {
      setModalState({
        isOpen: true,
        editingArea: null,
        parentAreaId,
      });
      setFormData({
        code: "",
        name: "",
        description: "",
        applicationBase: "",
        parentId: parentAreaId, // Changed from area_fk to area_id
        processes: [],
      });
    }
  };

  const closeModal = () => {
    setModalState({
      isOpen: false,
      editingArea: null,
    });
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      code: "",
      name: "",
      description: "",
      applicationBase: "",
      parentId: undefined, // Changed from area_fk to area_id
      processes: [],
    });
  };

  return {
    modalState,
    formData,
    setFormData,
    openModal,
    closeModal,
    resetForm,
  };
}
