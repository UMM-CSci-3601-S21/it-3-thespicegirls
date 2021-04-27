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
import umm3601.contextpack.ContextPack;
import umm3601.user.User;

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
    User user = ctx.sessionAttribute("current-user");

    try {
      learner = learnerCollection.find(eq("_id", new ObjectId(id))).first();
    } catch(IllegalArgumentException e) {
      throw new BadRequestResponse("The requested learner id wasn't a legal Mongo Object ID.");
    }
    if (learner == null) {
      throw new NotFoundResponse("The requested learner was not found");
    }
    else if(learner.userId.equals(user._id.toString())) {
      ctx.json(learner);
    }
    else{
      throw new IllegalAccessError("This is not your Learner");
    }
  }

  public void getLearners(Context ctx){
    User user = ctx.sessionAttribute("current-user");
    ctx.json(learnerCollection.find(eq("userId", user._id.toString()))
    .into(new ArrayList<>()));
  }

  public void assignWordlist(Context ctx){
    User user = ctx.sessionAttribute("current-user");
    Bson filter = (eq("_id", ctx.pathParam("id")));
    Learner learner = learnerCollection.find(filter).first();
    if(learner.userId.equals(user._id.toString())){

      if(ctx.queryParamMap().containsKey("assign")){
        String listname = ctx.queryParam("assign");
        learner.disabledWordlists.removeIf(list -> list.equals(listname));
      }
      if(ctx.queryParamMap().containsKey("disable")){
        String listname = ctx.queryParam("disable");
        if(learner.disabledWordlists.contains(listname)){}
        else{
          learner.disabledWordlists.add(listname);
        }
      }
      learnerCollection.replaceOne(eq("_id", ctx.pathParam("id")), learner);
      learner = learnerCollection.find(filter).first();
      ctx.json(learner);
    }
    else{
      throw new IllegalAccessError();
    }
  }

  public void assignContextPack(Context ctx){
    User user = ctx.sessionAttribute("current-user");
    Bson filter = eq("_id", ctx.pathParam("id"));
    Learner learner = learnerCollection.find(filter).first();
    if(learner.userId.equals(user._id.toString())){
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
    else {
    throw new IllegalAccessError();
    }
  }

  public void addLearner(Context ctx){
    Learner newLearner = ctx.bodyValidator(Learner.class)
      .check(learner -> learner.name != null )
      .get();
      User user = ctx.sessionAttribute("current-user");
      newLearner.userId = user._id;
      newLearner.userName = user.name;

      learnerCollection.insertOne(newLearner);
      ctx.status(201);
      ctx.json(ImmutableMap.of("id", newLearner._id));
  }
}
