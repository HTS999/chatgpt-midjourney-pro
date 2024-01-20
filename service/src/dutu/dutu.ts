import { Request, Response, NextFunction } from 'express';
import { isNotEmptyString } from 'src/utils/is';


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
export const checkToken=( token:string ):boolean|dutuType =>{
    
    slog('log','token',token )
    if(token=='1-1-1' || !token) return dutuData({error:317,error_des:'please login'})
    return true;

}

//前置出来token
export const preTokenProcessMiddleware = (req: Request, res: Response, next: NextFunction) => {
    //slog('header', req.headers )
    const isCheck= checkToken( req.headers['x-token'] as string)
    // 在这里进行合规性检查或其他前置处理操作
    if ( isCheck===true ) {
        next(); // 继续到下一个中间件或代理
    } else {
        res.status(431).json( isCheck );  //需要登录
    }
};

//结果入口
export const rz2mq= (key:string, data:any )=>{
    slog('rz2mq', key, data);
}