package umm3601.contextpack;

import static com.mongodb.client.model.Filters.and;


import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

import com.google.common.collect.ImmutableMap;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Filters;
import com.mongodb.client.model.Updates;
import com.mongodb.client.result.UpdateResult;

import org.bson.Document;
import org.bson.conversions.Bson;
import org.bson.json.JsonWriterSettings;
import org.bson.types.ObjectId;
import org.mongojack.JacksonMongoCollection;

import io.javalin.http.BadRequestResponse;
import io.javalin.http.Context;
import io.javalin.http.NotFoundResponse;
import static com.mongodb.client.model.Filters.eq;

public class ContextPackController {
  String statusRegex = "^(?i)(true|false)$";
  private static final String NAME_KEY = "name";
  private static final String ENABLED_KEY = "enabled";


  private final JacksonMongoCollection<ContextPack> contextPackCollection;
  static MongoClient mongoClient;
  static MongoDatabase db;


  public ContextPackController(MongoDatabase database){
    contextPackCollection = JacksonMongoCollection.builder().build(database, "contextpacks", ContextPack.class);
  }


  public void getContextPack(Context ctx) {
    String id = ctx.pathParam("id");
    ContextPack contextpack;

    try {
      contextpack = contextPackCollection.find(eq("_id", new ObjectId(id))).first();
    } catch(IllegalArgumentException e) {
      throw new BadRequestResponse("The requested contextpack id wasn't a legal Mongo Object ID.");
    }
    if (contextpack == null) {
      throw new NotFoundResponse("The requested contextpack was not found");
    } else {
      ctx.json(contextpack);
    }
  }

  public void getContextPacks(Context ctx){

    List<Bson> filters = new ArrayList<>();

    ctx.json(contextPackCollection.find(filters.isEmpty()? new Document() : and(filters))
    .into(new ArrayList<>()));
  }

  public void addNewContextPack(Context ctx){
    ContextPack newPack = ctx.bodyValidator(ContextPack.class)
      .check(pack -> pack.name != null )
      .check(pack -> String.valueOf(pack.enabled).matches(statusRegex))

      .get();

      contextPackCollection.insertOne(newPack);
      ctx.status(201);
      ctx.json(ImmutableMap.of("id", newPack._id));

  }

  public void editContextPackName(Context ctx){
    String id = ctx.pathParam("id");
    Bson filter = eq("_id", id);
    List<Bson> updateOperations = new ArrayList<>();

    if (ctx.queryParamMap().containsKey(NAME_KEY)) {
     updateOperations.add(Updates.set("name",  ctx.queryParam(NAME_KEY)));
    }
    if (ctx.queryParamMap().containsKey(ENABLED_KEY)) {
      updateOperations.add(Updates.set("enabled",  ctx.queryParam(ENABLED_KEY)));
    }

    System.out.println(contextPackCollection.find(filter).first().wordlists.get(0).enabled);

    contextPackCollection.updateOne(filter, updateOperations);
    ContextPack pack = contextPackCollection.find(filter).first();
    ctx.json(pack);

  }







}
