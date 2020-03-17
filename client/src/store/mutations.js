import {
  SETMESSAGE,
  SETROOMMSG,
  RENEWMSG,
  RENEWCHAT,
  OVERMSG
}from './mutations_type.js'
export default {
  [SETMESSAGE]:(state,{roommsg,nick}) => {
    state.RoomMsg = roommsg
    state.current_nick = nick
  },
  [SETROOMMSG]:(state,{id}) => {
    state.current_roomid = id
  },
  [RENEWMSG]:(state,{roommsg,id}) => {
    roommsg && (state.RoomMsg = roommsg)
    id && (state.current_roomid = id)

  },
  [RENEWCHAT]:(state,{nick,content}) => {
    state.Chat_Record.push({content,nick})
    state.Chat_Record.forEach((each,i) => {
      const index = state.Chat_Record.length - i
      each.bottom = index * 35 + 10 + 'px'
    })
  },
  [OVERMSG]: (state,{result}) => {
    state.over_msg = result
  }
  // [GET_CONTENT]:(state,result)=>{
  //   state.contentlist = result.content
  //   state.maxpage=Math.floor(result.maxpage[0].count/10)
  //   if(result.usermsg)
  //     state.loginusermsg=result.usermsg[0]
  //   state.contentlist.forEach(element => 
  //     {
  //       element.comment = result.comment.filter(each => (each.id === element.id)) ;
  //       element.islike = result.likeset.filter(e => e.id === element.id).length ;
  //     })
  // },

  }