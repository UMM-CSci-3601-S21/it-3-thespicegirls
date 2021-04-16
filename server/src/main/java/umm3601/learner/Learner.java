package umm3601.learner;

import java.util.ArrayList;

import javax.persistence.Id;

import org.mongojack.ObjectId;

import umm3601.contextpack.ContextPack;

public class Learner {

  @Id @ObjectId
  public String _id;

  //to be used in future updates - indicates which user created the learner
  public String creator;

  public String name;
  public ArrayList<ContextPack> assignedContextPacks;
}
