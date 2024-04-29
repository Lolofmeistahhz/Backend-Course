let express = require('express');
let app = express();
let port = 3000;
const { Buyer, Supplier, Product, CartItem, Order, Category, PickupPoint, Cart } = require('./schemas/schemas');

let swagger = require('./swagger');


app.listen(port, function () {
    console.log(`http://localhost:${port}`);
})

// для парсинга JSON
app.use(express.json());
// для пост запросов
app.use(express.urlencoded({ extended: true }));


// ПОКУПАТЕЛИ

/**
 * @swagger
 * /buyers:
 *   get:
 *     summary: Получить всех покупателей
 *     description: Получить список всех покупателей.
 *     responses:
 *       '200':
 *         description: Успешный запрос. Возвращает список покупателей.
 *       '500':
 *         description: Ошибка сервера. Не удалось получить список покупателей.
 */
app.get('/buyers', async (req, res) => {
    try {
        let buyers = await Buyer.find();
        console.log(buyers)
        res.status(200).json({ buyers: buyers, status: 'success' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to retrieve buyers' });
    }
});
/**
 * @swagger
 * /buyers/{id}:
 *   get:
 *     summary: Получить покупателя по ObjectId
 *     description: Получает покупателя из базы данных по его ObjectId.
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID покупателя
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Успешный запрос. Возвращает данные покупателя.
 *       '404':
 *         description: Покупатель не найден.
 *       '500':
 *         description: Ошибка сервера. Не удалось получить данные покупателя.
 */
app.get('/buyers/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const buyer = await Buyer.findById(id);
        if (!buyer) {
            return res.status(404).json({ error: 'Buyer not found' });
        }
        res.status(200).json({ buyer: buyer, status: 'success' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve buyer' });
    }
});
/**
 * @swagger
 * /buyers:
 *   post:
 *     summary: Добавить нового покупателя
 *     description: Добавляет нового покупателя в базу данных.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *             example:
 *               name: Николай
 *               email: mail@mail.ru
 *               phone: +7-991-214-00-55
 *     responses:
 *       '201':
 *         description: Покупатель успешно добавлен.
 *       '500':
 *         description: Ошибка сервера. Не удалось добавить покупателя.
 */

app.post('/buyers', async (req, res) => {
    try {
        const { name, email, phone } = req.body;
        const newBuyer = await new Buyer({ name: name, email: email, phone: phone });
        const savedBuyer = await newBuyer.save();
        res.status(201).json({ buyer: savedBuyer, status: 'success' });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: error.message });
        } else {
            console.error(error);
            return res.status(500).json({ error: 'Failed to add buyer' });
        }
    }
});

/**
 * @swagger
 * /buyers/{id}:
 *   put:
 *     summary: Изменить данные покупателя по ObjectId
 *     description: Изменяет данные покупателя в базе данных по его ObjectId.
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID покупателя
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *             example:
 *               name: Новое имя
 *               email: new@mail.ru
 *               phone: +7-999-999-99-99
 *     responses:
 *       '200':
 *         description: Покупатель успешно изменен.
 *       '404':
 *         description: Покупатель не найден.
 *       '500':
 *         description: Ошибка сервера. Не удалось изменить данные покупателя.
 */

app.put('/buyers/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const { name, email, phone } = req.body;
        const updatedBuyer = await Buyer.findByIdAndUpdate(id, { name, email, phone }, { new: true });
        if (!updatedBuyer) {
            return res.status(404).json({ error: 'Buyer not found' });
        }
        res.status(200).json({ buyer: updatedBuyer, status: 'success' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update buyer' });
    }
});

/**
 * @swagger
 * /buyers/{id}:
 *   delete:
 *     summary: Удалить покупателя по ObjectId
 *     description: Удаляет покупателя из базы данных по его ObjectId.
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID покупателя
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Покупатель успешно удален.
 *       '404':
 *         description: Покупатель не найден.
 *       '500':
 *         description: Ошибка сервера. Не удалось удалить покупателя.
 */

