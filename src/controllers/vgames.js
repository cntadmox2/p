const pool =require('../config/db');
const bcrypt = require('bcrypt');
const {tokenSign, verifyToken} = require('../utils/handleJwt')
const transport = require('../config/emailer') //treigo config

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

     //Registro
     verifyUser:async(req,res)=>{//post  games/verify-user       disponibilidad user
        
        const [rows] = await pool.query('SELECT username FROM users  WHERE username = ?',[req.body.username]);
        console.log("existencia de usuario: ",rows[0]);
        res.status(200).send(rows[0])
    },
    verifyMail:async(req,res)=>{//post  games/verify-email       disponibilidad user
        const [rows] = await pool.query('SELECT email FROM users  WHERE email = ?',[req.body.email]);
        console.log("existencia de correro: ",rows[0]);
        res.status(200).send(rows[0])
    },
    
    postUser: async (req, res)=>{//games/post 
        try {
            const {email, username, password} = req.body;
            bcrypt.hash(password, 10, async function(erro, hash) {
                
                const [rows] = await pool.query('INSERT INTO users (email, username, password) VALUES (?,?,?)',
                [email, username, hash],(x,d,g)=> {return x,d,g}); 
        
                console.log("resultado consulta",rows);
                
                const user={"id":rows.insertId, "email":email}; 
                return res.status(200).send({
                    "token": await tokenSign(user),
                    "id":rows.insertId
                })
            });

            
        } catch (error) {
            return res.send({error})
        }
       
      
    },   //login
    loginUser:async(req,res)=>{// games/login
        const credenciales = req.body;  //  {email:'',password:''}
        try {
            const [rows] = await pool.query('SELECT user_id, username, password  FROM users  WHERE email = ?',[credenciales.email])
            bcrypt.compare(credenciales.password, rows[0].password, async function(err, result) {//regresa true/false al comparar
                if(err) return res.status(400).send("Error")
                if(result) {
                    const user={"id":rows[0].user_id, "email":credenciales.email}; 
                    return res.status(200).send({
                        "token": await tokenSign(user),
                        "id":rows[0].user_id,
                        "username":rows[0].username
                    })
                }
                if(!result) return res.status(401).send("Credenciales incorrectas")
                
             });
        } catch (error) {
            return res.status(404).send(error)
        }
       
 
    },

            
    verifyToken:async(req,res)=>{// games/verify-token      verificar token Login
        const token = req.body.token
        const result = await verifyToken(token) //{ id: 53,email: 'mailex@example.com',iat: 1674059429, exp: 1674073829}
        res.status(200).send({result})
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

    //VERIFY EMAIL
    sendEmail: async (req, res) => {//creo quesolo se puede enviar a sí mismo
        console.log("correo to ",req.body.email)

          //randomnumber
          let numberVerify = ""
          for (let index = 0; index < 4; index++) {
            numberVerify += String(Math.floor(Math.random() * 10))
          }
          console.log(numberVerify);

          let options={
            from:'corrprub@mkjdev.com', // sender address         req.body.email
            to: req.body.email,// destino a si mismo "mail1", "mail2"       process.env.USER
            subject: 'Verifiación de email', // Subject line
            text: "ahhora envíando esto a", // plain text body
            html: `<b>${numberVerify}</b>` 
          }
         
       
          
          //fs.readFileSync('src/templates/email.html', 'utf-8')+
       transport.sendMail(options, (error, info) => {
            if (error) {
                console.log(error.message);
                res.status(500);
            } else {
                console.log("hecho");
                res.status(200).send({ info });
            }
        });
        },

//----------------------------------------------------------------------------------------------


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
    getGames:async(req,res)=>{//games/getgames 
        const [rows] = await pool.query('SELECT u.username, g.game, g.game_year from users u inner join games g on g.created_by = u.user_id')
        // console.log([rows],rows);[]  == [[{}]] y rows solo = [{}]
        if(rows.length > 0){
            res.send({rows})
        }else{
            res.send("nada")
        }
    },
    myGames:async(req,res)=>{//get/mygames/ oobtener juegos de usuario          uso req.userIdToken(id) traído de middleware
            const [rows] = await pool.query('SELECT * FROM games  WHERE created_by = ?',[req.userIdToken])
            if(rows.length > 0){
                res.send({rows})
            }else{
                res.send("No tiene juegos")
            }
         
       
    },

    postGames:(req, res)=>{//games/post
        try {
            req.body.forEach(async element => {
                const [rows] = await pool.query('INSERT INTO games (game, game_year, created_by) VALUES (?,?,?)',[element.game, element.game_year, req.userIdToken]);
            });
          
            return res.send({"Post":"correcto"})
        } catch (error) {
            return res.send({error})
        }
       
      
    },
    updategame:async(req, res)=>{//   PATCH games/update/:id
        try {               //debe recibir dentro de [] porque es un forEach
            console.log(typeof(req.p),req.body, "updatee");
            req.body.forEach(async element => {
            const [result] = await pool.query('UPDATE games SET game= IFNULL(?,game), game_year=IFNULL(?,game_year), created_by=IFNULL(?,created_by) WHERE game_id = ? and created_by = ?',[element.game, element.game_year, req.userIdToken, element.game_id, req.userIdToken]);  
               
        });
        res.status(200).send({"Actualizado":req.userIdToken})
        } catch (error) {
            res.status(404).send("No existe juego")
        }
      
      
    },
    deleteGame:async(req, res)=>{//games/delete/:id 
        console.log("reeeeee 1111111111",  req.body );
        try {
         
            req.body.forEach(async element => {  console.log(element.game_id );
                const [result] = await pool.query('DELETE  FROM games  WHERE game_id = ? and created_by = ?',[element.game_id , req.userIdToken]);//tal vez con [] porque se necesita interior de los que regresa: [ResulSet{ ...,affectedRows,..}]
        
            });
            res.sendStatus(204)
        } catch (error) {
            res.status(404).send("No existe juego")
        }
      
       
    }

 
   
} 

module.exports = juegos;