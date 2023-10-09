require('dotenv').config();

const {app, connectDB} = require('./app');

const PORT = process.env.PORT || 2000;

app.listen(PORT,async ()=>{
    console.log(`server is running at http://localhost:${PORT}`);
    await connectDB();
})