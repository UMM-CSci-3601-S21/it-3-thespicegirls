package umm3601.user;

import static com.mongodb.client.model.Filters.eq;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken.Payload;
import com.google.api.client.json.webtoken.JsonWebSignature.Header;
import com.mockrunner.mock.web.MockHttpServletRequest;
import com.mockrunner.mock.web.MockHttpServletResponse;
import com.mockrunner.mock.web.MockHttpSession;
import com.mongodb.MongoClientSettings;
import com.mongodb.ServerAddress;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;

import org.bson.Document;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import io.javalin.http.BadRequestResponse;
import io.javalin.http.Context;

import io.javalin.http.util.ContextUtil;


/**
* Tests the logic of the UserController
*
* @throws IOException
*/
public class UserControllerSpec {

  MockHttpServletRequest mockReq = new MockHttpServletRequest();
  MockHttpServletResponse mockRes = new MockHttpServletResponse();
  MockHttpSession mockSession = new MockHttpSession();

  private UserController userController;

  static MongoClient mongoClient;
  static MongoDatabase db;

  static ObjectMapper jsonMapper = new ObjectMapper();

  @BeforeAll
  public static void setupAll() {
    String mongoAddr = System.getenv().getOrDefault("MONGO_ADDR", "localhost");

    mongoClient = MongoClients.create(
    MongoClientSettings.builder()
    .applyToClusterSettings(builder ->
    builder.hosts(Arrays.asList(new ServerAddress(mongoAddr))))
    .build());

    db = mongoClient.getDatabase("test");
  }


  @BeforeEach
  public void setupEach() throws IOException {

    // Reset our mock request and response objects
    mockReq.resetAll();
    mockRes.resetAll();
    mockSession.resetAll();

    // Setup database
    MongoCollection<Document> userDocuments = db.getCollection("users");
    userDocuments.drop();
    List<Document> testUsers = new ArrayList<>();
    testUsers.add(
      new Document()
        .append("name", "Chris")
        .append("email", "chris@mail.com")
        .append("sub", "123456789"));
    testUsers.add(
      new Document()
        .append("name", "Jamie")
        .append("sub", "thissubhasletters"));
        testUsers.add(
      new Document()
        .append("name", "Admin")
        .append("email", "admin@mail.com")
        .append("admin", true)
        .append("sub", "54321"));

    userDocuments.insertMany(testUsers);
    userController = new UserController(db);
  }

  @AfterAll
  public static void teardown() {
    db.drop();
    mongoClient.close();
  }


  @Test
  public void ExistentIdShouldBeTrue() throws IOException {

    String testID = "admin@mail.com";
    String testID2 = "chris@mail.com";

    assertNotNull(userController.getUser(testID));
    assertNotNull(userController.getUser(testID2));

  }

  @Test
  public void GetUserWithBadId() throws IOException {
    String testID = "987654321";

    assertNull(userController.getUser(testID));

  }

  @Test
  public void GetUserWithNonexistentId() throws IOException {

    assertNull(userController.getUser(""));

  }

  @Test
  public void AddUser() throws IOException {
    User user = new User();
    user.name = "Thom";
    user.email = "thom@mail.com";
    user.sub = "number";
    userController.addNewUser(user);
    assertNotNull(userController.getUser("thom@mail.com"));

    assertEquals(1, db.getCollection("users").countDocuments(eq("sub", "number")));

    Document addedUser = db.getCollection("users").find(eq("sub", "number")).first();
    assertNotNull(addedUser);
    assertEquals("Thom", addedUser.getString("name"));
    assertEquals("number", addedUser.getString("sub"));

  }

  @Test
  public void OldLoginTokenChecker() throws GeneralSecurityException, IOException {

    String testToken = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjEzZThkNDVhNHLjYjIyNDIxNTRjN2Y0ZGFmYWMyOTMzZmVhMjAzNzQiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXpwIjoiMjM5NDc5ODk4MjI4LWpzYThrcXRjbnFnOTZ2OHI3NGoybXA5amJicDAxc2N1LmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwiYXVkIjoiMjM5NDc5ODk4MjI4LWpzYThrcXRjbnFnOTZ2OHI3NGoybXA5amJicDAxc2N1LmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTA4MDY3ODI5NDQ3MjIyMjY4NjU0IiwiZW1haWwiOiJqdXN0YXRyb2xsaW50aGVwYXJrQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJhdF9oYXNoIjoiUEh5WkttY3UxeWczcFVURDFFMUdpQSIsIm5hbWUiOiJUZWVtb28gRG93Z2Vyc29uIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hLS9BT2gxNEdqeEEtR0tBdW9tTXAxaEZ0YmNpSTdDbEtQdzY0WHdrZ3NPOW9oNXJBPXM5Ni1jIiwiZ2l2ZW5fbmFtZSI6IlRlZW1vbyIsImZhbWlseV9uYW1lIjoiRG93Z2Vyc29uIiwibG9jYWxlIjoiZW4iLCJpYXQiOjE2MTczMjQ5NDEsImV4cCI6MTYxNzMyODU0MSwianRpIjoiZTdlYmRlMDRkNDM0ZGMwZTQ0OTc5ZDU4NDZkZTgwNGFkNDdiYTc5NiJ9.c43zXgk9vt_0Ammh6GeciqTM0EzSnU5_mEpEwKHdx3usiuIkkr5V8CheWj8eR0mcJKD3Mu1M2_981-g8GlW9UztHpMJUS50O4Jo1rXJYLMVayGQkUPqpyhsa4TwzznoLAdZ0VnURmU6vg3gFxA4nJXMwhp_kb8AOTcHknabMCR-WuN7aRREJZ7TzIfmnYt_7K_uR0I-TMyilzXAvFRYKRuf11nfu8Lh-HBPNxKqe6b0OeGM4_8M3_Gi2Iwn_QN8fUSyx6KgiQRkJRv1oOM-I8peWKp1kmG4l8UqyzoWEjvQyHYBpKPi0n8jApSyh5_JROHXBVqqUZiugSLRLnEnWWA";
    mockReq.setBodyContent(testToken);
    mockReq.setMethod("POST");

    Context ctx = ContextUtil.init(mockReq, mockRes, "api/users");

    assertThrows(BadRequestResponse.class, () -> {
      userController.checkToken(ctx);
    });
  }

