package umm3601.learner;

import static com.mongodb.client.model.Filters.eq;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.google.common.collect.ImmutableMap;
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
import io.javalin.http.NotFoundResponse;
import io.javalin.http.util.ContextUtil;
import io.javalin.plugin.json.JavalinJson;
import umm3601.user.User;

public class LearnerControllerSpec {
  MockHttpServletRequest mockReq = new MockHttpServletRequest();
  MockHttpServletResponse mockRes = new MockHttpServletResponse();

  private LearnerController learnerController;

  private ObjectId testID;

  static MongoClient mongoClient;
  static MongoDatabase db;
  MockHttpSession mockSession = new MockHttpSession();

  static ObjectMapper jsonMapper = new ObjectMapper();

  @BeforeAll
  public static void setupAll() {
    String mongoAddr = System.getenv().getOrDefault("MONGO_ADDR", "localhost");

    mongoClient = MongoClients.create(MongoClientSettings.builder()
        .applyToClusterSettings(builder -> builder.hosts(Arrays.asList(new ServerAddress(mongoAddr)))).build());

    db = mongoClient.getDatabase("test");
  }

  @BeforeEach
  public void setupEach() throws IOException {

    // Reset our mock request and response objects
    mockReq.resetAll();
    mockRes.resetAll();

    // Setup database
    MongoCollection<Document> learnerDocuments = db.getCollection("learners");
    learnerDocuments.drop();
    List<Document> testLearners = new ArrayList<>();
    testID = new ObjectId();
    testLearners.add(
      new Document()
      .append("_id", testID)
      .append("userName", "Jonny")
      .append("userId", "12345")
      .append("name", "Ocean")
      .append("assignedContextPacks", Arrays.asList("boats", "lighthouses", "sharks"))
      .append("disabledWordlists", Arrays.asList("birds","whales","fish")));
    testLearners.add(
      new Document()
      .append("userName", "Jonny")
      .append("userId", "12345")
      .append("name", "animals")
      .append("assignedContextPacks", Arrays.asList("dogs", "cats"))
      .append("disabledWordlists", Arrays.asList("cows")));
        testLearners.add(
      new Document()
      .append("userName", "Starla")
      .append("userId", "54321")
      .append("name", "wood")
      .append("assignedContextPacks", Arrays.asList("oak", "willow"))
      .append("disabledWordlists", Arrays.asList("cats","ocean")));

    learnerDocuments.insertMany(testLearners);
    learnerController = new LearnerController(db);
  }

  @AfterAll
  public static void teardown() {
    db.drop();
    mongoClient.close();
  }

  @Test
  public void GetAllLearners() throws IOException {

    mockReq.setSession(mockSession);
    mockReq.setMethod("GET");
    User user = new User();
    user._id = "12345";
    user.name = "Jonny";
    mockSession.setAttribute("current-user", user);
    // Create our fake Javalin context
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/learners");
    learnerController.getLearners(ctx);
    assertEquals(200, mockRes.getStatus());
    String result = ctx.resultString();
    assertEquals(2, JavalinJson.fromJson(result, Learner[].class).length);
  }

  @Test
  public void GetLearner(){
    mockReq.setSession(mockSession);
    mockReq.setMethod("GET");
    User user = new User();
    user._id = "12345";
    user.name = "Jonny";
    mockSession.setAttribute("current-user", user);
    String testLearnerID = testID.toHexString();

    Context ctx = ContextUtil.init(mockReq, mockRes, "api/learners/:id" , ImmutableMap.of("id", testLearnerID));
    learnerController.getLearner(ctx);
    assertEquals(200, mockRes.getStatus());

    String result = ctx.resultString();
    Learner resultLearner = JavalinJson.fromJson(result, Learner.class);

    assertEquals(resultLearner._id, testLearnerID);
    assertEquals(resultLearner.userName, "Jonny");
  }

  @Test
  public void GetLearnerAsWrongUser(){
    mockReq.setSession(mockSession);
    mockReq.setMethod("GET");
    User user = new User();
    user._id = "54321";
    user.name = "Starla";
    mockSession.setAttribute("current-user", user);
    String testLearnerID = testID.toHexString();

    Context ctx = ContextUtil.init(mockReq, mockRes, "api/learners/:id" , ImmutableMap.of("id", testLearnerID));

    assertThrows(IllegalAccessError.class, ()->{
      learnerController.getLearner(ctx);
    });

  }

