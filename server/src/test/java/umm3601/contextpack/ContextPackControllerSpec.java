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
                Arrays.asList(
                new Document("word", "goat").append("forms", Arrays.asList("horsie", "horse")),
                new Document("word", "train").append("forms", Arrays.asList("trains"))
                )),

      new Document("name", "cats")
            .append("enabled", false)
            .append("verbs",
                Arrays.asList(
                new Document("word", "run").append("forms", Arrays.asList("run", "running")),
                new Document("word", "walk").append("forms", Arrays.asList("walk", "walking"))))
            .append("nouns",
                Arrays.asList(
                new Document("word", "goat").append("forms", Arrays.asList("goat", "goats"))
                ,new Document("word", "cow").append("forms", Arrays.asList("cow", "cows")) ))
            .append("adjectives",
                Arrays.asList(
                new Document("word", "red").append("forms", Arrays.asList("red", "reds")),
                new Document("word", "blue").append("forms", Arrays.asList("blue", "blues"))
                ))
            .append("misc",
                Arrays.asList(
                new Document("word", "moo").append("forms", Arrays.asList("moo")),
                new Document("word", "bark").append("forms", Arrays.asList("bark", "barks", "barky"))
                ))

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
  public void editPackName() throws IOException {

    String id = testID.toHexString();

    Context ctx = ContextUtil.init(mockReq, mockRes, "/api/contextpacks/:id/editpack", ImmutableMap.of("id", id));

    // Test editing name and enabled together
    mockReq.setQueryString("name=frank&enabled=false");
    contextPackController.editContextPack(ctx);

    assertEquals(200, mockRes.getStatus());
    String result = ctx.resultString();
    ContextPack resultPack = JavalinJson.fromJson(result, ContextPack.class);

    assertEquals(resultPack._id, testID.toHexString());
    assertEquals(resultPack.enabled, false);
    assertEquals("frank", resultPack.name);

    // Test editing name
    mockReq.setQueryString("name=coconuts");
    contextPackController.editContextPack(ctx);

    assertEquals(200, mockRes.getStatus());
    result = ctx.resultString();
    resultPack = JavalinJson.fromJson(result, ContextPack.class);

    assertEquals(resultPack._id, testID.toHexString());
    assertEquals(resultPack.enabled, false);
    assertEquals("coconuts", resultPack.name);

    //Test editing enabled
    mockReq.setQueryString("enabled=true");
    contextPackController.editContextPack(ctx);

    assertEquals(200, mockRes.getStatus());
    result = ctx.resultString();
    resultPack = JavalinJson.fromJson(result, ContextPack.class);

    assertEquals(resultPack._id, testID.toHexString());
    assertEquals(resultPack.enabled, true);
    assertEquals(resultPack.wordlists.get(0).enabled, true);
    assertEquals(resultPack.wordlists.get(1).enabled, false);
  }

  @Test
  public void editListName() throws IOException {
    String id = testID.toHexString();

    Context ctx = ContextUtil.init(mockReq, mockRes, "api/contextpacks/:id/editlist", ImmutableMap.of("id", id));
    mockReq.setQueryString("listname=dogs&enabled=false&name=donkeys");
    contextPackController.editWordlist(ctx);

    assertEquals(200, mockRes.getStatus());
    String result = ctx.resultString();
    ContextPack resultPack = JavalinJson.fromJson(result, ContextPack.class);

    assertEquals(resultPack._id, testID.toHexString());
    assertEquals(resultPack.wordlists.get(0).enabled, false);
    assertEquals(resultPack.wordlists.get(1).enabled, false);
    assertEquals(resultPack.wordlists.get(0).name, "donkeys");
    assertEquals(resultPack.wordlists.get(1).name, "cats");

    mockReq.setQueryString("listname=donkeys&enabled=true");
    contextPackController.editWordlist(ctx);

    assertEquals(200, mockRes.getStatus());
    result = ctx.resultString();
    resultPack = JavalinJson.fromJson(result, ContextPack.class);

    assertEquals(resultPack._id, testID.toHexString());


  }
  @Test
  public void deleteNoun(){
    String id = testID.toHexString();

    Context ctx = ContextUtil.init(mockReq, mockRes, "api/contextpacks/:id/editlist", ImmutableMap.of("id", id));
    mockReq.setQueryString("delnoun=goat&listname=cats");
    contextPackController.editWordlist(ctx);

    assertEquals(200, mockRes.getStatus());
    String result = ctx.resultString();
    ContextPack resultPack = JavalinJson.fromJson(result, ContextPack.class);

    assertEquals(resultPack._id, testID.toHexString());
    assertEquals(resultPack.wordlists.get(1).nouns.get(0).word, "cow");


  }
  @Test
  public void deleteVerb(){
    String id = testID.toHexString();

    Context ctx = ContextUtil.init(mockReq, mockRes, "api/contextpacks/:id/editlist", ImmutableMap.of("id", id));
    mockReq.setQueryString("delverb=run&listname=cats");
    contextPackController.editWordlist(ctx);

    assertEquals(200, mockRes.getStatus());
    String result = ctx.resultString();
    ContextPack resultPack = JavalinJson.fromJson(result, ContextPack.class);

    assertEquals(resultPack._id, testID.toHexString());
    assertEquals(resultPack.wordlists.get(1).verbs.get(0).word, "walk");
    assertNotEquals(resultPack.wordlists.get(1).verbs.get(0).word, "run");

  }
  @Test
  public void deleteAdj(){
    String id = testID.toHexString();

    Context ctx = ContextUtil.init(mockReq, mockRes, "api/contextpacks/:id/editlist", ImmutableMap.of("id", id));
    mockReq.setQueryString("deladj=red&listname=cats");
    contextPackController.editWordlist(ctx);

    assertEquals(200, mockRes.getStatus());
    String result = ctx.resultString();
    ContextPack resultPack = JavalinJson.fromJson(result, ContextPack.class);

    assertEquals(resultPack._id, testID.toHexString());
    assertEquals(resultPack.wordlists.get(1).adjectives.get(0).word, "blue");
    assertNotEquals(resultPack.wordlists.get(1).adjectives.get(0).word, "red");

  }
  @Test
  public void deleteMisc(){
    String id = testID.toHexString();

    Context ctx = ContextUtil.init(mockReq, mockRes, "api/contextpacks/:id/editlist", ImmutableMap.of("id", id));
    mockReq.setQueryString("delmisc=bark&listname=cats");
    contextPackController.editWordlist(ctx);

    assertEquals(200, mockRes.getStatus());
    String result = ctx.resultString();
    ContextPack resultPack = JavalinJson.fromJson(result, ContextPack.class);

    assertEquals(resultPack._id, testID.toHexString());
    assertEquals(resultPack.wordlists.get(1).misc.get(0).word, "moo");
    assertNotEquals(resultPack.wordlists.get(1).misc.get(0).word, "bark");

  }
  @Test
  public void editWordlistNonExistentWordlistName(){
    String id = testID.toHexString();

    Context ctx = ContextUtil.init(mockReq, mockRes, "api/contextpacks/:id/editlist", ImmutableMap.of("id", id));
    mockReq.setQueryString("delverb=run&listname=hamburger");


    assertThrows(NotFoundResponse.class, ()->{
      contextPackController.editWordlist(ctx);
    });
  }

  @Test
  public void addVerb(){
    String id = testID.toHexString();

    Context ctx = ContextUtil.init(mockReq, mockRes, "api/contextpacks/:id/editlist", ImmutableMap.of("id", id));
    mockReq.setQueryString("addverb=fall,falls&listname=cats");
    contextPackController.editWordlist(ctx);

    assertEquals(200, mockRes.getStatus());
    String result = ctx.resultString();
    ContextPack resultPack = JavalinJson.fromJson(result, ContextPack.class);

    assertEquals(resultPack._id, testID.toHexString());
    assertEquals(resultPack.wordlists.get(1).verbs.get(0).forms, Arrays.asList("run","running"));
    assertEquals(resultPack.wordlists.get(1).verbs.get(1).forms, Arrays.asList("walk","walking"));
    assertEquals(resultPack.wordlists.get(1).verbs.get(2).forms, Arrays.asList("fall", "falls"));
  }
  @Test
  public void addMisc(){
    String id = testID.toHexString();

    // adding word with forms
    Context ctx = ContextUtil.init(mockReq, mockRes, "api/contextpacks/:id/editlist", ImmutableMap.of("id", id));
    mockReq.setQueryString("addmisc=test,tests,testing&listname=cats");
    contextPackController.editWordlist(ctx);

    assertEquals(200, mockRes.getStatus());
    String result = ctx.resultString();
    ContextPack resultPack = JavalinJson.fromJson(result, ContextPack.class);

    assertEquals(resultPack._id, testID.toHexString());
    assertEquals(resultPack.wordlists.get(1).misc.get(0).forms, Arrays.asList("moo"));
    assertEquals(resultPack.wordlists.get(1).misc.get(1).forms, Arrays.asList("bark", "barks", "barky"));
    assertEquals(resultPack.wordlists.get(1).misc.get(2).forms, Arrays.asList("test","tests", "testing"));
    assertEquals(resultPack.wordlists.get(1).misc.get(2).word, "test");


    // adding word with no extra forms
    ctx = ContextUtil.init(mockReq, mockRes, "api/contextpacks/:id/editlist", ImmutableMap.of("id", id));
    mockReq.setQueryString("addmisc=test&listname=dogs");
    contextPackController.editWordlist(ctx);

    assertEquals(200, mockRes.getStatus());
    result = ctx.resultString();
    resultPack = JavalinJson.fromJson(result, ContextPack.class);

    assertEquals(resultPack._id, testID.toHexString());
    assertEquals(resultPack.wordlists.get(0).misc.get(0).forms, Arrays.asList("horsie", "horse"));
    assertEquals(resultPack.wordlists.get(0).misc.get(1).forms, Arrays.asList("trains"));
    assertEquals(resultPack.wordlists.get(0).misc.get(2).forms, Arrays.asList("test"));

  }

  @Test
  public void addAdj(){
    String id = testID.toHexString();

    Context ctx = ContextUtil.init(mockReq, mockRes, "api/contextpacks/:id/editlist", ImmutableMap.of("id", id));
    mockReq.setQueryString("addadj=purple,purples&listname=cats");
    contextPackController.editWordlist(ctx);

    assertEquals(200, mockRes.getStatus());
    String result = ctx.resultString();
    ContextPack resultPack = JavalinJson.fromJson(result, ContextPack.class);

    assertEquals(resultPack._id, testID.toHexString());
    assertEquals(resultPack.wordlists.get(1).adjectives.get(0).forms, Arrays.asList("red","reds"));
    assertEquals(resultPack.wordlists.get(1).adjectives.get(1).forms, Arrays.asList("blue","blues"));
    assertEquals(resultPack.wordlists.get(1).adjectives.get(2).forms, Arrays.asList("purple", "purples"));
    assertEquals(resultPack.wordlists.get(1).adjectives.get(2).word, "purple");
  }

  @Test
  public void addNoun(){
    String id = testID.toHexString();

    Context ctx = ContextUtil.init(mockReq, mockRes, "api/contextpacks/:id/editlist", ImmutableMap.of("id", id));
    mockReq.setQueryString("addnoun=jeep,jeeps,jeeper,jeepy&listname=cats");
    contextPackController.editWordlist(ctx);

    assertEquals(200, mockRes.getStatus());
    String result = ctx.resultString();
    ContextPack resultPack = JavalinJson.fromJson(result, ContextPack.class);

    assertEquals(resultPack._id, testID.toHexString());
    assertEquals(resultPack.wordlists.get(1).nouns.get(0).forms, Arrays.asList("goat","goats"));
    assertEquals(resultPack.wordlists.get(1).nouns.get(1).forms, Arrays.asList("cow","cows"));
    assertEquals(resultPack.wordlists.get(1).nouns.get(2).forms, Arrays.asList("jeep", "jeeps", "jeeper", "jeepy"));
    assertEquals(resultPack.wordlists.get(1).nouns.get(2).word, "jeep");
  }

   @Test
   public void AddWordPos(){
     Wordlist list = new Wordlist();
     ArrayList<String> posArray = new ArrayList<>(Arrays.asList("cow", "cows"));

     assertThrows(NotFoundResponse.class, ()->{
       list.addWord( posArray, "banana");
     });

    }





}






