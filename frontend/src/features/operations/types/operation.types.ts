export interface Operation {
  id: string;
  operation_type: 'CREATE' | 'UPDATE' | 'DELETE';
  entity_type: 'CHILD' | 'STAFF' | 'GROUP';
  entity_name: string;
  description: string;
  created_at: string;
}
