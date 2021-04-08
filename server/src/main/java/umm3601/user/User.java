package umm3601.user;

import org.mongojack.Id;
import org.mongojack.ObjectId;

public class User {

  @ObjectId @Id
  public String _id;

 public String email;
 public boolean emailVerified;
 public String name;
 public String pictureUrl;
 public String locale;
 public String familyName;
 public String givenName;
 public String sub;
 public Boolean admin;
}
