var api = require('../../common/api.js');
var log = require('../../instances/log');
var nodemailer = require('nodemailer');
var config = require('../../instances/config');
var email_send_config = config.email_send_config;
var email_receive_config = config.email_receive_config;


module.exports = (router) => {
    router.post(api.apiPath + api.emailSendPost.path, function*() {
        this.checkBody('subject').notEmpty();
        this.checkBody('text').notEmpty();

        if (this.errors) {
            this.body = this.errors;
            this.status = 400;
            return;
        }

        var mailTransport = nodemailer.createTransport(email_send_config);
        var subject = this.request.body.subject;
        var text = this.request.body.text;
        var phone = this.request.body.phone || '用户选择不填写';
        var email = this.request.body.email || '用户选择不填写';
        phone = '用户手机:' + phone;
        email = '用户email:' + email;
        text = phone + '</br>' + email + '</br>' + text;

        mailTransport.sendMail({
            from: email_send_config.auth.user,
            to: email_receive_config.user,
            subject: subject,
            html: text

        }, function(error, response) {
            if (error) {
                log.error('email send error:' + JSON.stringify(error) + 'email content:' + text);

                return;
            }
            log.debug('email send successfully');
        });

        this.body = {};
        this.status = 200;
        return;
    });
};
