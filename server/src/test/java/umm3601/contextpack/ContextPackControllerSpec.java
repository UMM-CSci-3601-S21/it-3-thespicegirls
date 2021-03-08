package umm3601.contextpack;

import static com.mongodb.client.model.Filters.eq;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.io.IOException;
import java.util.ArrayList;
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
import umm3601.contextpack.ContextPackControllerSpec;

public class ContextPackControllerSpec {

  MockHttpServletRequest mockReq = new MockHttpServletRequest();
  MockHttpServletResponse mockRes = new MockHttpServletResponse();

  private ContextPackController contextPackController;

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
    MongoCollection<Document> contextPackDocuments = db.getCollection("contextpacks");
    contextPackDocuments.drop();
    Document testPack = new Document().append("name", "animals").append("enabled", true).append("wordlists",
        new Document().append("topic", "cats").append("enabled", true)
            .append("verbs",
                Arrays.asList(new Document("word", "horse").append("forms", Arrays.asList("horsie", "horse"))))
            .append("nouns",
                Arrays.asList(new Document("word", "horse").append("forms", Arrays.asList("horsie", "horse"))))
            .append("adjectives",
                Arrays.asList(new Document("word", "horse").append("forms", Arrays.asList("horsie", "horse"))))
            .append("misc",
                Arrays.asList(new Document("word", "horse").append("forms", Arrays.asList("horsie", "horse")))));
    contextPackDocuments.insertOne(testPack);
    testID = new ObjectId();
    Document testPackID = new Document()
    .append("_id", testID)
    .append("name", "baskets")
    .append("enabled", true)
    .append("wordlist",
        new Document().append("topic", "dogs").append("enabled", true)
            .append("verbs",
                Arrays.asList(new Document("word", "run").append("forms", Arrays.asList("horsie", "horse"))))
            .append("nouns",
                Arrays.asList(new Document("word", "horse").append("forms", Arrays.asList("horsie", "horse"))))
            .append("adjectives",
                Arrays.asList(new Document("word", "blue").append("forms", Arrays.asList("horsie", "horse"))))
            .append("misc",
                Arrays.asList(new Document("word", "goat").append("forms", Arrays.asList("horsie", "horse")))));
    contextPackDocuments.insertOne(testPackID);

    MongoCollection<Document> wordlistDocuments = db.getCollection("wordlists");
    Document testList = new Document().append("topic", "cats")
          .append("enabled", true)
          .append("nouns",
                Arrays.asList(new Document("word", "horse").append("forms", Arrays.asList("horsie", "horse"))))
          .append("adjectives",
                Arrays.asList(new Document("word", "Bob").append("forms", Arrays.asList("Bob"))))
          .append("verbs",
                Arrays.asList(new Document("word", "run").append("forms", Arrays.asList("ran", "runs"))))
          .append("misc",
                Arrays.asList(new Document("word", "run").append("forms", Arrays.asList("ran", "runs"))));
    wordlistDocuments.insertOne(testList);

