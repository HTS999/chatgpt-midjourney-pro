import { Request, Response, NextFunction } from 'express';
import { ChatMessage } from 'gpt-tokenizer/esm/GptEncoding';
import { isNotEmptyString } from 'src/utils/is';
import { rz2mq, slog } from './dutu';
import { fetchSSE } from './sse/fetchsse';


export const getResponseHeader= (isStream:boolean)=>{
    if( isStream){
        return {
			'Content-Type': 'text/event-stream',
			'Connection': 'keep-alive',
			'Cache-Control': 'no-cache'
		};
    }
    return {
			'Content-Type': 'application/json',
			'Connection': 'keep-alive',
			'Cache-Control': 'no-cache'
	};
}

 const API_BASE_URL = isNotEmptyString(process.env.OPENAI_API_BASE_URL)
    ? process.env.OPENAI_API_BASE_URL
    : 'https://api.openai.com'

export const getStreamContent =( data:string)=>{
    let ddata=''
    try{
        let pjson= JSON.parse(data );
        ddata= pjson.choices[0].delta.content as string;
        return ddata;
    }catch(e3){
        return '';
    }
}

export const sseChat= async ( req: Request, response: Response, next: NextFunction )=>{
    let  headers ={
                'Content-Type': 'application/json'
                ,'Authorization': 'Bearer ' +process.env.OPENAI_API_KEY
                ,'Accept': 'text/event-stream '
    }
    let isWriteHeader= false;
    let arrDataString:string[]=[];
    const opt= {
        onMessage:(d:string)=>{
             
            if(!isWriteHeader  ){
                response.writeHead(200, getResponseHeader( true) );
                isWriteHeader= true ;
            }
            response.write( `data: ${d}\n\n` );  
            arrDataString.push( getStreamContent(d)??''); //每个chunk结果 
            
        }
        ,onError:(e:any)=>{

            try{
                if(e.status) {
                    response.writeHead(e.status );
                    if( e.reason) response.end( e.reason);
                    else{
                        let obj={error:{"message":e.statusText,  "type":"openai_hk_error","code":e.status}}
                        response.end(  JSON.stringify(obj)  );
                    }
                    return ;
                    
                }
                else if( e.statusCode ) {
                    response.writeHead(428); 
                    if( e.reason ){
                        response.end( e.reason);
                         slog('error', 'reason' , e.reason )
                    }else {
                        let ss = e.reason??'gate way error...';
                        let obj={error:{"message":ss,  "type":"openai_hk_error","code":'gate_way_error'}}
                        //response.end( `{"error":{"message":"${ss}","type":"openai_hk_error","code":"gate_way_error"}}`   );
                        response.end(  JSON.stringify(obj)  );
                        slog('error', ss ,e )
                    }
                    
                    //publishData( "openapi", 'error',  JSON.stringify({e: {status:428,reason:e}, tomq }));
                    return ;
                } 
            }catch(e2 ){
                slog('error','food-gate-way-error');
                response.end( `{"error":{"message":"gate way error...","type":"openai_hk_error","code":"gate_way_error"}}`   );
                return ;
            }
        }
        ,cnt:0
    };
    
    try {
         await fetchSSE( `${API_BASE_URL}/v1/chat/completions`,{
            method: 'POST',
            headers: headers,
            //signal:opt.signal,
            onMessage: async (data:string)=> { 
                opt.onMessage(data)
            },
            onError(e ){
                //console.log('eee>>', e )
                slog('❌未错误' ,e    )
                opt.onError && opt.onError(e)
            },
            body:JSON.stringify(req.body)
        });
     } catch (error:any ) {
        slog('❌未错误2' ,error ,error.reason, error.statusCode , Object.keys(error)  )
        opt.onError && opt.onError(error)
        return ;
     }

     try{
        const model= req.body.model??'gpt-3.5-turbo';
        const messages = req.body.messages as ChatMessage[];
        const usage= await countUsage(messages, arrDataString, model  );
        rz2mq('chat', {from:'chat',usage,header:req.headers, body:req.body,url:req.originalUrl,completion:arrDataString});
     }catch (error:any ) {
        slog('error','入库出错')
        slog('error','入库', error )

     }
     response.end();

}

const countUsage= async (  messages: ChatMessage[],arrDataString:string[],model:string )=>{
        //req.body.messages
     
     // messages,model.indexOf('gpt-3.5')>-1?'gpt-3.5-turbo':'gpt-4'
     const encodeChat= await encodeChatAsync(  );
     const encode= await encodeAsync();
     let usage= {
            "prompt_tokens": encodeChat(messages,model.indexOf('gpt-3.5')>-1?'gpt-3.5-turbo':'gpt-4'  ).length ,
            "completion_tokens":  encode( arrDataString.join('')).length ,
            "total_tokens": 0
     } ;
     usage.total_tokens= usage.completion_tokens+usage.completion_tokens; 
     slog('log','countUsage',usage )
     return usage;
}


export const encodeAsync = async ( ) => {
  const { encode } = await import('gpt-tokenizer');

  return encode;//(str).length;
};
export const encodeChatAsync = async ( ) => {
  const { encodeChat } = await import('gpt-tokenizer');

  return encodeChat;//(obj,model ).length;
};