import * as controller from '../controllers/profile.controller.js';

const profileRoutes = (app) => {
    app.get('/getUser', controller.getUser)
    app.put('/updateUser', controller.updateUser)
}

export default profileRoutes