const router = require('express').Router();
const { getPackages, getPackageById, createPackage, updatePackage, deletePackage } = require('../controllers/packageController');
const { protectAdmin } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

router.get('/',       getPackages);
router.get('/:id',    getPackageById);
router.post('/',      protectAdmin, upload.array('images', 5), createPackage);
router.put('/:id',    protectAdmin, upload.array('images', 5), updatePackage);
router.delete('/:id', protectAdmin, deletePackage);

module.exports = router;
