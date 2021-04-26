package umm3601.learner;

import static com.mongodb.client.model.Filters.eq;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.io.IOException;
import java.util.Arrays;


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

public class LearnerControllerSpec {
  MockHttpServletRequest mockReq = new MockHttpServletRequest();
  MockHttpServletResponse mockRes = new MockHttpServletResponse();

  private LearnerController learnerController;

  private ObjectId testID;

  static MongoClient mongoClient;
  static MongoDatabase db;

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
    testID = new ObjectId();
    Document testLearnerID = new Document()
    .append("_id", testID)
    .append("creator","KK")
    .append("name","Starla")
    .append("assignedContextPacks", Arrays.asList("testContextpackId1","testContextpackId2"))
    .append("disabledWordlists", Arrays.asList("cats","dogs","milk"));
    learnerDocuments.insertOne(testLearnerID);
    learnerController = new LearnerController(db);
  }

  @AfterAll
  public static void teardown() {
    db.drop();
    mongoClient.close();
  }

  @Test
  public void GetAllLearners() throws IOException {

    // Create our fake Javalin context
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/learners");
    learnerController.getLearners(ctx);

    assertEquals(200, mockRes.getStatus());

    String result = ctx.resultString();
    assertTrue(JavalinJson.fromJson(result, Learner[].class).length >= 1);
    assertEquals(db.getCollection("learners").countDocuments(),
        JavalinJson.fromJson(result, Learner[].class).length);
  }

  @Test
  public void GetLearner(){
    String testLearnerID = testID.toHexString();

    Context ctx = ContextUtil.init(mockReq, mockRes, "api/learners/:id" , ImmutableMap.of("id", testLearnerID));
    learnerController.getLearner(ctx);
    assertEquals(200, mockRes.getStatus());

    String result = ctx.resultString();
    Learner resultLearner = JavalinJson.fromJson(result, Learner.class);

    assertEquals(resultLearner._id, testLearnerID);
    assertEquals(resultLearner.name, "Starla");
  }

  @Test
  public void getLearnerInvalidID(){
     Context ctx = ContextUtil.init(mockReq, mockRes, "api/learners/:id" , ImmutableMap.of("id", "chickens"));

    assertThrows(BadRequestResponse.class, ()->{
      learnerController.getLearner(ctx);
    });
  }

  @Test
  public void getLearnerNOID(){
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/learners/:id" , ImmutableMap.of("id", "58af3a600343927e48e87335"));

    assertThrows(NotFoundResponse.class, ()->{
      learnerController.getLearner(ctx);
    });
  }

  @Test
  public void assignWordlist(){
    String testLearnerID = testID.toHexString();
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/learners/:id/assign" , ImmutableMap.of("id", testLearnerID));
    mockReq.setQueryString("assign=cats");
    learnerController.assignWordlist(ctx);

    assertEquals(200, mockRes.getStatus());
    String result = ctx.resultString();
    Learner resultLearner = JavalinJson.fromJson(result, Learner.class);
    assertEquals(resultLearner.disabledWordlists.contains("cats"), false);
    assertEquals(resultLearner.disabledWordlists.contains("dogs"), true);

    ctx = ContextUtil.init(mockReq, mockRes, "api/learners/:id/assign" , ImmutableMap.of("id", testLearnerID));
    mockReq.setQueryString("assign=dogs");
    learnerController.assignWordlist(ctx);
    result = ctx.resultString();

    assertEquals(200, mockRes.getStatus());
    resultLearner = JavalinJson.fromJson(result, Learner.class);
    assertEquals(resultLearner.disabledWordlists.contains("cats"), false);
    assertEquals(resultLearner.disabledWordlists.contains("dogs"), false);

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
    String test = "{"
    + "\"_id\": \"\" ,"
    + "\"creator\": \"RandomAdult\","
    + "\"name\": \"RandomKid\","
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
    assertEquals("RandomKid", addedLearner.getString("name"));
    assertNotNull(addedLearner);

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
  public void AddNewLearnerNoCreator() throws IOException {
    String test = "{"
    + "\"_id\": \"\" ,"
    + "\"name\": \"RandomKid\","
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
    String testLearnerID = testID.toHexString();
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/learners/:id/assign" , ImmutableMap.of("id", testLearnerID));
    mockReq.setQueryString("disable=baseball");
    learnerController.assignWordlist(ctx);

    assertEquals(200, mockRes.getStatus());
    String result = ctx.resultString();
    Learner resultLearner = JavalinJson.fromJson(result, Learner.class);
    assertEquals(resultLearner.disabledWordlists.size(), 4);
    assertEquals(resultLearner.disabledWordlists.contains("baseball"), true);
    assertEquals(resultLearner.disabledWordlists.contains("cats"), true);
  }

  @Test
  public void AssignContextPack() throws IOException {
    mockReq.setMethod("POST");

    Context ctx = ContextUtil.init(mockReq, mockRes, "api/learners/:id/assignPack", ImmutableMap.of("id", testID.toHexString()));
    mockReq.setQueryString("assign=testContextpackId3");

    learnerController.assignContextPack(ctx);
    assertEquals(201, mockRes.getStatus());

    String result = ctx.resultString();
    Learner resultLearner = jsonMapper.readValue(result, Learner.class);

    assertEquals(testID.toHexString(), resultLearner._id);
    assertEquals("testContextpackId3", resultLearner.assignedContextPacks.get(2));
  }

  @Test
  public void UnassignContextPack() throws IOException{
    mockReq.setMethod("POST");

    Context ctx = ContextUtil.init(mockReq, mockRes, "api/learners/:id/assignPack", ImmutableMap.of("id", testID.toHexString()));
    mockReq.setQueryString("unassign=testContextpackId2");

    learnerController.assignContextPack(ctx);
    assertEquals(201, mockRes.getStatus());

    String result = ctx.resultString();
    Learner resultLearner = jsonMapper.readValue(result, Learner.class);

    assertEquals(testID.toHexString(), resultLearner._id);
    for(int index = 0; index<resultLearner.assignedContextPacks.size(); index++) {
      assertNotEquals("testContextpackId2",resultLearner.assignedContextPacks.get(index));
    }
  }

@Test
public void disableWordlistDuplicate(){
  // if a list is already disabled, it should not be added twice
  String testLearnerID = testID.toHexString();
  Context ctx = ContextUtil.init(mockReq, mockRes, "api/learners/:id/assign" , ImmutableMap.of("id", testLearnerID));
  mockReq.setQueryString("disable=cats");
  learnerController.assignWordlist(ctx);

  assertEquals(200, mockRes.getStatus());
  String result = ctx.resultString();
  Learner resultLearner = JavalinJson.fromJson(result, Learner.class);
  assertEquals(resultLearner.disabledWordlists.size(), 3);
  assertEquals(resultLearner.disabledWordlists.contains("cats"), true);
}
}