  @Test
  public void getLearnerInvalidID(){
    mockReq.setSession(mockSession);
    mockReq.setMethod("GET");
    User user = new User();
    user._id = "12345";
    user.name = "Jonny";
    mockSession.setAttribute("current-user", user);
     Context ctx = ContextUtil.init(mockReq, mockRes, "api/learners/:id" , ImmutableMap.of("id", "chickens"));

    assertThrows(BadRequestResponse.class, ()->{
      learnerController.getLearner(ctx);
    });
  }

  @Test
  public void getLearnerNOID(){
    mockReq.setSession(mockSession);
    mockReq.setMethod("GET");
    User user = new User();
    user._id = "12345";
    user.name = "Jonny";
    mockSession.setAttribute("current-user", user);
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/learners/:id" , ImmutableMap.of("id", "58af3a600343927e48e87335"));

    assertThrows(NotFoundResponse.class, ()->{
      learnerController.getLearner(ctx);
    });
  }

  @Test
  public void getLearnerNotLoggedIn(){
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/learners/:id" , ImmutableMap.of("id", "58af3a600343927e48e87335"));

    assertThrows(NullPointerException.class, ()->{
      learnerController.getLearner(ctx);
    });
  }

  @Test
  public void assignWordlist(){
    mockReq.setSession(mockSession);
    mockReq.setMethod("GET");
    User user = new User();
    user._id = "12345";
    user.name = "Jonny";
    mockSession.setAttribute("current-user", user);
    String testLearnerID = testID.toHexString();
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/learners/:id/assign" , ImmutableMap.of("id", testLearnerID));
    mockReq.setQueryString("assign=fish");
    learnerController.assignWordlist(ctx);

    assertEquals(200, mockRes.getStatus());
    String result = ctx.resultString();
    Learner resultLearner = JavalinJson.fromJson(result, Learner.class);
    assertEquals(resultLearner.disabledWordlists.contains("cats"), false);
    assertEquals(resultLearner.disabledWordlists.contains("birds"), true);

    ctx = ContextUtil.init(mockReq, mockRes, "api/learners/:id/assign" , ImmutableMap.of("id", testLearnerID));
    mockReq.setQueryString("assign=whales");
    learnerController.assignWordlist(ctx);
    result = ctx.resultString();

    assertEquals(200, mockRes.getStatus());
    resultLearner = JavalinJson.fromJson(result, Learner.class);
    assertEquals(resultLearner.disabledWordlists.contains("whales"), false);
    assertEquals(resultLearner.disabledWordlists.contains("fish"), false);

    ctx = ContextUtil.init(mockReq, mockRes, "api/learners/:id/assign" , ImmutableMap.of("id", testLearnerID));
    mockReq.setQueryString("nothing=milk");
    learnerController.assignWordlist(ctx);
    result = ctx.resultString();
    // no changes are made if the query string is incorrectly constructed
    assertEquals(200, mockRes.getStatus());
    resultLearner = JavalinJson.fromJson(result, Learner.class);
    assertEquals(resultLearner.disabledWordlists.contains("cats"), false);
    assertEquals(resultLearner.disabledWordlists.contains("dogs"), false);
}

  @Test
  public void AddNewLearner() throws IOException {
    mockReq.setSession(mockSession);
    mockReq.setMethod("GET");
    User user = new User();
    user._id = "54321";
    user.name = "Starla";
    mockSession.setAttribute("current-user", user);
    String test = "{"
    + "\"_id\": \"\" ,"
    + "\"userName\": \"Starla\","
    + "\"userId\": \"54321\","
    + "\"name\": \"random name\","
    + "\"assignedContextPacks\": null,"
    + "\"disabledWordlists\": null"
    + "}"
    ;

    mockReq.setBodyContent(test);
    mockReq.setMethod("POST");

    Context ctx = ContextUtil.init(mockReq, mockRes, "api/learners");

    learnerController.addLearner(ctx);
    assertEquals(201, mockRes.getStatus());

    String result = ctx.resultString();
    String id = jsonMapper.readValue(result, ObjectNode.class).get("id").asText();

    assertNotEquals("", id);
    assertEquals(1, db.getCollection("learners").countDocuments(eq("_id", new ObjectId(id))));


    Document addedLearner = db.getCollection("learners").find(eq("_id", new ObjectId(id))).first();
    assertNotNull(addedLearner);
    assertEquals("random name", addedLearner.getString("name"));
    assertNotNull(addedLearner);
  }

