package umm3601.contextpack;


import org.mongojack.Id;
import org.mongojack.ObjectId;

import java.util.ArrayList;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown=true)

public class ContextPack {
  @ObjectId @Id
  public String _id;
  public String $schema = "https://raw.githubusercontent.com/kidstech/story-builder/master/Assets/packs/schema/pack.schema.json";

  public String name;
  public String icon;
  public boolean enabled;
  public ArrayList<Wordlist> wordlists;

}



