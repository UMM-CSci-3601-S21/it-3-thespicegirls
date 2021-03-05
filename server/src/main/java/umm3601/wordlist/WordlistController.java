package umm3601.wordlist;
import static com.mongodb.client.model.Filters.and;
import static com.mongodb.client.model.Filters.eq;
import static com.mongodb.client.model.Filters.regex;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

import com.google.common.collect.ImmutableMap;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Sorts;

import org.bson.Document;
import org.bson.conversions.Bson;
import org.bson.types.ObjectId;
import org.mongojack.JacksonMongoCollection;

import io.javalin.http.BadRequestResponse;
import io.javalin.http.Context;
import io.javalin.http.NotFoundResponse;

public class WordlistController {
  private static final String TOPIC_KEY = "topic";

  private final JacksonMongoCollection<Wordlist> wordlistCollection;


  public WordlistController(MongoDatabase database){
    wordlistCollection = JacksonMongoCollection.builder().build(database, "wordlists", Wordlist.class);

  }

  public void getWordlists(Context ctx){

    List<Bson> filters = new ArrayList<>();

    ctx.json(wordlistCollection.find(filters.isEmpty()? new Document() : and(filters))
    .into(new ArrayList<>()));

  }




}
