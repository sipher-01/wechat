const moment = require ('moment')


function format(user,text){
    return {
        user,
        text,
        time:moment().format('h:mm a')
    };
}


module.exports = format;