import { useState } from "react";
import { AreaFormData, AreaModalState } from "../../types";
import { Area } from "@igrp/platform-process-management-types";

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
  });

  const openModal = (area?: Area, parentAreaId?: string) => {
    if (area) {
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
