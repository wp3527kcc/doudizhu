import {ajax} from '../../static/util/ajax.js'
import {Toast} from 'mint-ui'
         import {
          SETMESSAGE,
          SETROOMMSG,
          RENEWMSG,
          RENEWCHAT
          }from './mutations_type.js'
export default {
  login: async({commit},{nick,password,router}) => {
			const {status,message,roommsg} = await ajax('/login',{nick,password},'post')
			if(status == 2 || status == 3){
				router.push('/selectRoom')
				Toast('login success')
        commit(SETMESSAGE,{roommsg,nick})
      }else
        Toast(message)
  },
  comeRoom: async({commit},{id}) => {
    commit(SETROOMMSG,{id})
  },
  createRoom:({commit},{roommsg,id}) => {
    commit(RENEWMSG,{roommsg,id})
  },
  renewpoker:({commit},{roommsg}) => {
    commit(RENEWMSG,{roommsg})
  },
  appendchat:({commit},{nick,content}) => {
    commit(RENEWCHAT,{nick,content})
  }
}