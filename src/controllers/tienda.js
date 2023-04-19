const {createPool} = require('mysql2/promise');
const moment = require('moment');

const pool= createPool({
    host:process.env.HOSTDB, //shared ip address de mi cpanel jodeeeer al fin coñooo
    user: process.env.USERDB,
    password:process.env.PASSWORDDB,
    database: process.env.database2
})

let tienda ={
    postCategoria: async (req, res) => {
        try {
          const { name, description } = req.body;
          // Obtener el tiempo actual
          const created_at = moment().format('YYYY-MM-DD HH:mm:ss');
          const [rows] = await pool.query('INSERT INTO categories (name, description, created_at, updated_at) VALUES (?, ?, ?, ?)', [name, description, created_at, created_at]);
          res.status(200).json({ message: 'Categoría creada exitosamente.' });
        } catch (error) {
          res.status(500).json({ message: 'Ha ocurrido un error al crear la categoría.', error });
        }
      },
      
    getCategoria: async (req, res) => {
      try {
        const id = req.params.id; // Obtener el ID de la categoría deseada desde la URL
        const [rows] = await pool.query('SELECT * FROM categories');
        if (rows.length > 0) {
          res.status(200).json(rows);
        } else {
          res.status(404).json({ message: 'No hay nada' });
        }
      } catch (error) {
        res.status(500).json({ message: 'Ha ocurrido un error al obtener las categorías.', error });
      }
    },

    createProducto:async (req, res) => {
      try {
        const product = req.body.product
        
        const atributte = req.body.atributo
        const value = req.body.value

        const [rows_product] = await pool.query('INSERT INTO products (name, price, created) VALUES (?, ?)', [product.name, product.price, created_at, created_at]);

        for (let index = 0; index < value.length; index++) {
           const [rows_atributte] = await pool.query('INSERT INTO atributtes (name, value) VALUES (?, ?)', [atributte, value[index]]);
        }
       
        res.status(200).json({ message: 'Producto creado' });

      } catch (error) {
        res.status(500).json({ message: 'Error al crear producto.', error })
      }
    }
   
}

module.exports = tienda;