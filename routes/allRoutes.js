const {Router} = require('express');
const User = require('../models/User')
const {check, validationResult} = require('express-validator');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const config = require('config')
const router = Router();


//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
router.get('registration', [
    check("email", 'Некорректный email').isEmail()
    , check("password", 'Минимальная длина пароля 6 символов').isLength({min: 6})
], async (req, res) => {

    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
                , message: "Что ты пытаешься сделать?"
            })
        }

        const {email, password} = req.body;

        const tryUser = await User.findOne({email});
        if (tryUser) {
            return res.status(400).json({message: 'Ты уже тут зарегался заходи не стесняйся только тапочки одень '})
        }
        const enrtyPassword = await bcrypt.hash(password, 101);
        const user = new User({email, password: enrtyPassword});
        await user.save();

        return res.status(201).json({message: 'Сложность уникальная '})

    } catch (e) {
        res.status(500).json({message: 'Пиздой накрылся сервак из-за тебя, СПАСИБО БЛЯДЬ'});
    }
});

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

.
post((req, res, next) => {
    login = req.body.login;
    password = req.body.password;
    UserLoginId = {id: NaN, login: ""};
    if (login && password) {
        UsER = useRR.filter(x => (x.login === login && x.password === password));
        if (UsER.length !== 0) {
            req.body.remember
                ? res.cookie('userLogin', `${UsER[0].id}`, options)
                : res.cookie('userLogin', `${UsER[0].id}`, optionsMoment);
            UserLoginId = {
                id: UsER[0].id
                , login: UsER[0].login
            };
            ServerMessage =
                {status: true, text: "Login & password is corrected"}
        } else {
            ServerMessage = {status: false, text: "Login & password is undefined"}
        }
    } else {
        ServerMessage =
            {text: "It`s not Login or Password ", status: undefined}
    }
    res.json([ServerMessage, UserLoginId]);
    next();
});


router.get('/:ProfileId', async (req, res) => {
    let ProfileId = parseInt(req.params.ProfileId || req.cookies.userLogin);
    let ProfilePage = {
        id: NaN
        , status: ''
        , location: {city: '', country: ''}
        , fullName: {name: '', lastName: ''}
        , friend: []
    };
    let ServerMessage;

    try {
        let UseR = fullname.filter(x => x.id === ProfileId);
        let pic = fottoSS.filter(x => x.id === ProfileId);
        ProfilePage = {
            id: UseR[0].id
            , status: UseR[0].aboutUser.statuss
            , location: {
                city: UseR[0].aboutUser.city
                , country: UseR[0].aboutUser.country
            }
            , fullName: {
                name: UseR[0].aboutUser.name
                , lastName: UseR[0].aboutUser.lastName
            }
            , friend: UseR[0].aboutUser.friend
            , picture: pic[0].max
        };
        ServerMessage = {status: true, text: "It`s profile List"}
    } catch (e) {
        ServerMessage = {status: false, text: `It\`s not profile List, error:${e}`}
    }

    await res.json([ServerMessage, ProfilePage]);
});


router.get('/post/:ProfileId', async (req, res) => {
    ProfileId = parseInt(req.params.ProfileId);
    if (ProfileId) {
        post = postSS.filter(x => (x.id === ProfileId));
        ProfilePot = post[0].post;
        ServerMessage = {status: true, text: "It`s user"}
    } else {
        ServerMessage = {status: false, text: "It`s not user"}
    }
    res.json([ServerMessage, ProfilePot])
});


router.post('/post/:ProfileId', async (req, res) => {
    sendUser = parseInt(req.cookies.userLogin);
    acceptUser = parseInt(req.params.ProfileId);
    TextPost = req.body.post;
    if (sendUser && acceptUser && TextPost) {
        profile = postSS.filter(x => x.id === acceptUser);
        profile[0].post.push({user: sendUser, post: TextPost});
        ServerMessage = {text: "Post is corrected!", status: true}
    } else {
        ServerMessage = {
            text: "Post is not corrected!(empty or undefined)"
            , status: false
        }
    }
    res.json(ServerMessage)
});


router.post('/status', async (req, res) => {
    userStatus = parseInt(req.cookies.userLogin);
    textStatus = req.body.status + '';
    if (textStatus && textStatus !== ' ') {
        fullname.filter(x => (x.id === userStatus) ? x.aboutUser.statuss = textStatus : '');
        ServerMessage = {
            text: "Status is corrected!"
            , status: true
        }
    } else {
        ServerMessage = {
            text: "Status is not corrected!(empty or undefined)"
            , status: false
        }
    }
    res.json(ServerMessage);
});


module.exports = router;


//регистрация
app.use('/api/', require('./routes/allRoutes'))


