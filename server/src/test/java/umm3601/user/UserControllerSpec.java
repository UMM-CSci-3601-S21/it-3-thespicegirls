package umm3601.user;

import static com.mongodb.client.model.Filters.eq;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.google.common.collect.ImmutableMap;
import com.mockrunner.mock.web.MockHttpServletRequest;
import com.mockrunner.mock.web.MockHttpServletResponse;
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
import io.javalin.http.NotFoundResponse;
import io.javalin.http.util.ContextUtil;
import io.javalin.plugin.json.JavalinJson;


/**
* Tests the logic of the UserController
*
* @throws IOException
*/
public class UserControllerSpec {

  MockHttpServletRequest mockReq = new MockHttpServletRequest();
  MockHttpServletResponse mockRes = new MockHttpServletResponse();

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

    // Setup database
    MongoCollection<Document> userDocuments = db.getCollection("users");
    userDocuments.drop();
    List<Document> testUsers = new ArrayList<>();
    testUsers.add(
      new Document()
        .append("name", "Chris")
        .append("sub", "123456789"));
    testUsers.add(
      new Document()
        .append("name", "Jamie")
        .append("sub", "thissubhasletters"));

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

    String testID = "123456789";
    String testID2 = "thissubhasletters";

    assertTrue(userController.getUser(testID));
    assertTrue(userController.getUser(testID2));

  }

  @Test
  public void GetUserWithBadId() throws IOException {
    String testID = "987654321";

    assertFalse(userController.getUser(testID));

  }

  @Test
  public void GetUserWithNonexistentId() throws IOException {

    assertFalse(userController.getUser(""));

  }

  @Test
  public void AddUser() throws IOException {
    User user = new User();
    user.name = "Thom";
    user.sub = "number";
    userController.addNewUser(user);
    assertTrue(userController.getUser("number"));

    assertEquals(1, db.getCollection("users").countDocuments(eq("sub", "number")));

    Document addedUser = db.getCollection("users").find(eq("sub", "number")).first();
    assertNotNull(addedUser);
    assertEquals("Thom", addedUser.getString("name"));
    assertEquals("number", addedUser.getString("sub"));

  }

  @Test
  public void OldLoginTokenChecker() throws GeneralSecurityException, IOException {

    String testToken = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjEzZThkNDVhNDNjYjIyNDIxNTRjN2Y0ZGFmYWMyOTMzZmVhMjAzNzQiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXpwIjoiMjM5NDc5ODk4MjI4LWpzYThrcXRjbnFnOTZ2OHI3NGoybXA5amJicDAxc2N1LmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwiYXVkIjoiMjM5NDc5ODk4MjI4LWpzYThrcXRjbnFnOTZ2OHI3NGoybXA5amJicDAxc2N1LmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTA4MDY3ODI5NDQ3MjIyMjY4NjU0IiwiZW1haWwiOiJqdXN0YXRyb2xsaW50aGVwYXJrQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJhdF9oYXNoIjoiUEh5WkttY3UxeWczcFVURDFFMUdpQSIsIm5hbWUiOiJUZWVtb28gRG93Z2Vyc29uIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hLS9BT2gxNEdqeEEtR0tBdW9tTXAxaEZ0YmNpSTdDbEtQdzY0WHdrZ3NPOW9oNXJBPXM5Ni1jIiwiZ2l2ZW5fbmFtZSI6IlRlZW1vbyIsImZhbWlseV9uYW1lIjoiRG93Z2Vyc29uIiwibG9jYWxlIjoiZW4iLCJpYXQiOjE2MTczMjQ5NDEsImV4cCI6MTYxNzMyODU0MSwianRpIjoiZTdlYmRlMDRkNDM0ZGMwZTQ0OTc5ZDU4NDZkZTgwNGFkNDdiYTc5NiJ9.c43zXgk9vt_0Ammh6GeciqTM0EzSnU5_mEpEwKHdx3usiuIkkr5V8CheWj8eR0mcJKD3Mu1M2_981-g8GlW9UztHpMJUS50O4Jo1rXJYLMVayGQkUPqpyhsa4TwzznoLAdZ0VnURmU6vg3gFxA4nJXMwhp_kb8AOTcHknabMCR-WuN7aRREJZ7TzIfmnYt_7K_uR0I-TMyilzXAvFRYKRuf11nfu8Lh-HBPNxKqe6b0OeGM4_8M3_Gi2Iwn_QN8fUSyx6KgiQRkJRv1oOM-I8peWKp1kmG4l8UqyzoWEjvQyHYBpKPi0n8jApSyh5_JROHXBVqqUZiugSLRLnEnWVA";
    mockReq.setBodyContent(testToken);
    mockReq.setMethod("POST");

    Context ctx = ContextUtil.init(mockReq, mockRes, "api/users");

    assertThrows(BadRequestResponse.class, () -> {
      userController.checkToken(ctx);
    });
  }

  @Test
  public void GoodLoginTokenChecker() throws GeneralSecurityException, IOException {

    String testToken = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjEzZThkNDVhNDNjYjIyNDIxNTRjN2Y0ZGFmYWMyOTMzZmVhMjAzNzQiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiIyMzk0Nzk4OTgyMjgtanNhOGtxdGNucWc5NnY4cjc0ajJtcDlqYmJwMDFzY3UuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiIyMzk0Nzk4OTgyMjgtanNhOGtxdGNucWc5NnY4cjc0ajJtcDlqYmJwMDFzY3UuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDkwMTQ4NDAxMzk5Mjg5MjQwNzYiLCJoZCI6Im1vcnJpcy51bW4uZWR1IiwiZW1haWwiOiJkYWhsZzEzNkBtb3JyaXMudW1uLmVkdSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJhdF9oYXNoIjoiM1RmZUlkTzdfS0JQM1BMTVRPbl8tZyIsIm5hbWUiOiJUaG9tYXMgRGFobGdyZW4iLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDQuZ29vZ2xldXNlcmNvbnRlbnQuY29tLy1RcjZicVlKek94VS9BQUFBQUFBQUFBSS9BQUFBQUFBQUFBQS9BTVp1dWNtMHVqaXhfY0kwcUp1eGE3SERJS19yU1dYU0FnL3M5Ni1jL3Bob3RvLmpwZyIsImdpdmVuX25hbWUiOiJUaG9tYXMiLCJmYW1pbHlfbmFtZSI6IkRhaGxncmVuIiwibG9jYWxlIjoiZW4iLCJpYXQiOjE2MTczMzEyMDksImV4cCI6MTYxNzMzNDgwOX0.hcv9dd0L7hBI5K1b9XEHbOAOMIMPBBzAPOeQipzorOlHhhW7rUKoPBLRLAOxcL012ZZVZ0AEnHnqF-vU513r9GIzXgZuf2nG6gQYM4lFhoKN32YLeST26RKSbqvRKKZEXFF_0WcdjaFiQUqAzDsw-2q3cUmaOb91BDTe0LD98azLqgUVYGyA6-XzHno1Cq2KbN3b0xQYcYEzk5WLdMvdwqpg9y5ziubOWGub_du0zvNH-d8SZVeWXdHHLYYmFVuadFa0_J_8kvosaPAzuRMYvcX5N5_WDMB-fyxl0zxt75LCQBUQz2kv-zi4EJQnbldwkpleP4mp9A__s5njUtt4Qg";
    mockReq.setBodyContent(testToken);
    mockReq.setMethod("POST");
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/users");
    userController.checkToken(ctx);
    assertEquals(201, mockRes.getStatus());

    mockReq.setBodyContent(testToken);
    mockReq.setMethod("POST");
    Context ctx2 = ContextUtil.init(mockReq, mockRes, "api/users");
    userController.checkToken(ctx2);
    assertEquals(201, mockRes.getStatus());

  }
}
