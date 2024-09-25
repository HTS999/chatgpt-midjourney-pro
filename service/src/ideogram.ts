import  proxy from "express-http-proxy"
import { isNotEmptyString } from "./utils/is";
import { generateRandomCode, rz2mq, slog } from "./dutu";
import axios from 'axios'; 
import FormData  from 'form-data'
import { Request, Response, NextFunction } from 'express';

 const API_BASE_URL = isNotEmptyString(process.env.OPENAI_API_BASE_URL)
    ? process.env.OPENAI_API_BASE_URL
    : 'https://api.openai.com'

export const getBaseUrl= ()=>{
    return API_BASE_URL
}

const sunoEndResDecorator= (  proxyRes:any, proxyResData:any, req:any , userRes:any )=>{
    const dd={ from:'ideo',etime: Date.now() ,url: req.originalUrl,header:req.headers, body:req.body ,data:proxyResData.toString('utf8') };
    //http2mq( 'suno',dd )
    rz2mq('ideo', dd);
    return proxyResData; //.toString('utf8') 
}
const EndResDecorator=(  proxyRes:any, proxyResData:any, req:any , userRes:any , key:string)=>{
    const dd={ from: key,etime: Date.now() ,url: req.originalUrl,header:req.headers, body:req.body ,data:proxyResData.toString('utf8') };
    //http2mq( 'suno',dd )
    rz2mq(key, dd);
    return proxyResData; //.toString('utf8') 
}

export const ideogramProxy = proxy( getBaseUrl(), {
  https: false, limit: '10mb',
  proxyReqPathResolver: function (req) {
    return req.originalUrl.replace('/sunoapi', '') // 将URL中的 `/openapi` 替换为空字符串
  },
  proxyReqOptDecorator: function (proxyReqOpts, srcReq) {
    //slog("rq: ",API_BASE_URL )
    proxyReqOpts.headers['Authorization'] ='Bearer '+ process.env.OPENAI_API_KEY;
    proxyReqOpts.headers['Content-Type'] = 'application/json';
    return proxyReqOpts;
  }, 
  userResDecorator:sunoEndResDecorator// endResDecorator
  
});


export const lumaProxy = proxy( getBaseUrl(), {
  https: false, limit: '10mb',
  proxyReqPathResolver: function (req) {
    //slog("log", req.originalUrl , getBaseUrl())
    return req.originalUrl.replace('/luma', '/pro/luma') // 将URL中的 `/luma` => /luma/pro 替换为空字符串
  },
  proxyReqOptDecorator: function (proxyReqOpts, srcReq) {
    
    proxyReqOpts.headers['Authorization'] ='Bearer '+ process.env.OPENAI_API_KEY;
    proxyReqOpts.headers['Content-Type'] = 'application/json';
    return proxyReqOpts;
  }, 
  userResDecorator:(  proxyRes:any, proxyResData:any, req:any , userRes:any )=> EndResDecorator( proxyRes,proxyResData,req, userRes,'luma' )
  
  
});

export const runwayProxy = proxy( getBaseUrl(), {
  https: false, limit: '10mb',
  proxyReqPathResolver: function (req) {
    return req.originalUrl.replace('/sunoapi', '') // 将URL中的 `/luma` => /luma/pro 替换为空字符串
  },
  proxyReqOptDecorator: function (proxyReqOpts, srcReq) {
    
    proxyReqOpts.headers['Authorization'] ='Bearer '+ process.env.OPENAI_API_KEY;
    proxyReqOpts.headers['Content-Type'] = 'application/json';
    return proxyReqOpts;
  }, 
  userResDecorator:(  proxyRes:any, proxyResData:any, req:any , userRes:any )=> EndResDecorator( proxyRes,proxyResData,req, userRes,'runway' )
  
});

export const klingProxy = proxy( getBaseUrl(), {
  https: false, limit: '10mb',
  proxyReqPathResolver: function (req) {
    return req.originalUrl.replace('/sunoapi', '') // 将URL中的 `/luma` => /luma/pro 替换为空字符串
  },
  proxyReqOptDecorator: function (proxyReqOpts, srcReq) {
    
    proxyReqOpts.headers['Authorization'] ='Bearer '+ process.env.OPENAI_API_KEY;
    proxyReqOpts.headers['Content-Type'] = 'application/json';
    return proxyReqOpts;
  }, 
  userResDecorator:(  proxyRes:any, proxyResData:any, req:any , userRes:any )=> EndResDecorator( proxyRes,proxyResData,req, userRes,'kling' )
  
});






// //req, res, next
// export const ideoProxyFileDo=async( req:Request, res:Response, next?:NextFunction)=>{ 
//     console.log('req.originalUrl', req.originalUrl );
     
//     if(req.file.buffer) {
//       const fileBuffer = req.file.buffer;
//       const formData = new FormData();
//       formData.append('image_file',  fileBuffer,  { filename:  req.file.originalname }  );
//       formData.append('image_request',  req.body.image_request );
//      try{
//        let url = `${API_BASE_URL}${req.originalUrl}` ;
//       let responseBody = await axios.post( url , formData, {
//               headers: {
//               Authorization: 'Bearer '+ ( process.env.OPENAI_API_KEY) ,
//               'Content-Type': 'multipart/form-data',
//               //'Mj-Version': pkg.version
//             }
//         })   ; 
//        res.json(responseBody.data );
//       }catch(e){ 
//         res.status( 400 ).json( {error: e } );
//       }

//     }else{
//       res.status(400).json({'error':'uploader fail'});
//     }
    
// }


export const ideoProxyFileDo=   async( req:Request, res:Response, next?:NextFunction)=>{ 
    //console.log('req.originalUrl', req.originalUrl );
    const clientId =  generateRandomCode(16);
    const dd={ from:'ideo',etime: Date.now() ,url: req.originalUrl,header:req.headers,clientId, body:req.body ,data:{} };
    
   
    //mlog("log image_request",req.body.image_request )
    if(req.file.buffer) {
      const fileBuffer = req.file.buffer;
      const formData = new FormData();
      formData.append('image_file',  fileBuffer,  { filename:  req.file.originalname }  );
      if ( req.body.image_request){
        formData.append("image_request", req.body.image_request)
      }

   
     try{
        let url = `${API_BASE_URL}${ req.originalUrl.replace('/pro', '') }` ;
        let responseBody = await axios.post( url , formData, {
            headers: {
                Authorization: 'Bearer '+ process.env.OPENAI_API_KEY ,
                'Content-Type': 'multipart/form-data',
                }
            })   ; 
            slog("error",  responseBody.status )
            res.json(responseBody.data );
        try{
            dd.data= responseBody.data
            rz2mq( 'ideo',dd )
        }catch(e){
            slog("error", "ideo2 file error!")
        }
      }catch(e:any){ 
        try{   
            res.status( e.response.status ).json(  e.response.data )  
        }catch(e2){
            res.status( 400 ).json( {error: "ideo file error!" } );
        }
      }

    }else{
      res.status(400).json({'error':'uploader fail'});
    }
    
}
