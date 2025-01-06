export interface AssignmentType {
  category: string;
  name: string;
}

export interface OrderSection {
  id: string;
  title: string;
  isExpanded: boolean;
  value: string | null;
}
