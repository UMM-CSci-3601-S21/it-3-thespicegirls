package umm3601.contextpack;

import static com.mongodb.client.model.Filters.and;


import java.util.ArrayList;
import java.util.List;


import com.google.common.collect.ImmutableMap;

import com.mongodb.client.MongoDatabase;


import org.bson.Document;
import org.bson.conversions.Bson;

import org.mongojack.JacksonMongoCollection;


import io.javalin.http.Context;


public class ContextPackController {
  String statusRegex = "^(?i)(true|false)$";


  private final JacksonMongoCollection<ContextPack> contextPackCollection;
  private final JacksonMongoCollection<Wordlist> wordlistCollection;


  public ContextPackController(MongoDatabase database){
    contextPackCollection = JacksonMongoCollection.builder().build(database, "contextpacks", ContextPack.class);
    wordlistCollection = JacksonMongoCollection.builder().build(database, "wordlist", Wordlist.class);
  }

  public void getContextPacks(Context ctx){

    List<Bson> filters = new ArrayList<>();

    ctx.json(contextPackCollection.find(filters.isEmpty()? new Document() : and(filters))
    .into(new ArrayList<>()));
  }


  public void addNewWordlist(Context ctx){
    Wordlist newList = ctx.bodyValidator(Wordlist.class)
      .check(list -> list.topic.length() > 0)
      .check(list -> String.valueOf(list.enabled).matches(statusRegex))
      .get();

      wordlistCollection.insertOne(newList);
      ctx.status(201);
      ctx.json(ImmutableMap.of("id", newList._id));
  }





}
