const Sequelize=require('sequelize');

const sequelize=new Sequelize('expense','root','Sahil99811@',{
    dialect:'mysql',host:'localhost'
})

sequelize.authenticate().then(()=>{
    console.log("successfully connect with db")
}).catch((error)=>{
    console.log(error);
})
module.exports=sequelize;