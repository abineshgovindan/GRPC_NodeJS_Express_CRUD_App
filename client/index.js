const client = require("./client");


const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const allowedCustomerTypeValues = ['PREMIUM', 'REGULAR'];

app.get('/', (req, res) => {
    client.getAll(null, (err, data) => {
        res.status(200).json(data);

    })
})

app.post('/save', (req, res) => {
    const c_type = req.body.customer_type;
    if(!allowedCustomerTypeValues.includes(c_type)){
        return res.status(400).json({ error: 'Invalid  Customer_Type!' });
    }
    const newAddress = {
        no : req.body.address.no,
        street : req.body.address.street,
        city : req.body.address.city,
        pincode : req.body.address.pincode 
    }
    const newCustomer = {
        name : req.body.name,
        age : req.body.age,
        address : newAddress,
        customer_type : c_type,
        loyalty_points : req.body.loyalty_points,

    };
    client.insert(newCustomer, (err, data) => {
        if(err) return res.status(404).json(err);
        res.status(201).json("Customer created successfully")

    })

})

app.post('/update', (req, res) => {
    
      const c_type = req.body.customer_type;
    if(!allowedCustomerTypeValues.includes(c_type)){
        return res.status(400).json({ error: 'Invalid  Customer_Type!' });
    }
    
      const editedAddress = {
        no : req.body.address.no,
        street : req.body.address.street,
        city : req.body.address.city,
        pincode : req.body.address.pincode 
    }
    const existingCustomer = {
        name : req.body.name,
        age : req.body.age,
        address : editedAddress,
        customer_type : c_type,
        loyalty_points : req.body.loyalty_points,

    };
   
    client.update(existingCustomer, (err, data) => {
        if(err) return res.status(404).json(err);
        res.status(201).json(data)

    })

});

app.get('/:id', (req, res) => {
    const id = req.params.id;
    console.log(id)


    client.get({id} ,(err, data) => {
        if(err) return res.status(404).json(err);
        res.status(200).json(data)
    })
})

app.delete('/:id', (req, res) => {
    const id = req.params.id;
    client.remove({id} ,(err, data) => {
         if(err) return res.status(404).json(err);
        res.status(200).json("Customer deleted successfully")
        
    })
})

app.listen(port, ()=>{
console.log(`Server is running on http://localhost:${port}`);
});