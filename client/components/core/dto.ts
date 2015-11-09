export interface Todo {
  id?: string;
  title?: string;
  status?: string;
  createdAt?: number;
}

export interface Contact {
  id?: string;
  email?: string;
  name?: string;
  website?: string;
  industry?: any;
  city?: any;
  createdBy?: any;
  createdAt?: Date;
  updatedAt?: Date;
}