import * as controller from '../controllers/customer.controller.js';

const customerRoutes = (app) => {
    app.get('/getCust', controller.getCust)
    app.put('/updateCust', controller.updateCust)
    app.post('/addCust', controller.addCust)

}

export default customerRoutes