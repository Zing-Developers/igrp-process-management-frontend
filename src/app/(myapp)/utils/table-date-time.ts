type DateTimeValue = string | number | Date | null | undefined;

const toTimestamp = (value: DateTimeValue): number | null => {
  if (value === null || value === undefined || value === "") return null;

  const timestamp = new Date(value).getTime();
  return Number.isNaN(timestamp) ? null : timestamp;
};

export const formatTableDateTime = (value: DateTimeValue): string => {
  const timestamp = toTimestamp(value);
  if (timestamp === null) return "-";

  return new Intl.DateTimeFormat("pt-PT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).format(timestamp);
};

export const compareTableDateTimes = (
  left: DateTimeValue,
  right: DateTimeValue,
): number => {
  const leftTimestamp = toTimestamp(left);
  const rightTimestamp = toTimestamp(right);

  if (leftTimestamp === null && rightTimestamp === null) return 0;
  if (leftTimestamp === null) return -1;
  if (rightTimestamp === null) return 1;

  return leftTimestamp - rightTimestamp;
};
