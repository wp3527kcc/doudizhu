import {mapActions,mapMutations,mapState} from 'vuex'
import {Toast} from 'mint-ui'
import store from '../../src/store'
import VueSocketIO from 'vue-socket.io'
const vuesocket = new VueSocketIO({debug: false,connection: 'http://localhost:3000',vuex: {store}})
export const io = vuesocket
export const sockets = {
        connect:()=>{
          console.log('connect')
        },
        system:(data) => {
          console.log(data)
        },
        receiver:({message,type,status,id,roommsg}) => {
          if(status){
            switch(type){
              case 1:store.dispatch('comeRoom',({id}));break;//join
              case 2:store.dispatch('createRoom',{id,roommsg});break;//create
            }
          }else{
            Toast(message)
          }
        },
        renew:({roommsg}) => {
          store.dispatch('renewpoker',{roommsg})
        },
        chat:({content,nick}) => {
          store.dispatch('appendchat',{content,nick})
        },
        gameover:({result}) => {
          store.dispatch('setovermsg',{result})
        }
      }