useRR = [
    {id: 1, login: 'q', password: 'q'},
    {id: 2, login: 'w', password: 'w'},
    {id: 3, login: 'e', password: 'e'},
    {id: 4, login: 'r', password: 'r'},
    {id: 5, login: 't', password: 't'},
    {id: 6, login: 'y', password: 'y'},
    {id: 7, login: 'u', password: 'u'},
    {id: 8, login: 'i', password: 'i'},
    {id: 9, login: 'o', password: 'o'},
    {id: 10, login: 'p', password: 'p'},
    {id: 11, login: 'a', password: 'a'},
    {id: 12, login: 's', password: 's'},
    {id: 13, login: 'd', password: 'd'}

];
fullname = [
    {
        id: 1, aboutUser: {
            statuss: 'I am Boss'
            , city: 'Los', country: 'Brasil'
            , name: '11111', lastName: '1'
            , friend: [2, 3, 4, 5]
            , dialog: [111, 222, 333, 444]
        }
    },

    {
        id: 2, aboutUser: {
            statuss: 'I am LOS'
            , city: 'Los', country: 'dfgsdfg'
            , name: '2222', lastName: '2'
            , friend: [2, 3, 4, 5, 6]
            , dialog: [111, 222, 333, 444]
        }
    },

    {
        id: 3, aboutUser: {
            statuss: 'I am ROS'
            , city: 'Los', country: 'Brassssssssssil'
            , name: '3333', lastName: '3'
            , friend: [2, 6, 4, 5]
            , dialog: [111, 222, 333, 444]
        }
    },

    {
        id: 4, aboutUser: {
            statuss: 'I am TOD'
            , city: 'Los', country: 'Braaaaaaaaaasil'
            , name: '44444', lastName: '4'
            , friend: [2, 3, 4, 5]
            , dialog: [111, 222, 333, 444]
        }
    },

    {
        id: 5, aboutUser: {
            statuss: 'I am VOIeS'
            , city: 'Los', country: 'Braaaaaaaaaxggsil'
            , name: '55555', lastName: '5'
            , friend: [2, 3, 4, 5], dialog: [111, 222, 333, 444]
        }
    },

    {
        id: 6, aboutUser: {
            statuss: 'I am WAS'
            , city: 'Los', country: 'Bragggggggggggsil'
            , name: '66666', lastName: '6'
            , friend: [2, 3, 4, 5]
            , dialog: [111, 222, 333, 444]
        }
    },

    {
        id: 7, aboutUser: {
            stauss: 'I am WED'
            , city: 'Los', country: 'Brahhhhhhhhhhhsil'
            , name: '77777', lastName: '7'
            , friend: [2, 3, 4, 5]
            , dialog: [111, 222, 333, 444]
        }
    },

    {
        id: 8, aboutUser: {
            statuss: 'I am RTY'
            , city: 'Los', country: 'Brasjjjjjjjjjjil'
            , name: '88888', lastName: '8'
            , friend: [2, 3, 4, 5]
            , dialog: [111, 222, 333, 444]
        }
    },

    {
        id: 9, aboutUser: {
            statuss: 'I am GFD'
            , city: 'Los', country: 'Brakkkkkkkkkkkksil'
            , name: '99999', lastName: '9'
            , friend: [2, 3, 4, 5]
            , dialog: [111, 222, 333, 444]
        }
    },

    {
        id: 10, aboutUser: {
            statuss: 'I am DCV'
            , city: 'Los', country: 'Brmmmmmmmmmmmmasil'
            , name: '100000', lastName: '10'
            , friend: [2, 3, 4, 5]
            , dialog: [111, 222, 333, 444]
        }
    },

    {
        id: 11, aboutUser: {
            statuss: 'I am FFF'
            , city: 'Los', country: 'Brbbbbbbbbbbbbbbasil'
            , name: '110000', lastName: '11'
            , friend: [2, 3, 4, 5]
            , dialog: [111, 222, 333, 444]
        }
    },

    {
        id: 12, aboutUser: {
            statuss: 'I am RRR'
            , city: 'Los', country: 'Bracccccccccccsil'
            , name: '1200000', lastName: '12'
            , friend: [2, 3, 4, 5]
            , dialog: [111, 222, 333, 444]
        }
    },

    {
        id: 13, aboutUser: {
            statuss: 'I am AAAA'
            , city: 'Los', country: 'Braxxxxxxxxxxsil'
            , name: '130000', lastName: '13'
            , friend: [2, 3, 4, 5]
            , dialog: [111, 222, 333, 444]
        }
    },
];
fottoSS = [
    {id: 1, max: "https://img2.goodfon.ru/original/320x240/b/b2/pulemet-6-stvor-metall-oruzhie.jpg"}
    , {id: 2, max: "https://img2.goodfon.ru/original/320x240/b/b2/pulemet-6-stvor-metall-oruzhie.jpg"}
    , {id: 3, max: "https://img2.goodfon.ru/original/320x240/b/b2/pulemet-6-stvor-metall-oruzhie.jpg"}
    , {id: 4, max: "https://img2.goodfon.ru/original/320x240/b/b2/pulemet-6-stvor-metall-oruzhie.jpg"}
    , {id: 5, max: "https://img2.goodfon.ru/original/320x240/b/b2/pulemet-6-stvor-metall-oruzhie.jpg"}
    , {id: 6, max: "https://img2.goodfon.ru/original/320x240/b/b2/pulemet-6-stvor-metall-oruzhie.jpg"}
    , {id: 7, max: "https://img2.goodfon.ru/original/320x240/b/b2/pulemet-6-stvor-metall-oruzhie.jpg"}
    , {id: 8, max: "https://img2.goodfon.ru/original/320x240/b/b2/pulemet-6-stvor-metall-oruzhie.jpg"}
    , {id: 9, max: "https://img2.goodfon.ru/original/320x240/b/b2/pulemet-6-stvor-metall-oruzhie.jpg"}
    , {id: 10, max: "https://img2.goodfon.ru/original/320x240/b/b2/pulemet-6-stvor-metall-oruzhie.jpg"}
    , {id: 11, max: "https://img2.goodfon.ru/original/320x240/b/b2/pulemet-6-stvor-metall-oruzhie.jpg"}
    , {id: 11, max: "https://img2.goodfon.ru/original/320x240/b/b2/pulemet-6-stvor-metall-oruzhie.jpg"}
    , {id: 12, max: "https://img2.goodfon.ru/original/320x240/b/b2/pulemet-6-stvor-metall-oruzhie.jpg"}
    , {id: 13, max: "https://img2.goodfon.ru/original/320x240/b/b2/pulemet-6-stvor-metall-oruzhie.jpg"}
];
postSS = [
    {
        id: 1, post: [
            {user: 1, post: 'df6sf6fs'}
            , {user: 1, post: 'sdf5sdf'}
            , {user: 1, post: 'sdf23323sdf'}
        ]
    }, {
        id: 2, post: [
            {user: 2, post: 'df6sf6fs'}
            , {user: 2, post: 'sdf5sdf'}
            , {user: 2, post: 'sdf23323sdf'}
        ]
    }, {
        id: 3, post: [
            {user: 3, post: 'df6sf6fs'}
            , {user: 3, post: 'sdf5sdf'}
            , {user: 3, post: 'sdf23323sdf'}
        ]
    }, {
        id: 4, post: [
            {user: 1, post: 'df6sf6fs'}
            , {user: 4, post: 'sdf5sdf'}
            , {user: 1, post: 'sdf23323sdf'}
        ]
    }, {
        id: 5, post: [
            {user: 1, post: 'df6sf6fs'}
            , {user: 51, post: 'sdf5sdf'}
            , {user: 1, post: 'sdf23323sdf'}
        ]
    }, {
        id: 6, post: [
            {user: 1, post: 'df6sf6fs'}
            , {user: 6, post: 'sdf5sdf'}
            , {user: 1, post: 'sdf23323sdf'}
        ]
    }, {
        id: 7, post: [
            {user: 1, post: 'df6sf6fs'}
            , {user: 7, post: 'sdf5sdf'}
            , {user: 1, post: 'sdf23323sdf'}
        ]
    }, {
        id: 8, post: [
            {user: 1, post: 'df6sf6fs'}
            , {user: 8, post: 'sdf5sdf'}
            , {user: 1, post: 'sdf23323sdf'}
        ]
    }, {
        id: 9, post: [
            {user: 1, post: 'df6sf6fs'}
            , {user: 9, post: 'sdf5sdf'}
            , {user: 1, post: 'sdf23323sdf'}
        ]
    }, {
        id: 10, post: [
            {user: 1, post: 'df6sf6fs'}
            , {user: 10, post: 'sdf5sdf'}
            , {user: 1, post: 'sdf23323sdf'}
        ]
    }, {
        id: 11, post: [
            {user: 1, post: 'df6sf6fs'}
            , {user: 4, post: 'sdf5sdf'}
            , {user: 1, post: 'sdf23323sdf'}
        ]
    }, {
        id: 12, post: [
            {user: 1, post: 'df6sf6fs'}
            , {user: 5, post: 'sdf5sdf'}
            , {user: 1, post: 'sdf23323sdf'}
        ]
    }, {
        id: 13, post: [
            {user: 1, post: 'df6sf6fs'}
            , {user: 13, post: 'sdf5sdf'}
            , {user: 1, post: 'sdf23323sdf'}
        ]
    }

];
messagEE = [
    {
        id1: 1, id2: 1, message: [
            {user: 1, message: 'Hallo bitch'}
        ]
    },
];