package umm3601.contextpack;

import static com.mongodb.client.model.Filters.and;


import java.util.ArrayList;
import java.util.List;


import com.google.common.collect.ImmutableMap;

import com.mongodb.client.MongoDatabase;


import org.bson.Document;
import org.bson.conversions.Bson;
import org.bson.types.ObjectId;
import org.mongojack.JacksonMongoCollection;

import io.javalin.http.BadRequestResponse;
import io.javalin.http.Context;
import io.javalin.http.NotFoundResponse;
import static com.mongodb.client.model.Filters.eq;

public class ContextPackController {
  String statusRegex = "^(?i)(true|false)$";


  private final JacksonMongoCollection<ContextPack> contextPackCollection;
  private final JacksonMongoCollection<Wordlist> wordlistCollection;


  public ContextPackController(MongoDatabase database){
    contextPackCollection = JacksonMongoCollection.builder().build(database, "contextpacks", ContextPack.class);
    wordlistCollection = JacksonMongoCollection.builder().build(database, "wordlists", Wordlist.class);
  }

  public void getWordlist(Context ctx) {
    String id = ctx.pathParam("id");
    Wordlist wordlist;

    try {
      wordlist = wordlistCollection.find(eq("_id", new ObjectId(id))).first();
    } catch(IllegalArgumentException e) {
      throw new BadRequestResponse("The requested wordlist id wasn't a legal Mongo Object ID.");
    }
    if (wordlist == null) {
      throw new NotFoundResponse("The requested wordlist was not found");
    } else {
      ctx.json(wordlist);
    }
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

  public void getWordlists(Context ctx){

    List<Bson> filters = new ArrayList<>();

    ctx.json(wordlistCollection.find(filters.isEmpty()? new Document() : and(filters))
    .into(new ArrayList<>()));
  }


  public void addNewWordlist(Context ctx){
    Wordlist newList = ctx.bodyValidator(Wordlist.class)
      .check(list -> list.topic.matches("^[a-zA-Z]+$") && list.topic != null)
      .check(list -> String.valueOf(list.enabled).matches(statusRegex))
      .get();

      wordlistCollection.insertOne(newList);
      ctx.status(201);
      ctx.json(ImmutableMap.of("id", newList._id));
  }





}
