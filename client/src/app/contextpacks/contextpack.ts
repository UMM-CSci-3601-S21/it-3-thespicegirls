export interface Word{
  word?: string;
  forms?: string[];
}
export interface Wordlist {
  _id: string;

  topic: string;
  enabled: boolean;
  nouns?: Word[];
  verbs?: Word[];
  adjectives?: Word[];
  misc?: Word[];
}

