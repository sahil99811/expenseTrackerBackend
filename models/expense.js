const Sequelize=require('sequelize');
const sequelize=require('../config/db-connect');

const Expense=sequelize.define('expenses',{
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true,
    },
    amount:{
        type:Sequelize.INTEGER,
    },
    description:{
        type:Sequelize.STRING
    },
    category:{
        type:Sequelize.STRING
    },
    userId:{
        type:Sequelize.INTEGER
    }
})

module.exports=Expense;