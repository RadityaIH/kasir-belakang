import * as controller from '../controllers/auth.controller.js';

const authRoutes = (app) => {
    app.post('/login', controller.login)
    app.post('/logout', controller.logout)
}

export default authRoutes;