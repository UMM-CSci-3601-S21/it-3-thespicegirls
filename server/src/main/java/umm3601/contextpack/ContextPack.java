package umm3601.contextpack;

import org.mongojack.Id;
import org.mongojack.ObjectId;

import java.util.ArrayList;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown=true)

public class ContextPack {
  @ObjectId @Id
  public String _id;
  public String userId;
  public String userName;
  public String name;
  public String icon;
  public boolean enabled;
  public ArrayList<Wordlist> wordlists;

  public void deleteWordlist(String name) {
    this.wordlists.removeIf(wordlist -> (wordlist.name.equals(name)));

  }
  public void addWordlist(String listname) {
    Wordlist list =  new Wordlist();
    list.name = listname;
    list.enabled =true;
    list.nouns = new ArrayList<Word>();
    list.misc =  new ArrayList<Word>();
    list.verbs =  new ArrayList<Word>();
    list.adjectives =  new ArrayList<Word>();
    this.wordlists.add(list);
  }



}



