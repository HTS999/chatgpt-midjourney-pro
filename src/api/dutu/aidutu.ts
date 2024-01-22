import { homeStore } from "@/store";
import { ls } from "@/utils/storage"
import { mlog } from "../mjapi";
import { useMessage } from "naive-ui";
const LC_NAME='gpt-mid-token'
const ms= useMessage();
export const getLocalToken= ()=>{
    const token = ls.get(LC_NAME);
    return token??'1-1-1';
}
export const saveLocalToken= (token:string)=>{
    ls.set(LC_NAME, token);
}

const getUrl=(url:string)=>{
    if(url.indexOf('http')==0) return url; 
    return `/vapi${url}`;
}

 
export const dtFetch=(url:string,data?:any, method?:string)=>{
    mlog('dtFetch', url  );
    let header = {'Content-Type':'application/json', 'x-token': getLocalToken() };  //, 'x-token': getLocalToken()
    return new Promise<any>((resolve, reject) => {
        let opt:RequestInit ={method:'GET'}; 
        opt.headers=header;
        if(data) {
            opt.body= JSON.stringify(data) ;
             opt.method='POST';
        }
        if(method)  opt.method= method; 

        fetch(getUrl(url),  opt )
        .then(d=>d.json().then(d=> resolve(d))
        .catch(e=>reject(e)))
        .catch(e=>reject(e))
    })
     
}

export function ajax({ url="",method='GET',data=undefined}): Promise<any> {
    return new Promise<any>((resolve, reject) => {
        dtFetch(url, data, method ).then((d:any)=>{
            if(d.error>0) {
                mlog('error',d.error_des );
                //ms.info(d.error_des );
                reject(d);
                return ;
            }
            resolve(d);
        }).catch(e=>reject(e))
    }) 
}

export const getTokenFormServer= async ()=>{
   const d= await  ajax({url:'/hetao/token'});
   mlog('hetao', d.data.user.token );
   if( d.error==0 ){ 
        saveLocalToken(d.data.user.token) //data.user.token
        homeStore.setMyData({isLogin:true, token: d.data.user.token})
   }
}

export const logout= async()=>{
     const d= await  ajax({url:'/hetao/token/logout'});
     if( d.error==0 ){ 
         const token= '1-1-1'
         saveLocalToken(token);
         homeStore.setMyData({isLogin:false, token,act:'' })
     }
}