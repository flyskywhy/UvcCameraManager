module.exports = function(mail) {
    mail = mail.replace(/\s/g, '');
    //*?^%$
    if (mail.match(/[*?^%$]/g) || !(/^([\.a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/).test(mail)) {
        return false;
    }
    return true;
}