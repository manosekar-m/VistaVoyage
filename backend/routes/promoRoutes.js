const router = require('express').Router();
const { getPromos, createPromo, updatePromo, deletePromo, validatePromo } = require('../controllers/promoController');
const { protectUser, protectAdmin } = require('../middleware/auth');

// User: Validate
router.post('/validate', protectUser, validatePromo);

// Admin: CRUD
router.get('/',      protectAdmin, getPromos);
router.post('/',     protectAdmin, createPromo);
router.put('/:id',    protectAdmin, updatePromo);
router.delete('/:id', protectAdmin, deletePromo);

module.exports = router;
