const express=require('express');
const app=express();
const cors=require('cors');
const userRoutes=require('./routes/user');
const expenseRoutes=require('./routes/expense');
const paymentRoutes=require('./routes/payment')
const PORT=process.env.PORT;
const User=require('./models/user');
const Expense=require('./models/expense');
const cookieParser = require("cookie-parser");
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:3000',  // Replace with the origin of your client app
  credentials: true,
}))
User.sync();
Expense.sync();
User.hasMany(Expense, { foreignKey: 'userId' });
Expense.belongsTo(User, { foreignKey: 'userId' });
app.use(userRoutes);
app.use(expenseRoutes);
app.use("/payment",paymentRoutes);
app.listen(PORT,()=>{
    console.log(`serve is started at ${PORT}`);
})



