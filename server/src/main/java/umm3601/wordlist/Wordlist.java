package umm3601.wordlist;

import java.util.ArrayList;
import java.util.List;

import javax.swing.text.Document;

import org.mongojack.Id;
import org.mongojack.ObjectId;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown=true)

public class Wordlist {

  public String name;
  public boolean enabled;
  public List<Word> verbs;
  public List<Word> nouns;
  public List<Word> adjetives;
  public List<Word> misc;

}


