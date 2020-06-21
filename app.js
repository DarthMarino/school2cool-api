require("dotenv").config();
const bcrypt = require("bcrypt");
const saltRounds = parseInt(process.env.saltRounds);
const express = require("express");
const app = express();
var bodyParser = require("body-parser");
const uri = process.env.mongodbURI;
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(bodyParser.urlencoded({ extended: false }));

const application = (err, client) => {
  // Get all users
  app.get("/", (request, response) => {
    return client
      .db()
      .collection("users")
      .find()
      .toArray()
      .then((users) => {
        if (users.length) {
          return response.send(
            users.map((user) => user.Nombre + " " + user.Apellido)
          );
        } else {
          return response.send("No se encontraron usuarios.");
        }
      });
  });
  // Get all students of a classroom
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
              .then((users) =>
                users.map((user) => user.Nombre + " " + user.Apellido)
              )
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
  // Get assignment info
  app.get("/:idAula/asignaciones/:_id", async (request, response) => {
    /*url params express*/
    const idAula = request.params.idAula;
    const idAssignment = request.params._id;
    let assignment = client
      .db()
      .collection("asignment")
      .findOne({ _id: ObjectId(idAssignment), idAula })
      .then(
        async ({
          idRubrica,
          FechaApertura,
          FechaEntrega,
          FechaCierre,
          Puntuacion,
        }) => {
          let rubric = await client
            .db()
            .collection("rubric")
            .findOne({ _id: ObjectId(idRubrica) });
          console.log(rubric);
          if (rubric) {
            const { Nombre, Descripcion } = rubric;
            let assData = {
              Nombre,
              Descripcion,
              FechaApertura,
              FechaEntrega,
              FechaCierre,
              Puntuacion,
            };
            return response.send(assData);
          } else {
            return response.send("No se encontraron estudiantes.");
          }
        }
      )

      .catch(console.log);
  });
  // Get all the assignments
  app.get("/:idAula/asignaciones", async (request, response) => {
    /*url params express*/
    const idAula = request.params.idAula;
    let assignments = client
      .db()
      .collection("asignment")
      .find({ idAula })
      .toArray()
      .then((assignments) =>
        Promise.all(
          assignments.map((assignment) =>
            client
              .db()
              .collection("rubric")
              .find({ _id: ObjectId(assignment.idRubrica) })
              .toArray()
              .then((rubric) => rubric[0].Nombre + ": " + rubric[0].Descripcion)
          )
        ).then((rubric) => {
          if (rubric) {
            return response.send(rubric);
          } else {
            return response.send("No se encontraron estudiantes.");
          }
        })
      )
      .catch(console.log);
  });
  // Register a new user
  app.post("/user", function (request, response) {
    const solUsuario = request.body;
    bcrypt.hash(solUsuario.Password, saltRounds).then((result) => {
      const postUsuario = {
        Nombre: solUsuario.Nombre,
        Apellido: solUsuario.Apellido,
        Correo: solUsuario.Correo,
        Username: solUsuario.Username,
        ClaveEncrypt: result,
        Descripcion: solUsuario.Descripcion,
      };
      return client
        .db()
        .collection("users")
        .insertOne(postUsuario)
        .then(() => response.send(postUsuario));
    });
  });
  // listen for requests
  const listener = app.listen(process.env.PORT, () => {
    console.log("Your app is listening on port " + listener.address().port);
  });
};

const connection = client.connect(application);
