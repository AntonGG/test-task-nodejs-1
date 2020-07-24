import express from "express";
import Api from "./controllers/api";
import Database from "./database/database";
import bodyParser from "body-parser";
import fileUpload from "express-fileupload";

const app = express();
const database: Database = new Database();
app.use(bodyParser.json());
app.use(express.json());
app.use(
  fileUpload({
    limits: { fileSize: 1 * 1024 * 1024 },
  })
);
Api(app, database);
app.listen(3000, function() {
  console.log("App is listening on port 3000!");
});
