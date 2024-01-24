import * as controller from '../controllers/profile.controller.js';

const profileRoutes = (app) => {
    app.get('/getUser', controller.getUser)
}

export default profileRoutes