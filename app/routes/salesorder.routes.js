import * as controller from '../controllers/salesorder.controller.js';

const salesorderRoutes = (app) => {
    app.get('/getSO', controller.getSO)
    app.post('/addSO', controller.addSO)
    app.get('/getSOFiltered', controller.getSOFiltered)
}

export default salesorderRoutes