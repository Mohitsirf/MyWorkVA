export interface User {
  id: number;
  first_name: string;
  last_name: string;
  grace_period: boolean;
  email: string;
  meta: any;
  stripe_plan: Plan | null;
  updated_at: string;
  created_at: string;
}

export enum Plan {
  PRO_MONTHLY = 'vaetas_pro_monthly',
  PRO_ANNUAL = 'vaetas_pro_annual'
}
