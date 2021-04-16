package umm3601.learner;

import java.util.ArrayList;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoDatabase;

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
}
