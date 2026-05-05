export type UserTier = 'free' | 'pro';

export interface User {
  id: string;
  email: string;
  tier: UserTier;
  createdAt: string;
}
