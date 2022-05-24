const express = require("express");
const expressApp = express();
const contenedor = require("./products");

const PORT = 8080;

expressApp.get("/", (req, res) => {
  res.send("<h1>Bienvenidos a consulta de Productos</h1>");
});

expressApp.get("/productos", (req, res) => {
  contenedor.getAll().then((result) => {
    res.send(result);
  });
});

expressApp.get("/productoRandom", (req, res) => {
  contenedor
    .getAll()
    .then((result) => {
      const products = result;
      let randomId = Math.floor(Math.random() * products.length + 1);
      return randomId;
    })
    .then((newRes) => {
      const prod = contenedor.getById(newRes);
      return prod;
    })
    .then((finalRes) => {
      res.send(finalRes);
    });
});

const server = expressApp.listen(PORT, () => {
  console.log(`Server running on Port ${server.address().port}`);
});

server.on("error", (err) => {
  console.log(`Error en el servidor: ${err.message}`);
});
