
const User = require('./models/User');
const Party = require('./models/Party');
const config= require('config');

const express       =   require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const favicon = require('express-favicon');

const app = express();

app.use(cookieParser ());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const MONGO = config.get('mongoUri');
const user =config.get('user')
const refresh =config.get('refreshToken')
const client = config.get('clientId')
const secret = config.get('clientSecret')
const port=5000 || process.env.PORT
// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "https://geizer6991.github.io");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     res.header("Access-Control-Allow-Credentials", true);
//     next();
// });

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:8848");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Credentials", true);
    next();
});


let transporter = nodemailer.createTransport(
    {
    service: 'Gmail',
    auth: {
      type:'OAuth2'
      , user:user
      , refreshToken:refresh
      , clientId:client
      , clientSecret: secret
    }
});


options = {maxAge: 900000, httpOnly: true,};
optionsMoment = {maxAge: 20000, httpOnly: true,};
randomNumber=Math.random().toString();
randomNumber=randomNumber.substring(2,randomNumber.length);

async function start() {
    try {
        await mongoose.connect(MONGO, {
            useNewUrlParser: true
            , useUnifiedTopology: true
            , useCreateIndex: true
            , autoIndex: false
        });
        app.listen(port, console.log(`Server connected to mongoose and start on port`))
    } catch (e) {
        console.log('server error', e.message);
        process.exit(1);
    }
}
start();

// app.get('/', function(req, res){
//     res.redirect('/login');
// });
//###############################################################
app.route('/login')
    .get((req, res) => {
        let id = req.cookies.code;
        if (id) {
            User.findOne({_id: id}).exec((err, user) => {
                res.send({
                    _id: user._id
                    , status: true
                    , message: "User, Entry"
                })
            })
        } else {
            res.json({mess: 'error cookie undefined', status: false, user: ''})
        }
    })
    .post((req, res) => {
        let Login = req.body.Login;
        let Password = req.body.Password;
        User.findOne({'Login': Login, 'Password': Password}).exec((err, user) => {
            console.log(user)
            if (user && user.RegistrationStatus.authorization) {
                res.cookie('code', user._id, options);
                res.send({
                    _id: user._id
                    , status: true
                    , message: "User, Entry"
                })
            } else {
                res.json({mess: 'You are not logged in to the app, corrected login or password', status: false})
            }
        })
    });
//#######################################################################
app.route('/registration')
    .post((req, res) => {
        let Login    = req.body.Login;
        let Password = req.body.Password;
        let Nickname = req.body.Nickname;

        console.log(Login)
        console.log(Password)
        console.log(Nickname)
        let pass_gen=(len)=>{
            let string = 'abdehkimnopswxzABDEFGHKMNPOQRSTWXZ123456789';
            let str = '';
            for (let i = 0; i <len; i++) {
                let pos = Math.floor(Math.random() * string.length);
                str += string.substring(pos,pos+1);
            }
            return str;
        }
        let key=pass_gen(4);
        console.log(key)
        let mailOptions={
            from: `${Nickname} <${Login}>`,
            to: Login,
            subject: 'End of registration',
            text: 'This String is used to complete registration',
            html: `This String is used to complete registration <p>${key}</p>.`,
        };
        transporter.sendMail(mailOptions, (err,info)=>{
            transporter.close()
        });

        User.findOne({'Login': Login, 'Password': Password}).exec((err, user) => {
            console.log(user)
            if (!user) {
                let NewUser = new User({
                    'Login': Login
                    , 'Password': Password
                    , 'Description': {
                        'Nickname': [`${Nickname}`]
                        ,'Location':{
                            'Count':'what country do you are living ?'
                            ,'City':'what country do you are living ? '
                        }
                        ,'Gender':'X'
                        ,'Age':{
                            'day':0
                            ,'month':''
                            ,'year':0
                            ,'age':0
                        }
                        ,'Skills':['List Skills']
                        ,'Photo':{
                            'origin':''
                            ,'default':'https://99px.ru/sstorage/1/2018/09/image_12609180120369461163.gif'
                        }
                        ,'PhotoMin': {
                            'origin':''
                            ,'default':'https://99px.ru/sstorage/1/2018/09/image_12609180120369461163.gif'
                        }
                        ,'Friend': []
                        ,'Status': 'Describe your condition'
                        ,'Tags':[]
                    }
                    , 'RegistrationStatus':{
                        'authorization':false
                        ,'key':key
                    }
                });
                NewUser.save( (err) => { !err ? console.log('Exelent') : console.log('err01', err) } );
                res.send( {mess: 'OK', status: true} )
            } else {
                res.send( {mess: 'User exists. login with your username or password', status: false} )
            }
        })
    });
