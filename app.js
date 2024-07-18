const express = require('express')
const passport = require('passport')
const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const initializePassport = require('./passport-config')
const forge = require('node-forge')
const dotenv = require('dotenv').config()

var bodyParser = require('body-parser');
var mongoose = require('mongoose')
var multer = require('multer'); 
var fs = require('fs');
var path = require('path');
var imgModel = require('./model');

const port = process.env.PORT || 5050
const app = express()
const favicon = require('serve-favicon')


var otp
const encrypt = (message, key, iv) =>{
    var cipher = forge.cipher.createCipher('AES-CBC', key);
    cipher.start({iv: iv});
    cipher.update(forge.util.createBuffer(message));
    cipher.finish();
    var encrypted = cipher.output;
    return encrypted
}

const decrypt = (encrypted, key, iv)=>{
    var decipher = forge.cipher.createDecipher('AES-CBC', key);
    decipher.start({iv: iv});
    decipher.update(forge.util.createBuffer(encrypted));
    var decryptedStr = decipher.output.toString();
    return decryptedStr
}

//Very important
//.replace(/[\s\b\x07\x05\x10\x01\x02\x03\x04\x05\x06\x07\x08\x09]/g, '')


//test area

//


function sendMail(subject,text,to){

    var nodemailer = require('nodemailer')
    // var transporter = nodemailer.createTransport({
    //     service: "SendinBlue",
    //     auth: {
    //         user: 'staff.credsaver@gmail.com',
    //         pass: process.env.SMTP_KEY
    //     }
    // })

    // var mailOptions = {
    //     from: 'staff.credsaver@gmail.com',
    //     to: to,
    //     subject: subject,
    //     text: text
    // }
    // transporter.sendMail(mailOptions, function(error, info){
    //     if (error) {
    //         console.log(error)
    //     }else {
    //         console.log('Email sent: ' + info.response)
    //     }
    // })
    

    // CURRENTY SENDING EMAIL WITHOUT VERIFIED DOMAIN NAME IS NOT ALLOWED BY ANY PROVIDER
    // FORGOT PASSWORD HAS BEEN DISCONTINUED UNTIL A DOMAIN NAME IS ACQUIRED AND VERIFIED.
    // PREFERRED PROVIDER IS 1. SPARKPOST 2. MAILTRAP
}

mongoose.connect(process.env.DB_URI,
    { useNewUrlParser: true, useUnifiedTopology: true }, err => {
        console.log('connected')
    });
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});
    
var upload = multer({ storage: storage });

async function main(userC, allR, passU, userU){

    const uri = process.env.DB_URI;
    const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true });

    

    // Connect to the MongoDB cluster
    await client.connect();
    console.log('Connection to MongoDB, successful!')

    // Make the appropriate DB calls here
    if (userC){
        result = await client.db("CredSaver").collection("users").insertOne(userC);
        return console.log(`New user added with the following id: ${result.insertedId}`);

    }else if(allR){
        const toReturn = await client.db("CredSaver").collection("users").find({ type: 'users' }).sort().toArray();
        return toReturn
    }else if(passU){
        const result = await client.db("CredSaver").collection("users").updateOne({ _id: passU[0] }, {$set : passU[1]})
        console.log(`${result.matchedCount} credential matched the criteria and ${result.modifiedCount} credential was updated.`)
    }else if(userU){
        var object = userU[1]
        const result = await client.db("CredSaver").collection("users").updateOne({ _id: userU[0] }, {$set : object})
        console.log(`${result.matchedCount} user matched the criteria and ${result.modifiedCount} user was updated.`)
    }
}

