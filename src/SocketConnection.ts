import {Server} from 'socket.io';

export default class SocketMain{
    constructor(argumentoListen){
        const io = new Server(argumentoListen);
        // io.set('origins', '*:*');
        const documents = {};

        io.on('connection', (socket) => {
          let previousIdR;
          socket.emit("connectionSuccesfully",{msg:'hola'});       
          const safeJoinRoom = (roomId) => {
            socket.leave(previousIdR);
            /* Join a room all socket.emit functions will only in the room*/
            /* that's where socket.emit comes into play */
            socket.join(roomId);
            previousIdR = roomId;
          };

          socket.on('send_order',(data)=>{
            console.log('orden recivida desde el aplicativo movil');
            console.log(JSON.parse(data));
            io.sockets.emit("get_order",data);
          });

          socket.on('NewSaleRoom', ({item,userId})=>{
            // room id is the same as user id
            safeJoinRoom(userId);
            console.log("socket new sale room");
            console.log(item);
            // io.sockets.emit('nuevaVenta',item);
            io.to(userId).emit('nuevaVenta',item);
                                     
          });

          socket.on("joinAroom",(userId)=>{
            safeJoinRoom(userId);
          })

          socket.on("deleteSaleFromResumen",(item) =>{
            console.log("deleteSaleFromResumen");
            io.sockets.emit('deletedSale', item);
        });          
          socket.on('clearTheScreen', (something)=>{
            console.log(something);
            socket.emit('clearTheScreenNow', something);
          });
          
          socket.on('NewSale', (item)=>{
            console.log(' Socket on evento disparado');
            console.log(item);
            io.sockets.emit('nuevaVenta', item);
            });
      
          socket.on('DeleteSale', (item)=>{
            console.log('borra venta evento');
            socket.emit('deletedSale', item);
          });
      
          socket.on('openCASH', (item)=>{
            console.log('cliente disparon un evento socket on item igual a '+item);
            socket.emit('clientEvent', item);
          });
      
      
          /* TODO ESTE BLOQUE ES DEL EJEMPLO DE SOCKET CON DOCUMENTOS */
          /* TODO ESTE BLOQUE ES DEL EJEMPLO DE SOCKET CON DOCUMENTOS */
          /* TODO ESTE BLOQUE ES DEL EJEMPLO DE SOCKET CON DOCUMENTOS */
          /* TODO ESTE BLOQUE ES DEL EJEMPLO DE SOCKET CON DOCUMENTOS */
          /* TODO ESTE BLOQUE ES DEL EJEMPLO DE SOCKET CON DOCUMENTOS */
          let previousId;
          const safeJoin = (currentId) => {
            socket.leave(previousId);
            /* Join a room all socket.emit functions will only in the room*/
            /* that's where socket.emit comes into play */
            socket.join(currentId);
            previousId = currentId;
          };
          /* join a room with that doc id and emit the stored document */
          socket.on('getDoc', (docId) => {
            /* Join a room */
            safeJoin(docId);
            /* Emit the stored document back to the initiatins client only */
            socket.emit('document', documents[docId]);
          });
          /* they payload is 
          a document object of an id generetad by the client */
          socket.on('addDoc', (doc) => {
            documents[doc.id] = doc;
            safeJoin(doc.id);
            io.emit('documents', Object.keys(documents));
            socket.emit('document', doc);
          });
          /*  the payload will be the whole document at its state after any keystroke.
                   We’ll replace the existing document in the database, and then broadcast
                   the new document to only the clients that are currently viewing that
                   document */
          socket.on('editDoc', (doc) =>{
            documents[doc.id] = doc;
            socket.to(doc.id).emit('document', doc);
          });
          io.emit('documents', Object.keys(documents));
        });
    }
}