app.delete('/buyers/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const deletedBuyer = await Buyer.findByIdAndDelete(id);
        if (!deletedBuyer) {
            return res.status(404).json({ error: 'Buyer not found' });
        }
        res.status(200).json({ message: 'Buyer deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete buyer' });
    }
});


// ПРОИЗВОДИТЕЛИ


/**
 * @swagger
 * /suppliers:
 *   get:
 *     summary: Получить всех производителей
 *     description: Получить список всех производителей.
 *     responses:
 *       '200':
 *         description: Успешный запрос. Возвращает список производителей.
 *       '500':
 *         description: Ошибка сервера. Не удалось получить список производителей.
 */

app.get('/suppliers', async (req, res) => {
    try {
        const suppliers = await Supplier.find();
        res.status(200).json({ suppliers: suppliers, status: 'success' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to retrieve suppliers' });
    }
});

/**
 * @swagger
 * /suppliers/{id}:
 *   get:
 *     summary: Получить производителя по ID
 *     description: Получить информацию о производителе по его ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID производителя
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Успешный запрос. Возвращает информацию о производителе.
 *       '404':
 *         description: Производитель не найден.
 *       '500':
 *         description: Ошибка сервера. Не удалось получить информацию о производителе.
 */

app.get('/suppliers/:id', async (req, res) => {
    try {
        const supplier = await Supplier.findById(req.params.id);
        if (!supplier) {
            return res.status(404).json({ error: 'Supplier not found' });
        }
        res.status(200).json({ supplier: supplier, status: 'success' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to retrieve supplier' });
    }
});

/**
 * @swagger
 * /suppliers:
 *   post:
 *     summary: Добавить нового производителя
 *     description: Добавляет нового производителя в базу данных.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Имя производителя
 *               inn:
 *                 type: string
 *                 description: ИНН производителя
 *               email:
 *                 type: string
 *                 description: Email производителя
 *             example:
 *               name: Название производителя
 *               inn: 1234567890
 *               email: example@example.com
 *     responses:
 *       '201':
 *         description: Производитель успешно добавлен.
 *       '500':
 *         description: Ошибка сервера. Не удалось добавить производителя.
 */

app.post('/suppliers', async (req, res) => {
    try {
        const { name, inn, email } = req.body;
        const newSupplier = await new Supplier({ name, inn, email });
        const savedSupplier = await newSupplier.save();
        res.status(201).json({ supplier: savedSupplier, status: 'success' });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: error.message });
        } else {
            console.error(error);
            return res.status(500).json({ error: 'Failed to add supplier' });
        }
    }
});

/**
 * @swagger
 * /suppliers:
 *   post:
 *     summary: Добавить нового производителя
 *     description: Добавляет нового производителя в базу данных.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Имя производителя
 *               inn:
 *                 type: string
 *                 description: ИНН производителя
 *               email:
 *                 type: string
 *                 description: Email производителя
 *             example:
 *               name: Название производителя
 *               inn: 1234567890
 *               email: example@example.com
 *     responses:
 *       '201':
 *         description: Производитель успешно добавлен.
 *       '500':
 *         description: Ошибка сервера. Не удалось добавить производителя.
 */

app.post('/suppliers', async (req, res) => {
    try {
        const { name, inn, email } = req.body;
        const newSupplier = await new Supplier({ name, inn, email });
        const savedSupplier = await newSupplier.save();
        res.status(201).json({ supplier: savedSupplier, status: 'success' });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: error.message });
        } else {
            console.error(error);
            return res.status(500).json({ error: 'Failed to add supplier' });
        }
    }
});

/**
 * @swagger
 * /suppliers/{id}:
 *   put:
 *     summary: Изменить информацию о производителе
 *     description: Изменяет информацию о производителе по его ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID производителя
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: новое имя
 *                 description: Новое имя производителя
 *               inn:
 *                 type: новый инн
 *                 description: Новый ИНН производителя
 *               email:
 *                 type: new@mail.ru
 *                 description: Новый email производителя
 *     responses:
 *       '200':
 *         description: Информация о производителе успешно изменена.
 *       '404':
 *         description: Производитель не найден.
 *       '500':
 *         description: Ошибка сервера. Не удалось изменить информацию о производителе.
 */

