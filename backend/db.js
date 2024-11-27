const mongoose = require("mongoose");
const connectionString = process.env.MONGO_URI;

const connectToMongo = () => {
  mongoose
    .connect(connectionString) 
    .then(() => {
      console.log("Connected to MongoDB");


      mongoose.connection.on("close", () => {
        console.log("Connection to MongoDB closed");
      });

    
      mongoose.connection.on("error", (error) => {
        console.error("MongoDB connection error:", error);
      });

      mongoose.connection.on("disconnected", () => {
        console.log("MongoDB connection lost");
      });

      mongoose.connection.on("reconnected", () => {
        console.log("MongoDB reconnected");
      });
    })
    .catch((error) => {
      console.error("Connection error", error);
    });
};

module.exports = connectToMongo;
