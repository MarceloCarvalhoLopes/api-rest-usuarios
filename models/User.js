var knex  = require("../database/connection");
var bcrypt = require("bcrypt");
const PasswordToken = require("./PasswordToken");

class User{

    async findAll(){
        try {
            var result = await knex.select(["id","name","email","role"]).table("users");
            return result;            
        } catch (err) {
            console.log(err);
            return [];
        }
    }

    async findById(id){
        try {
            var result = await knex.select(["id","name","email","role"]).table("users").where({id:id});
            if(result.length > 0){
                return result[0];
            }else{
                return undefined;
            }
                 
        } catch (err) {
            console.log(err);
            return undefined;
        }
    }

    async findByEmail(email){
        try {
            var result = await knex.select(["id","name","email","password","role"]).table("users").where({email:email});
            if(result.length > 0){
                return result[0];
            }else{
                return undefined;
            }
                 
        } catch (err) {
            console.log(err);
            return undefined;
        }
    }

    async create(email,password,name){
        try{
            var hash = await bcrypt.hash(password, 10);
            await knex.insert({email,password:hash,name,role:0}).table("users");    
        } catch (err) {
            console.log(err);
        }
        
    }

    async findEmail(email){
        try {
            var result = await knex.select("*").from("users").where({email:email});
            /*console.log(result);*/
            if(result.length > 0){
                return true;
            }else{
                return false;
            }
        } catch (err) {
            console.log(err);
            return false;
        }
    }

    async update(id,email,name,role){

        var user = await this.findById(id);

        if(user != undefined){

            var editUser = {};

            if(email != undefined){ 
                if(email != user.email){
                   var result = await this.findEmail(email);
                   if(result == false){
                        editUser.email = email;
                   }else{
                        return {status: false,err: "O e-mail j?? est?? cadastrado"}
                   }
                }
            }

            if(name != undefined){
                editUser.name = name;
            }

            if(role != undefined){
                editUser.role = role;
            }

            try{
                await knex.update(editUser).where({id: id}).table("users");
                return {status: true}
            }catch(err){
                return {status: false,err: err}
            }
            
        }else{
            return {status: false,err: "O usu??rio n??o existe!"}
        }
    }

    async delete(id){
        var user = await this.findById(id);
        if (user != undefined){
            try {
                await knex.delete().table("users").where({id:id}); 
                return {status: true}   
            } catch (err) {
                return {status: false, err:err}
            }
        }else{
            return {status: false, err:"Usu??rio n??o existente"}
        }

    }

    async changePassword(newPassword, id, token){
        var hash = await bcrypt.hash(newPassword, 10);    
        await knex.update({password:hash}).table("users").where({id:id});
        await PasswordToken.setUsed(token);
    }


}

module.exports = new User();