async function creds(credC, allR, credD, credR , credU){

    const uri = process.env.DB_URI;
    const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true });

    

    // Connect to the MongoDB cluster
    await client.connect();
    console.log('Connection to MongoDB, successful!')

    // Make the appropriate DB calls here
    if (credC){
        var object = credC
        //encryption
        for (var key in object){
            if (key !== 'type' && key !== '_id'){
                object[key] = encrypt(object[key] , process.env.ED_KEY , process.env.ED_IV)
            }
        }
        result = await client.db("CredSaver").collection("creds").insertOne(object);
        return console.log(`New credential added with the following id: ${result.insertedId}`);

    }else if(allR){
        const array = await client.db("CredSaver").collection("creds").find({ type: allR }).sort().toArray();
        // decryption
        array.forEach((object)=>{
            for (var key in object){
                if (key !== 'type' && key !== '_id'){
                    object[key] = decrypt(object[key] , process.env.ED_KEY ,  process.env.ED_IV).replace(/[\b\x07\x05\x10\x01\x02\x03\x04\x05\x06\x07\x08\x09]/g, '')
                }
            }
        })
        return array
    }else if(credD){
        const deletion = await client.db("CredSaver").collection("creds").deleteOne({ _id: credD });
        console.log(deletion.deletedCount)
    }else if(credR){
        const object = await client.db("CredSaver").collection("creds").findOne({ _id: credR })
        for (var key in object){
            if (key !== 'type' && key !== '_id'){
                object[key] = decrypt(object[key] , process.env.ED_KEY , process.env.ED_IV).replace(/[\b\x07\x05\x10\x01\x02\x03\x04\x05\x06\x07\x08\x09]/g, '')
            }
        }
        return object
    }else if(credU){
        var object = credU[1]
        //encryption
        for (var key in object){
            if (key !== 'type' && key !== '_id'){
                object[key] = encrypt(object[key] , process.env.ED_KEY , process.env.ED_IV)
            }
        }
        const result = await client.db("CredSaver").collection("creds").updateOne({ _id: credU[0] }, {$set : object})
        console.log(`${result.matchedCount} credential matched the criteria and ${result.modifiedCount} credential was updated.`)
    }
}

function mailExists(mail, userArray){
    return (userArray.find(user=>user.email == mail))
}
function findUserByMail(mail, userArray){
    user = userArray.find(o => o.email == mail);
    return user
}

