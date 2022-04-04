import { Request, Response } from 'express';
import Orders from '../models/Orders';


export class OrdersController {

    async addOrder(req:Request,res:Response){
        // to do
        console.log('Header Authorization on add order');
        console.log(req.headers.authorization);
        try {
            console.log(req.query);
            const {amount,dateTime,products,imgUrl} = req.body;   
          
            const newOrder = new Orders({amount,dateTime,products,imgUrl});
            if (await newOrder.save()){
                return res.status(200).json({msg:'order has been created succesfully',order:newOrder});
            }
            
        } catch (error) {
            console.log('error en la base de datos');
            console.error(error);
            res.status(500).json({msg:'error in the server sorry', error:error});            
        }
    }


    async viewOrder(req:Request,res:Response){
        // to do
        try {
            const allOrders = await Orders.find({});
            if (allOrders){
                return res.status(200).json({
                    msg:"Orders loaded succesfully :)",
                    order:allOrders});
            }
            
            
        } catch (error) {
            console.log('error en la base de datos');
            console.error(error);
            res.status(500).json({msg:'error del servidor', error:error});   
            
        }
    }
    async viewOrderById(req:Request,res:Response){
        // to do
        try {
            const order = await Orders.findById(req.params.id);
            if (order){
                return res.status(200).json({msg:"order found succesfully",order});

            } else {
                return res.status(404).json({msg:"order not found in db"});
            }
            
        } catch (error) {
            console.log('error en la base de datos');
            console.error(error);
            res.status(500).json({msg:'sorry server error :(', error:error});   
            
        }
    }


    async updateOrder(req:Request,res:Response){
        // to do
        try {
            const {price,description,title,imageUrl,isFavorite} = req.body;

          

            
        } catch (error) {
            console.log('error en la base de datos');
            console.error(error);
            res.status(500).json({msg:'sorry server error :(', error:error});   
        }
    }


    async deleteOrder(req:Request,res:Response){
        // to do
        try {
            const order = await Orders.findByIdAndRemove(req.params.id);
            if (order){
                return res.status(200).json({msg:"order deleted succesfully"});

            }
        } catch (error) {
            console.log('error en la base de datos');
            console.error(error);
            res.status(500).json({msg:'sorry server error :(', error:error});      
            
        }
    }



}

