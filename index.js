import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

await mongoose.connect('mongodb://localhost/capstone_database');

const Chat=new mongoose.Schema({
    senderID:String,
    receiver:String,
    type:String,
    body: String,
    readflag: {
        type: Boolean,
        default: false
    },
    created:{
        type:Date,
        default:new Date()
    }
});
const ChatModel=mongoose.model('chat',Chat);

const Membership=new mongoose.Schema({
    id:String,
    password:String,
    name:String,
    age:Number
})
const MembershipModel=mongoose.model('membership',Membership);

const HOST='0.0.0.0';
const PORT=3000;

const app=express();

app.use(express.json());
app.use(cors());

app.listen(PORT,HOST,()=>console.log(`Running on ${HOST}:${PORT}`));

app.post('/chat',async(req,res)=>{ //CREATE
    try{
        console.log(req.body);
        const document=await ChatModel.create(req.body);
        res.json(document);
    }catch(err){
        res.send({"error":err});
    }
});

app.get('/chat/',async(req,res)=>{ //READ ALL
    try{
        console.log(req.body);
        const documents=await ChatModel.find({});
        res.send(documents);
    }catch(err){
        res.send({"error":err});
    }
});

app.get('/chat/:rcv_id',async(req,res)=>{ //READ ONE
    try{
        let filter = {"receiver":req.params.rcv_id,"readflag":false};
        console.log(req.params);
        const documents=await ChatModel.find(filter);
        console.log(documents);
        await ChatModel.updateMany(filter, {"readflag" : true});
        console.log('before send')
        res.send(documents);
        console.log('after send')
    }catch(err){
        res.send({"error":err});
        console.log('error');
    }
});

app.put('/chat/:id',async(req,res)=>{ //UPDATE
    try{
        const before=await ChatModel.findByIdAndUpdate(req.params.id,req.body);
        const after=await ChatModel.findById(req.params.id);
        res.send({"before":before,"after":after});
    }catch(err){
        res.send(err);
    }
});

app.delete('/chat/:id',async(req,res)=>{ //DELETE
    try{
        const document=await ChatModel.findByIdAndDelete(req.params.id);
        res.send({'removed':document});
    }catch(err){
        res.send(err);
    }
});

// ---------------------------------------------------------------------------------

app.post('/membership',async(req,res)=>{ //CREATE
    try{
        console.log(req.body);
        const document=await MembershipModel.create(req.body);
        res.json(document);
    }catch(err){
        res.send({"error":err});
    }
});

app.get('/membership/',async(req,res)=>{ //READ ALL
    try{
        console.log(req.body);
        const documents=await MembershipModel.find({});
        res.send(documents);
    }catch(err){
        res.send({"error":err});
    }
});

app.get('/membership/:mb_id',async(req,res)=>{ //READ ONE
    try{
        let member = {"id":req.params.mb_id};
        const documents=await MembershipModel.find(member);
        if (documents.length >= 1) {
            console.log(documents);
            res.send(documents);
        } else {
            console.log("회원을 찾을 수 없음");
        }
    }catch(err){
        res.send({"error":err});
        console.log('error');
    }
});