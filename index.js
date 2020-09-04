// Run with: node -r dotenv/config index.js 
const express = require('express');
const app= express();
const Tutorial = require('./models/tutorial');
const PORT = process.env.PORT;
const cors=require('cors')

app.use(cors())
app.use(express.json())

app.get('/api/tutorials',(req,res) => {
    const {title} = req.query||''
    const regex = new RegExp(title,'i')
    Tutorial.find({title:regex}).then(tutorials=>{
        res.json(tutorials.map(tutorial=>tutorial.toJSON()))
    })
    .catch(e => res.send(e))
})
app.get('/api/tutorials/published',(req,res) => {
    Tutorial.find({published:true}).then(tutorials=>{
        res.json(tutorials.map(tutorial=>tutorial.toJSON()))
    })
    .catch(e => res.send(e))
})
app.get('/api/tutorials/:id',(req,res) => {
    const id = req.params.id
    Tutorial.findById(id)
    .then(tutorial=>{
        res.json(tutorial.toJSON())
    }).catch(e=>res.status(404))
})
app.post('/api/tutorials',(req,res) => {
    console.log(req.body)
    const {title, content, published} = req.body
    if(!title){
        return res.status(400).json({
            error:'title missing'
        })
    }
    const tutorial = new Tutorial(
        {title, content:content||'empty', published:published||false}
    ) 
    tutorial.save()
    .then(savedTutorial=>{res.json(savedTutorial)})
})
app.put('/api/tutorials/:id',(req,res) => {
    const id = req.params.id
    const {body}= req
    Tutorial.findByIdAndUpdate(id,body,{new:true})
    .then(updatedTutorial=>{res.json(updatedTutorial.toJSON())})
    .then(tutorial=>{
        tutorial.find
    }).catch(e=>res.status(404)) 
})
app.delete('/api/tutorials',(req,res)=>{
    Tutorial.deleteMany({})
    .then(removedItems=>{res.send(`removed ${removedItems.deletedCount} items`)})
})
app.delete('/api/tutorials/:id',(req,res)=>{
    const {id} = req.params
    Tutorial.deleteOne({id})
    .then(removedItems=>{res.send(`removed item`)})
    .catch(e=>{res.status(404).send('item not found')})
})


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })