import express, { response } from 'express'
import {PORT, MongoDBURL} from './config.js'
import {MongoClient, ObjectId, ServerApiVersion} from "mongodb"
const app = express()


 app.use(express.json()) 

 const client = new MongoClient (MongoDBURL, {
    serverApi: {
         version: ServerApiVersion.v1,
         strict: true,
         deprecationErrors: true,
        }
    });
    
    const bookDB = client.db("myBookShop")
    const myBooks = bookDB.collection("booksCollection")
    

app.listen(PORT, ()=> {
    console.log(`Server started on port ${PORT}`)
})

app.get('/', (req, res)=> {
  return  res.status(202).send("Domain Expansion")

})

app.get('/shop', (req, res)=> {
    myBooks.find().toArray()
    .then(response=>{
        //console.log(response)
        return res.status(202).send(response)
    })
    .catch(err=>console.log(err))
    
    //return  res.status(202).send("<a href='/'> Home</a>")
    
})
app.get('/shop/:id', (req, res)=> {
    const data = req.params

const filter = {
    "_id" : new ObjectId(data.id) 
    }

    myBooks.findOne(filter)
    .then(response=>{
        //console.log(response)
        return res.status(202).send(response)
        })
        .catch(err=>console.log(err))
        
})



    

// return  res.status(202).send(`<a href='/'> Home ${data.id}</a>`)

app.post('/admin/savebook', (req, res)=> {
    const data = req.body
    if (!data.title)
        return res.status(202).send("No title found.")
    if (!data.author)
    return res.status(202).send("No author found.")
if (!data.price)
return res.status(202).send("No price found.")

myBooks.insertOne(data)
.then(response=>{
        return res.status(202).send(JSON.stringify(response))
    })
        .catch(err=>console.log(err))
    })
  

    
  app.delete ('/admin/remove/:id', (req ,res)=>{
  
  const data = req.params

    const filter ={
        "_id" : new ObjectId(data.id)
    }

  myBooks.deleteOne(filter)
  .then(response=>{
      //console.log(response)
      return res.status(202).send(response)
      })
      .catch(err=>console.log(err))
  })  
    
    
  app.put('/admin/update/:id', (req, res)=>{

      
      const data = req.params
      const docData = req.body
      
      const filter = {
          "_id" : new ObjectId(data.id)
        }
        const updDoc = {
            $set : {
                ...docData
            }
        }
        
        
        myBooks.updateOne(filter, updDoc)
        .then (response=>{

           return res.status(202).send(response)
        })
        .catch(err=>console.log(err))
        
        
    })