  @Test
  public void AddNewLearnerNoNameWhileLoggedIn() throws IOException {
    mockReq.setSession(mockSession);
    mockReq.setMethod("GET");
    User user = new User();
    user._id = "54321";
    user.name = "Starla";
    mockSession.setAttribute("current-user", user);
    String test = "{"
    + "\"_id\": \"\" ,"
    + "\"userName\": \"Starla\","
    + "\"userId\": \"54321\","
    + "\"assignedContextPacks\": null,"
    + "\"disabledWordlists\": null"
    + "}"
    ;

    mockReq.setBodyContent(test);
    mockReq.setMethod("POST");

    Context ctx = ContextUtil.init(mockReq, mockRes, "api/learners");

    assertThrows(BadRequestResponse.class, () -> {
      learnerController.addLearner(ctx);
    });

  }

  @Test
  public void AddNewLearnerNoName() throws IOException {
    String test = "{"
    + "\"_id\": \"\" ,"
    + "\"creator\": \"RandomAdult\","
    + "\"assignedContextPacks\": null,"
    + "\"disabledWordlists\": null"
    + "}"
    ;

    mockReq.setBodyContent(test);
    mockReq.setMethod("POST");

    Context ctx = ContextUtil.init(mockReq, mockRes, "api/learners");

    assertThrows(BadRequestResponse.class, () -> {
      learnerController.addLearner(ctx);
    });
  }
  @Test
  public void disableWordlist(){
    mockReq.setSession(mockSession);
    mockReq.setMethod("GET");
    User user = new User();
    user._id = "12345";
    user.name = "Jonny";
    mockSession.setAttribute("current-user", user);
    String testLearnerID = testID.toHexString();
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/learners/:id/assign" , ImmutableMap.of("id", testLearnerID));
    mockReq.setQueryString("disable=boats");
    learnerController.assignWordlist(ctx);

    assertEquals(200, mockRes.getStatus());
    String result = ctx.resultString();
    Learner resultLearner = JavalinJson.fromJson(result, Learner.class);
    assertEquals(resultLearner.disabledWordlists.size(), 4);
    assertEquals(resultLearner.disabledWordlists.contains("boats"), true);
    assertEquals(resultLearner.disabledWordlists.contains("sharks"), false);
}
@Test
public void disableWordlistDuplicate(){
  mockReq.setSession(mockSession);
  mockReq.setMethod("GET");
  User user = new User();
  user._id = "12345";
  user.name = "Jonny";
  mockSession.setAttribute("current-user", user);
  // if a list is already disabled, it should not be added twice
  String testLearnerID = testID.toHexString();
  Context ctx = ContextUtil.init(mockReq, mockRes, "api/learners/:id/assign" , ImmutableMap.of("id", testLearnerID));
  mockReq.setQueryString("disable=crows");
  learnerController.assignWordlist(ctx);

  assertEquals(200, mockRes.getStatus());
  String result = ctx.resultString();
  Learner resultLearner = JavalinJson.fromJson(result, Learner.class);
  assertEquals(resultLearner.disabledWordlists.size(), 4);
  assertEquals(resultLearner.disabledWordlists.contains("crows"), true);
}
@Test
public void noAccessIfNotCreator(){
  mockReq.setSession(mockSession);
  mockReq.setMethod("GET");
  User user = new User();
  user._id = "54321";
  user.name = "Starla";
  mockSession.setAttribute("current-user", user);
  String testLearnerID = testID.toHexString();
  Context ctx = ContextUtil.init(mockReq, mockRes, "api/learners/:id/assign" , ImmutableMap.of("id", testLearnerID));
  mockReq.setQueryString("disable=boats");
  assertThrows(IllegalAccessError.class, () -> {
    learnerController.assignWordlist(ctx);
  });
}
}
