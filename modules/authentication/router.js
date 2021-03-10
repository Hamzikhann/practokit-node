
'use strict';
const express = require("express");
const router = express.Router();
const jwt = require('../../utils/jwt');
const authcontroller = require('./authentication.controller');

const fileUpload = require("../../utils/fileUpload");
const { upload } = fileUpload("profile");


router.post('/login', authcontroller.login);
router.post('/signup', upload.fields([
    {
        name: 'resume'
    }
]), authcontroller.signup);
router.post('/signup/:token/confirmation', authcontroller.signupConfirmation);
router.post('/resend/confirmation/:email', authcontroller.resendConfirmationEmail);
router.get('/:email/status', (req, res) => {
    authcontroller.checkEmailStatus(req, res)
});
router.get('/status/:email', (req, res) => {
    authcontroller.getEmailStatus(req, res)
});
router.post('/forgot/password', authcontroller.forgotPassword);
router.post('/reset/password/:token', jwt.resetPasswordProtect, authcontroller.resetPassword);
router.get('/enroll/:token', (req, res) => {
    authcontroller.sendPaymentMethodEmail(req, res)
});
router.get('/object/:token', (req, res) => {
    authcontroller.decryptObject(req, res)
});

module.exports = router;
