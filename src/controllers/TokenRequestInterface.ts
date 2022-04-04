export interface TokenRequest {  
    user?:{
      admin?:boolean;
      id?:string;
      name?:string;
      superuser?:boolean;
    }
  }