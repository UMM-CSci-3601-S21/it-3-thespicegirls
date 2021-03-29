package umm3601.contextpack;

import static com.mongodb.client.model.Filters.and;


import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.regex.Pattern;

import javax.management.InvalidAttributeValueException;

import com.google.common.collect.ImmutableMap;
import com.mongodb.BasicDBObject;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Filters;
import com.mongodb.client.model.FindOneAndUpdateOptions;
import com.mongodb.client.model.ReturnDocument;
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
  private static final String ICON_KEY = "icon";
  private static final String NOUN_DEL_KEY = "delnoun";
  private static final String VERB_DEL_KEY ="delverb";
  private static final String MISC_DEL_KEY ="delmisc";
  private static final String ADJ_DEL_KEY ="deladj";
  private static final String NOUN_FORM_KEY ="nounforms";
  private static final String ADJ_FORM_KEY ="adjforms";
  private static final String MISC_FORM_KEY ="miscforms";
  private static final String VERB_FORM_KEY ="verbforms";
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

  //Calls correct addForms() version according to specified parameters - does all changes then replaces mongo document
  public void addFormsWordlist(Context ctx){
    String id = ctx.pathParam("id");
    ContextPack pack = contextPackCollection.find(eq("_id", id)).first();
    int index = getListIndex(pack,ctx.queryParam("listname"));
    Wordlist list = pack.wordlists.get(index);

    if(ctx.queryParamMap().containsKey(NOUN_FORM_KEY)){
      addForms(NOUN_FORM_KEY, ctx, list);
    }
    if(ctx.queryParamMap().containsKey(ADJ_FORM_KEY)){
      addForms(ADJ_FORM_KEY, ctx, list);
    }
    if(ctx.queryParamMap().containsKey(MISC_FORM_KEY)){
      addForms(MISC_FORM_KEY, ctx, list);
    }
    if(ctx.queryParamMap().containsKey(VERB_FORM_KEY)){
      addForms(VERB_FORM_KEY, ctx, list);
    }
    contextPackCollection.replaceOne(eq("_id", id), pack);
    pack = contextPackCollection.find(eq("_id", id)).first();
    ctx.json(pack);
  }

  //Looks through all the word arrays to find the designated word and adds new forms to it
  public void addForms(String key, Context ctx, Wordlist list){
    String forms[] = ctx.queryParam(key).split(",");
    String wordString = forms[0];
    int wordIndex =0;
    Word word;
    switch(key){
      case VERB_FORM_KEY:
        wordIndex = getWordIndex(list, wordString, "verb");
        word = list.verbs.get(wordIndex);
        for(int i=1; i<forms.length; i++){word.addForm(forms[i]);}
        break;
      case MISC_FORM_KEY:
        wordIndex = getWordIndex(list, wordString, "misc");
        word = list.misc.get(wordIndex);
        for(int i=1; i<forms.length; i++){word.addForm(forms[i]);}
        break;
      case ADJ_FORM_KEY:
        wordIndex = getWordIndex(list, wordString, "adj");
        word = list.adjectives.get(wordIndex);
        for(int i=1; i<forms.length; i++){word.addForm(forms[i]);}
        break;
      case NOUN_FORM_KEY:
        wordIndex = getWordIndex(list, wordString, "noun");
        word = list.nouns.get(wordIndex);
        for(int i=1; i<forms.length; i++){word.addForm(forms[i]);}
        break;
    }
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

  public int getWordIndex(Wordlist list, String word, String pos) {
    int index=0;
    boolean match = false;
    ArrayList<Word>posArray = new ArrayList<Word>();
    int size = 0;
    switch(pos){
      case "noun":
        posArray = list.nouns;size = list.nouns.size();
        break;
      case "adj":
        posArray = list.adjectives;size = list.adjectives.size();
        break;
      case "misc":
        posArray = list.misc;size = list.misc.size();
        break;
      case "verb":
        posArray = list.verbs;size = list.verbs.size();
        break;
      default:
      throw new NotFoundResponse("The requested part of speech was not found");
    }
    for(int i=0; i<size; i++){
      if(posArray.get(i).word.equals(word)){
        index =i;match=true;
        break;
      }
    }
    if(match == false){throw new NotFoundResponse("The requested word was not found");}
    return index;
  }













}
