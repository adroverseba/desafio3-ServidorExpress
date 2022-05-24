const fs = require("fs");

class Contenedor {
  constructor({ nameFile }) {
    this.nameFile = nameFile;
  }

  // podria usar una variable static para que sirva como contador en el contenedor. ej: se usaria en save Contenedor.id++
  // static id = 0;

  async save(product) {
    try {
      // utilizo metodo access de fs para validar la existencia del archivo de manera asincronica
      fs.access(`./ddbb/${this.nameFile}.json`, fs.F_OK, (err) => {
        if (err) {
          // console.error(err.message);
          console.log(
            `\nArchivo no encontrado, se procede a la creacion del archivo: " ${this.nameFile}.json" con producto nuevo id:1\n\n`
          );
          // no se puede usar las formas asincronicas de creacion de archivos dentro de acces
          fs.writeFileSync(
            `${this.nameFile}.json`,
            JSON.stringify([{ ...product, id: 1 }], null, 2)
          );
        }
        //file exist
      });
      //* en el caso de que el archivo exista se ejecuta lo siguiente

      let products = JSON.parse(
        await fs.promises.readFile(`./${this.nameFile}.json`, "utf-8")
      );
      // le adiciono la propiedad id y su valor  teniendo en cuenta la longitud del array de la variable contenedora de todos los productos
      product.id = products.length + 1;
      // utilizo spread operator para agregar productos a la constante products
      products = [...products, product];
      // console.log(products);
      // realizo la escritura del archivo del archivo con el producto nuevo
      await fs.promises.writeFile(
        `${this.nameFile}.json`,
        JSON.stringify(products, null, 2)
      );
      console.log(`Producto Guardado con Exito, id asignado: ${product.id}`);
    } catch (err) {
      console.log(err.message);
    }
  }

  async getById(id) {
    try {
      let products = JSON.parse(
        await fs.promises.readFile(`./ddbb/${this.nameFile}.json`, "utf-8")
      );
      // genero un localizador de id para verificar si el mismo existe y determinar con eso la accion
      let locatorId = products.some((prod) => prod.id == id);
      if (!locatorId) {
        return { message: "Producto no encontrado" };
      } else {
        let product = products.filter((prod) => prod.id == id);
        return product;
      }
    } catch (err) {
      return err;
    }
  }

  async getAll() {
    try {
      let products = JSON.parse(
        await fs.promises.readFile(`./ddbb/${this.nameFile}.json`, "utf-8")
      );
      return products;
    } catch (err) {
      console.log(err);
    }
  }

  async deleteById(id) {
    try {
      let products = JSON.parse(
        await fs.promises.readFile(`${this.nameFile}.json`, "utf-8")
      );
      // verifico si el id buscado esta en el array de productos
      let locatorId = products.some((prod) => prod.id == id);
      if (!locatorId) {
        console.log(
          "El Id ingresado no se encuentra, pruebe porfavor con otro o consulte la lista completa de productos "
        );
      } else {
        // una manera de realizar el borrado el elemento usando el metodo filter
        // let newListProducts = products.filter((prod) => prod.id != id);
        products.map((prod, index) => {
          if (prod.id == id) {
            products.splice(index, 1);
          }
        });
        // actualizo el id de la lista de productos
        products.map((prod, index) => (prod.id = index + 1));

        await fs.promises.writeFile(
          `${this.nameFile}.json`,
          JSON.stringify(products, null, 2)
        );
        console.log(`ID: ${id}, eliminado con exito`);
      }
    } catch (err) {
      console.log(err);
    }
  }

  async deleteAll() {
    try {
      await fs.promises.writeFile(`${this.nameFile}.json`, JSON.stringify([]));
      console.log("Base de datos eliminada con Exito");
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = Contenedor;
