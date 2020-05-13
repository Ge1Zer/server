const {Schema, model} = require('mongoose');

let Party = new Schema({
    'admin':Array
    ,'ListPeople': Array
    ,'NameParty':Array
    ,'AvaParty': String
    ,'NumberOfPerson':Number
    ,'ListMessage': Array
    ,'NumberMessage':Number

});
module.exports=model('Party',Party);





