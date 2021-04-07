package umm3601.contextpack;

import java.util.ArrayList;

import io.javalin.http.NotFoundResponse;

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
    this.misc.removeIf(misc -> (misc.word.equals(word)));
  }


  public void addWord(ArrayList<String> posArray, String pos){
    Word newWord = new Word();
    newWord.word = posArray.get(0);
    newWord.forms = posArray;

    switch(pos){
      case "noun":
        this.nouns.add(newWord);
        break;
      case "misc":
        this.misc.add(newWord);
        break;
      case "verb":
        this.verbs.add(newWord);
        break;
      case "adj":
        this.adjectives.add(newWord);
        break;
      default:
      throw new NotFoundResponse("The requested wordlist was not found");
    }
  }










}

