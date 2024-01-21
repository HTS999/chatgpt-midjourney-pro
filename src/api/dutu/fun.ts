
declare global {
    interface Date {
      format(formatString: string): string;
    }
}

/**
 * 
 * @param format yyyy-MM-dd hh:mm:ss
 * @param date 
 * @returns 
 */
export const dateFormatDone= (format:string,date:Date)=>{
 
        Date.prototype.format = function(format) {
            const o = {
                "M+" :this.getMonth() + 1, // month
                "d+" :this.getDate(), // day
                "h+" :this.getHours(), // hour
                "m+" :this.getMinutes(), // minute
                "s+" :this.getSeconds(), // second
                "q+" :Math.floor((this.getMonth() + 3) / 3), // quarter
                "S" :this.getMilliseconds()
                // millisecond
            }
            if (/(y+)/.test(format)) {
                format = format.replace(RegExp.$1, (this.getFullYear() + "")
                    .substr(4 - RegExp.$1.length));
            }
            for ( var k in o) {
                if (new RegExp("(" + k + ")").test(format)) {
                    format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k]
                        : ("00" + o[k]).substr(("" + o[k]).length));
                }
            }
            return format;
        }

        return date.format(format);
}
/**
 * 
 * @param format  yyyy-MM-dd hh:mm:ss
 * @param time 
 * @returns 
 */
export const timeFormat= (time=0, format='yyyy-MM-dd hh:mm:ss' )=>{
        let d= time? new Date(time*1000): new Date();
        return dateFormatDone( format,d); 
}