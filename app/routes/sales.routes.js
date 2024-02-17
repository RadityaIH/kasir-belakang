import * as controller from '../controllers/sales.controller.js';

const salesRoutes = (app) => {
    app.get('/getSales', controller.getSales)
    app.get('/getSalesAll', controller.getSalesAll)
    app.get('/getSalesAllByDate', controller.getSalesAllByDate)
    app.post('/addSales', controller.addSales)
}

export default salesRoutes