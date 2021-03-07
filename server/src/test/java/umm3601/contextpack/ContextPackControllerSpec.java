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

import io.javalin.http.util.ContextUtil;
import io.javalin.plugin.json.JavalinJson;
import umm3601.contextpack.ContextPackControllerSpec;

public class ContextPackControllerSpec {

  MockHttpServletRequest mockReq = new MockHttpServletRequest();
  MockHttpServletResponse mockRes = new MockHttpServletResponse();

  private ContextPackController contextPackController;

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
    Document testList = new Document().append("name", "animals").append("enabled", true).append("wordlist",
        new Document().append("topic", "cats").append("enabled", true)
            .append("verbs",
                Arrays.asList(new Document("word", "horse").append("forms", Arrays.asList("horsie", "horse"))))
            .append("nouns",
                Arrays.asList(new Document("word", "horse").append("forms", Arrays.asList("horsie", "horse"))))
            .append("adjectives",
                Arrays.asList(new Document("word", "horse").append("forms", Arrays.asList("horsie", "horse"))))
            .append("misc",
                Arrays.asList(new Document("word", "horse").append("forms", Arrays.asList("horsie", "horse")))));
    contextPackDocuments.insertOne(testList);
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
  public void ContextPacksHaveAllFields() {
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/contextpacks");
    contextPackController.getContextPacks(ctx);

    contextPackController.getContextPacks(ctx);
    assertEquals(200, mockRes.getStatus());

    String result = ctx.resultString();
    ContextPack[] resultPacks = JavalinJson.fromJson(result, ContextPack[].class);

    for (ContextPack pack : resultPacks) {
      assertEquals(true, pack.enabled);
      assertEquals(true, pack.wordlist.getEnabled());
      assertEquals("cats", pack.wordlist.topic);
      assertEquals("horse", pack.wordlist.nouns.get(0).getWord());
      assertEquals(Arrays.asList("horsie", "horse"), pack.wordlist.nouns.get(0).getForms());
    }

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

    assertEquals(1, db.getCollection("wordlist").countDocuments(eq("_id", new ObjectId(id))));


    Document addedList = db.getCollection("wordlist").find(eq("_id", new ObjectId(id))).first();
    assertNotNull(addedList);
    assertEquals("k", addedList.getString("topic"));

    addedList = db.getCollection("wordlist").find(eq("nouns.word", "he")).first();
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

}



