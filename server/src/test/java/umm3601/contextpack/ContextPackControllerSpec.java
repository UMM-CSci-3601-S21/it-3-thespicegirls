package umm3601.contextpack;

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
    testID = new ObjectId();
    Document testPackID = new Document()
    .append("_id", testID)
    .append("name", "baskets")
    .append("icon", "dog.png")
    .append("enabled", true)
    .append("wordlists", Arrays.asList(
      new Document("name", "dogs")
            .append("enabled", true)
            .append("verbs",
                Arrays.asList(new Document("word", "run").append("forms", Arrays.asList("horsie", "horse"))))
            .append("nouns",
                Arrays.asList(new Document("word", "horse").append("forms", Arrays.asList("horsie", "horse"))))
            .append("adjectives",
                Arrays.asList(new Document("word", "blue").append("forms", Arrays.asList("horsie", "horse"))))
            .append("misc",
                Arrays.asList(new Document("word", "goat").append("forms", Arrays.asList("horsie", "horse")))),

      new Document("name", "cats")
            .append("enabled", true)
            .append("verbs",
                Arrays.asList(new Document("word", "walk").append("forms", Arrays.asList("pink", "pork"))))
            .append("nouns",
                Arrays.asList(new Document("word", "goat").append("forms", Arrays.asList("goat", "goats"))))
            .append("adjectives",
                Arrays.asList(new Document("word", "red").append("forms", Arrays.asList("seven", "horse"))))
            .append("misc",
                Arrays.asList(new Document("word", "moo").append("forms", Arrays.asList("horse"))))

                )

    );
    contextPackDocuments.insertOne(testPackID);

    MongoCollection<Document> wordlistDocuments = db.getCollection("wordlists");

    Document testListID = new Document()
          .append("_id", testID)
          .append("name", "MountainDew")
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


  @Test
  public void AddInvalidContextPackNullTopic(){
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
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/contextpacks");

    assertThrows(BadRequestResponse.class, () -> {
      contextPackController.addNewContextPack(ctx);
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
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/contextpacks");

    assertThrows(BadRequestResponse.class, () -> {
      contextPackController.addNewContextPack(ctx);
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
  public void editContextPackName(){
    // Test to make sure name is "baskets" before change
    String testContextPackID = testID.toHexString();

    Context ctx = ContextUtil.init(mockReq, mockRes, "api/contextpacks/:id" , ImmutableMap.of("id", testContextPackID));
    contextPackController.getContextPack(ctx);
    assertEquals(200, mockRes.getStatus());

    String result = ctx.resultString();
    ContextPack resultPack = JavalinJson.fromJson(result, ContextPack.class);

    assertEquals(resultPack._id, testContextPackID);
    assertEquals(resultPack.name, "baskets");

    //update pack name
    contextPackController.editContextPackName(resultPack._id, "bob", ctx );

    // Test to make sure name is now "Bob"
    ctx = ContextUtil.init(mockReq, mockRes, "api/contextpacks/:id" , ImmutableMap.of("id", testContextPackID));
    contextPackController.getContextPack(ctx);
    assertEquals(200, mockRes.getStatus());

    result = ctx.resultString();
    resultPack = JavalinJson.fromJson(result, ContextPack.class);
    System.out.println(resultPack.name);
    assertEquals(resultPack.name, "bob");



  }


}



