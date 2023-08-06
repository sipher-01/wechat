const users = [];

// for joining
function userJoin(id, username, room) {
  const user = { id, username, room };
  users.push(user);

  return user;
}//joining a room
function userLeave(id){
    const index = users.findIndex(user=>user.id===id)
    if(index!==-1){
      return users.splice(index,1)[0]
    }
}

function getRoomUser(room)
{
    return users.filter(user=>user.room===room)
}

//data for curret user
function getCurrentUser(id) {
  return users.find((user) => user.id === id);
}

module.exports = { userJoin, getCurrentUser, userLeave, getRoomUser };
