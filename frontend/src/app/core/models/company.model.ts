export interface Company {
  id: string;
  ownerId?: string;
  name: string;
  description?: string;
  website?: string;
  industry?: string;
  size?: string;
  email?: string;
  phone?: string;
  isVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}