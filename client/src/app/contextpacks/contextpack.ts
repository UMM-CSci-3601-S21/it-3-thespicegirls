
export interface Word{
  word?: string;
  forms?: string[];
}
export interface Wordlist{
  name?: string;
  enabled?: boolean;
  nouns?: Word[];
  adjectives?: Word[];
  verbs?: Word[];
  misc?: Word[];

}

export interface ContextPack {
  _id: string;
  name: string;
  userId?: string;
  userName?: string;
  icon?: string;
  enabled: boolean;
  wordlists?: Wordlist[];

}


export type WordRole = 'nouns' | 'verbs' | 'adjectives' | 'misc';
