import mongoose from 'mongoose'

type ConnectionObject ={
    isConnected?:number,
}

const connection: ConnectionObject = {}

async function dbConnect():Promise<void>{
    
    if(connection.isConnected){
        
        console.log('database is already connected');
        return;
    }

    try{
        const db =await mongoose.connect(process.env.MONGO_DB_URI ||'', {}) // {} other opetions
        connection.isConnected =  db.connections[0].readyState
        console.log('database connected succesfully')

    }catch(e){
        console.log('database connected failed')
        console.log(e);
    }

}

export default dbConnect;