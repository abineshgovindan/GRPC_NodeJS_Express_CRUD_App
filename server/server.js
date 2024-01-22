
//importing proto file
const PROTO_PATH = "../db/customers.json";

//importing grpc server
const grpc = require('@grpc/grpc-js');

//importing   proto schema Loader
const protoLoader = require('@grpc/proto-loader');

const customers = require('../constan/customers.json');



const packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
     longs: String,
     defaults: true,
    
    });

const customersProto = grpc.loadPackageDefinition(packageDefinition);



const { v4: uuidv4 } = require('uuid');

//Creating new grpc Server
const server = new grpc.Server();




server.addService(customersProto.CustomerService.service,{
    getAll : (_, callback) =>{
        callback(null, {customers});
    },
    get : (call, callback) =>{
    
        let customer = customers.find((customer)=> customer.id === call.request.id);
       
        if(customer){
            callback(null, customer);
        }else{
            callback({
                code : grpc.status.NOT_FOUND,
                details : "NotFound"
            });
        }

    },
    insert : (call, callback) =>{
        console.log("in" + call.request.name )
        let customer = call.request;
      
        customer.id = uuidv4();
        customers.push(customer);
        console.log(customer)
        callback(null, customer);
    },
    update : (call, callback) =>{
        console.log(call.request.id)
      const editedAddress = {
        no : call.request.address.no,
        street : call.request.address.street,
        city : call.request.address.city,
        pincode : call.request.address.pincode 
    }
    const existingCustomer = {
        name : call.request.name,
        age : call.request.age,
        address : editedAddress,
        customer_type : call.request.customer_type,
        loyalty_points : call.request.loyalty_points,

    };
   
         
      
          customers.map((customer)=> customer.id === call.request.id ? {...customer, ...existingCustomer } :customer )   
           const inserted = customers.filter((customer)=> existingCustomer.id === customer.id)
            if(inserted){
            callback(null, existingCustomer);
        } else {
            callback({
                code : grpc.status.NOT_FOUND,
                details : "NotFound"
            })
        }

    },
    remove : (call, callback) =>{
        let existingCustomerIndex  = customers.filter((customer)=> customer.id === call.request.id);

        if(existingCustomerIndex != -1){
            customers.splice(existingCustomerIndex, 1);
            callback(null, {})
            
        }else {
            callback({
                code : grpc.status.NOT_FOUND,
                details : "NotFound"
            })
        }

    }

});

server.bindAsync("127.0.0.1:30043", grpc.ServerCredentials.createInsecure(),
()=> {
console.log("Server running at http://127.0.0.1:30043");

server.start();

});


