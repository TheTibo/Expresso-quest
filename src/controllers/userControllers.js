const database = require("../../database");

const getUsers = (req, res) => {
  database
    .query("select * from users")

    .then(([users]) => {
      res.json(users); // use res.json instead of console.log
    })

    .catch((err) => {
      console.error(err);

      res.sendStatus(500);
    });
};

const getUsersbyId = (req, res) => {
  const id = parseInt(req.params.id);

  database
    .query("select * from users where id =  ?", [id])

    .then(([users]) => {
      if (users[0] != null) {
        res.json(users); // use res.json instead of console.log
      } else {
        res.sendStatus(404);
      }
    })

    .catch((err) => {
      console.error(err);

      res.sendStatus(500);
    });
};

const postUsers = (req, res) => {
  const { firstname, lastname, email, city, language } = req.body;
  database
    .query(
      "INSERT INTO users( firstname, lastname, email, city, language) VALUES(?,?,?,?,?)",
      [firstname, lastname, email, city, language]
    )
    .then(([result]) => {
      res.status(201).send({ id: result.insertId });
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};
module.exports = {
  getUsers,
  getUsersbyId,
  postUsers,
};
