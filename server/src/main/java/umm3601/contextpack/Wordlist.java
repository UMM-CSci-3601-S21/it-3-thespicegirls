package umm3601.contextpack;

import java.lang.reflect.Array;
import java.util.ArrayList;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
@JsonIgnoreProperties(ignoreUnknown=true)

public class Wordlist {
  public boolean enabled;
  Pos[] nouns;
  ArrayList<Pos> adjectives;
  ArrayList<Pos> verbs;
  ArrayList<Pos> misc;

  public boolean getEnabled() {
    return this.enabled;
  }

  public ArrayList<Pos> getAdjectives(){
    return this.adjectives;
  }

}

