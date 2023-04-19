const pool =require('../config/db');
const bcrypt = require('bcrypt');
const {tokenSign, verifyToken} = require('../utils/handleJwt')
const {tokenEmail, verifyTokenEmail} = require('../utils/handleJwtVerify')
const transport = require('../config/emailer') //treigo config
const {readFile} = require('fs/promises');

async function sendEmail(email, urlVerification) {
    
    //enviar correo
    let options={
        from:process.env.USER, // sender address         req.body.email
        to: email,// destino a si mismo "mail1", "mail2"       process.env.USER
        subject: 'Verifiación de email', // Subject line
        html:`<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Document</title>
            <style>
                .container{
                    border: 1px 0px solid white;
                    box-shadow: 0 0 3px white;
                    border-radius: 10px;
                    background-image: linear-gradient(to right bottom, #2c282a, #2b2729, #2a2628, #292527, #282426, #272325, #262224, #252123, #242022, #231f21, #221e20, #211d1f);
                    color: white;
                    align-items: center;
                    width: 600px;

                    padding: 30px;
                }
                .game{
                    color: rgb(0, 255, 242);
                }
                span{
                    color: white;
                }
                h1,h3{
                    margin: 18px auto;
                    text-align:  center;
                }
                h3{
                    margin: 0 auto;
                    text-align:  center;
                }
                h4,h2{
                    color: rgb(253, 253, 253);
                    text-align: justify;
                }
                h2{
                    text-align:  center;
                    color: rgb(77, 255, 0);
                }
                .no{
                    color: rgb(229, 245, 6);
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1 class="game">WATMACHI <span>verificación</span></h1> <h1> </h1>
                <br><br>
                <h4>Ha ingresado su correo electrónico en WATMACHI para registrar una nueva cuenta. Debe verificar que esta es su dirección de correo electrónico haciendo clic aquí:</h4>
                <h2><a href="${urlVerification}">Verificar correo</a></h2>
                <h4>¡Esperamos que te unas a nuestra comunidad!</h4>
                <h4 class="no">Si no intentó registrar una cuenta, ignore este correo electrónico.</h4>
            </body>
            </div>

        </html>`
        }

        transport.sendMail(options, (error, info) => {
            if (error) {
                console.log(error.message);
            } else {
                console.log("Correo verificación enviado");
            }
        });
         
        
}

 

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
        console.log("existencia de usuario: ",rows[0]);//escojo el {} con [0] aunque el resultado sea uno trae [{}]
        res.status(200).send(rows[0])   //envío { username: 'nombrex' } encontrado, sino envía undefined
    },
    existEmail:async(req,res)=>{//post  games/verify-email       disponibilidad user
        const [rows] = await pool.query('SELECT email FROM users  WHERE email = ?',[req.body.email]);
        console.log("existencia de correro: ",rows);
        res.status(200).send(rows[0])
    },
    //VERIFY EMAIL
    //con el interceptior de angular quito el bearer de email una vez verificado por lo que ya no se puede usar más de una vez la verificación
    verifyEmail:async (req,res)=>{//post  games/verify-email       disponibilidad user
        const { verification } = req.params;
        const result = await verifyTokenEmail(verification)
        const [rows] = await pool.query('SELECT * FROM users  WHERE email = ? AND username = ?',[result.email, result.username]);

        //si no encuentra coincidencia cancela
        if(rows == undefined){
            console.log("No se encuentra correo");
            res.status(500).send({"message":"Correo no ingresado en formulario"});
        }

        if(rows[0].email_verified){
            console.log("Correo ya verificado");
            return res.status(500).send({"message":"Correo ya verificado"})
        }
        console.log("SELECT ",rows[0].user_id);

        //actualiza a true el verificado
        const [check] = await pool.query('UPDATE users SET email_verified = IFNULL(?,email_verified)  WHERE user_id = ?',[1, rows[0].user_id]);
        // 'SET game= IFNULL(?,game), game_year=IFNULL(?,game_year), created_by=IFNULL(?,created_by) WHERE game_id = ? and created_by = ?'
        if(check.affectedRows > 0){
            console.log("Correo verificado");

            const user={"id": rows[0].user_id, "email": result.email};
            return res.status(200).send({
                "token": await tokenSign(user),
                "id": rows[0].user_id,
                "username": rows[0].username,
                "message":"correcto"
            })
        }else{
            res.status(500);
        }

        //         let numberVerify = ""
        // for (let index = 0; index < 4; index++) {
        //   numberVerify += String(Math.floor(Math.random() * 10))
        // }


    },
    postUser: async (req, res)=>{//games/post
        try {
            const {email, username, password} = req.body;
            bcrypt.hash(password, 10, async function(erro, hash) {
                //insertar usuario
                const [rows] = await pool.query('INSERT INTO users (email, username, password, email_verified) VALUES (?,?,?,?)',
                [email, username, hash, 0]);

                //hacer token para verificar
                const tokenmail = await tokenEmail(req.body);
                const urlVerification = process.env.URL_QUERY+tokenmail

                //enviar correo
                let options={
                    from:process.env.USER, // sender address         req.body.email
                    to: email,// destino a si mismo "mail1", "mail2"       process.env.USER
                    subject: 'Verifiación de email', // Subject line
                    html:`<!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta http-equiv="X-UA-Compatible" content="IE=edge">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Document</title>
                        <style>
                            .container{
                                border: 1px 0px solid white;
                                box-shadow: 0 0 3px white;
                                border-radius: 10px;
                                background-image: linear-gradient(to right bottom, #2c282a, #2b2729, #2a2628, #292527, #282426, #272325, #262224, #252123, #242022, #231f21, #221e20, #211d1f);
                                color: white;
                                align-items: center;
                                width: 600px;

                                padding: 30px;
                            }
                            .game{
                                color: rgb(0, 255, 242);
                            }
                            span{
                                color: white;
                            }
                            h1,h3{
                                margin: 18px auto;
                               text-align:  center;
                            }
                            h3{
                                margin: 0 auto;
                               text-align:  center;
                            }
                            h4,h2{
                                color: rgb(253, 253, 253);
                                text-align: justify;
                            }
                            h2{
                                text-align:  center;
                                color: rgb(77, 255, 0);
                            }
                            .no{
                                color: rgb(229, 245, 6);
                            }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <h1 class="game">WATMACHI <span>verificación</span></h1> <h1> </h1>
                            <br><br>
                            <h4>Ha ingresado su correo electrónico en WATMACHI para registrar una nueva cuenta. Debe verificar que esta es su dirección de correo electrónico haciendo clic aquí:</h4>
                            <h2><a href="${urlVerification}">Verificar correo</a></h2>
                            <h4>¡Esperamos que te unas a nuestra comunidad!</h4>
                            <h4 class="no">Si no intentó registrar una cuenta, ignore este correo electrónico.</h4>
                        </body>
                        </div>

                    </html>`
                  }

               transport.sendMail(options, (error, info) => {
                    if (error) {
                        console.log(error.message);
                        res.status(500);
                    } else {
                        console.log("Correo verificación enviado");
                        res.status(200).send({ tokenmail });
                    }
                });


            });


        } catch (error) {
            return res.send({error})
        }


    },   //login
  

    loginUser: async (req, res) => {// games/login
        try {
          const { email, password } = req.body;//  {email:'',password:''}
          const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
      
          const user = rows[0];
          const passwordMatch = await bcrypt.compare(password, user.password);//regresa true/false al comparar
          const emailVerified = user.email_verified;
      
          if (passwordMatch) {
            if (!emailVerified) {//luego de comprobar pass correcta verifica si email verificado
                //hacer token para verificar
              const tokenmail = await tokenEmail({ email: user.email, username: user.username });
              const urlVerification = `${process.env.URL_QUERY}${tokenmail}`;
              await sendEmail(user.email, urlVerification);
              return res.status(200).send({ tokenmail });
            } else {
              const token = await tokenSign({ id: user.user_id, email });
              return res.status(200).send({ token, id: user.user_id, username: user.username });
            }
          } else {
            console.log("Credenciales incorrectas");
            return res.status(401).send("Credenciales incorrectas");
          }
        } catch (error) {
          console.log(error);
          return res.status(404).send(error);
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