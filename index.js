const express  = require('express')
const mongoose = require('mongoose')
const app = express()
const {v4 : uuidv4} = require('uuid')
// mrEihtdmisx07QNP kdthakkar22

app.set('view engine','ejs')
app.set('views','./views')
app.use(express.urlencoded({extended:true}))

mongoose.connect("mongodb+srv://kdthakkar22:mrEihtdmisx07QNP@cluster0.b4ghb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0").then(()=>console.log('Connected')).catch(()=>console.log('Some error while Connecting to Server! Try again Later'))
// mongoose.connect("mongodb://127.0.0.1:27017/chaintech").then(()=>console.log("Connected")).catch(()=>console.log("Not Connected"))

const Mymodel = mongoose.Schema({
    uniqueId:String,
    title:String,
    discription:String,
    done:Boolean,
    category:String
})

const Categories = mongoose.Schema({
    name : String
})

const category = mongoose.model('Categories',Categories)
const tasks = mongoose.model('Tasks',Mymodel)

app.get('/',async (req,res)=>{
    const TaskList = await tasks.find({})
    const cat = await category.find({})
    res.render('index.ejs',{'tasklist':TaskList,"cat":cat})
})

app.post('/addcat', async (req,res) => {
    const name = req.body.categoryName;
    const cat = new category({
        name:name
    })
    await cat.save()
    res.redirect('/')
})

app.get('/deletecat', async(req,res)=>{
    const name = req.query.name
    await category.deleteOne({name:name})
    res.redirect('/')
})

app.post('/addtask',async (req,res)=>{
    const id = req.query.uid;
    const title = req.body.taskTitle
    const description = req.body.taskDescription
    const category = req.body.taskCategory
    // console.log(id)
    if(id){
        // console.log(id)
        await tasks.updateOne({'uniqueId':id},{$set:{title:title, discription:description}})
    } else {
        const uniqueId = uuidv4()
        let task = new tasks({
            uniqueId:uniqueId,
            title:title,
            discription:description,
            done:false,
            category:category
        })
        await task.save()
    }
    res.redirect('/')
})

app.get('/deletetask',async (req,res)=>{
    const id = req.query.uid
    await tasks.deleteOne({'uniqueId':id})
    res.redirect('/')
})

app.get('/completedtask', async (req,res)=>{
    const id = req.query.uid
    await tasks.updateOne({'uniqueId':id},{$set:{done:true}})
    res.redirect('/')
})


app.listen(5000)