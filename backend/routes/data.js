const express = require('express')
const router = express.Router()
const dataModel = require('../DB/models/data')
const multer = require('multer')
const fs = require('fs')
const path = require('path')


var requestIp = require('request-ip');
const { FILE } = require('dns')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, __dirname+'/uploaded_csv/') // 파일 업로드 경로
    },
    filename: function (req, file, cb) {
      cb(null, "data.csv") //파일 이름 설정
    }
  })
  
const upload = multer({ storage: storage })

function nowTime(){
    const date = new Date(+new Date() + 3240 * 10000).toISOString().split("T")[0]
    const time = new Date().toTimeString().split(" ")[0];
    return (date + ' ' + time);
}

const FILE_NAME = "data.csv";
const csvPath = path.join(__dirname,'.','uploaded_csv',FILE_NAME);


function readCsv(){
    /* const csv = fs.readFileSync(csvPath,"utf-8");
    const rows = csv.split("\r\n")
    if(rows[rows.length-1]===''){
        rows.pop();
    }

    for(let i=1; i<rows.length; i++){
        const row = rows[i]
        const data = row.split(",")
        
        //console.log(data[0])    //ipaddr
        //console.log(data[1])    //gname
        //console.log(data[2])    //etc
        //console.log(data[3])    //date

        var postData = new dataModel({
            ipaddr: data[0],
            gname: data[1],
            etc: data[2],
            date: data[3]
        })
    
        postData.save((err)=>{
            if(err){
                console.log(err)
            }
            else{
                console.log("success")
            }
        })

    }
    var ip = requestIp.getClientIp(req);
    console.log("upload_csv " + nowTime() + " Access IP: "+ ip); */
}

router.get('/',(req,res)=>{
    dataModel.find({},function(err,docs){
        if(err){
            res.json(err)
        }
        res.json(docs)
    })
});

router.post('/upload_csv', upload.single('file'), (req,res,next)=>{
    
    const { fieldname, originalname, encoding, mimetype, destination, filename, path, size } = req.file
    const { name } = req.body;

/*     console.log("body 데이터 : ", name);
    console.log("폼에 정의된 필드명 : ", fieldname);
    console.log("사용자가 업로드한 파일 명 : ", originalname);
    console.log("파일의 엔코딩 타입 : ", encoding);
    console.log("파일의 Mime 타입 : ", mimetype);
    console.log("파일이 저장된 폴더 : ", destination);
    console.log("destinatin에 저장된 파일 명 : ", filename);
    console.log("업로드된 파일의 전체 경로 ", path);
    console.log("파일의 바이트(byte 사이즈)", size); */
    try{
        //readCsv()
        const csv = fs.readFileSync(csvPath,"utf-8");
        const rows = csv.split("\r\n")
        if(rows[rows.length-1]===''){
            rows.pop();
            }

        for(let i=1; i<rows.length; i++){
            const row = rows[i]
            const data = row.split(",")
        
        //console.log(data[0])    //ipaddr
        //console.log(data[1])    //gname
        //console.log(data[2])    //etc
        //console.log(data[3])    //date

            var postData = new dataModel({
                ipaddr: data[0],
                gname: data[1],
                etc: data[2],
                date: data[3]
            })
    
            postData.save((err)=>{
                if(err){
                    console.log(err)
                }
                else{
                    console.log("success")
                }
            })

        }
        var ip = requestIp.getClientIp(req);
        console.log("upload_csv " + nowTime() + " Access IP: "+ ip);
    }catch(e){
        console.log("upload_csv error" + nowTime() + " Access IP: "+ ip);
    }
    //res.json({ok: true, data: "Single Upload Ok"})
    //res.sendFile(__dirname+'../../frontend/index.html')
    res.write("<script>window.location.href = 'http://localhost:8080';</script>");
    
})

router.post('/addInfo',(req,res,next) => {

    //console.log("addInfo " + nowTime())
    var ip = requestIp.getClientIp(req);
    console.log("addInfo " + nowTime() + " Access IP: "+ ip);

    var postData = new dataModel({
        ipaddr: req.body.ipaddr,
        gname: req.body.gname,
        etc: req.body.etc,
        date: req.body.date
    })

    postData.save((err)=>{
        if(err){
            res.json({
                status:1,
                message:'error',
            })
        }
        res.json({
            status:0,
            message:'success'
        })
    })
})

router.post('/delete',(req,res,next) => {
    console.log("delete " + nowTime())

    dataModel.findByIdAndDelete(req.body.data,function(err,docs){
        if(err){
            res.json(err)
        }
        else{
            res.json(docs)
        }
    })
})

router.post('/edit',(req,res,next)=>{

    var ip = requestIp.getClientIp(req);
    console.log("edit " + nowTime() + " Access IP: "+ ip);

    let data = req.body.data
    let id
    let newVal
    let prop
    //console.log(data)
    val = data

    id = val[0];
    newVal = val[1];
    prop = val[2];

    if(prop=="gname"){
        dataModel.findByIdAndUpdate(id,{gname:newVal},function(err,docs){
            if(err){
                res.json(err)
            }
            else{
                res.json(docs)
            }
        })
    }
    else if(prop=="ipaddr"){
        dataModel.findByIdAndUpdate(id,{ipaddr:newVal},function(err,docs){
            if(err){
                res.json(err)
            }
            else{
                res.json(docs)
            }
        })
    }
    else if(prop=="etc"){
        dataModel.findByIdAndUpdate(id,{etc:newVal},function(err,docs){
            if(err){
                res.json(err)
            }
            else{
                res.json(docs)
            }
        })
    }
    else if(prop=="date"){
        dataModel.findByIdAndUpdate(id,{date:newVal},function(err,docs){
            if(err){
                res.json(err)
            }
            else{
                res.json(docs)
            }
        })
    }
    else{
        console.log("Not correct prop")
    }
})


module.exports = router