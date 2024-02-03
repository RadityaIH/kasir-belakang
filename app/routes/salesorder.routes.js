import * as controller from '../controllers/salesorder.controller.js';

const salesorderRoutes = (app) => {
    app.get('/getSO', controller.getSO)
}

export default salesorderRoutes