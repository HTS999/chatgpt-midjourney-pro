import { Request, Response, NextFunction } from 'express';
import { isNotEmptyString } from 'src/utils/is';
import {generateRandomCode} from "./func"

const DATA_BASE_URL=    isNotEmptyString(process.env.DATA_URL)
    ? process.env.DATA_URL
    : 'https://www.aidutu.cn'
export interface dutuType{
    error:number //返回错误编号0 表示正确 317登录
    error_des:string //错误描述
    data:any //数据
}
export const dutuData=( opt:{ data?:any,error?:number,error_des?:string} ) :dutuType=>{
    return{
        error:opt.error??0,
        error_des:opt.error_des??'',
        data:opt.data??{}
    }
}

export const slog = ( ...arg) => {
     
   // console.log(`%c[mjgpt]`,  style, msg , ...args)
   if(['error','log'].indexOf( arg[0]  )>-1 ){ //必须显示的
   }else  if(! isNotEmptyString(process.env.M_DEBUG) ) return ;
  
  const currentDate = new Date();
  const hours = currentDate.getHours().toString().padStart(2, '0');
  const minutes = currentDate.getMinutes().toString().padStart(2, '0');
  const seconds = currentDate.getSeconds().toString().padStart(2, '0');
  const currentTime = `${hours}:${minutes}:${seconds}`;
  console.log( currentTime,...arg)
}
export const checkToken= async ( token:string ):Promise < boolean|dutuType> =>{
    
    slog('token',token )
    if(token=='1-1-1' || !token) return dutuData({error:317,error_des:'please login'})
    const data= (await myFetch('/hetao/express/checkToken',undefined,{header:{'x-token': token }}) ) as dutuType;
    if(data.error>0) return data;
    const acc= data.data.account
     slog('log','token',acc.user_id,acc.fen, acc.use_fen )
    return true;

}

export const myFetch=(url:string,data?:any,opt?:any)=>{
    url = DATA_BASE_URL+ url   //`${DATA_BASE_URL}${url}`
    slog('myFetch', url  );
    let header = {'Content-Type':'application/json'};
    //header= {...header  }
    if(opt?.header)header= {...header,...opt.header  }

    return new Promise<any>((resolve, reject) => {
        let opt:RequestInit ={method:'GET'}; 
        opt.headers=header;
        if(data) {
            opt.body= JSON.stringify(data) ;
             opt.method='POST';
        }
        fetch( url ,  opt )
        .then(d=>d.json().then(d=> resolve(d))
        .catch(e=>reject(e)))
        .catch(e=>reject(e))
    })
     
}

//前置出来token
export const preTokenProcessMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    //slog('header', req.headers )
    const isCheck= await checkToken( req.headers['x-token'] as string)
    // 在这里进行合规性检查或其他前置处理操作
    if ( isCheck===true ) {
        next(); // 继续到下一个中间件或代理
    } else {
        const data= isCheck as dutuType;
        if(data.error==4089)
            res.status(434).json( isCheck );  //需要充值
        else if(data.error==317)
         res.status(431).json( isCheck );  //需要登录
        else res.status(433).json( isCheck );
    }
};

//结果入口
export const rz2mq= (key:string, data:any )=>{
    //slog('rz2mq', key, data);
    data.rqid= generateRandomCode(16);
    myFetch('/hetao/token/rz2mq/'+key,data );
}