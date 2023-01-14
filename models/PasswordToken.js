var knex = require("../database/connection");
var User = require("./User");

class PasswordToken{

    async create(email){
        var user =  await User.findByEmail(email);
        if (user != undefined){

            try {
                var token =  Date.now();
                
                await knex.insert({
                    user_id : user.id,
                    used: 0,
                    token: token //UUID
                }).table("passwordtokens");    
                
                return {status:true, token : token}
            } catch (err) {
                console.log(err);
                return {status:false, err: err}
            }
            
        }else{
            return{status: false, err: "E-mail não cadastrado"};
        }
    }
    

}

module.exports = new  PasswordToken();