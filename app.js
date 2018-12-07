const express = require('express');
const ejs = require('ejs');
const multer = require('multer');
const path = require('path');


// storage

const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req,file,cb){
        cb(null, file.fieldname+'-'+Date.now()+path.extname(file.originalname));
    }
});

// uploads

const upload = multer({
    storage: storage,
    limits:{
        fileSize : 1000000
    },
    fileFilter : function (req,file,cb){
            checkType(file,cb);
        }
    
}).single('myImg')


// Checking the type of file

function checkType(file,cb){
    const fileType = /jpeg|jpg|png|gif/;

    const exttype = fileType.test(path.extname(file.originalname).toLowerCase());

    console.log(exttype);

    const mimeType = fileType.test(file.mimetype);
    console.log(mimeType)

    if(exttype && mimeType){
       return cb(null,true)
    }else{
        return cb('Error: images Only')
    }
}


const app = express();

app.set('view engine', 'ejs');

app.use(express.static('./public'));

app.get("/",function(req,res){
    // res.send("Hello")
    res.render('index')
});

app.post('/uploads', function(req,res){
    upload(req,res,(err)=>{
        if(err){
            res.render('index',{
                msg : err
            });
        }else{
            if(req.file == undefined){
                res.render('index',{
                    msg : 'Error : No Image Selected'
                });
            }else{
                res.render('index',{
                    msg : 'File Uploded Successfully',
                    file: `uploads/${req.file.filename}`
                });
            }
            res.send("working");
            console.log(req.file)
        }
    })
});

const port = 3000;

app.listen(port, ()=> console.log(`Server is Running On Port ${port}`));