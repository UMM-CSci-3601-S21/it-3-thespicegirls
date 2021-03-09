export interface Word{
  word?: string;
  forms?: string[];
}
export interface Wordlist{
  _id?: string;
  topic?: string;
  enabled?: boolean;
  nouns?: Word[];
  adjectives?: Word[];
  verbs?: Word[];
  misc?: Word[];
}

export interface ContextPack {
  _id: string;
  name: string;
  enabled: boolean;
  wordlist: Wordlist[];
}
