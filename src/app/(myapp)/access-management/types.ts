export interface Application {
  code: string;
  name: string;
  slug?: string | null;
  url?: string | null;
}

export interface ApplicationResponse<T> {
  data: T;
}

export interface AccessManagementClient {
  applications: {
    getApplications(): Promise<ApplicationResponse<Application[]>>;
    getApplicationByCode(
      code: string,
    ): Promise<ApplicationResponse<Application>>;
  };
}
