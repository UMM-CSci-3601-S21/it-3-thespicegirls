// package umm3601.user;
// import java.io.IOException;
// import java.security.GeneralSecurityException;
// import java.util.Collections;

// import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
// import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
// import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken.Payload;

// import com.google.api.client.http.javanet.NetHttpTransport;
// import com.google.api.client.json.gson.GsonFactory;

// import io.javalin.http.BadRequestResponse;
// import io.javalin.http.Context;

// public class UserTokenCheck {

//   GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory())
//     // Specify the CLIENT_ID of the app that accesses the backend:
//     .setAudience(Collections.singletonList("239479898228-jsa8kqtcnqg96v8r74j2mp9jbbp01scu.apps.googleusercontent.com"))
//     // Or, if multiple clients access the backend:
//     //.setAudience(Arrays.asList(CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3))
//     .build();

// // (Receive idTokenString by HTTPS POST)

// public void checkToken(Context ctx) throws GeneralSecurityException, IOException {
//   String idTokenString = ctx.body();
//   GoogleIdToken idToken = verifier.verify(idTokenString);
//   if (idToken != null) {
//     Payload payload = idToken.getPayload();

//     // Print user identifier
//     String userId = payload.getSubject();
//     System.out.println("User ID: " + userId);

//     // Get profile information from payload
//     String email = payload.getEmail();
//     boolean emailVerified = Boolean.valueOf(payload.getEmailVerified());
//     String name = (String) payload.get("name");
//     String pictureUrl = (String) payload.get("picture");
//     String locale = (String) payload.get("locale");
//     String familyName = (String) payload.get("family_name");
//     String givenName = (String) payload.get("given_name");

//     User user = new User();
//     user.email = email;
//     user.emailVerified = emailVerified;
//     user.name = name;
//     user.pictureUrl= pictureUrl;
//     user.locale = locale;
//     user.familyName = familyName;
//     user.givenName= givenName;

//     UserController.addNewUser(user);


//   } else {
//     throw new BadRequestResponse("The requested user id wasn't a legal Mongo Object ID.");
//   }
//   }
// }
