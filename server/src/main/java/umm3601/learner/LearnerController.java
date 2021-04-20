package umm3601.learner;

import java.util.ArrayList;
import java.util.List;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Updates;

import org.bson.conversions.Bson;
import org.bson.types.ObjectId;
import org.mongojack.JacksonMongoCollection;

import io.javalin.http.BadRequestResponse;
import io.javalin.http.Context;
import io.javalin.http.NotFoundResponse;
import umm3601.contextpack.ContextPack;

import static com.mongodb.client.model.Filters.eq;

public class LearnerController {

  private final JacksonMongoCollection<Learner> learnerCollection;
  private final JacksonMongoCollection<ContextPack> contextPackCollection;



  static MongoClient mongoClient;
  static MongoDatabase db;


  public LearnerController(MongoDatabase database){
    learnerCollection = JacksonMongoCollection.builder().build(database, "learners", Learner.class);
    contextPackCollection = JacksonMongoCollection.builder().build(database, "contextpacks", ContextPack.class);
  }

  public void getLearner(Context ctx) {
    String id = ctx.pathParam("id");
    Learner learner;

    try {
      learner = learnerCollection.find(eq("_id", new ObjectId(id))).first();
    } catch(IllegalArgumentException e) {
      throw new BadRequestResponse("The requested learner id wasn't a legal Mongo Object ID.");
    }
    if (learner == null) {
      throw new NotFoundResponse("The requested learner was not found");
    } else {
      ctx.json(learner);
    }
  }

  public void getLearners(Context ctx){
    ctx.json(learnerCollection.find()
    .into(new ArrayList<>()));
  }
  public void assignWordlist(Context ctx){
    Bson filter = (eq("_id", ctx.pathParam("id")));
    Learner  learner = learnerCollection.find(filter).first();

    if(ctx.queryParamMap().containsKey("assign")){
      String listname = ctx.queryParam("assign");
      learner.disabledWordlists.removeIf(list -> list.equals(listname));
    }
    
    learnerCollection.replaceOne(eq("_id", ctx.pathParam("id")), learner);
    learner = learnerCollection.find(filter).first();
    ctx.json(learner);
  }
}