app.route('/protection')
    .post((req,res)=>{
        User.findOne({'RegistrationStatus.key':req.body.key}).exec((err, prof) => {
            if(prof) {
                prof.RegistrationStatus.key = 0;
                prof.RegistrationStatus.authorization = true;

                prof.save();
                res.send({status:true})

            }else{
                res.send({status:false})
            }
        });
})
//############################################################################
app.route('/exit')
    .get((req, res)=>{
        res.cookie('code', '', optionsMoment);
        res.json({mess: 'User deleted', status: false})
    });
//###############################################################
app.route('/profile/:profile')
    .get((req, res) => {
        let IdProfile = req.params.profile;
        User.findOne({_id: IdProfile}).exec((err, prof) => {
            prof ? res.send( {Profile: prof['Description'], mess: 'Profile found', status: true} )
                 : res.send( {mess: 'profile, in corrected', status: false} )
        });
    });
//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
app.post('/update/info', (req, res) => {
    let id      = req.cookies.code;
    let inform  = req.body.inform;
        User.findOne( {_id: id} ).exec( (err, user) => {
            if (user) {
                let description = user.Description;
                description.Nickname = inform.nickname              ||'NoName';
                description.Location.Count = inform.location.Count  ||' ';
                description.Location.City = inform.location.City    ||' ';
                description.Gender = inform.gender                  ||'X';
                description.Age.day = inform.age.day                ||0;
                description.Age.month = inform.age.month            ||0;
                description.Age.year = inform.age.year              ||0;
                description.Age.age = inform.age.age                ||0;
                description.Skills = inform.skills                  ||0;
                description.Photo.maxSize= inform.photo             ||'https://99px.ru/sstorage/1/2018/09/image_12609180120369461163.gif';
                description.Status = inform.status                  ||' ';
                description.Tags = inform.tags                      ||' ';
                user.save();
                res.json( {mess: 'Set info', status: true } )
            } else {
                res.json({mess: 'error cookie undefined', status: false, user: ''})
            }
        })
});
//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
app.route('/people')
   .post((req, res)=> {
       let id = req.cookies.code;

       let list = req.body.list;
       let tags = req.body.tags;
       let nickname = req.body.nickname;

       let peopleFriend=[],user=[];
       let fu=()=>{
           return(
               nickname.length!==0 && tags.length!==0 && {'Description.Tags': {$all: tags}, 'Description.Nickname': {$all: nickname}}
               ||nickname.length!==0 && tags.length===0 && { 'Description.Nickname': {$all: nickname} }
               ||nickname.length===0 && tags.length!==0 && {  'Description.Tags': {$all: tags} }
               ||nickname.length===0 && tags.length===0 && {}
           )
       };
       User.findOne({_id:id}).then(u => {
           user=[...u.Description.Friend];
           User.find(fu()).sort({'Description.Nickname':1}).skip(list*2-2).limit(2).then(people=>{
               if (people.length !== 0) {
                   for (let i = 0; i < people.length; i++) {
                       let a = user.filter(r =>r+'' === people[i]._id+'');
                       a.length !== 0
                           ? peopleFriend.push({
                               _id: people[i]._id,
                               Description: people[i].Description,
                               friendStatus: true
                           })
                           : peopleFriend.push({
                               _id: people[i]._id,
                               Description: people[i].Description,
                               friendStatus: false
                           })
                   }
                   res.send({people: peopleFriend})
               }else{
                   res.send({people})
               }
               peopleFriend = []
           })
       });
   });
