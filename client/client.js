//importing proto file
const PROTO_PATH = __dirname + '/../proto_schema/customers.proto';


//importing grpc server
const grpc = require('@grpc/grpc-js');

//importing   proto schema Loader
const protoLoader = require('@grpc/proto-loader');

//Defining the package
//Refer the link to see the available options 
//https://www.npmjs.com/package/@grpc/proto-loader

const packageDefinition = protoLoader.loadSync(PROTO_PATH,
    { keepCase: true,
    longs: String,
    arrays: true,
    enums: String,
  defaults: true,

    })

const CustomerService = grpc.loadPackageDefinition(packageDefinition);

const client = new CustomerService.CustomerService(
    "127.0.0.1:30043", 
    grpc.credentials.createInsecure()
);

module.exports = client;
