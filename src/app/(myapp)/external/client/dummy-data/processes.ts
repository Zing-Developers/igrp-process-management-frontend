import { Process, ProcessInstance } from "../../types/process";
import { PaginatedResponse } from "../../types/response";

export const processes: Process[] = [
  // Human Resources processes
  {
    id: 'c396655e-850a-41d0-9280-90168ab6b8ea',
    processKey: 'vacation_request',
    name: 'Processo de Gestão de Férias',
    description: 'Este processo automatiza o pedido e a aprovação de férias dos colaboradores.',
    releaseId: 'rel-2023-01',
    areaId: '1', // HR area
    status: 'ACTIVE',
    statusDesc: 'Processo ativo e disponível',
    version: '1.0',
    createdAt: '2023-01-10T10:00:00Z',
    updatedAt: '2023-01-15T10:00:00Z',
    createdBy: 'admin',
    updatedBy: 'hr_manager',
    removedAt: null,
    removedBy: null,
  },
  {
    id: 'expense-approval-001',
    processKey: 'expense_approval',
    name: 'Processo de Aprovação de Despesas',
    description: 'Processo para aprovação de despesas corporativas.',
    releaseId: 'rel-2023-02',
    areaId: '1', // HR area
    status: 'ACTIVE',
    statusDesc: 'Processo ativo e disponível',
    version: '1.1',
    createdAt: '2023-02-15T14:30:00Z',
    updatedAt: '2023-02-20T14:30:00Z',
    createdBy: 'admin',
    updatedBy: 'finance_manager',
    removedAt: null,
    removedBy: null,
  },
  // Technology area processes
  {
    id: 'customer-support-001',
    processKey: 'customer_support',
    name: 'Processo de Atendimento ao Cliente',
    description: 'Processo para gestão de tickets de atendimento.',
    releaseId: 'rel-2023-03',
    areaId: '2', // Technology area
    status: 'ACTIVE',
    statusDesc: 'Processo ativo e disponível',
    version: '2.0',
    createdAt: '2023-03-20T09:00:00Z',
    updatedAt: '2023-03-25T09:00:00Z',
    createdBy: 'tech_lead',
    updatedBy: 'tech_lead',
    removedAt: null,
    removedBy: null,
  },
  {
    id: 'customer-feedback-001',
    processKey: 'customer_feedback',
    name: 'Processo de Feedback do Cliente',
    description: 'Coleta e análise de feedback dos clientes.',
    releaseId: 'rel-2023-04',
    areaId: '2', // Technology area
    status: 'ACTIVE',
    statusDesc: 'Processo ativo e disponível',
    version: '1.0',
    createdAt: '2023-04-10T11:00:00Z',
    updatedAt: '2023-04-15T11:00:00Z',
    createdBy: 'tech_lead',
    updatedBy: 'product_manager',
    removedAt: null,
    removedBy: null,
  },
  // Development subarea processes
  {
    id: 'financial-reports-001',
    processKey: 'financial_reports',
    name: 'Geração de Relatórios Financeiros',
    description: 'Processo automatizado para geração de relatórios financeiros.',
    releaseId: 'rel-2023-05',
    areaId: '3', // Development subarea
    status: 'INACTIVE',
    statusDesc: 'Processo inativo',
    version: '1.5',
    createdAt: '2023-05-15T16:00:00Z',
    updatedAt: '2023-05-20T16:00:00Z',
    createdBy: 'dev_manager',
    updatedBy: 'dev_manager',
    removedAt: '2023-06-01T16:00:00Z',
    removedBy: 'dev_manager',
  },
  {
    id: 'onboarding-001',
    processKey: 'employee_onboarding',
    name: 'Onboarding de Novo Colaborador',
    description: 'Processo para integração de novos colaboradores na empresa.',
    releaseId: 'rel-2023-06',
    areaId: '3', // Development subarea
    status: 'ACTIVE',
    statusDesc: 'Processo ativo e disponível',
    version: '2.0',
    createdAt: '2023-06-20T09:00:00Z',
    updatedAt: '2023-06-25T09:00:00Z',
    createdBy: 'dev_manager',
    updatedBy: 'hr_manager',
    removedAt: null,
    removedBy: null,
  },
  {
    id: 'performance-review-001',
    processKey: 'performance_review',
    name: 'Processo de Avaliação de Desempenho',
    description: 'Avaliação periódica de desempenho dos colaboradores.',
    releaseId: 'rel-2023-07',
    areaId: '3', // Development subarea
    status: 'ACTIVE',
    statusDesc: 'Processo ativo e disponível',
    version: '1.3',
    createdAt: '2023-07-10T14:00:00Z',
    updatedAt: '2023-07-15T14:00:00Z',
    createdBy: 'dev_manager',
    updatedBy: 'hr_manager',
    removedAt: null,
    removedBy: null,
  },
  // Infrastructure subarea processes
  {
    id: 'job-posting-001',
    processKey: 'job_posting',
    name: 'Processo de Publicação de Vagas',
    description: 'Publicação e gestão de vagas de emprego.',
    releaseId: 'rel-2023-08',
    areaId: '4', // Infrastructure subarea
    status: 'ACTIVE',
    statusDesc: 'Processo ativo e disponível',
    version: '1.0',
    createdAt: '2023-08-05T10:00:00Z',
    updatedAt: '2023-08-10T10:00:00Z',
    createdBy: 'infra_manager',
    updatedBy: 'hr_manager',
    removedAt: null,
    removedBy: null,
  },
  {
    id: 'candidate-selection-001',
    processKey: 'candidate_selection',
    name: 'Processo de Seleção de Candidatos',
    description: 'Triagem e seleção de candidatos para vagas.',
    releaseId: 'rel-2023-09',
    areaId: '4', // Infrastructure subarea
    status: 'ACTIVE',
    statusDesc: 'Processo ativo e disponível',
    version: '1.2',
    createdAt: '2023-08-20T15:30:00Z',
    updatedAt: '2023-08-25T15:30:00Z',
    createdBy: 'infra_manager',
    updatedBy: 'hr_manager',
    removedAt: null,
    removedBy: null,
  }
];

// Helper functions similar to areas.ts
export const getDummyProcessById = (id: string): Process | undefined => {
  return processes.find(p => p.id === id);
};

export const getDummyProcessesPaginated = (
  page = 0,
  size = 20
): PaginatedResponse<Process> => {
  const startIndex = page * size;
  const endIndex = startIndex + size;
  const paginatedProcesses = processes.slice(startIndex, endIndex);

  return {
    content: paginatedProcesses,
    totalElements: processes.length,
    totalPages: Math.ceil(processes.length / size),
    pageSize: size,
    pageNumber: page,
    first: page === 0,
    last: page >= Math.ceil(processes.length / size) - 1,
    empty: processes.length === 0,
  };
};

export const createDummyProcessInstance = (
  processDefinitionId: string,
  businessKey?: string,
  variables?: Record<string, any>
): ProcessInstance => {
  const process = getDummyProcessById(processDefinitionId);
  
  return {
    id: `pi_${Date.now()}`,
    processDefinitionId,
    processDefinitionName: process?.name || 'Unknown Process',
    businessKey,
    startDate: new Date().toISOString(),
    initiator: 'currentUser',
    status: 'RUNNING',
    startedBy: 'currentUser',
    variables,
  };
};
