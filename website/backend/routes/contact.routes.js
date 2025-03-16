import express from 'express'
import contact from '../services/contact.service.js';

const router = express.Router();

router.post('/mail', contact.setMailMessage);

export default router;