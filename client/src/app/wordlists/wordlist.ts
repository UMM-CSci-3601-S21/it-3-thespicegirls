import { Word } from './word';

export interface Wordlist {
  _id: string;

  topic: string;
  enabled: boolean;
  nouns: string[];
  verbs: string[];
  adjectives: string[];
  misc: string[];
}
