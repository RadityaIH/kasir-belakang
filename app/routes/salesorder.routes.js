import * as controller from '../controllers/salesorder.controller.js';

const salesorderRoutes = (app) => {
    app.get('/getSO', controller.getSO)
    app.post('/addSO', controller.addSO)
}

export default salesorderRoutes