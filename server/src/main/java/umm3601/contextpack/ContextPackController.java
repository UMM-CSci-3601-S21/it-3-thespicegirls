package umm3601.contextpack;

import static com.mongodb.client.model.Filters.and;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import com.google.common.collect.ImmutableMap;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Updates;

import org.bson.conversions.Bson;
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
  private static final String ICON_KEY = "icon";
  private static final String NOUN_DEL_KEY = "delnoun";
  private static final String VERB_DEL_KEY ="delverb";
  private static final String MISC_DEL_KEY ="delmisc";
  private static final String ADJ_DEL_KEY ="deladj";
  private static final String ADD_VERB_KEY = "addverb";
  private static final String ADD_MISC_KEY = "addmisc";
  private static final String ADD_ADJ_KEY = "addadj";
  private static final String ADD_NOUN_KEY = "addnoun";




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

  //Stores all designated update operations then updates document in one call
  public void editContextPack(Context ctx){
    String id = ctx.pathParam("id");
    Bson filter = eq("_id", id);
    List<Bson> updateOperations = new ArrayList<>();

    if (ctx.queryParamMap().containsKey(NAME_KEY)) {
     updateOperations.add(Updates.set("name", ctx.queryParam(NAME_KEY)));
    }
    if (ctx.queryParamMap().containsKey(ENABLED_KEY)) {
     updateOperations.add(Updates.set("enabled", ctx.queryParam(ENABLED_KEY)));
    }
    if (ctx.queryParamMap().containsKey(ICON_KEY)) {
      updateOperations.add(Updates.set("icon", ctx.queryParam(ICON_KEY)));
    }
    System.out.println(contextPackCollection.find(filter).first().wordlists.get(0).enabled);

    contextPackCollection.updateOne(filter, updateOperations);
    ContextPack pack = contextPackCollection.find(filter).first();
    ctx.json(pack);

  }

  //Edits wordlist name and enabled status, adds and removes words in word arrays - makes all the changes and then replaces mongo document
  public void editWordlist(Context ctx){
    Bson filter = and(eq("_id", ctx.pathParam("id")));
    ContextPack pack = contextPackCollection.find(filter).first();
    int index = getListIndex(pack,ctx.queryParam("listname"));

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
    if(ctx.queryParamMap().containsKey(ADJ_DEL_KEY)){
      list.deleteAdj(ctx.queryParam(ADJ_DEL_KEY));
    }
    if(ctx.queryParamMap().containsKey(MISC_DEL_KEY)){
      list.deleteMisc(ctx.queryParam(MISC_DEL_KEY));
    }
    if(ctx.queryParamMap().containsKey(ADD_ADJ_KEY)){
      ArrayList<String> posArray = new ArrayList<>(Arrays.asList((ctx.queryParam(ADD_ADJ_KEY).split(","))));
      list.addWord(posArray, "adj");
    }
    if(ctx.queryParamMap().containsKey(ADD_NOUN_KEY)){
      ArrayList<String> posArray = new ArrayList<>(Arrays.asList((ctx.queryParam(ADD_NOUN_KEY).split(","))));
      list.addWord(posArray, "noun");
    }
    if(ctx.queryParamMap().containsKey(ADD_VERB_KEY)){
      ArrayList<String> posArray = new ArrayList<>(Arrays.asList((ctx.queryParam(ADD_VERB_KEY).split(","))));
      list.addWord(posArray, "verb");
    }
    if(ctx.queryParamMap().containsKey(ADD_MISC_KEY)){
      ArrayList<String> posArray = new ArrayList<>(Arrays.asList((ctx.queryParam(ADD_MISC_KEY).split(","))));
      list.addWord(posArray, "misc");
    }
    contextPackCollection.replaceOne(eq("_id", ctx.pathParam("id")), pack);

    pack = contextPackCollection.find(filter).first();
    ctx.json(pack);

  }

  public int getListIndex(ContextPack pack, String listname){
    int index=0;
    boolean match = false;
    for(int i=0; i<pack.wordlists.size(); i++){
      if(pack.wordlists.get(i).name.equals(listname)){
        index =i;match=true;
        break;
      }
    }
    if(match == false){throw new NotFoundResponse("The requested wordlist was not found");}
    return index;
  }

}