app.put('/suppliers/:id', async (req, res) => {
    try {
        const { name, inn, email } = req.body;
        const updatedSupplier = await Supplier.findByIdAndUpdate(req.params.id, { name, inn, email }, { new: true });
        if (!updatedSupplier) {
            return res.status(404).json({ error: 'Supplier not found' });
        }
        res.status(200).json({ supplier: updatedSupplier, status: 'success' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update supplier' });
    }
});

/**
 * @swagger
 * /suppliers/{id}:
 *   delete:
 *     summary: Удалить производителя по ID
 *     description: Удаляет производителя из базы данных по его ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID производителя
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Производитель успешно удален.
 *       '404':
 *         description: Производитель не найден.
 *       '500':
 *         description: Ошибка сервера. Не удалось удалить производителя.
 */

app.delete('/suppliers/:id', async (req, res) => {
    try {
        const deletedSupplier = await Supplier.findByIdAndDelete(req.params.id);
        if (!deletedSupplier) {
            return res.status(404).json({ error: 'Supplier not found' });
        }
        res.status(200).json({ message: 'Supplier successfully deleted', status: 'success' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete supplier' });
    }
});

// КАТЕГОРИИ ТОВАРОВ

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Получить все категории
 *     description: Получить список всех категорий.
 *     responses:
 *       '200':
 *         description: Успешный запрос. Возвращает список категорий.
 *       '500':
 *         description: Ошибка сервера. Не удалось получить список категорий.
 */

app.get('/categories', async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json({ categories: categories, status: 'success' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to retrieve categories' });
    }
});

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: Получить категорию по ID
 *     description: Получить информацию о категории по ее ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID категории
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Успешный запрос. Возвращает информацию о категории.
 *       '404':
 *         description: Категория не найдена.
 *       '500':
 *         description: Ошибка сервера. Не удалось получить информацию о категории.
 */

app.get('/categories/:id', async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.status(200).json({ category: category, status: 'success' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to retrieve category' });
    }
});

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Добавить новую категорию
 *     description: Добавляет новую категорию в базу данных.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Название категории
 *             example:
 *               name: Новая категория
 *     responses:
 *       '201':
 *         description: Категория успешно добавлена.
 *       '500':
 *         description: Ошибка сервера. Не удалось добавить категорию.
 */

app.post('/categories', async (req, res) => {
    try {
        const { name } = req.body;
        const newCategory = await new Category({ name });
        const savedCategory = await newCategory.save();
        res.status(201).json({ category: savedCategory, status: 'success' });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: error.message });
        } else {
            console.error(error);
            return res.status(500).json({ error: 'Failed to add category' });
        }
    }
});

/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     summary: Изменить категорию
 *     description: Изменяет информацию о категории в базе данных по её ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID категории, которую нужно изменить
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Новое название категории
 *             example:
 *               name: Новое название категории
 *     responses:
 *       '200':
 *         description: Категория успешно изменена.
 *       '404':
 *         description: Категория не найдена.
 *       '500':
 *         description: Ошибка сервера. Не удалось изменить категорию.
 */

app.put('/categories/:id', async (req, res) => {
    try {
        const { name } = req.body;
        const updatedCategory = await Category.findByIdAndUpdate(req.params.id, { name }, { new: true });
        if (!updatedCategory) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.status(200).json({ category: updatedCategory, status: 'success' });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: error.message });
        } else {
            console.error(error);
            return res.status(500).json({ error: 'Failed to update category' });
        }
    }
});

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Удалить категорию
 *     description: Удаляет категорию из базы данных по её ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID категории, которую нужно удалить
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Категория успешно удалена.
 *       '404':
 *         description: Категория не найдена.
 *       '500':
 *         description: Ошибка сервера. Не удалось удалить категорию.
 */

