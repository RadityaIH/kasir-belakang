import * as controller from '../controllers/sales.controller.js';

const salesRoutes = (app) => {
    app.get('/getSales', controller.getSales)
}

export default salesRoutes