package umm3601;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

import com.mongodb.MongoClientSettings;
import com.mongodb.ServerAddress;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoDatabase;

import io.javalin.Javalin;
import io.javalin.core.security.Role;
import io.javalin.core.util.RouteOverviewPlugin;
import io.javalin.http.Context;
import io.javalin.http.UnauthorizedResponse;
import umm3601.contextpack.ContextPackController;
import umm3601.user.UserController;

public class Server {
  enum MyRole implements Role {
    ANYONE, USER, ADMIN, ROLE_THREE;
}

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
    UserController userController = new UserController(database);

    Javalin server = serverStarter(mongoClient);

    server.start(4567);

    server.get("/api/users/logout", ctx -> {ctx.req.getSession().invalidate();}, roles(MyRole.ANYONE));
    server.get("/api/users/loggedin", userController::loggedIn, roles(MyRole.ANYONE));

    server.get("/api/contextpacks", contextPackController::getContextPacks, roles(MyRole.ANYONE));
    server.get("/api/contextpacks/:id", contextPackController::getContextPack, roles(MyRole.ANYONE));

    server.post("/api/users", userController::checkToken, roles(MyRole.ANYONE));

    server.post("/api/contextpacks", contextPackController::addNewContextPack, roles(MyRole.USER));
    // editing information about contextpacks
    server.post("/api/contextpacks/:id/editpack", contextPackController::editContextPack, roles(MyRole.ADMIN));
    // editing information about wordlists
    server.post("/api/contextpacks/:id/editlist", contextPackController::editWordlist, roles(MyRole.ADMIN));
    // add forms to words in wordlists

    server.exception(Exception.class, (e, ctx) -> {
      ctx.status(500);
    });
  }

  private static Javalin serverStarter(MongoClient mongoClient) {
    Javalin server = Javalin.create(config -> {
      config.registerPlugin(new RouteOverviewPlugin("/api"));
            config.accessManager((handler, ctx, permittedRoles) -> {
                  if (userHasValidRole(ctx, permittedRoles)) {
                    handler.handle(ctx);
                } else {
                    throw new UnauthorizedResponse();
                }
            });
    });
    server.before(ctx -> ctx.header("Access-Control-Allow-Credentials", "true"));
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
  private static Set<Role> roles(MyRole role) {
    Set<Role> setRole = new HashSet<Role>();
    setRole.add(role);
    return setRole;
  }
  private static boolean userHasValidRole(Context ctx, Set<Role> permittedRoles) {
    boolean result = false;

    if(permittedRoles.contains(MyRole.ANYONE)){
      result = true;
    }
    else{
      if(ctx.sessionAttribute("current-user") == null){
        throw new UnauthorizedResponse();
      }
      else{
        if(ctx.sessionAttribute("current-user").toString() == "USER"){
          Set<Role> userRole = roles(MyRole.USER);
          if(permittedRoles.equals(userRole)){
            result = true;
          }
        }
        if(ctx.sessionAttribute("current-user").toString() == "ADMIN"){result = true;}

      }

    }
    return result;
}

}