app.route('/subscribe')
   .post((req,res)=>{
       let id=req.cookies.code;
       let profile=req.body.id;
       User.find({_id:id}).exec((err, user) => {
          let arr=[...user[0].Description.Friend];
           let f=arr.indexOf(profile);
           f<0
               ?arr.push(profile)
               :arr.splice(f,f+1);
           user[0].Description.Friend=arr;
           user[0].save();
           err && res.json({mess:'NO',status:false})
        });
       res.json({mess:'OK',status:true})
   });
//###############################################################
app.route('/message/friend')
    .get((req,res)=>{
        let code=req.cookies.code;
        User.find({_id:code}).then(u => {
            let r=[...u[0].Description.Friend];
            u[0].save();
            User.find({_id:r}).then(u => {
                res.send({Friend: u})
            })
        })
    });


app.route('/message/party')
    .get((req,res)=>{
        let code=req.cookies.code;
        Party.find({ListPeople: {$all:[code]}}).then(u => {
                res.send({Party: u})
            });
    });

app.route('/message/list')
    .post((req,res)=> {
        let code = req.cookies.code;
        let id = req.body.id;
        let list =req.body.list;
        let tu = () => {return list.length===0 ?{ListPeople: list} :{_id: id, ListPeople: list} };
        Party.findOne(tu()).then(r=> {
            r===null?res.send({}):r.ListPeople.filter(r => r === code).length !== 0 && res.send(r)
        });
    });


app.route('/message/send')
   .post((req,res)=>{
       let code = req.cookies.code;
       let profile = req.body.profile;

       let fi=(profile)=>{
          if(profile.idParty) {
             return  {_id:profile.idParty,ListPeople: {$all:profile.dialog} }
          }else {
             return  {ListPeople:{$all:profile.dialog} }
          }
       };
       Party.findOne(fi(profile)).then(r => {
           r.ListMessage.push({'user':code, 'text':profile.text,'img':profile.img,'date':profile.date});
           r.NumberMessage++;
           r.save();
           res.send({status:'good'})
       })
   });

app.route('/message/setting')
    .post((req,res)=>{
        let code = req.cookies.code;
        let setting=req.body.setting;
        setting.command==='FRI-ADD-PARTY' && new Party({
                'admin':[code]
                ,'ListPeople': setting.list
                ,'NameParty': `${setting.nameParty}`
                ,'AvaParty': 'https://im0-tub-ru.yandex.net/i?id=3817df0380ccc027fec4d3b6aebe468c&n=13'
                ,'NumberOfPerson':setting.list.length
                ,'ListMessage': []
                ,'NumberMessage':0
            }).save((err) => {
                !err ? console.log('dialog Created') : console.log('err01', err);});

        if(setting.command==='PAR-DEL') {
            for (let i = 0; i < setting.list.length; i++) {
                Party.deleteOne({_id: setting.list[i]}).then(
                    r=> {res.send({mess:'good'})}
                )
            }
        }


        setting.command==='LEAVING-THE-PARTY' && Party.find({_id:setting.list}).then(r=>{
                let f=[...r[0].ListPeople];
                let d=f.indexOf(code);
                f.splice(d,d+1);
                r[0].ListPeople=[...f];
                r[0].NumberOfPerson=r[0].ListPeople.length;
                r[0].save()
            })
    });


