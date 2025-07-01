import { Server } from "http";
import app from "./app";
import config from "./app/config";

const main = async () => {
  try {
    const server: Server = app.listen(config.port, () => {
      console.log("Server is running on port", config.port);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
};

main();