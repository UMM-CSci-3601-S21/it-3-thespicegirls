
export interface Learner {
  _id: string;
  creator: string;
  name: string;
  assignedContextPacks: string[];
  disabledWordlists: string[];
}
