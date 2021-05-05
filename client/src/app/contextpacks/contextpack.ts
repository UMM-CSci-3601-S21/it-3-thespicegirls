
export interface Word{
  word?: string;
  forms?: string[];
  pos?: string;
  pack?: string;
  wordlist?: string;
}
export interface Wordlist{
  name?: string;
  enabled?: boolean;
  nouns?: Word[];
  adjectives?: Word[];
  verbs?: Word[];
  misc?: Word[];
  pack?: ContextPack;

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
