package umm3601.contextpack;

import static com.mongodb.client.model.Filters.and;


import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

import com.google.common.collect.ImmutableMap;
import com.mongodb.BasicDBObject;
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
  private static final String NOUN_DEL_KEY = "delnoun";
  private static final String VERB_DEL_KEY ="delverb";



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

    ctx.json(contextPackCollection.find()
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

  public void editWordlist(Context ctx){
    String listname = ctx.queryParam("listname");
    String id = ctx.pathParam("id");
    boolean match = false;

    Bson filter = and(eq("_id", id));
    int index=0;
    ContextPack pack = contextPackCollection.find(filter).first();
    for(int i=0; i<pack.wordlists.size(); i++){
      if(pack.wordlists.get(i).name.equals(listname)){
        index =i;
        match=true;
        break;
      }
    }
    if(match == false){throw new NotFoundResponse("The requested wordlist was not found");}
    Wordlist list = pack.wordlists.get(index);

    if (ctx.queryParamMap().containsKey(ENABLED_KEY)) {
      boolean enabled = ctx.queryParam(ENABLED_KEY).equals("false") ? false : true;
      list.setEnabled(enabled);
    }
    if(ctx.queryParamMap().containsKey(NAME_KEY)){
      list.setName(ctx.queryParam(NAME_KEY));

    }
    if(ctx.queryParamMap().containsKey(NOUN_DEL_KEY)){
      list.deleteNoun(ctx.queryParam(NOUN_DEL_KEY));
    }
    if(ctx.queryParamMap().containsKey(VERB_DEL_KEY)){
      list.deleteVerb(ctx.queryParam(VERB_DEL_KEY));
    }

    contextPackCollection.replaceOne(eq("_id", id), pack);
    pack = contextPackCollection.find(filter).first();
    ctx.json(pack);

  }









}
