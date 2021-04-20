package umm3601.learner;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.io.IOException;
import java.util.Arrays;


import com.fasterxml.jackson.databind.ObjectMapper;
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
    .append("assignedContextPacks", Arrays.asList())
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
  public void getContextPackInvalidID(){
     Context ctx = ContextUtil.init(mockReq, mockRes, "api/learners/:id" , ImmutableMap.of("id", "chickens"));

    assertThrows(BadRequestResponse.class, ()->{
      learnerController.getLearner(ctx);
    });

  }

  @Test
  public void getContextPackNOID(){
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

  }
}
