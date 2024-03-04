import * as controller from '../controllers/salesorder.controller.js';

const salesorderRoutes = (app) => {
    app.get('/getSO', controller.getSO)
    app.post('/addSO', controller.addSO)
    app.get('/getNotDelivered', controller.countNotDelivered)
    app.put('/setDelivered/:id_SO', controller.setDelivered)
    app.delete('/deleteSO/:id_SO', controller.deleteSO)
    app.get('/getSOById/:id_SO', controller.getSOById)
    app.get('/getSalesResult/:id_sales', controller.getSalesResult)
    app.get('/getSOperDate', controller.getSOperDate)
    app.get('/getSOperDateperSales/:sales_id', controller.getSOperDateperSales)
    app.put('/updateSO/:id_SO', controller.updateSO)
    app.put('/setLunas/:id_SO', controller.setLunas)
}

export default salesorderRoutes