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
    MongoCollection<Document> contextPackDocuments = db.getCollection("contextpacks");
    contextPackDocuments.drop();
    Document testList =
      new Document()
        .append("name", "horses")
        .append("enabled", true)
        .append("k", new Document()
          .append("enabled", true)
          .append("verbs", Arrays.asList(new Document("word","horse").append("forms", Arrays.asList("horsie", "horse"))))
          .append("nouns", Arrays.asList(new Document("word", "horse").append("forms", Arrays.asList("horsie","horse"))))
          .append("adjectives", Arrays.asList(new Document("word", "horse").append("forms", Arrays.asList("horsie","horse"))))
          .append("misc", Arrays.asList(new Document("word", "horse").append("forms", Arrays.asList("horsie","horse")))))
        ;
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
    assertTrue(JavalinJson.fromJson(result, ContextPack[].class).length>=1);
    assertEquals(db.getCollection("contextpacks").countDocuments(), JavalinJson.fromJson(result, ContextPack[].class).length);

  }

  @Test
  public void ContextPacksHaveAllFields(){
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/contextpacks");
    contextPackController.getContextPacks(ctx);

    contextPackController.getContextPacks(ctx);
    assertEquals(200, mockRes.getStatus());

    String result = ctx.resultString();
    ContextPack[] resultPacks = JavalinJson.fromJson(result, ContextPack[].class);

    for(ContextPack pack: resultPacks) {
      assertEquals(true, pack.enabled);
      assertEquals(true, pack.k.getEnabled());
    }

  }

}