//=================================================>

    let listAction=[
      {
        id:1,priceSumple:100,priceAction:35,currency:'$'
        ,kind:'Pulover',type:'M',size:['48','46','42','43']

        ,img1:"https://a.lmcdn.ru/product/O/O/OO001EMCRCG7_7203461_1_v1.jpg"
        ,img2:"https://avatars.mds.yandex.net/get-marketpic/1339465/market_ahA4Am1d-FHhPZ1zAReSOQ/orig"
        ,img3:"https://image01.bonprix.ru/assets/1400x1960/1535442831/18263376-nEx8tCqM.jpg"
        ,img4:"https://image01.bonprix.ru/assets/1400x1960/0/18293478-ZK5zIOkY.jpg"

        ,color:'red'
        ,actionBull:true
      },{
        id:2,priceSumple:40,priceAction:30,currency:'$'
        ,kind:'Pulover',type:'M',size:['48','46','42','43']
        
        ,img1:"https://a.lmcdn.ru/product/O/O/OO001EMCRCG7_7203461_1_v1.jpg"
        ,img2:"https://avatars.mds.yandex.net/get-marketpic/1339465/market_ahA4Am1d-FHhPZ1zAReSOQ/orig"
        ,img3:"https://image01.bonprix.ru/assets/1400x1960/1535442831/18263376-nEx8tCqM.jpg"
        ,img4:"https://image01.bonprix.ru/assets/1400x1960/0/18293478-ZK5zIOkY.jpg"

        ,color:'blue'
        ,actionBull:true
      },{
        id:3,priceSumple:40,priceAction:30,currency:'$'
        ,kind:'Pulover',type:'M',size:['48','46','42','43']
        
        ,img1:"https://a.lmcdn.ru/product/O/O/OO001EMCRCG7_7203461_1_v1.jpg"
        ,img2:"https://avatars.mds.yandex.net/get-marketpic/1339465/market_ahA4Am1d-FHhPZ1zAReSOQ/orig"
        ,img3:"https://image01.bonprix.ru/assets/1400x1960/1535442831/18263376-nEx8tCqM.jpg"
        ,img4:"https://image01.bonprix.ru/assets/1400x1960/0/18293478-ZK5zIOkY.jpg"

        ,color:'green'
        ,actionBull:true
      },{
        id:4,priceSumple:40,priceAction:30,currency:'$'
        ,kind:'Switshot',type:'M',size:['48','46','42','43']
        
        ,img1:"https://a.lmcdn.ru/product/O/O/OO001EMCRCG7_7203461_1_v1.jpg"
        ,img2:"https://avatars.mds.yandex.net/get-marketpic/1339465/market_ahA4Am1d-FHhPZ1zAReSOQ/orig"
        ,img3:"https://image01.bonprix.ru/assets/1400x1960/1535442831/18263376-nEx8tCqM.jpg"
        ,img4:"https://image01.bonprix.ru/assets/1400x1960/0/18293478-ZK5zIOkY.jpg"

        ,color:'red'
        ,actionBull:true
      },{
        id:5,priceSumple:40,priceAction:30,currency:'$'
        ,kind:'Switshot',type:'M',size:['48','46','42','43']
        
        ,img1:"https://a.lmcdn.ru/product/O/O/OO001EMCRCG7_7203461_1_v1.jpg"
        ,img2:"https://avatars.mds.yandex.net/get-marketpic/1339465/market_ahA4Am1d-FHhPZ1zAReSOQ/orig"
        ,img3:"https://image01.bonprix.ru/assets/1400x1960/1535442831/18263376-nEx8tCqM.jpg"
        ,img4:"https://image01.bonprix.ru/assets/1400x1960/0/18293478-ZK5zIOkY.jpg"

        ,color:'blue'
        ,actionBull:true
      },{
        id:6,priceSumple:40,priceAction:30,currency:'$'
        ,kind:'Snickers',type:'M',size:['48','46','42','43']
        
        ,img1:"https://a.lmcdn.ru/product/O/O/OO001EMCRCG7_7203461_1_v1.jpg"
        ,img2:"https://avatars.mds.yandex.net/get-marketpic/1339465/market_ahA4Am1d-FHhPZ1zAReSOQ/orig"
        ,img3:"https://image01.bonprix.ru/assets/1400x1960/1535442831/18263376-nEx8tCqM.jpg"
        ,img4:"https://image01.bonprix.ru/assets/1400x1960/0/18293478-ZK5zIOkY.jpg"

        ,color:'green'
        ,actionBull:true
      },{
        id:7,priceSumple:40,priceAction:30,currency:'$'
        ,kind:'Snickers',type:'M',size:['48','46','42','43']
        
        ,img1:"https://a.lmcdn.ru/product/O/O/OO001EMCRCG7_7203461_1_v1.jpg"
        ,img2:"https://avatars.mds.yandex.net/get-marketpic/1339465/market_ahA4Am1d-FHhPZ1zAReSOQ/orig"
        ,img3:"https://image01.bonprix.ru/assets/1400x1960/1535442831/18263376-nEx8tCqM.jpg"
        ,img4:"https://image01.bonprix.ru/assets/1400x1960/0/18293478-ZK5zIOkY.jpg"

        ,color:'red'
        ,actionBull:true
      },{
        id:8,priceSumple:40,priceAction:30,currency:'$'
        ,kind:'Shoes',type:'M',size:['48','46','42','43']
       
        ,img1:"https://a.lmcdn.ru/product/O/O/OO001EMCRCG7_7203461_1_v1.jpg"
        ,img2:"https://avatars.mds.yandex.net/get-marketpic/1339465/market_ahA4Am1d-FHhPZ1zAReSOQ/orig"
        ,img3:"https://image01.bonprix.ru/assets/1400x1960/1535442831/18263376-nEx8tCqM.jpg"
        ,img4:"https://image01.bonprix.ru/assets/1400x1960/0/18293478-ZK5zIOkY.jpg"

        ,color:'blue'
        ,actionBull:true
      },{
        id:9,priceSumple:40,priceAction:30,currency:'$'
        ,kind:'Shoes',type:'M',size:['48','46','42','43']
        
        ,img1:"https://a.lmcdn.ru/product/O/O/OO001EMCRCG7_7203461_1_v1.jpg"
        ,img2:"https://avatars.mds.yandex.net/get-marketpic/1339465/market_ahA4Am1d-FHhPZ1zAReSOQ/orig"
        ,img3:"https://image01.bonprix.ru/assets/1400x1960/1535442831/18263376-nEx8tCqM.jpg"
        ,img4:"https://image01.bonprix.ru/assets/1400x1960/0/18293478-ZK5zIOkY.jpg"

        ,color:'green'
        ,actionBull:true
      }
    ]

     let bisnesCard=[
      {
        type:'PREMIUM'
        ,price:'1000'
        ,currency:'$'
        ,imgBig:'https://im0-tub-ru.yandex.net/i?id=cb230404183e1731b9ba9177baab1f41&n=13'
        ,desc:'Даёт возможность получить скидку, по номиналу карты, от следующей покупки'

     },{
        type:'STANDART'
        ,price:'500'
        ,currency:'$'
        ,imgBig:'https://im0-tub-ru.yandex.net/i?id=cb230404183e1731b9ba9177baab1f41&n=13'
        ,desc:'Даёт возможность получить скидку, по номиналу карты, от следующей покупки'

      },{
        type:'LOW'
        ,price:'100'
        ,currency:'$'
        ,imgBig:'https://im0-tub-ru.yandex.net/i?id=cb230404183e1731b9ba9177baab1f41&n=13'
        ,desc:'Даёт возможность получить скидку, по номиналу карты, от следующей покупки'
      }
    ]
