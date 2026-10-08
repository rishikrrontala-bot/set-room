import { createClient, type Client, type InValue } from '@libsql/client';
let client:Client|undefined;
export function getClient():Client {
 if(client)return client;
 const url=process.env.TURSO_DATABASE_URL;
 if(!url)throw new Error('The room database is not configured.');
 if(process.env.VERCEL&&url.startsWith('file:'))throw new Error('Vercel requires a durable remote database.');
 client=createClient({url,authToken:process.env.TURSO_AUTH_TOKEN,intMode:'number'});
 return client;
}
class Statement {
 constructor(private sql:string,private args:InValue[]=[]){}
 bind(...args:InValue[]){return new Statement(this.sql,args);}
 async first<T=Record<string,unknown>>():Promise<T|null>{const data=await getClient().execute({sql:this.sql,args:this.args});return data.rows[0] as unknown as T||null;}
 async all<T=Record<string,unknown>>():Promise<{results:T[]}>{const data=await getClient().execute({sql:this.sql,args:this.args});return {results:data.rows as unknown as T[]};}
 async run(){const data=await getClient().execute({sql:this.sql,args:this.args});return {meta:{changes:data.rowsAffected}};}
}
export function database(){return {prepare:(sql:string)=>new Statement(sql)};}
