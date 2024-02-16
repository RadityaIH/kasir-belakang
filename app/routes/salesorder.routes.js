import * as controller from '../controllers/salesorder.controller.js';

const salesorderRoutes = (app) => {
    app.get('/getSO', controller.getSO)
    app.post('/addSO', controller.addSO)
    app.get('/getNotDelivered', controller.countNotDelivered)
    app.put('/setDelivered/:id_SO', controller.setDelivered)
    app.delete('/deleteSO/:id_SO', controller.deleteSO)
    app.get('/getSOById/:id_SO', controller.getSOById)
}

export default salesorderRoutes