//=================================================>
app.route('/sait/action')
  .post((req,res)=>{
    let item=req.body.item
    let items=[]
    for(let i=0; i<item; i++){
      items.push(listAction[i])
    }
    res.json(items)
  })
    

  .get((req,res)=>{
    res.json(listAction)
  })
//=================================================>
  app.route('/sait/card')
  .post((req,res)=>{
    res.json(bisnesCard)
  })

//=================================================>  
function ArrayCompa(array1, array2){
  let r, f=[];
  r=array1.size.filter(x=>x== array2.size.filter(c=>c===x) )
  r.length!==0 && f.push(...r)

  if(!array2.strict && array2.size.length === 0){
    return true
  }

  if(array2.strict){
    return array2.size.length === f.length?true:false
  }else{
    return f.length!==0?true:false
  }
}
//=================================================>  
  app.route('/sait/catalog')
  .post((req,res)=>{
    let listTags=req.body.list;

    let ArrayItem;
    let ArrayItems=[];

    ArrayItem=listAction.filter(q=>
         (q.kind===listTags.kind || listTags.kind==="default" )
      && (q.color===listTags.color || listTags.color==='default')
      && q.priceAction>=listTags.priceAction.min
      && q.priceAction<=listTags.priceAction.max
      && ArrayCompa(q, listTags))

   // ArrayItem.length!==0 && ArrayItems.push(ArrayItem)
     res.json(ArrayItem)
  
  })