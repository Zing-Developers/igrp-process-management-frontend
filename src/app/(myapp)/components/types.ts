export interface RecentProcess {
  processDefinitionId: string;
  title: string;
  category: string;
  version: string;
}

export interface RecentTask {
  id: string;
  name: string;
  description: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
}
