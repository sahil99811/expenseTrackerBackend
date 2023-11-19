const Sequelize=require('sequelize');
const sequelize=require('../config/db-connect');

const User=sequelize.define('users',{
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true,
    },
    name:{
        type:Sequelize.STRING
    },
    email:{
        type:Sequelize.STRING,
    },
    password:{
        type:Sequelize.STRING
    },
    isPremiumUser:{
        type:Sequelize.BOOLEAN,
        defaultValue:false
    },
    totalExpense:{
        type:Sequelize.INTEGER,
        defaultValue:0
    },
    token:{
        type:Sequelize.STRING
    },
    resetPasswordExpires: {
        type: Sequelize.DATE,
    },
})

module.exports=User;