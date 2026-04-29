export interface Staff {
  id: string;
  full_name: string;
  position: string;
  phone: string;
  email?: string;
  passport_no: string;
  group_id?: string;
  group_name?: string;
  child_count?: number;
  status: 'ACTIVE' | 'INACTIVE';
  created_at: string;
}
