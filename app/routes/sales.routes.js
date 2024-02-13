import * as controller from '../controllers/sales.controller.js';

const salesRoutes = (app) => {
    app.get('/getSales', controller.getSales)
    app.get('/getSalesAll', controller.getSalesAll)
    app.get('/getSalesAllByDate', controller.getSalesAllByDate)
}

export default salesRoutes