app.delete('/categories/:id', async (req, res) => {
    try {
        const deletedCategory = await Category.findByIdAndDelete(req.params.id);
        if (!deletedCategory) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.status(200).json({ category: deletedCategory, status: 'success' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete category' });
    }
});



// ТОВАРЫ


/**
 * @swagger
 * /products:
 *   get:
 *     summary: Получить все продукты
 *     description: Получает список всех продуктов.
 *     parameters:
 *       - in: query
 *         name: manufacturer
 *         schema:
 *           type: string
 *         description: ID производителя для фильтрации продуктов
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: ID категории для фильтрации продуктов
 *     responses:
 *       '200':
 *         description: Успешный запрос. Возвращает список всех продуктов.
 *       '500':
 *         description: Ошибка сервера. Не удалось получить список продуктов.
 */

app.get('/products', async (req, res) => {
    try {
        const { manufacturer, category } = req.query;

        const filter = {};
        if (manufacturer) {
            filter.manufacturer = manufacturer;
        }
        if (category) {
            filter.category = category;
        }
        const products = await Product.find(filter);
        res.status(200).json({ products: products, status: 'success' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to retrieve products' });
    }
});

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Получить продукт по ID
 *     description: Получает информацию о продукте по его ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID продукта
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Успешный запрос. Возвращает информацию о продукте.
 *       '404':
 *         description: Продукт не найден.
 *       '500':
 *         description: Ошибка сервера. Не удалось получить информацию о продукте.
 */

app.get('/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(200).json({ product: product, status: 'success' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to retrieve product' });
    }
});

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Добавить новый продукт
 *     description: Добавляет новый продукт в базу данных.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Название продукта
 *               price:
 *                 type: number
 *                 description: Цена продукта
 *               photo:
 *                 type: string
 *                 description: Ссылка на фото продукта
 *               characteristics:
 *                 type: string
 *                 description: Характеристики продукта
 *               category:
 *                 type: string
 *                 description: ID категории продукта
 *               manufacturer:
 *                 type: string
 *                 description: ID производителя продукта
 *             example:
 *               name: Ноутбук
 *               price: 1000
 *               photo: https://example.com/notebook.jpg
 *               characteristics: "Скорость процессора: 2.0 GHz"
 *               category: "5fd9e53e16f9c04d986da45c"
 *               manufacturer: "5fd9e53e16f9c04d986da45d"
 *     responses:
 *       '201':
 *         description: Продукт успешно добавлен.
 *       '500':
 *         description: Ошибка сервера. Не удалось добавить продукт.
 */

app.post('/products', async (req, res) => {
    try {
        const { name, price, photo, characteristics, category, manufacturer } = req.body;
        const newProduct = await new Product({ name, price, photo, characteristics, category, manufacturer });
        const savedProduct = await newProduct.save();
        res.status(201).json({ product: savedProduct, status: 'success' });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: error.message });
        } else {
            console.error(error);
            return res.status(500).json({ error: 'Failed to add product' });
        }
    }
});


/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Обновить продукт
 *     description: Обновляет информацию о продукте по его ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID продукта для обновления
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Новое название продукта
 *               price:
 *                 type: number
 *                 description: Новая цена продукта
 *               photo:
 *                 type: string
 *                 description: Новое фото продукта
 *               characteristics:
 *                 type: string
 *                 description: Новые характеристики продукта
 *               category:
 *                 type: string
 *                 description: Новая категория продукта (ID категории)
 *               manufacturer:
 *                 type: string
 *                 description: Новый производитель продукта (ID производителя)
 *             example:
 *               name: Новое название
 *               price: 99999
 *               photo: Новая ссылка
 *               characteristics: Новый характеристики
 *               category: ID новой категории
 *               manufacturer: ID нового производителя
 *     responses:
 *       '200':
 *         description: Продукт успешно обновлен.
 *       '404':
 *         description: Продукт не найден.
 *       '500':
 *         description: Ошибка сервера. Не удалось обновить продукт.
 */
app.put('/products/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        const updatedProduct = await Product.findByIdAndUpdate(productId, req.body, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(200).json({ product: updatedProduct, status: 'success' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update product' });
    }
});


/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Удалить продукт
 *     description: Удаляет продукт по его ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID продукта для удаления
 *         schema:
 *           type: string
 *     responses:
 *       '204':
 *         description: Продукт успешно удален.
 *       '404':
 *         description: Продукт не найден.
 *       '500':
 *         description: Ошибка сервера. Не удалось удалить продукт.
 */
