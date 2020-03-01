import axios from 'axios'
import Qs from 'qs'
export function ajax(url,data={},type='GET'){
        return new Promise(function(resolve,rejects){
            const baseurl='http://localhost:3000'
            let promise
            url=baseurl+url
            let str = '?'
            if(!Object.keys(data).length)
            str=''
            if(type=='GET'){//get delete post patch
                  Object.keys(data).forEach(each=>str+=each+'='+data[each]+'&')
               //    url+= Qs.stringify(data)
                   url+=str.slice(0,-1)
                 promise = axios.get(url)       
            }
            else {
                 promise = axios({
                    url: url,
                    method: 'post',
                    transformRequest: [(data) => Qs.stringify(data)],
                    data: data,
                })
            }
            promise.then(function(response){
                 resolve(response.data)
            }).catch(function(error){
                 reject(error)
            })
        })
}
export const uploadFileRequest = (url, params) => {
     const base='http://localhost:3000'
     return axios({
       method: 'post',
       url: `${base}${url}`,
       data: params,
       headers: {
         'Content-Type': 'multipart/form-data'
       }
     });
   }