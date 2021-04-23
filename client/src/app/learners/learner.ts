
export interface Learner {
  _id: string;
  userName?: string;
  userId?: string;
  name: string;
  assignedContextPacks: string[];
  disabledWordlists: string[];
}
