package umm3601.contextpack;

import java.util.ArrayList;

public class Wordlist {
  public String name;
  public boolean enabled;
  public ArrayList<Word> nouns;
  public ArrayList<Word> adjectives;
  public ArrayList<Word> verbs;
  public ArrayList<Word> misc;


  public void setEnabled(boolean enabled){
    this.enabled=enabled;
  }
  public void setName(String name){
    this.name = name;
  }


  public void deleteNoun(String word){
    this.nouns.removeIf(noun -> (noun.word.equals(word)));
  }

  public void deleteVerb(String word){
    this.verbs.removeIf(verb -> (verb.word.equals(word)));
  }

  public void deleteAdj(String word){
    this.adjectives.removeIf(adj -> (adj.word.equals(word)));
  }

  public void deleteMisc(String word){
    this.adjectives.removeIf(misc -> (misc.word.equals(word)));
  }






}

