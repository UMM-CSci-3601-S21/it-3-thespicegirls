import { Wordlist } from '../wordlists/wordlist';

export interface ContextPack {
  name: string;
  enabled: boolean;
  k: Wordlist;
}
