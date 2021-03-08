package umm3601.contextpack;

import java.util.ArrayList;

import org.mongojack.Id;
import org.mongojack.ObjectId;

public class Wordlist {
  @ObjectId @Id
  public String _id;

  public String topic;
  public boolean enabled;
  public ArrayList<Word> nouns;
  public ArrayList<Word> adjectives;
  public ArrayList<Word> verbs;
  public ArrayList<Word> misc;

}

