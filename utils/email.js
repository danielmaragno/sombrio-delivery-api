"usestrict";

require('dotenv').config();
var nodemailer = require('nodemailer');


var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWD
  }
});

//
// Aux functions
//

function sendEmail(mailOptions){
	transporter.sendMail(mailOptions, function(error, info){
	  if (error) {
	    console.log(error);
	  } else {
	    console.log('Email sent: ' + info.response);
	  }
	});
};

function configMailOptions(receiver, subject, message){
	var mailOptions = {
	  from: process.env.GMAIL_USER,
	  to: receiver,
	  subject: subject,
	  text: message
	};

	return mailOptions;
};


function hostUrl() {
	let HOST  = process.env.HTTP_TYPE;
		HOST += "://";
		HOST += process.env.HOST;
		HOST += ":";
		HOST += process.env.PORT;

	return HOST;
};

//
//	Export functions
//

exports.sendConfirmEmail = function(receiver, hash){
	const subject = "Confirmação de Email";

	let message  = "Seja bem vindo ao maior portal de delivery da sua cidade!\n";
		message += "\n";
		message += "Sua conta está pronta. Por favor, clique no link para confirmar seu cadastro e boas compras :)\n";
		message += "\n";
		message += hostUrl()+"/auth/account-confirm?code="+hash+"\n";
		message += "\n\n";
		message += "Equipe Santa Catarina Delivery."

	const mailOptions = configMailOptions(receiver, subject, message);

	sendEmail(mailOptions);
};

exports.sendPasswdRecovyEmail = function(receiver, passwd) {
	const subject = "Recuperação de Senha";

	let message  = "Você esqueceu sua senha? Não tem problema, nós recuperamos para você ;)\n";
		message += "\n";
		message += "Sua nova senha é "+passwd+"\n";
		message += "\n";
		message += "Parece boa? Você pode continuar utilizando ela, ou então trocá-la por outra do seu gosto no App.\n";
		message += "Fique à vontade e boas compras :)\n";
		message += "\n\n";
		message += "Equipe Santa Catarina Delivery.";

	const mailOptions = configMailOptions(receiver, subject, message);

	sendEmail(mailOptions);

}