    Document testListID = new Document()
          .append("_id", testID)
          .append("topic", "MountainDew")
          .append("enabled", true)
          .append("nouns",
                Arrays.asList(new Document("word", "horse").append("forms", Arrays.asList("horsie", "horse"))))
          .append("adjectives",
                Arrays.asList(new Document("word", "Bob").append("forms", Arrays.asList("Bob"))))
          .append("verbs",
                Arrays.asList(new Document("word", "run").append("forms", Arrays.asList("ran", "runs"))))
          .append("misc",
                Arrays.asList(new Document("word", "run").append("forms", Arrays.asList("ran", "runs"))));
    wordlistDocuments.insertOne(testListID);
    contextPackController = new ContextPackController(db);
  }

  @AfterAll
  public static void teardown() {
    db.drop();
    mongoClient.close();
  }

  @Test
  public void GetAllContextPacks() throws IOException {

    // Create our fake Javalin context
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/contextpacks");
    contextPackController.getContextPacks(ctx);

    assertEquals(200, mockRes.getStatus());

    String result = ctx.resultString();
    assertTrue(JavalinJson.fromJson(result, ContextPack[].class).length >= 1);
    assertEquals(db.getCollection("contextpacks").countDocuments(),
        JavalinJson.fromJson(result, ContextPack[].class).length);

  }
  @ Test
  public void GetAllWordlists(){

    // Create our fake Javalin context
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/wordlists");
    contextPackController.getWordlists(ctx);

    assertEquals(200, mockRes.getStatus());

    String result = ctx.resultString();
    assertTrue(JavalinJson.fromJson(result, Wordlist[].class).length >= 1);
    assertEquals(db.getCollection("wordlists").countDocuments(),
        JavalinJson.fromJson(result, Wordlist[].class).length);

  }


  @Test
  public void AddNewWordlist() throws IOException {
    String test = "{"
    + "\"topic\": \"k\","
    + "\"enabled\": true,"
    + "\"nouns\": ["
    + "{\"word\": \"he\", \"forms\": [\"he\"]},"
    + "{\"word\": \"she\", \"forms\": [\"he\"]}"
    + "],"
    + "\"adjectives\": ["
    + "{\"word\": \"he\", \"forms\": [\"he\"]},"
    + "{\"word\": \"he\", \"forms\": [\"he\"]}"
    + "],"
    + "\"verbs\": ["
    + "{\"word\": \"he\", \"forms\": [\"he\"]},"
    + "{\"word\": \"he\", \"forms\": [\"he\"]}"
    + "],"
    + "\"misc\": ["
    + "{\"word\": \"he\", \"forms\": [\"he\"]},"
    + "{\"word\": \"he\", \"forms\": [\"he\"]}"
    + "]"
    + "}"
    ;

    mockReq.setBodyContent(test);
    mockReq.setMethod("POST");

    Context ctx = ContextUtil.init(mockReq, mockRes, "api/wordlists");

    contextPackController.addNewWordlist(ctx);
    assertEquals(201, mockRes.getStatus());

    String result = ctx.resultString();

    String id = jsonMapper.readValue(result, ObjectNode.class).get("id").asText();
    assertNotEquals("", id);
    System.out.println(id);

    assertEquals(1, db.getCollection("wordlists").countDocuments(eq("_id", new ObjectId(id))));


    Document addedList = db.getCollection("wordlists").find(eq("_id", new ObjectId(id))).first();
    assertNotNull(addedList);
    assertEquals("k", addedList.getString("topic"));

    addedList = db.getCollection("wordlists").find(eq("nouns.word", "he")).first();
    assertNotNull(addedList);

  }

  @Test
  public void AddInvalidWordlistNullTopic(){
    String test = "{"
    + "\"topic\": \"\","
    + "\"enabled\": true,"
    + "\"nouns\": ["
    + "{\"word\": \"he\", \"forms\": [\"he\"]},"
    + "{\"word\": \"she\", \"forms\": [\"he\"]}"
    + "],"
    + "\"adjectives\": ["
    + "{\"word\": \"he\", \"forms\": [\"he\"]},"
    + "{\"word\": \"he\", \"forms\": [\"he\"]}"
    + "],"
    + "\"verbs\": ["
    + "{\"word\": \"he\", \"forms\": [\"he\"]},"
    + "{\"word\": \"he\", \"forms\": [\"he\"]}"
    + "],"
    + "\"misc\": ["
    + "{\"word\": \"he\", \"forms\": [\"he\"]},"
    + "{\"word\": \"he\", \"forms\": [\"he\"]}"
    + "]"
    + "}"
    ;

    mockReq.setBodyContent(test);
    mockReq.setMethod("POST");
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/wordlists");

    assertThrows(BadRequestResponse.class, () -> {
      contextPackController.addNewWordlist(ctx);
    });

  }

  @Test
  public void AddInvalidWordlistIllegalStatus(){
    String test = "{"
    + "\"topic\": \"cats\","
    + "\"enabled\": hockey,"
    + "\"nouns\": ["
    + "{\"word\": \"he\", \"forms\": [\"he\"]},"
    + "{\"word\": \"she\", \"forms\": [\"he\"]}"
    + "],"
    + "\"adjectives\": ["
    + "{\"word\": \"he\", \"forms\": [\"he\"]},"
    + "{\"word\": \"he\", \"forms\": [\"he\"]}"
    + "],"
    + "\"verbs\": ["
    + "{\"word\": \"he\", \"forms\": [\"he\"]},"
    + "{\"word\": \"he\", \"forms\": [\"he\"]}"
    + "],"
    + "\"misc\": ["
    + "{\"word\": \"he\", \"forms\": [\"he\"]},"
    + "{\"word\": \"he\", \"forms\": [\"he\"]}"
    + "]"
    + "}"
    ;

    mockReq.setBodyContent(test);
    mockReq.setMethod("POST");
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/wordlists");

    assertThrows(BadRequestResponse.class, () -> {
      contextPackController.addNewWordlist(ctx);
    });

  }

  @Test
  public void AddInvalidContextPackIllegalStatus(){
    String test = "{"
    + "\"topic\": \"cats\","
    + "\"enabled\": hockey,"
    + "\"nouns\": ["
    + "{\"word\": \"he\", \"forms\": [\"he\"]},"
    + "{\"word\": \"she\", \"forms\": [\"he\"]}"
    + "],"
    + "\"adjectives\": ["
    + "{\"word\": \"he\", \"forms\": [\"he\"]},"
    + "{\"word\": \"he\", \"forms\": [\"he\"]}"
    + "],"
    + "\"verbs\": ["
    + "{\"word\": \"he\", \"forms\": [\"he\"]},"
    + "{\"word\": \"he\", \"forms\": [\"he\"]}"
    + "],"
    + "\"misc\": ["
    + "{\"word\": \"he\", \"forms\": [\"he\"]},"
    + "{\"word\": \"he\", \"forms\": [\"he\"]}"
    + "]"
    + "}"
    ;

    mockReq.setBodyContent(test);
    mockReq.setMethod("POST");
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/wordlists");

    assertThrows(BadRequestResponse.class, () -> {
      contextPackController.addNewWordlist(ctx);
    });

  }

  @Test
  public void AddNewContextPack() throws IOException {
    String test = "{"
    + "\"name\": \"sight words\","
    + "\"icon\": \"eye.png\","
    + "\"enabled\": true,"
    + "\"wordlist\":"
      + "{"
      + "\"topic\": \"goats\","
      + "\"enabled\": true,"
      + "\"nouns\": ["
      + "{\"word\": \"boat\", \"forms\": [\"he\"]},"
      + "{\"word\": \"she\", \"forms\": [\"he\"]}"
      + "],"
      + "\"adjectives\": ["
      + "{\"word\": \"he\", \"forms\": [\"he\"]},"
      + "{\"word\": \"he\", \"forms\": [\"he\"]}"
      + "],"
      + "\"verbs\": ["
      + "{\"word\": \"he\", \"forms\": [\"he\"]},"
      + "{\"word\": \"he\", \"forms\": [\"he\"]}"
      + "],"
      + "\"misc\": ["
      + "{\"word\": \"duck\", \"forms\": [\"ducky\"]},"
      + "{\"word\": \"he\", \"forms\": [\"he\"]}"
      + "]"
      + "}}"
    ;

    mockReq.setBodyContent(test);
    mockReq.setMethod("POST");

    Context ctx = ContextUtil.init(mockReq, mockRes, "api/contextpacks");

    contextPackController.addNewContextPack(ctx);
    assertEquals(201, mockRes.getStatus());

    String result = ctx.resultString();
    String id = jsonMapper.readValue(result, ObjectNode.class).get("id").asText();

    assertNotEquals("", id);
    System.out.println(id);
    System.out.println(result);

    assertEquals(1, db.getCollection("contextpacks").countDocuments(eq("_id", new ObjectId(id))));


    Document addedPack = db.getCollection("contextpacks").find(eq("_id", new ObjectId(id))).first();
    assertNotNull(addedPack);
    assertEquals("sight words", addedPack.getString("name"));
    assertNotNull(addedPack);

  }

  @Test
  public void GetContextPack(){
    String testContextPackID = testID.toHexString();

    Context ctx = ContextUtil.init(mockReq, mockRes, "api/contextpacks/:id" , ImmutableMap.of("id", testContextPackID));
    contextPackController.getContextPack(ctx);
    assertEquals(200, mockRes.getStatus());

    String result = ctx.resultString();
    ContextPack resultPack = JavalinJson.fromJson(result, ContextPack.class);

    assertEquals(resultPack._id, testContextPackID);
    assertEquals(resultPack.name, "baskets");
  }

  @Test
  public void getContextPackInvalidID(){
     Context ctx = ContextUtil.init(mockReq, mockRes, "api/contextpacks/:id" , ImmutableMap.of("id", "chickens"));

    assertThrows(BadRequestResponse.class, ()->{
      contextPackController.getContextPack(ctx);
    });

  }

  @Test
  public void getContextPackNOID(){
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/contextpacks/:id" , ImmutableMap.of("id", "58af3a600343927e48e87335"));

    assertThrows(NotFoundResponse.class, ()->{
      contextPackController.getContextPack(ctx);
    });

  }
  @Test
  public void GetWordlist(){
    String testlistID = testID.toHexString();

    Context ctx = ContextUtil.init(mockReq, mockRes, "api/wordlists/:id" , ImmutableMap.of("id", testlistID));
    contextPackController.getWordlist(ctx);
    assertEquals(200, mockRes.getStatus());

    String result = ctx.resultString();
    Wordlist resultPack = JavalinJson.fromJson(result, Wordlist.class);

    assertEquals(resultPack._id, testlistID);
    assertEquals(resultPack.topic, "MountainDew");
  }

  @Test
  public void getWordlistInvalidID(){
     Context ctx = ContextUtil.init(mockReq, mockRes, "api/wordlists/:id" , ImmutableMap.of("id", "chickens"));

    assertThrows(BadRequestResponse.class, ()->{
      contextPackController.getWordlist(ctx);
    });

  }

  @Test
  public void getWordlistNOID(){
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/wordlists/:id" , ImmutableMap.of("id", "58af3a600343927e48e87335"));

    assertThrows(NotFoundResponse.class, ()->{
      contextPackController.getWordlist(ctx);
    });

  }

}



