export interface PriorityOption {
  value: string;
  label: string;
}

export const PRIORITY_OPTIONS: PriorityOption[] = [
  { value: '1', label: 'Prioridade Muito Alta' },
  { value: '2', label: 'Prioridade Alta' },
  { value: '3', label: 'Prioridade Média' },
  { value: '4', label: 'Prioridade Baixa' },
  { value: '5', label: 'Prioridade Muito Baixa' },
];

export enum Priority {
  MUITO_ALTA = '1',
  ALTA = '2',
  MEDIA = '3',
  BAIXA = '4',
  MUITO_BAIXA = '5',
}

export const getPriorityLabel = (value: string): string => {
  const option = PRIORITY_OPTIONS.find(opt => opt.value === value);
  return option?.label || 'Prioridade Desconhecida';
};