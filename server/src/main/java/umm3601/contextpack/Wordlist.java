package umm3601.contextpack;

import java.lang.reflect.Array;
import java.util.ArrayList;

import javax.persistence.Id;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import org.mongojack.ObjectId;
@JsonIgnoreProperties(ignoreUnknown=true)

public class Wordlist {
  @ObjectId @Id
  public String _id;

  public String topic;
  public boolean enabled;
  ArrayList<Pos> nouns;
  ArrayList<Pos> adjectives;
  ArrayList<Pos> verbs;
  ArrayList<Pos> misc;

  public boolean getEnabled() {
    return this.enabled;
  }

  public ArrayList<Pos> getAdjectives(){
    return this.adjectives;
  }
  public ArrayList<Pos> getVerbs(){
    return this.verbs;
  }
  public ArrayList<Pos> getMisc(){
    return this.misc;
  }
  public ArrayList<Pos> getNouns(){
    return this.nouns;
  }
  public String getTopic(){
    return this.topic;
  }

}

