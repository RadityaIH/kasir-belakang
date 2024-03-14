import * as controller from '../controllers/profile.controller.js';
import upload from '../../index.js'

const profileRoutes = (app) => {
    app.get('/getUser', controller.getUser)
    app.put('/updateUser', controller.updateUser)
    app.post('/uploadPhoto', upload.single('photo'), controller.uploadPhoto)
    app.put('/deletePhoto', controller.deletePhoto)
    app.get('/getKasir', controller.getKasir)
    app.post('/addKasir', controller.addKasir)
    app.put('/updateKasir', controller.updateKasir)
    app.delete('/deleteKasir/:id', controller.deleteKasir)
}

export default profileRoutes