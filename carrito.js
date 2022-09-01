const express = require('express');
const { Router } = express;

const app = express();
const router = Router();
const PORT = process.env.PORT || 8080; 

const server = app.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${server.address().port}`);
}); 

server.on('error', (error) => console.log(`Error en servidor ${error}`));

app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use('/public', express.static(__dirname + '/public'));

app.use('/api/carrito', router);

let productsCart = []; 


class Products {
    constructor(products) {
        this.products = [...products]
    }
    getAll(){
        return this.productsCart;
    }
    findOne(id){
        return this.products.find((item) => item.id == id); 
    }
    addOne(product) {
        const lastItem = this.products[this.products.length -1];
        let lastId = 1; 
        if(lastItem){
            lastId = lastItem.id + 1;
        }
        product.id = lastId;
        this.products.push(product);
        return this.products[this.products.length -1];
    }
    deleteOne(id) {
        const foundProduct = this.findOne(id);
        if (foundProduct) {
            this.products = this.products.filter((item) => item.id != id);
            return id;
        }
        return undefined;
    }

}


router.delete('/:id', (req, res) => {
    let { id } = req.params;
    const products = new Products(productsCart);
    const date = new Date().tolocaleString();
    id = parseInt(id);
    const deletedProduct = products.deleteOne(id);
    console.log(products.getAll());
    if(deletedProduct){
        res.json({ success: 'ok', id})
    }else {
        res.json({ error: 'producto no encontrado' });
    }
});



router.post('/', (req, res) => {
    const { body } = req; 
    const date = new Date().tolocaleString();
    console.log(body);
    body.price = parseFloat(body.price); 
    const products = new Products(productsCart);
    const productoGenerado = products.addOne(body);
    res.json({ success: 'ok', new: productoGenerado });
}); 


router.get('/:id', (req, res) => {
    let { id } = req.params; 
    console.log('id', id);
    const products = new Products(productsCart);
    const date = new Date().tolocaleString();
    id = parseInt(id);

    const found = products.findOne(id);
    if (found) {
        res.json(found);
    } else {
        res.json({error: 'producto no encontrado'})
    }
}); 

router.get('/', (req, res) => {
    const products = new Products(productsCart);
    const date = new Date().tolocaleString();
    res.json(products.getAll());
});