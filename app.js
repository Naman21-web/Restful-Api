const express = require('express');
const mongoose = require('mongoose');
const validator = require('validator');
const studentRouter = require('./router/student.js')

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(studentRouter);//Now replace app with router in post,get,etc. and it to student.js and remove from it

mongoose.connect("mongodb://localhost:27017/students-api",{
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false//for the deprecation warning that we get while updating data using patch
}).then(()=>{
    console.log("connection is succesful");
}).catch((e)=>{
    console.log("No Connection");
})

const studentSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        minlength:3
    },
    email:{
        type: String,
        required: true,
        unique:[true,"Email id aready exists"],
        //validate(value){
          //  if(validator.isEmail(value)){
            //    throw new error("Invalid Email")
          //  }
        //}
    },
    phone:{
        type:Number,
        min:10,
       // max:10,
        required:true,
        unique:true
    },
    address:{
        type:String,
        required:true
    }
})

//We will create a new connection using model
const Student = new mongoose.model('Student',studentSchema);

module.exports = Student;

//Create a new router
//const router = new express.Router();

//We need to define the router
// router.get("/naman",(req,res) =>{
//     res.send("Hello whatsup guys")
// })

//We need too register our router
//app.use(router);

//Create a new students

//Promise method
// app.post("/students",(req,res) => {
//     console.log(req.body);

//     const user =  new Student(req.body);

//     user.save().then(() => {
//         res.status(201).send(user);
//     }).catch((e)=>{
//         res.status(400).send(e);
//     })

// });

//async await method
app.post("/students", async(req,res) =>{

    try{
    const user =  new Student(req.body);
    const createUser= await user.save();
    res.status(201).send(createUser);
    }catch(e){
    res.status(400).send(e);
    }
})


//Read the data of the registered students
app.get("/students",async(req,res)=>{
    
    try{
       const studentsData =  await Student.find();//Name should be same as given mongoose schema i.e., Student
       res.send(studentsData);
    }
    catch(e){
        res.send(e);
    }
})

//Get the indivisualised Studebt data using id
app.get("/students/:id", async(req,res) =>{
    try{
        const id = req.params.id;//We have assigne did in the link above thatswhy we have written id 
        //if we write anything else we should have written that 
        //i.e., req.params.name _that_we_have_provided_in_the_link

       const studentData = await Student.findById({_id:id});//key value and then parameter //if both are same only 1 can be written

       if(!studentData){
           res.status(404).send()
       }
       else{
       res.send(studentData);
       }
    //res.send(id)
    }
    catch(e){
        res.status(500).send(e)
    }
})

app.get("/students/:name", async(req,res) =>{
    try{
        const name = req.params.name;

       const studentdata = await Student.find({_name:name});//key value and then parameter //if both are same only 1 can be written

       if(!studentdata){
           res.status(404).send()
       }
       else{
       res.send(studentdata);
       }
    
    }
    catch(e){
        res.send(e)
    }
})

//Update the students data
app.patch("/students/:id", async(req,res) =>{
    try{
        const id = req.params.id;
        const updatestudent = await Student.findByIdAndUpdate({_id : id}, req.body, {//If we dont add this then 
//it will show previous data and not the updated one and we have to send the request again to get the updated data
            new:true
        });
        res.send(updatestudent);
    }
    catch(e){
        res.status(404).send(e)
    }
})

//Delete the data by id
app.delete("/students:id", async (req,res) => {
    try{
        const id = req.params.id;
        const deletestudent = await Student.findByIdAndDelete(req.params.id);
        if(!req.params.id){
            res.status(400).send;
        }
        res.send(deletestudent);
    }
    catch(e){
        res.status(500).send(e);
    }
});

app.listen(port, ()=>{
    console.log(`connection is set up at port no ${port}`);
});
//You do not nees express.json() and express.urlencoded()
//for GET requests or DELETE requests. We only need it for post and put req.

//express.json() is a method inbuilt in express to recognise the incoming
//Request Object as a JSON object. This method is called middleware in your application using the code:
//app.use(express.json())