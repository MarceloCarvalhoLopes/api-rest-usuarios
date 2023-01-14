var User = require("../models/User");
var PasswordToken = require("../models/PasswordToken");
var jwt = require("jsonwebtoken");
var secret = "huahahuahuahuahu";
var bcrypt = require("bcrypt");

class UserController{

    async index(req, res){
        var users = await User.findAll();
        res.json(users);

    }

    async findById(req, res){
        var id = req.params.id;
        var user = await User.findById(id);
        
        if(user == undefined){
            res.status(404);
            res.json({});
        }else{
            res.json(user);
        }
    }


    async create(req, res){
        /*console.log(req.body);*/
        var {email, name, password} = req.body;
        
        if (email == undefined) {
            res.status(400);
            res.json({err: "O e-mail é inválido!"});
            return;
        }
        
        var emailExists = await User.findEmail(email);
        if (emailExists){
            res.status(406);
            res.json({err:"O e-mail já está cadastrado!"});
            return;
        }


        await User.create(email,password,name);

        res.status(201);
        res.send("Tudo OK");
    }

    async update(req, res){
        var {id, name, role, email} = req.body;
        var result = await User.update(id,email,name,role);
        if(result != undefined){
            if(result.status){
                res.status(200);
                res.send("Tudo OK!");
            }else{
                res.status(406);
                res.send(result.err)
            }
        }else{
            res.status(406);
            res.send("Ocorreu um erro no servidor!");
        }
    }
    
    async delete(req, res){
        var id =  req.params.id;      
        var result = await User.delete(id);
       
        if (result.status){
            res.status(200);
            res.send("Tudo Ok!");
        }else{
            res.status(406);
            res.send(result.err);
        }

    }

    async recoverPassword(req, res){
        var email = req.body.email;
        var result = await PasswordToken.create(email);
        if(result.status){
            /*console.log(result.token);*/
            res.status(200);
            res.send("" + result.token);

        }else{
            res.status(406);
            res.send(result.err);
        }

    }

    async changePassword(req, res){
        var token = req.body.token;
        var password = req.body.password;
        var isValidToken = await PasswordToken.validate(token);
        if(isValidToken.status){
            await User.changePassword(password,isValidToken.token.user_id, isValidToken.token.token);
            res.status(200);
            res.send("Senha alterada");
        }else{
            res.status(406);
            res.send("Token inválido");
        }
    }
    
    async login(req, res){
        var {email, password} = req.body;

        var user = await User.findByEmail(email);

        if (user != undefined){
            var result = await bcrypt.compare(password,user.password);

            if (result){
                var token = jwt.sign({ email: user.email, role: user.role }, secret);
                res.status(200);
                res.json({token:token});

            }else{
                res.status(406);
                res.send("Senha incorreta");
            }
            
            /*res.json({status: result});*/

        }else{
            res.json({status: false});
        }

    }

}

module.exports = new UserController();