//Authentication System
var promise = main(false, true, false)
promise.then((array) =>{
    users = array
    initializePassport(
        passport,
        email => users.find(user => user.email === email),
        id => users.find(user => user._id === id)
    )
    app.set('view-engine' ,'ejs')
    app.use(express.urlencoded({extended: false}))
    app.use(flash())
    app.use(session({secret: 'superSecretKey', resave: false, saveUninitialized: false }))
    app.use(methodOverride('_method'))
    app.use(passport.initialize())
    app.use(passport.session())
    app.use(express.static('public'))
    app.use(favicon(__dirname+'/public/images/favicon.ico'));

    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json())
    
    
    app.delete('/logout', function(req, res, next) {
        req.logout(function(err) {
          if (err) { return next(err); }
          res.redirect('/');
        });
      });
    app.get('/' , checkNotAuthenticated , (req,res)=>{
        res.render('landing.ejs')
    })
    app.get('/dashboard', checkAuthenticated, (req,res) => {
        var credPromise = creds(false, req.user._id, false)
        credPromise.then((credList)=>{
            imgModel.find({_id: req.user._id}, (err, items) => {
                if(err){
                    console.log(err)
                }else if(items.length==0) {
                    imgModel.find({_id:'generalImg'},(err,itemsNew)=>{
                        res.render('index.ejs',{image:itemsNew[0] , user:req.user, credentials: credList})
                    })
                }else{
                    res.render('index.ejs',{image:items[0] , user:req.user, credentials: credList})
                }
            });
        })
    })
    app.get('/dashboard/update/:id', checkAuthenticated , (req,res)=>{
        credPromise = creds(false,false,false,req.params.id,false)
        credPromise.then((object)=>{
            imgModel.find({_id: req.user._id}, (err, items) => {
                if(err){
                    console.log(err)
                }else if(items.length==0) {
                    imgModel.find({_id:'generalImg'},(err,itemsNew)=>{
                        res.render('update.ejs',{image:itemsNew[0] , user:req.user, cred : object})
                    })
                }else{
                    res.render('update.ejs',{image:items[0] , user:req.user, cred : object})
                }
            });
        })
    })
    app.put('/dashboard/updateuser/:id', (req,res)=>{
        console.log(req.body)
        id = req.params.id
        updatedUser = req.body
        updatedUser.email = req.user.email
        updatedUser.type = "users"
        updatedUser.password = req.user.password
        console.log(updatedUser)
        imgModel.find({_id: req.user._id}, (err, items) => {
            if(err){
                console.log(err)
            }else if(items.length==0) {
                imgModel.find({_id:'generalImg'},(err,itemsNew)=>{
                    res.render('done.ejs',{image:itemsNew[0] , user:req.user , message : 'User updated successfully!'})
                })
            }else{
                res.render('done.ejs',{image:items[0] , user:req.user , message : 'User updated successfully!'})
            }
        });
        main(false,false,false,[id,updatedUser])
    })
    app.get('/register', checkNotAuthenticated, (req,res) => {
        res.render('register.ejs')
    })
    app.get('/login', checkNotAuthenticated, (req,res) => {
        res.render('login.ejs')
    })
    app.post('/register', checkNotAuthenticated, async (req, res) =>{
        try{
            const hashedPwd = await bcrypt.hash(req.body.password, 10)
            var newUser = {
                    _id: (req.body.name+req.body.email).replace(/\W/g,''),
                    name: req.body.name,
                    email: req.body.email,
                    password: hashedPwd,
                    type: 'users',
                    age: 18,
                    tier: 'glass'
                }
            users.push(newUser)
            main(newUser, false, false)
            res.redirect('/login')
        } catch{
            res.redirect('/register')
        }
    })
    app.post('/login', passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/login',
        failureFlash: true
    }))
    app.get('/dashboard/new-cred', checkAuthenticated , (req,res)=>{
        imgModel.find({_id: req.user._id}, (err, items) => {
            if(err){
                console.log(err)
            }else if(items.length==0) {
                imgModel.find({_id:'generalImg'},(err,itemsNew)=>{
                    res.render('new-cred.ejs',{image:itemsNew[0] , user:req.user})
                })
            }else{
                res.render('new-cred.ejs',{image:items[0] , user:req.user})
            }
        });
    })
    app.post('/dashboard/new-cred', checkAuthenticated, (req, res)=>{
        var newCred = req.body
        newCred.type = req.user._id
        newCred._id = (req.user._id+newCred.siteName).replace(/\W/g,'')
        imgModel.find({_id: req.user._id}, (err, items) => {
            if(err){
                console.log(err)
            }else if(items.length==0) {
                imgModel.find({_id:'generalImg'},(err,itemsNew)=>{
                    res.render('done.ejs',{image:itemsNew[0] , user:req.user , message : 'Credentials saved and encrypted successfully!'})
                })
            }else{
                res.render('done.ejs',{image:items[0] , user:req.user , message : 'Credentials saved and encrypted successfully!'})
            }
        });
        creds(newCred, false, false)
    })
    app.delete('/dashboard/:id' , (req,res)=>{
        var id = req.params.id
        creds(false,false,id)
        imgModel.find({_id: req.user._id}, (err, items) => {
            if(err){
                console.log(err)
            }else if(items.length==0) {
                imgModel.find({_id:'generalImg'},(err,itemsNew)=>{
                    res.render('done.ejs',{image:itemsNew[0] , user:req.user , message : 'Credentials deleted successfully!'})
                })
            }else{
                res.render('done.ejs',{image:items[0] , user:req.user , message : 'Credentials deleted successfully!'})
            }
        });
    })
    app.put('/dashboard/:id', (req,res)=>{
        id = req.params.id
        updatedCred = req.body
        updatedCred.type = req.user._id
        console.log(updatedCred)
        imgModel.find({_id: req.user._id}, (err, items) => {
            if(err){
                console.log(err)
            }else if(items.length==0) {
                imgModel.find({_id:'generalImg'},(err,itemsNew)=>{
                    res.render('done.ejs',{image:itemsNew[0] , user:req.user , message : 'Credentials updated and encrypted successfully!'})
                })
            }else{
                res.render('done.ejs',{image:items[0] , user:req.user , message : 'Credentials updated and encrypted successfully!'})
            }
        });
        creds(false,false,false,false,[id,updatedCred])
    })
    //done
    app.get('/userDetails', checkAuthenticated , (req,res)=>{
        imgModel.find({_id: req.user._id}, (err, items) => {
            if(err){
                console.log(err)
            }else if(items.length==0) {
                imgModel.find({_id:'generalImg'},(err,itemsNew)=>{
                    res.render('details.ejs',{image:itemsNew[0] , user:req.user})
                })
            }else{
                res.render('details.ejs',{image:items[0] , user:req.user})
            }
        });
    })
    app.get('/forgot-password', (req,res)=>{
        res.render('forgotPassword.ejs',{userFound: false, otp:'', otpVerified:false, steps: {s1: false, s2: false}})
    })
    app.post('/forgot-password' , (req, res)=>{
        let mail = req.body.mail
        ans = mailExists(mail, users)
        if (ans){
            otp = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1)
            sendMail('Password Reset For CredSaver',`Your One Time Password is ${otp}`,ans.email)
            res.render('forgotPassword.ejs',{user: ans, userFound: true, otpVerified:'neutral', steps: {s1: true, s2: false}})
        } else{
            res.send('no user try again')
        }
    })
    app.post('/verify-otp',(req,res)=>{
        if (req.body.otpEntered == otp){
            res.render('forgotPassword.ejs',{user: ans, userFound: true, otpVerified:true, steps: {s1: true, s2: true}})
        }else{
            res.render('forgotPassword.ejs',{user: ans, userFound: true, otpVerified:false, steps: {s1: true, s2: false}})
            otp=undefined
        }
    })
    app.post('/update-password',async (req,res)=>{
        var usermail = req.body.mail
        var updatedPass = await bcrypt.hash(req.body.password, 10)
        updatedUser = findUserByMail(usermail,users)
        updatedUser.password = updatedPass
        main(false,false,[user._id,updatedUser])
        res.redirect('/login')
    })
    app.post('/update-password-login',async (req,res)=>{
        var usermail = req.body.mail
        var newpass = req.body.new_pass
        var oldpass = req.body.old_pass
        var user = findUserByMail(usermail,users)
        // bcrypt.compare(oldpass, user.password, function(err, resp) {
        //     if (err){
        //         console.log(err)
        //     }
        //     if (resp){
        //         var updatedPass = bcrypt.hash(newpass, 10)
        //         updatedUser = findUserByMail(usermail,users)
        //         updatedUser.password = updatedPass
        //         main(false,false,[user._id,updatedUser])
        //         res.render('login.ejs',{messages : {error:'Password changed successfully! <br> Login again to continue.'}})
        //     }else{
        //         imgModel.find({_id: req.user._id}, (err, items) => {
        //             if(err){
        //                 console.log(err)
        //             }else if(items.length==0) {
        //                 imgModel.find({_id:'generalImg'},(err,itemsNew)=>{
        //                     res.render('done.ejs',{image:itemsNew[0] , user:req.user , message : 'Password Incorrect. Please try again.'})
        //                 })
        //             }else{
        //                 res.render('done.ejs',{image:items[0] , user:req.user , message : 'Password Incorrect. Please try again.'})
        //             }
        //         });
        //     }
        //   });
        if (await bcrypt.compare(oldpass, user.password)){
            var updatedPass = await bcrypt.hash(newpass, 10)
            updatedUser = findUserByMail(usermail,users)
            updatedUser.password = updatedPass
            main(false,false,[user._id,updatedUser])
            res.render('login.ejs',{messages : {error:'Password changed successfully! Login again to continue.'}})
        }else{
            imgModel.find({_id: req.user._id}, (err, items) => {
                if(err){
                    console.log(err)
                }else if(items.length==0) {
                    imgModel.find({_id:'generalImg'},(err,itemsNew)=>{
                        res.render('done.ejs',{image:itemsNew[0] , user:req.user , message : 'Password Incorrect. Please try again.'})
                    })
                }else{
                    res.render('done.ejs',{image:items[0] , user:req.user , message : 'Password Incorrect. Please try again.'})
                }
            });
        }
        
    })
    //ToDo:- done
    app.post('/upload', upload.single('image'), (req, res, next) => {

        imgModel.find({_id: req.user._id}, (err, items) => {
            if(err){
                console.log(err)
            }else if(items.length==0) { //if no previously uploaded custom image
                var obj = {
                    _id: req.body.id,
                    img: {
                        data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
                        contentType: 'image/png'
                    },
                    type: 'img'
                }
                fs.unlinkSync(path.join(__dirname + '/uploads/' + req.file.filename))
                imgModel.create(obj, (err, item) => {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        // item.save();
                        res.redirect('/');
                    }
                });
            }else{ //if there is previously uploaded image, first delte it and then add new image
                imgModel.deleteOne({_id:req.user._id},(err)=>{
                    if(err){
                        console.log(err)
                    }
                })
                var obj = {
                    _id: req.body.id,
                    img: {
                        data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
                        contentType: 'image/png'
                    },
                    type: 'img'
                }
                fs.unlinkSync(path.join(__dirname + '/uploads/' + req.file.filename))
                imgModel.create(obj, (err, item) => {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        // item.save();
                        res.redirect('/');
                    }
                });
            }
        });
    });
    //404 routing
    app.use((req,res,next)=>{
        res.render('notFound.ejs')
    })

    app.listen(port, () => {
        console.log(`Find the app on localhost:${port}`)
    })

    function checkAuthenticated(req, res, next){
        if (req.isAuthenticated()){
            return next()
        }

        res.redirect('/login')
    }
    function checkNotAuthenticated (req, res, next){
        if (req.isAuthenticated()){
            return res.redirect('/dashboard')
        }
        next()
    }
})



