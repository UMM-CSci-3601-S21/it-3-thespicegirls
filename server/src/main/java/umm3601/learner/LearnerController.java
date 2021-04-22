package umm3601.learner;

import java.util.ArrayList;

import com.google.common.collect.ImmutableMap;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoDatabase;

import org.bson.conversions.Bson;
import org.bson.types.ObjectId;
import org.mongojack.JacksonMongoCollection;

import io.javalin.http.BadRequestResponse;
import io.javalin.http.Context;
import io.javalin.http.NotFoundResponse;

import static com.mongodb.client.model.Filters.eq;

public class LearnerController {

  private final JacksonMongoCollection<Learner> learnerCollection;

  static MongoClient mongoClient;
  static MongoDatabase db;

  public LearnerController(MongoDatabase database){
    learnerCollection = JacksonMongoCollection.builder().build(database, "learners", Learner.class);
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
    Learner learner = learnerCollection.find(filter).first();

    if(ctx.queryParamMap().containsKey("assign")){
      String listname = ctx.queryParam("assign");
      learner.disabledWordlists.removeIf(list -> list.equals(listname));
    }

    learnerCollection.replaceOne(eq("_id", ctx.pathParam("id")), learner);
    learner = learnerCollection.find(filter).first();
    ctx.json(learner);
  }

  public void assignContextPack(Context ctx){
    Bson filter = eq("_id", ctx.pathParam("id"));
    Learner learner = learnerCollection.find(filter).first();

    if(ctx.queryParamMap().containsKey("assign")){
      String packIdAdd = ctx.queryParam("assign");
      learner.assignedContextPacks.add(packIdAdd);
    }

    if(ctx.queryParamMap().containsKey("unassign")){
      String packIdRemove = ctx.queryParam("unassign");
      learner.assignedContextPacks.removeIf(packs -> packs.equals(packIdRemove));
    }

    learnerCollection.replaceOne(filter, learner);
    learner = learnerCollection.find(filter).first();
    ctx.status(201);
    ctx.json(learner);
  }

  public void addLearner(Context ctx){
    Learner newLearner = ctx.bodyValidator(Learner.class)
      .check(learner -> learner.name != null && learner.name != " ")
      .check(learner -> learner.creator != null)
      .get();

      learnerCollection.insertOne(newLearner);
      ctx.status(201);
      ctx.json(ImmutableMap.of("id", newLearner._id));
  }
}
