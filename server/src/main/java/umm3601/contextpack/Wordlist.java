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

  public void getWordIndex(){

  }

  public void deleteNoun(String word){
    this.nouns.removeIf(noun -> (noun.word.equals(word)));
  }






}

