package umm3601.learner;

import java.util.ArrayList;

import javax.persistence.Id;

import org.mongojack.ObjectId;

public class Learner {

  @Id @ObjectId
  public String _id;

  //to be used in future updates - indicates which user created the learner
  public String userId;
  public String userName;

  public String name;
  public ArrayList<String> assignedContextPacks;
  public ArrayList<String> disabledWordlists;
}
