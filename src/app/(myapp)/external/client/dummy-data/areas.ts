import { Area, PaginatedResponse } from '@/app/(myapp)/external/types/area';

export const dummyAreas: Area[] = [
  {
    id: '1',
    code: 'HR001',
    name: 'Human Resources',
    description: 'HR Platform',
    areaId: '',
    process: [
      {
        id: '770e8400-e29b-41d4-a716-446655440222',
        processKey: 'onboarding',
        name: 'Onboarding Process',
        description: 'Onboarding Process',
        releaseId: 'rel-2023-01',
        areaId: '1',
        status: 'ACTIVE',
        statusDesc: 'Publicado',
        version: '1.0.0',
        createdAt: '2024-06-01T12:00:00',
        createdBy: 'admin',
        removedAt: null,
        removedBy: null,
      },
    ],
    createdAt: '2024-06-01T12:00:00',
    updatedAt: '2024-07-01T15:45:00',
    createdBy: 'admin',
    updatedBy: 'hr_manager',
  },
  {
    id: '2',
    code: 'TECH',
    name: 'Tecnologia',
    description: 'Área de Tecnologia da Informação',
    areaId: '',
    process: [
      {
        id: 'tech-process-1',
        processKey: 'software_development',
        name: 'Desenvolvimento de Software',
        description: 'Desenvolvimento de Software',
        releaseId: 'rel-2024-01',
        areaId: '2',
        status: 'ACTIVE',
        statusDesc: 'Ativo',
        version: '2.0.0',
        createdAt: '2024-01-01T00:00:00Z',
        createdBy: 'tech_lead',
        removedAt: null,
        removedBy: null,
      },
      {
        id: 'tech-process-2',
        processKey: 'code_review',
        name: 'Code Review',
        description: 'Code Review',
        releaseId: 'rel-2024-02',
        areaId: '2',
        status: 'ACTIVE',
        statusDesc: 'Ativo',
        version: '1.5.0',
        createdAt: '2024-02-01T00:00:00Z',
        createdBy: 'tech_lead',
        removedAt: null,
        removedBy: null,
      },
    ],
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '3',
    code: 'TECH_DEV',
    name: 'Desenvolvimento',
    description: 'Subárea de Desenvolvimento de Software',
    areaId: '2',
    process: [
      {
        id: 'dev-process-1',
        processKey: 'feature_development',
        name: 'Feature Development',
        description: 'Feature Development',
        releaseId: 'rel-2024-03',
        areaId: '3',
        status: 'ACTIVE',
        statusDesc: 'Ativo',
        version: '1.0.0',
        createdAt: '2024-03-01T00:00:00Z',
        createdBy: 'dev_manager',
        removedAt: null,
        removedBy: null,
      },
    ],
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '4',
    code: 'TECH_INFRA',
    name: 'Infraestrutura',
    description: 'Subárea de Infraestrutura de TI',
    areaId: '2',
    process: [],
    createdAt: '2024-01-01T00:00:00Z',
  },
];

export const createDummyArea = (areaData: any): Area => ({
  id: `area_${Date.now()}`,
  code: areaData.code,
  name: areaData.name,
  description: areaData.description,
  areaId: areaData.area_id,
  process: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

export const createDummyUpdatedArea = (id: string, areaData: any): Area => ({
  id,
  code: areaData.code || 'UPDATED_CODE',
  name: areaData.name || 'Updated Area',
  description: areaData.description,
  areaId: areaData.area_id,
  process: [],
  updatedAt: new Date().toISOString(),
});

export const getDummyAreaById = (id: string): Area => ({
  id,
  code: 'SAMPLE_CODE',
  name: 'Sample Area',
  description: 'Sample area description',
  process: [],
  createdAt: '2024-01-01T00:00:00Z',
});

export const getDummySubareas = (parentAreaId: string): Area[] =>
  dummyAreas.filter((area) => area.areaId === parentAreaId);

export const getDummyAreasPaginated = (
  page = 0,
  size = 20,
  parentId?: string,
): PaginatedResponse<Area> => {
  // Filter areas based on parentId
  const filteredAreas = parentId
    ? getDummySubareas(parentId)
    : dummyAreas.filter((area) => !area.areaId); // Top-level areas only when no parentId
  console.log('filteredAreas', filteredAreas);
  return {
    content: filteredAreas,
    totalElements: filteredAreas.length,
    totalPages: Math.ceil(filteredAreas.length / size),
    pageSize: size,
    pageNumber: page,
    first: page === 0,
    last: page >= Math.ceil(filteredAreas.length / size) - 1,
    empty: filteredAreas.length === 0,
  };
};
