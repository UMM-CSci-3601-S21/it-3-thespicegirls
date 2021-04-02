package umm3601;

import java.util.Arrays;

import com.mongodb.MongoClientSettings;
import com.mongodb.ServerAddress;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoDatabase;

import io.javalin.Javalin;
import io.javalin.core.util.RouteOverviewPlugin;
import umm3601.contextpack.ContextPackController;

public class Server {

  static String appName = "Word River";
  private static String mongoAddr = System.getenv().getOrDefault("MONGO_ADDR", "localhost");
  private static String databaseName = System.getenv().getOrDefault("MONGO_DB", "dev");

  public static void main(String[] args) {

    // Setup the MongoDB client object with the information we set earlier
    MongoClient mongoClient
      = MongoClients.create(MongoClientSettings
        .builder()
        .applyToClusterSettings(builder -> builder.hosts(Arrays.asList(new ServerAddress(mongoAddr))))
        .build());

    // Get the database
    MongoDatabase database = mongoClient.getDatabase(databaseName);


    ContextPackController contextPackController = new ContextPackController(database);

    Javalin server = setupServer(mongoClient);

    server.start(4567);


    server.get("/api/contextpacks", contextPackController::getContextPacks);
    server.get("/api/contextpacks/:id", contextPackController::getContextPack);
    server.post("/api/contextpacks", contextPackController::addNewContextPack);
    // editing information about contextpacks
    server.post("/api/contextpacks/:id/editpack", contextPackController::editContextPack);
    // editing information about wordlists
    server.post("/api/contextpacks/:id/editlist", contextPackController::editWordlist);

    server.exception(Exception.class, (e, ctx) -> {
      ctx.status(500);
    });
  }

  private static Javalin setupServer(MongoClient mongoClient) {
    Javalin server = Javalin.create(config -> {
      config.registerPlugin(new RouteOverviewPlugin("/api"));
    });
    /*
     * We want to shut the `mongoClient` down if the server either
     * fails to start, or when it's shutting down for whatever reason.
     * Since the mongClient needs to be available throughout the
     * life of the server, the only way to do this is to wait for
     * these events and close it then.
     */
    server.events(event -> {
      event.serverStartFailed(mongoClient::close);
      event.serverStopped(mongoClient::close);
    });
    Runtime.getRuntime().addShutdownHook(new Thread(() -> {
      server.stop();
    }));
    return server;
  }
}
