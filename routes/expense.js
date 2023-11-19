const express=require('express');
const router=express.Router();
const {auth}=require('../middlewares/auth')
const{addExpense,deleteExpense,getExpenses}=require('../controllers/expense');
router.post('/expense',auth,addExpense);
router.get('/expense',auth,getExpenses);
router.delete('/expense/:id',auth,deleteExpense);

module.exports=router;