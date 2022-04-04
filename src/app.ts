import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import DataBaseConnection from "./dataBaseConnection";
import SocketMain from "./SocketConnection";
import cajeros from "./routes/cajeros";
import productos from "./routes/productos";
import delivery from "./routes/delivery";
import categorias from "./routes/categorias";
import ventas from "./routes/ventas";
import resturants from "./routes/restaurant";
import preventas from "./routes/preventa";
import finalUserRouter from "./routes/finalusers";
import { Response, Request } from "express";
import productosTestRouter from './routes/productosTest';
import orderRouter from './routes/orders';
import modifierRouter from './routes/modifiergroups'

class Server {
  public app: express.Application;
  constructor() {
    this.app = express();
    this.config();
    this.routes();
    this.cookies();
  }
  private cookies(){
    this.app.post('/cookies',(req:Request,res:Response)=>{
      const tokenRecivido = req.body;
      console.log('token recivido es');
      console.log(tokenRecivido);
    })
  }
  private config() {
    //dataBaseConnection
    new DataBaseConnection();
    //settings
    this.app.set("port", process.env.PORT || 5000);
    //middlewares
    this.app.use(helmet());
    this.app.use(morgan('combined'));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    //first score
    this.app.use(cors());
  }
  private routes() {    
    this.app.use("/cajeros", cajeros);
    this.app.use("/products", productos);
    this.app.use("/deliver",delivery);
    this.app.use("/categorias",categorias);
    this.app.use("/preventas",preventas);
    this.app.use("/ventas",ventas);
    this.app.use('/restaurants',resturants);
    this.app.use("/productosTest",productosTestRouter);
    this.app.use("/orders",orderRouter);
    this.app.use("/finalUsers",finalUserRouter);
    // this.app.use("/modifier",modifierRouter);
    
    /*     this.app.use('/deliver', deliver);
        this.app.use('/products', products);
        this.app.use('/ventas', ventas);
        this.app.use('/deleteReports', deleteReports);
        this.app.use('/preventas', preventa);
        this.app.use('/categorias', categorias);  */
  }
  public start() {
    return this.app.listen(this.app.get("port"), () => {
      console.log("Server on port", this.app.get("port"));      
    });
  }
  public get appExpress(){
    return this.app;
  }
}
const server: Server = new Server();
export const app  = server.start();
new SocketMain(app);
// export const app = server.appExpress;




/**
 * Webpack HMR Activation test test change
 */
type ModuleId = string | number;

interface WebpackHotModule {
  hot?: {
    data: any;
    accept(
      dependencies: string[],
      callback?: (updatedDependencies: ModuleId[]) => void,
    ): void;
    accept(dependency: string, callback?: () => void): void;
    accept(errHandler?: (err: Error) => void): void;
    dispose(callback: (data: any) => void): void;
  };
}

// declare const module:WebpackHotModule;

// if (module.hot) {
//   module.hot.accept();
//   module.hot.dispose(() => listening.close());
// }