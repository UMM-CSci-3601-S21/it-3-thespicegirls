import { Wordlist } from './wordlist';

export interface ContextPack {
  name: string;
  enabled: boolean;
  k: Wordlist;
}
