export type IssueLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface InspectionIssue {
  id: string;
  questionId: string;
  comment: string;
  level: IssueLevel;
  evidenceUrl?: string;
  createdAt: string;
}

export interface FoodConsumption {
  groupId: string;
  groupName: string;
  stats: {
    percentage: 100 | 75 | 50 | 25 | 0;
    count: number;
  }[];
  evidenceUrl?: string; // Mandatory for 0% and 25% if issues exist
}

export interface Inspection {
  id: string;
  type: 'KITCHEN' | 'WAREHOUSE' | 'SANITARY' | 'SAMPLES';
  inspectorId: string;
  status: 'DRAFT' | 'COMPLETED';
  progress: number;
  issues: InspectionIssue[];
  foodConsumption?: FoodConsumption[];
  createdAt: string;
  updatedAt: string;
}
