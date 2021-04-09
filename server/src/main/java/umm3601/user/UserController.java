package umm3601.user;

import static com.mongodb.client.model.Filters.eq;

import java.io.IOException;
import java.security.GeneralSecurityException;

import java.util.Collections;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken.Payload;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.google.common.collect.ImmutableMap;
import com.mongodb.client.MongoDatabase;

import org.mongojack.JacksonMongoCollection;

import io.javalin.http.BadRequestResponse;
import io.javalin.http.Context;



/**
 * Controller that manages requests for info about users.
 */
public class UserController {

  private final JacksonMongoCollection<User> userCollection;

  /**
   * Construct a controller for users.
   *
   * @param database the database containing user data
   */
  public UserController(MongoDatabase database) {
    userCollection = JacksonMongoCollection.builder().build(database, "users", User.class);
  }

  /**
   * Get the single user specified by the `id` parameter in the request.
   *
   * @param sub a string with users google ID
   * @return true or false based on if user exists in database
   */
  public User getUser(String sub) {
    String id = sub;
    User user;
    user = userCollection.find(eq("email", id)).first();
    return user;
  }


  /**
   * Get a JSON response with a list of all the users.
   *
   * @param user a user to be added to the database
   * @return
   */
  public String addNewUser(User user) {
    userCollection.insertOne(user);
    return user._id;
  }

  GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory())
    // Specify the CLIENT_ID of the app that accesses the backend:
    .setAudience(Collections.singletonList("239479898228-jsa8kqtcnqg96v8r74j2mp9jbbp01scu.apps.googleusercontent.com"))
    // Or, if multiple clients access the backend:
    //.setAudience(Arrays.asList(CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3))
    .build();

// (Receive idTokenString by HTTPS POST)

public void checkToken(Context ctx) throws GeneralSecurityException, IOException {
  String idTokenString = ctx.body();
  GoogleIdToken idToken = verifier.verify(idTokenString);
  if (idToken != null) {
    ctx = userTokenChecker(idToken, ctx);
  }
  else {
    throw new BadRequestResponse("The requested user token was not legal.");
  }
}

public Context userTokenChecker(GoogleIdToken idToken, Context ctx){

  Payload payload = idToken.getPayload();
  User loggedUser = getUser(payload.get("email").toString());

  if (!(loggedUser == null)){
    if (loggedUser.admin == true){
      ctx.sessionAttribute("current-user", "ADMIN");
      ctx.sessionAttribute("user-name", loggedUser.givenName);
      ctx.status(201);
      ctx.json(ImmutableMap.of("id", "true"));
    }
    else{
      ctx.sessionAttribute("current-user", "USER");
      ctx.sessionAttribute("user-name", loggedUser.givenName);
      ctx.status(201);
      ctx.json(ImmutableMap.of("id", "false"));
    }

  }
  else{
    User user = new User();
    user.email = payload.getEmail();
    user.emailVerified = Boolean.valueOf(payload.getEmailVerified());
    user.name = (String) payload.get("name");
    user.pictureUrl = (String) payload.get("picture");
    user.locale = (String) payload.get("locale");
    user.familyName = (String) payload.get("family_name");
    user.givenName = (String) payload.get("given_name");
    user.sub = (String) payload.get("sub");
    user.admin = false;

    String id = addNewUser(user);
    ctx.sessionAttribute("current-user", "USER");
    ctx.sessionAttribute("user-name", (String) payload.get("given_name"));
    ctx.status(201);
    ctx.json(ImmutableMap.of("id", id));
  }
  return ctx;
}
public void loggedIn(Context ctx)  {
  if(!(ctx.sessionAttribute("user-name")==null)){
    boolean admin;
    if(ctx.sessionAttribute("current-user")=="USER"){
      admin = false;
    }
    else{
      admin = true;
    }
    User user = new User();
    user.name = ctx.sessionAttribute("user-name").toString();
    user.admin  = admin;

    ctx.json(user);
  }
  else{
    throw new BadRequestResponse("No user logged in");
  }

}
}
