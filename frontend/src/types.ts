import React from 'react';

export type UserRole = 
  | 'DIRECTOR' 
  | 'OPERATOR' 
  | 'STOREKEEPER' 
  | 'DIETITIAN'
  | 'KITCHEN_MANAGER' 
  | 'CHEF' 
  | 'LAB_CONTROLLER' 
  | 'TEACHER'
  | 'NURSE'
  | 'PARENT'
  | 'INSPECTOR'
  | 'PROFILES'
  | 'SUPPLY'
  | 'FINANCE';

export interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
}

export interface Child {
  id: number;
  name: string;
  allergy: string;
  diet: string;
  risk?: 'low' | 'medium' | 'high' | 'critical';
}

export interface Group {
  name: string;
  children: Child[];
}

export interface DishNutrition {
  kcal: number;
  proteins: number;
  fats: number;
  carbs: number;
  starch: number;
  vitamins: string;
}

export interface Dish {
  id: string;
  name: string;
  type: 'breakfast' | 'lunch' | 'tea' | 'dinner';
  ingredients: string[];
  image: string;
  tech_card: string[];
  nutrition: {
    '1-3': DishNutrition;
    '3-7': DishNutrition;
  };
}

export type KitchenStatus = 'BOSHLASH' | 'PISHIRILYAPTI' | 'TAYYOR' | 'SUZISHGA_TAYYOR';

export interface KitchenIngredient {
  name: string;
  amount: number;
  unit: string;
  inStock: boolean;
  expiryDate?: string;
  isUrgent?: boolean;
}

export interface KitchenTask {
  id: string;
  mealName: string;
  mealType: 'BREAKFAST' | 'LUNCH' | 'TEA' | 'DINNER';
  portions: number;
  dietPortions: number;
  originalPortions: number;
  status: KitchenStatus;
  chef?: string;
  startTime?: string;
  completedAt?: string;
  ingredients: KitchenIngredient[];
  alerts?: string[];
  temperatureRecords?: { time: string, temp: number }[];
  hygieneChecks?: { item: string, status: 'OK' | 'ISSUE' }[];
}

export type LabSampleStatus = 'COLLECTED' | 'STORED' | 'TESTED' | 'DISCARDED' | 'CRITICAL';
export type LabRiskLevel = 'NORMAL' | 'WARNING' | 'CRITICAL';

export interface LabSample {
  sample_id: string;
  dish_id: string;
  dish_name: string;
  batch_reference: string;
  date: string;
  storage_location: string;
  storage_duration: number;
  status: LabSampleStatus;
  lab_result?: string;
  risk_level: LabRiskLevel;
  notes?: string;
  created_by: string;
  timestamp: string;
  nutrition: {
    vitamins: string;
    starch: string;
    carbs: string;
    proteins: string;
    fats: string;
    calories: string;
    weight: string;
  };
}

export interface Batch {
  id: string;
  batchNumber: string;
  quantity: number;
  expiryDate: string;
  receivedDate: string;
  storageLocation: string;
  storageTemp: number;
  supplier: string;
}

export interface InventoryProduct {
  id: string;
  name: string;
  category: string;
  unit: string;
  batches: Batch[];
  minStock: number;
}

export interface Transaction {
  id: string;
  date: string;
  type: 'IN' | 'OUT';
  productName: string;
  quantity: number;
  unit: string;
}

export interface ParentUser {
  id: string;
  childName: string;
  fatherName: string;
  childGroup: string;
  login: string;
  password: string;
}

export type InspectionType = 'KITCHEN' | 'WAREHOUSE' | 'HYGIENE' | 'SAMPLE';
export type Severity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type AuditStatus = 'OPEN' | 'CLOSED';
export type ChecklistResult = 'OK' | 'ISSUE';

export interface ChecklistItem {
  id: string;
  question: string;
  result: ChecklistResult;
  issueNote?: string;
  severity?: Severity;
}

export interface FinanceLog {
  id: string;
  date: string;
  category: string;
  item: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
}

export type MenuItem = NavItem;

export interface AuditRecord {
  inspection_id: string;
  inspection_type: InspectionType;
  checklist_items: ChecklistItem[];
  overall_result: 'PASS' | 'FAIL' | 'WARNING';
  severity: Severity;
  notes: string;
  attachments: string[];
  created_by: string;
  created_at: string;
  follow_up_date?: string;
  status: AuditStatus;
  kitchen_metrics?: {
    cooking_temp?: number;
    serving_temp?: number;
    serving_time?: string;
  };
}
