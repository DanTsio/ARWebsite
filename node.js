const express = require('express');
const bodyParser = require('body-parser')
const app = express();
app.use(express.json());
const port = 3000;
const fs = require("fs");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public"));

app.get("/api/Database.json", (req, res) => {
  fs.readFile("Database.json", (err, jsondata) => {
    let products = [];
    if (!err) products = JSON.parse(jsondata);
    res.status(200).json(products);
  });
});

app.listen(port, function () {
  console.log("Listening on port:" + port);
});

function getEntry(req, res) {
  const id = parseInt(req.params.id);
  fs.readFile(
    "Database.json",
    function (err, data) {
      let products = [];
      if (!err) products = JSON.parse(data);
      res.status(200).json(products.filter((p) => p.id === id));
    },
  );
}

function addEntry(req, res) {
  console.log(req.body)
  const { id, product, price, pricekilo, discount } = req.body;
  const newProduct = { id: parseInt(id), product, price: parseFloat(price), pricekilo: parseFloat(pricekilo), discount: parseInt(discount)};
  fs.readFile(
    "Database.json",
    function (err, data) {
      let product = [];
      if (!err) product = JSON.parse(data);
      product.push(newProduct);
      fs.writeFile(
        "Database.json",
        JSON.stringify(product),
        function (err) {
          if (err) {
            res.status(200).json(`Error adding id: ${id}`);
          } else {
            res.status(200).json(`Song added with id: ${id}`);
          }
        },
      );
    },
  );
}

function updateEntry(req, res) {
  const { id, product, price, pricekilo, discount } = req.body;
  const updatedProduct = { id: parseInt(id), product, price: parseFloat(price), pricekilo: parseFloat(pricekilo), discount: parseInt(discount) };
  fs.readFile(
    "Database.json",
    function (err, data) {
      let product = [];
      if (!err) product = JSON.parse(data);
      const anIndex = product.findIndex((p) => p.id === updatedProduct.id);
      if (anIndex < 0) {
        res.status(200).json(`Cannot find ID: ${id}`);
        return;
      }
      product[anIndex] = updatedProduct;
      fs.writeFile(
        "Database.json",
        JSON.stringify(product),
        function (err) {
          if (err) {
            res.status(200).json(`Error updating id: ${id}`);
          } else {
            res.status(200).json(`Updated id: ${id}`);
          }
        },
      );
    },
  );
}

function removeEntry(req, res) {
  const id = parseInt(req.body.id);
  console.log(req.body)
  fs.readFile(
    "Database.json",
    function (err, data) {
      let product = [];
      if (!err) product = JSON.parse(data);
      console.log(id)
      const anIndex = product.findIndex((p) => p.id === id);
      if (anIndex < 0) {
        res.status(200).json(`Cannot find ID: ${id}`);
        return;
      }
      product.splice(anIndex, 1);
      fs.writeFile(
        "Database.json",
        JSON.stringify(product),
        function (err) {
          if (err) {
            res.status(200).json(`Error deleting id: ${id}`);
          } else {
            res.status(200).json(`Deleted id: ${id}`);
          }
        },
      );
    },
  );
}

app.get("/api/Database.json/:id", (req, res) => getEntry(req, res));
app.post("/api/Database.json", (req, res) => addEntry(req, res));
app.put("/api/Database.json/:id", (req, res) => updateEntry(req, res));
app.delete("/api/Database.json/:id", (req, res) => removeEntry(req, res));