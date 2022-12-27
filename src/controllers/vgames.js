const pool =require('../config/db');
const bcrypt = require('bcrypt');


var juegos ={
 //USUARIOS
    getUser:async(req,res)=>{//games/get/:id
        const [rows] = await pool.query('SELECT * FROM users  WHERE user_id = ?',[req.params.id])
        // console.log([rows],rows);[]  == [[{}]] y rows solo = [{}]
        if(rows.length > 0){
            res.send({rows})
        }else{
            res.send("nada")
        }
    },

    //registro
    postUser: (req, res)=>{//games/post
        try {
            const {email, username, password} = req.body;
            bcrypt.hash(password, 1, async function(err, hash) {
                const [rows] = await pool.query('INSERT INTO users (email, username, password) VALUES (?,?,?)',[email, username, hash]); console.log(hash)
            });
 
            // capturo el nuevo id
            idgenerado=rows.insertId
            return res.send({"idNuevo":idgenerado})
        } catch (error) {
            return res.send({error})
        }
       
      
    },
    putUser:async(req, res)=>{//   PATCH games/update/:id
        const {email, username, password} = req.body;
        const [result] = await pool.query('UPDATE users SET email= IFNULL(?,email), username=IFNULL(?,username), password=IFNULL(?,password) WHERE user_id = ?',[email, username, password,req.params.id]);
        if(result.affectedRows > 0){
            res.send(result)
        }else{
            res.send("No existe usuario")
        }
    },
    deleteUser:async(req, res)=>{//games/delete/:id
        const [result] = await pool.query('DELETE  FROM users  WHERE user_id = ?',[req.params.id]);//tal vez con [] porque se necesita interior de los que regresa: [ResulSet{ ...,affectedRows,..}]
        if(result.affectedRows > 0){
            res.sendStatus(204)
        }else{
            res.status(404).send("No existe usuario")
        }
    },

    //JUEGOS-----------------------------

    getGame:async(req,res)=>{//games/get/:id
        const [rows] = await pool.query('SELECT * FROM games  WHERE game_id = ?',[req.params.id])
        // console.log([rows],rows);[]  == [[{}]] y rows solo = [{}]
        if(rows.length > 0){
            res.send({rows})
        }else{
            res.send("nada")
        }
    },
//select u.username, g.game, g.game_year from users u inner join games g on g.created_by=  u.user_id;
// SELECT u.username, g.game, g.game_year from users u inner join games g on g.created_by = u.user_id
    getGames:async(req,res)=>{//games/get/:id
        const [rows] = await pool.query('SELECT u.username, g.game, g.game_year from users u inner join games g on g.created_by = u.user_id')
        // console.log([rows],rows);[]  == [[{}]] y rows solo = [{}]
        if(rows.length > 0){
            res.send({rows})
        }else{
            res.send("nada")
        }
    },
    postGame:async (req, res)=>{//games/post
        const {game, game_year, created_by} = req.body;
        try {
            const [rows] = await pool.query('INSERT INTO games (game, game_year, created_by) VALUES (?,?,?)',[game, game_year, created_by]);
            // capturo el nuevo id
            idgenerado=rows.insertId
            return res.send({"idNuevo":idgenerado})
        } catch (error) {
            return res.send({error})
        }
       
      
    },
    putGame:async(req, res)=>{//   PATCH games/update/:id
        const {game, game_year, created_by} = req.body;
        const [result] = await pool.query('UPDATE games SET game= IFNULL(?,game), game_year=IFNULL(?,game_year), created_by=IFNULL(?,created_by) WHERE game_id = ?',[game, game_year, created_by,req.params.id]);
        if(result.affectedRows > 0){
            res.send(result)
        }else{
            res.send("No existe usuario")
        }
    },
    deleteGame:async(req, res)=>{//games/delete/:id
        const [result] = await pool.query('DELETE  FROM games  WHERE game_id = ?',[req.params.id]);//tal vez con [] porque se necesita interior de los que regresa: [ResulSet{ ...,affectedRows,..}]
        if(result.affectedRows > 0){
            res.sendStatus(204)
        }else{
            res.status(404).send("No existe usuario")
        }
    },

    //login
    loginUser:async(req,res)=>{// games/login
        const credenciales = req.body;
        try {
            const [rows] = await pool.query('SELECT password FROM users  WHERE email = ?',[credenciales.email])
      
            bcrypt.compare(credenciales.password, rows[0].password, function(err, result) {
                res.status(200).send(result);     
             });
        } catch (error) {
            return res.status(400).send("incorrecta")
        }
       
 
    }

} 

module.exports = juegos;