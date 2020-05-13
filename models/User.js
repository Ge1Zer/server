const {Schema, model} = require('mongoose');


let UserValidator = Schema({
    'Login': String
    , 'Password': String
    , 'Description': {
        'Nickname': Array
        ,'Location':{
            'Count': String
           ,'City':String
        }
        ,'Age':{
            'day':Number
            ,'month':String
            ,'year':Number
            ,'age':Number
        }
        ,'Gender':String
        ,'Skills':Array
        ,'Photo':{
            'origin':String
            ,'default':String
        }
        ,'PhotoMin': {
            'origin':String
            ,'default':String
        }
        ,'Friend': Array
        ,'Status': String
        ,'Tags':Array
    }
    , 'RegistrationStatus': {
        'authorization': Boolean
        , 'key': String
    }
});

const User = model('User', UserValidator)
module.exports = User;


