class UserController{

    async index(req, res){}

    async create(req, res){
        /*console.log(req.body);*/
        var {email, name, password} = req.body;
        
        if (email == undefined) {
            res.status(400);
            res.json({err: "O e-mail é inválido!"})
        }
        
        res.status(201);
        res.send("Tudo OK");
    }

    
}

module.exports = new UserController();