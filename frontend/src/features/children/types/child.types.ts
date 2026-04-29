export interface Child {
  id: string;
  first_name: string;
  last_name: string;
  birth_date: string;
  age_category: string;
  gender: 'M' | 'F';
  passport_info?: string;
  birth_certificate_number: string;
  medical_notes?: string;
  status: 'DRAFT' | 'PENDING' | 'ACTIVE';
  father: Parent;
  mother: Parent;
  parent_account?: ParentAccount;
  group_name?: string;
  group_teacher?: string;
  created_at: string;
}

export interface Parent {
  id: string;
  full_name: string;
  workplace?: string;
  phone: string;
  role: 'FATHER' | 'MOTHER';
}

export interface ParentAccount {
  id: string;
  login: string;
  status: string;
}
