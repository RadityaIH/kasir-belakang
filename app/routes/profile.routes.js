import * as controller from '../controllers/profile.controller.js';

const profileRoutes = (app) => {
    app.get('/getUser', controller.getUser)
    app.put('/updateUser', controller.updateUser)
    app.get('/getKasir', controller.getKasir)
    app.post('/addKasir', controller.addKasir)
    app.put('/updateKasir', controller.updateKasir)
}

export default profileRoutes