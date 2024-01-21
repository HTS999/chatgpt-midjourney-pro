import mp3Duration from 'mp3-duration'

export const mp3time= (buffer:any )=>{
    return new Promise<{duration:number}>((resolve, reject) => {
         mp3Duration(buffer , (err, duration) => {
        if (err) {
            //return res.status(500).send('无法获取时长');
            reject({error:'无法获取时长'});
        }
        resolve({duration});


      //res.send(`MP3文件时长为 ${duration} 秒`);
        });
    })
   
}