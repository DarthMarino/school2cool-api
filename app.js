const express = require("express");
const app = express();
const uri = process.env.mongodbURI;
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const application = (err, client) => {
  // Get all users
  app.get("/", async (request, response) => {
    const users = await client.db().collection("users").find().toArray();
    if (users.length) {
      const first = users[0];
      return response.send({
        Nombre: first.Nombre + " " + first.Apellido,
        Correo: first.Correo,
      });
    } else {
      return response.send("No se encontraron usuarios.");
    }
  });
  app.get("/:idAula/students", async (request, response) => {
    /*url params express*/
    const idAula = request.params.idAula;
    let students = client
      .db()
      .collection("student")
      .find({ idAula: idAula })
      .toArray()
      .then((students) =>
        Promise.all(
          students.map((student) =>
            client
              .db()
              .collection("users")
              .find({ _id: ObjectId(student.idUsuario) })
              .toArray()
              .then((user) => user[0].Nombre + " " + user[0].Apellido)
          )
        )
          .then((users) => {
            if (users) {
              return response.send(users);
            } else {
              return response.send("No se encontraron estudiantes.");
            }
          })
          .catch(console.log)
      );
  });
  // listen for requests :)
  const listener = app.listen(process.env.PORT, () => {
    console.log("Your app is listening on port " + listener.address().port);
  });
};

const connection = client.connect(application);
