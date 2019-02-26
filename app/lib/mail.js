var nodemailer = require('nodemailer');

var mail = {};

var _transporter;

mail.init = function() {
	_transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: '###',
			pass: '###'
		}
	});
};

mail.send = function(recipients, subj, html) {
	if (_transporter) {
		var mailOptions = {
			from: '###',
			to: recipients.join(','),
			subject: subj,
			html: html
		};

		_transporter.sendMail(mailOptions, function(error, info){
			if (error) {
				console.log(error);
			} else {
				console.log('Email sent: ' + info.response);
			}
		});
	} else {
		console.log('You must initialize mail module before sending email');
	}
}

module.exports = mail;