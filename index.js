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

app.use('/api/products', router);

let productsHC = [
  { id: 1, title: 'Cristal', price: 350, thumbnail: 'http://localhost:8080/public/1.jpg' },
  { id: 2, title: 'Flor', price: 550, thumbnail: 'http://localhost:8080/public/2.jpg' },
  { id: 3, title: 'Corazón', price: 450, thumbnail: 'http://localhost:8080/public/3.jpg' },
  { id: 4, title: 'Aros', price: 700, thumbnail: 'http://localhost:8080/public/4.jpg' },
  { id: 5, title: 'Copo', price: 350, thumbnail: 'http://localhost:8080/public/5.jpg' }
]; 


class Products {
    constructor(products) {
        this.products = [...products]
    }
    getAll(){
        return this.products;
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
    updateOne(id, product){
        const productToInsert = { ...product, id};
        for (let i = 0; i < this.products.length; i++) {
            if(this.products[i].id == id) {
                this.products[i] = productToInsert;
                return productToInsert;
            }
        }
        return undefined;
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


router.get('/form', (req, res) => {
    res.sendFile(__dirname + '/index.html'); 
}); 

router.delete('/:id', (req, res) => {
    let { id } = req.params;
    const products = new Products(productsHC);
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

router.put('/id', (req, res) => {
    let { id } = req.params;
    const { body } = req;
    const date = new Date().tolocaleString();
    id = parseInt(id);

    const products = new Products(productsHC);

    const changedProduct = products.updateOne(id, body); 

    if (changedProduct) {
        res.json({ success: 'ok', new: changedProduct });
    } else {
        res.json({ error: 'producto no encontrado' });
    }
}); 



router.post('/', (req, res) => {
    const { body } = req; 
    const date = new Date().tolocaleString();
    console.log(body);
    body.price = parseFloat(body.price); 
    const products = new Products(productsHC);
    const productoGenerado = products.addOne(body);
    res.json({ success: 'ok', new: productoGenerado });
}); 


router.get('/:id', (req, res) => {
    let { id } = req.params; 
    const date = new Date().tolocaleString();
    console.log('id', id);
    const products = new Products(productsHC);
    id = parseInt(id);

    const found = products.findOne(id);
    if (found) {
        res.json(found);
    } else {
        res.json({error: 'producto no encontrado'})
    }
}); 

router.get('/', (req, res) => {
    const products = new Products(productsHC);
    const date = new Date().tolocaleString();
    res.json(products.getAll());
});