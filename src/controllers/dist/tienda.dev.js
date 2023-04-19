"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var _require = require('mysql2/promise'),
    createPool = _require.createPool;

var moment = require('moment');

var pool = createPool({
  host: process.env.HOSTDB,
  //shared ip address de mi cpanel jodeeeer al fin coñooo
  user: process.env.USERDB,
  password: process.env.PASSWORDDB,
  database: process.env.database2
});
var tienda = {
  postCategoria: function postCategoria(req, res) {
    var _req$body, name, description, _created_at, _ref, _ref2, rows;

    return regeneratorRuntime.async(function postCategoria$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _req$body = req.body, name = _req$body.name, description = _req$body.description; // Obtener el tiempo actual

            _created_at = moment().format('YYYY-MM-DD HH:mm:ss');
            _context.next = 5;
            return regeneratorRuntime.awrap(pool.query('INSERT INTO categories (name, description, created_at, updated_at) VALUES (?, ?, ?, ?)', [name, description, _created_at, _created_at]));

          case 5:
            _ref = _context.sent;
            _ref2 = _slicedToArray(_ref, 1);
            rows = _ref2[0];
            res.status(200).json({
              message: 'Categoría creada exitosamente.'
            });
            _context.next = 14;
            break;

          case 11:
            _context.prev = 11;
            _context.t0 = _context["catch"](0);
            res.status(500).json({
              message: 'Ha ocurrido un error al crear la categoría.',
              error: _context.t0
            });

          case 14:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[0, 11]]);
  },
  getCategoria: function getCategoria(req, res) {
    var id, _ref3, _ref4, rows;

    return regeneratorRuntime.async(function getCategoria$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            id = req.params.id; // Obtener el ID de la categoría deseada desde la URL

            _context2.next = 4;
            return regeneratorRuntime.awrap(pool.query('SELECT * FROM categories'));

          case 4:
            _ref3 = _context2.sent;
            _ref4 = _slicedToArray(_ref3, 1);
            rows = _ref4[0];

            if (rows.length > 0) {
              res.status(200).json(rows);
            } else {
              res.status(404).json({
                message: 'No hay nada'
              });
            }

            _context2.next = 13;
            break;

          case 10:
            _context2.prev = 10;
            _context2.t0 = _context2["catch"](0);
            res.status(500).json({
              message: 'Ha ocurrido un error al obtener las categorías.',
              error: _context2.t0
            });

          case 13:
          case "end":
            return _context2.stop();
        }
      }
    }, null, null, [[0, 10]]);
  },
  createProducto: function createProducto(req, res) {
    var product, atributte, value, _ref5, _ref6, rows_product, index, _ref7, _ref8, rows_atributte;

    return regeneratorRuntime.async(function createProducto$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            product = req.body.product;
            atributte = req.body.atributo;
            value = req.body.value;
            _context3.next = 6;
            return regeneratorRuntime.awrap(pool.query('INSERT INTO products (name, price, created) VALUES (?, ?)', [product.name, product.price, created_at, created_at]));

          case 6:
            _ref5 = _context3.sent;
            _ref6 = _slicedToArray(_ref5, 1);
            rows_product = _ref6[0];
            index = 0;

          case 10:
            if (!(index < value.length)) {
              _context3.next = 19;
              break;
            }

            _context3.next = 13;
            return regeneratorRuntime.awrap(pool.query('INSERT INTO atributtes (name, value) VALUES (?, ?)', [atributte, value[index]]));

          case 13:
            _ref7 = _context3.sent;
            _ref8 = _slicedToArray(_ref7, 1);
            rows_atributte = _ref8[0];

          case 16:
            index++;
            _context3.next = 10;
            break;

          case 19:
            res.status(200).json({
              message: 'Producto creado'
            });
            _context3.next = 25;
            break;

          case 22:
            _context3.prev = 22;
            _context3.t0 = _context3["catch"](0);
            res.status(500).json({
              message: 'Error al crear producto.',
              error: _context3.t0
            });

          case 25:
          case "end":
            return _context3.stop();
        }
      }
    }, null, null, [[0, 22]]);
  }
};
module.exports = tienda;