app.delete('/products/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        const deletedProduct = await Product.findByIdAndDelete(productId);
        if (!deletedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(204).end();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete product' });
    }
});


// ТОЧКИ ПВЗ

/**
 * @swagger
 * /pickuppoints:
 *   get:
 *     summary: Получить все пункты выдачи
 *     description: Получает список всех пунктов выдачи.
 *     responses:
 *       '200':
 *         description: Успешный запрос. Возвращает список всех пунктов выдачи.
 *       '500':
 *         description: Ошибка сервера. Не удалось получить список пунктов выдачи.
 */
app.get('/pickuppoints', async (req, res) => {
    try {
        const pickupPoints = await PickupPoint.find();
        res.status(200).json({ pickupPoints: pickupPoints, status: 'success' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to retrieve pickup points' });
    }
});

/**
 * @swagger
 * /pickuppoints/{id}:
 *   get:
 *     summary: Получить пункт выдачи по ID
 *     description: Получает информацию о пункте выдачи по его ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID пункта выдачи
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Успешный запрос. Возвращает информацию о пункте выдачи.
 *       '404':
 *         description: Пункт выдачи не найден.
 *       '500':
 *         description: Ошибка сервера. Не удалось получить информацию о пункте выдачи.
 */
app.get('/pickuppoints/:id', async (req, res) => {
    try {
        const pickupPoint = await PickupPoint.findById(req.params.id);
        if (!pickupPoint) {
            return res.status(404).json({ error: 'Pickup point not found' });
        }
        res.status(200).json({ pickupPoint: pickupPoint, status: 'success' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to retrieve pickup point' });
    }
});
/**
 * @swagger
 * /pickuppoints:
 *   post:
 *     summary: Добавить новый пункт выдачи
 *     description: Добавляет новый пункт выдачи в базу данных.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Название пункта выдачи
 *               address:
 *                 type: string
 *                 description: Адрес пункта выдачи
 *             example:
 *               name: Пункт выдачи A
 *               address: Улица Пушкина, дом Колотушкина
 *     responses:
 *       '201':
 *         description: Пункт выдачи успешно добавлен.
 *       '500':
 *         description: Ошибка сервера. Не удалось добавить пункт выдачи.
 */
app.post('/pickuppoints', async (req, res) => {
    try {
        const { name, address } = req.body;
        const newPickupPoint = await new PickupPoint({ name, address });
        const savedPickupPoint = await newPickupPoint.save();
        res.status(201).json({ pickupPoint: savedPickupPoint, status: 'success' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to add pickup point' });
    }
});
/**
 * @swagger
 * /pickuppoints/{id}:
 *   put:
 *     summary: Обновить пункт выдачи
 *     description: Обновляет информацию о пункте выдачи по его ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID пункта выдачи для обновления
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Новое название пункта выдачи
 *               address:
 *                 type: string
 *                 description: Новый адрес пункта выдачи
 *             example:
 *               name: Пункт выдачи B
 *               address: Улица Лермонтова, дом Гоголя
 *     responses:
 *       '200':
 *         description: Пункт выдачи успешно обновлен.
 *       '404':
 *         description: Пункт выдачи не найден.
 *       '500':
 *         description: Ошибка сервера. Не удалось обновить пункт выдачи.
 */
app.put('/pickuppoints/:id', async (req, res) => {
    try {
        const pickupPointId = req.params.id;
        const updatedPickupPoint = await PickupPoint.findByIdAndUpdate(pickupPointId, req.body, { new: true });
        if (!updatedPickupPoint) {
            return res.status(404).json({ error: 'Pickup point not found' });
        }
        res.status(200).json({ pickupPoint: updatedPickupPoint, status: 'success' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update pickup point' });
    }
});

/**
 * @swagger
 * /pickuppoints/{id}:
 *   delete:
 *     summary: Удалить пункт выдачи
 *     description: Удаляет пункт выдачи из базы данных по его ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID пункта выдачи для удаления
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Пункт выдачи успешно удален.
 *       '404':
 *         description: Пункт выдачи не найден.
 *       '500':
 *         description: Ошибка сервера. Не удалось удалить пункт выдачи.
 */
app.delete('/pickuppoints/:id', async (req, res) => {
    try {
        const pickupPointId = req.params.id;
        const deletedPickupPoint = await PickupPoint.findByIdAndDelete(pickupPointId);
        if (!deletedPickupPoint) {
            return res.status(404).json({ error: 'Pickup point not found' });
        }
        res.status(200).json({ pickupPoint: deletedPickupPoint, status: 'success' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete pickup point' });
    }
});

// КОРЗИНА

/**
 * @swagger
 * /cart/{buyerId}:
 *   get:
 *     summary: Получить корзину текущего пользователя
 *     description: Получает корзину текущего пользователя по его ID.
 *     parameters:
 *       - in: path
 *         name: buyerId
 *         required: true
 *         description: ID текущего пользователя (BuyerID)
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Успешный запрос. Возвращает корзину текущего пользователя.
 *       '404':
 *         description: Корзина пользователя не найдена.
 *       '500':
 *         description: Ошибка сервера. Не удалось получить корзину текущего пользователя.
 */
app.get('/cart/:buyerId', async (req, res) => {
    try {
        const buyerId = req.params.buyerId;
        const cart = await Cart.findOne({ buyer: buyerId }).populate('cartItems');
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }
        res.status(200).json({ cart: cart, status: 'success' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to retrieve user cart' });
    }
});
/**
 * @swagger
 * /cart/add-product:
 *   post:
 *     summary: Добавить продукт в корзину
 *     description: Добавляет указанный продукт в корзину текущего пользователя.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               buyerId:
 *                 type: string
 *                 description: ID текущего пользователя (BuyerID).
 *               productId:
 *                 type: string
 *                 description: ID добавляемого продукта.
 *               quantity:
 *                 type: number
 *                 description: Количество добавляемого продукта в корзину.
 *             example:
 *               buyerId: "5fd9e53e16f9c04d986da45a"
 *               productId: "5fd9e53e16f9c04d986da45b"
 *               quantity: 2
 *     responses:
 *       '200':
 *         description: Продукт успешно добавлен в корзину.
 *       '404':
 *         description: Пользователь или продукт не найден.
 *       '500':
 *         description: Ошибка сервера. Не удалось добавить продукт в корзину.
 */

app.post('/cart/add-product', async (req, res) => {
    try {
        const { buyerId, productId, quantity } = req.body;

        let cart = await Cart.findOne({ buyer: buyerId });

        if (!cart) {
            cart = await new Cart({ buyer: buyerId, cartItems: [] }).save();
        }
        const existingCartItem = await CartItem.findOne({ product: productId, cart: cart._id });
        if (existingCartItem) {
            existingCartItem.quantity += quantity;
            await existingCartItem.save();
        } else {
            const cartItem = await new CartItem({ product: productId, quantity: quantity, cart: cart._id }).save();
            cart.cartItems.push(cartItem._id);
            await cart.save();
        }

        res.status(200).json({ message: 'Product added to cart successfully', status: 'success' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to add product to cart' });
    }
});

/**
 * @swagger
 * /cart/remove-product:
 *   delete:
 *     summary: Удалить продукт из корзины
 *     description: Удаляет указанный продукт из корзины покупателя.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               buyerId:
 *                 type: string
 *                 description: ID покупателя
 *               productId:
 *                 type: string
 *                 description: ID продукта
 *             example:
 *               buyerId: 60ef48f16730e23a1c732b3d
 *               productId: 60ef4a0e6d9d1e3dd7cf6820
 *     responses:
 *       '200':
 *         description: Продукт успешно удален из корзины.
 *       '404':
 *         description: Корзина или продукт не найдены.
 *       '500':
 *         description: Ошибка сервера. Не удалось удалить продукт из корзины.
 */
app.delete('/cart/remove-product', async (req, res) => {
    try {
        const { buyerId, productId } = req.body;

        const cart = await Cart.findOne({ buyer: buyerId });

        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        const cartItem = await CartItem.findOne({ product: productId, cart: cart._id });

        if (!cartItem) {
            return res.status(404).json({ error: 'Product not found in cart' });
        }

        await CartItem.findByIdAndRemove(cartItem._id);

        cart.cartItems = cart.cartItems.filter(itemId => itemId.toString() !== cartItem._id.toString());
        await cart.save();

        res.status(200).json({ message: 'Product removed from cart successfully', status: 'success' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to remove product from cart' });
    }
});

/**
 * @swagger
 * /cart/update-quantity:
 *   put:
 *     summary: Обновить количество продукта в корзине
 *     description: Обновляет количество указанного продукта в корзине покупателя.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               buyerId:
 *                 type: string
 *                 description: ID покупателя
 *               productId:
 *                 type: string
 *                 description: ID продукта
 *               quantity:
 *                 type: number
 *                 description: Новое количество продукта в корзине
 *             example:
 *               buyerId: 60ef48f16730e23a1c732b3d
 *               productId: 60ef4a0e6d9d1e3dd7cf6820
 *               quantity: 2
 *     responses:
 *       '200':
 *         description: Количество продукта в корзине успешно обновлено.
 *       '404':
 *         description: Корзина или продукт не найдены.
 *       '500':
 *         description: Ошибка сервера. Не удалось обновить количество продукта в корзине.
 */
app.put('/cart/update-quantity', async (req, res) => {
    try {
        const { buyerId, productId, quantity } = req.body;


        const cart = await Cart.findOne({ buyer: buyerId });

        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

  
        const cartItem = await CartItem.findOne({ product: productId, cart: cart._id });

        if (!cartItem) {
            return res.status(404).json({ error: 'Product not found in cart' });
        }

        cartItem.quantity = quantity;
        await cartItem.save();

        res.status(200).json({ message: 'Product quantity updated in cart successfully', status: 'success' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update product quantity in cart' });
    }
});


// ЗАКАЗЫ

/**
 * @swagger
 * /orders/by-buyer/{buyerId}:
 *   get:
 *     summary: Получить заказы по ID покупателя
 *     description: Получает список всех заказов для указанного покупателя.
 *     parameters:
 *       - in: path
 *         name: buyerId
 *         required: true
 *         description: ID покупателя
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Успешный запрос. Возвращает список всех заказов для указанного покупателя.
 *       '500':
 *         description: Ошибка сервера. Не удалось получить список заказов.
 */

app.get('/orders/by-buyer/:buyerId', async (req, res) => {
    try {
        const { buyerId } = req.params;

        const orders = await Order.find({ buyer: buyerId }).populate('orderedProducts');

        res.status(200).json({ orders: orders, status: 'success' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve orders' });
    }
});

/**
 * @swagger
 * /orders/checkout:
 *   post:
 *     summary: Совершить заказ
 *     description: Создает заказ на основе содержимого корзины покупателя и удаляет корзину.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               buyerId:
 *                 type: string
 *                 description: ID покупателя
 *               pickUpPointId:
 *                 type: string
 *                 description: ID пункта самовывоза
 *             example:
 *               buyerId: 60ed8b619085b8338898a94e
 *               pickUpPointId: 60ed8b619085b8338898a94f
 *     responses:
 *       '200':
 *         description: Успешный запрос. Заказ успешно создан и корзина удалена.
 *       '500':
 *         description: Ошибка сервера. Не удалось создать заказ или удалить корзину.
 */

app.post('/orders/checkout', async (req, res) => {
    try {
        const { buyerId, pickUpPointId } = req.body;

        const cart = await Cart.findOne({ buyer: buyerId }).populate('cartItems');

        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        let totalCost = 0;
        for (const cartItem of cart.cartItems) {
            const product = await Product.findById(cartItem.product);
            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            }
            totalCost += cartItem.quantity * product.price;
        }

        const order = new Order({
            buyer: buyerId,
            totalCost: totalCost,
            orderedProducts: cart.cartItems.map(cartItem => cartItem.product),
            pickupPoint: pickUpPointId
        });

        await order.save();

        await CartItem.deleteMany({ cart: cart._id });

        await Cart.findByIdAndDelete(cart._id);

        res.status(200).json({ message: 'Order placed successfully', status: 'success' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to place order' });
    }
});

swagger(app);
