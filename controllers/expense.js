const Expense=require('../models/expense');
const sequelize=require('../config/db-connect')
const User=require('../models/user')
const Sequelize=require('sequelize');
// addexpense Controller for adding expense
exports.addExpense = async (req, res) => {
  // Destructure fields from the request body
  const { expenseAmount, description, category } = req.body;

  // Check if All Details are there or not
  const id = req.user.id;
  if (!expenseAmount || !description || !category || !id) {
    return res.status(403).send({
      success: false,
      message: "All Fields are required",
    });
  }

  const t1 = await sequelize.transaction(); // Create a transaction

  try {
    // Create expense within the transaction
    const expense = await Expense.create(
      {
        amount: expenseAmount,
        description,
        category,
        userId: id,
      },
      {
        transaction: t1, // Pass the transaction to the create method
      }
    );

    // Find the user's totalExpense within the transaction
    let total = await User.findOne({
      attributes: ['totalExpense'],
      where: {
        id: id
      },
      transaction: t1 // Pass the transaction to the findOne method
    });
    let integerValue = parseInt(expenseAmount, 10);
    let te =total.totalExpense+integerValue;
    console.log("total expense",te);
     
    // Update totalExpense within the transaction
    await User.update(
      {
        totalExpense: te
      },
      {
        where: { id: id },
        transaction: t1,
      }
    );

    await t1.commit(); // Commit the transaction

    return res.status(200).json({
      success: true,
      expense: expense,
      message: "Expense created successfully",
    });
  } catch (error) {
    await t1.rollback(); // Rollback the transaction in case of an error
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Expense cannot be added. Please try again.",
    });
  }
};

// deleteexpense Controller for deleting expense
exports.deleteExpense=async (req,res)=>{
  const t1 = await sequelize.transaction();
  // Destructure fields from the request body
  const id=req.params.id;
  const amount=req.body.amount;
  console.log("printinng amount",amount)
  // Check if All Details are there or not
   if(!id&&!amount){
    return res.status(403).send({
       success: false,
       message: "All Fields are required",
     })
   }  
    try{
     
       //delete expense
      const expense=await Expense.destroy({
        where:{
            id:id
        },
        transaction:t1
      });
  
      // Find the user's totalExpense within the transaction
      let total = await User.findOne({
       attributes: ['totalExpense'],
       where: {
        id: req.user.id
      },
      transaction: t1 // Pass the transaction to the findOne method
     });
    //  console.log(total,expense);
    let integerValue1 = parseInt(amount, 10);
     let te = total.totalExpense -integerValue1;
     console.log("printing",te);
      await User.update({totalExpense:te},{
        where:{id:req.user.id},
        transaction:t1
      })
      t1.commit();
      return res.status(200).json({
        success: true,
        message: "expense deleted successfully",
      })
    }catch(error){
      t1.rollback();
        console.error(error)
        return res.status(500).json({
          success: false,
          message: "Expense cannot be deleted. Please try again.",
        })
    }
}

exports.getExpenses=async (req,res)=>{
  try {
    const id=req.user.id;
    if(!id){
      return res.status(403).send({
        success: false,
        message: "All Fields are required",
      })
    }
    const getexpenses=await Expense.findAll({
      where:{
        userId:id
      }
    })
    return res.status(200).json({
      message:'expenses fetched successfully',
      success:true,
      data:getexpenses
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again.",
    })
  }
}