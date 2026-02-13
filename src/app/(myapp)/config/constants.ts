import type { IGRPOptionsProps } from "@igrp/igrp-framework-react-design-system";

export const DATE_FORMAT_OPTIONS: IGRPOptionsProps[] = [
  { label: "YYYY", value: "yyyy" },
  { label: "YYYYMM", value: "yyyyMM" },
  { label: "YYYYMMDD", value: "yyyyMMdd" },
  { label: "DDMMYYYY", value: "ddMMyyyy" },
  { label: "MMDDYYYY", value: "MMddyyyy" },
];

export const PRIORITY_OPTIONS: IGRPOptionsProps[] = [
  { label: "Low", value: "1", color: "#2E7D32" },
  { label: "Normal", value: "2", color: "#ED6C02" },
  { label: "Urgent", value: "3", color: "#B91C1C" },
];
