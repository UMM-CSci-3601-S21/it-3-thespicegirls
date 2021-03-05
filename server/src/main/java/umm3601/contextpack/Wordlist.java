package umm3601.contextpack;

import java.util.ArrayList;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
@JsonIgnoreProperties(ignoreUnknown=true)

public class Wordlist {
  boolean enabled;
  ArrayList<Pos> nouns;
  ArrayList<Pos> adjectives;
  ArrayList<Pos> verbs;
  ArrayList<Pos> misc;



}