  @Test
  public void GoodLoginTokenChecker() throws GeneralSecurityException, IOException {

    String testToken = "12345";
    mockReq.setBodyContent(testToken);
    mockReq.setMethod("POST");
    mockReq.setSession(mockSession);

    Context ctx = ContextUtil.init(mockReq, mockRes, "api/users");
    Header header = new Header();
    header.set("alg", "RS256");
    Payload payload = new Payload();
    payload.set("name", "Thomas");
    payload.set("email", "Thomas@mail");
    payload.set("email_verified", true);
    payload.set("picture", "ThomasPicture");
    payload.set("locale", "EN");
    payload.set("family_name", "Joe");
    payload.set("given_name", "Thomas");
    payload.set("sub", "12345");
    byte[] signatureBytes = {1};
    byte[] signedContentBytes = {1};
    GoogleIdToken idToken = new GoogleIdToken(header, payload, signatureBytes, signedContentBytes);

    userController.userTokenChecker(idToken, ctx);
    assertEquals("USER", mockSession.getAttribute("current-user").toString());

    assertEquals(201, mockRes.getStatus());
    String result = ctx.resultString();
    String id = jsonMapper.readValue(result, ObjectNode.class).get("id").asText();
    assertNotEquals("", id);
    assertEquals(1, db.getCollection("users").countDocuments(eq("_id", new ObjectId(id))));

    Document addedUser = db.getCollection("users").find(eq("_id", new ObjectId(id))).first();
    assertNotNull(addedUser);
    assertEquals("Thomas", addedUser.getString("name"));
    assertEquals("Thomas@mail", addedUser.getString("email"));
    assertTrue(addedUser.getBoolean("emailVerified"));
    assertEquals("ThomasPicture", addedUser.getString("pictureUrl"));
    assertEquals("EN", addedUser.getString("locale"));
    assertEquals("Joe", addedUser.getString("familyName"));
    assertEquals("Thomas", addedUser.getString("givenName"));
    assertEquals("12345", addedUser.getString("sub"));


    //This test makes sure an already added user doesn't get added again
    mockReq.clearAttributes();
    mockReq.setBodyContent(testToken);
    mockReq.setMethod("POST");

    Context ctx2 = ContextUtil.init(mockReq, mockRes, "api/users");
    userController.userTokenChecker(idToken, ctx2);
    assertEquals(201, mockRes.getStatus());
    assertEquals(4, db.getCollection("users").countDocuments());

    //And then asks if he is logged in
    userController.loggedIn(ctx2);
    String result2 = ctx2.resultString();
    String name = jsonMapper.readValue(result2, ObjectNode.class).get("name").asText();
    String admin = jsonMapper.readValue(result2, ObjectNode.class).get("admin").asText();
    assertEquals("Thomas", name);
    assertEquals("false", admin);

  }
  @Test
  public void NotLoggedChecker() throws GeneralSecurityException, IOException {

    String testToken = "12345";
    mockReq.setBodyContent(testToken);
    mockReq.setMethod("POST");
    mockReq.setSession(mockSession);

    Context ctx = ContextUtil.init(mockReq, mockRes, "api/users");
    boolean result = false;
    try{
      userController.loggedIn(ctx);
      }catch(BadRequestResponse ref){result = true;}

    assertTrue(result);
  }

  @Test
  public void GoodAdminChecker() throws GeneralSecurityException, IOException {

    String testToken = "12345";
    mockReq.setBodyContent(testToken);
    mockReq.setMethod("POST");
    mockReq.setSession(mockSession);

    Context ctx = ContextUtil.init(mockReq, mockRes, "api/users");
    Header header = new Header();
    header.set("alg", "RS256");
    Payload payload = new Payload();
    payload.set("name", "Thomas");
    payload.set("email", "admin@mail.com");
    payload.set("email_verified", true);
    payload.set("picture", "ThomasPicture");
    payload.set("locale", "EN");
    payload.set("family_name", "Joe");
    payload.set("given_name", "Thomas");
    payload.set("sub", "54321");
    byte[] signatureBytes = {1};
    byte[] signedContentBytes = {1};
    GoogleIdToken idToken = new GoogleIdToken(header, payload, signatureBytes, signedContentBytes);

    userController.userTokenChecker(idToken, ctx);
    assertEquals("ADMIN", mockSession.getAttribute("current-user").toString());

    assertEquals(201, mockRes.getStatus());
    String result = ctx.resultString();
    String id = jsonMapper.readValue(result, ObjectNode.class).get("id").asText();
    assertEquals("true", id);

  }
}
