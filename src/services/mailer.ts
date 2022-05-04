
import sgMail from '@sendgrid/mail';


export class Mailer {


    static init(apiKey: string) {
        sgMail.setApiKey(apiKey);
    }

    getHTMLMail(otp: string) {
        const template = `<div>
            <h1>Welcome to Venture </h1>
            <h3>Your Otp is ${otp}</h3>
            <p>Otp is valid for the next one hour.</p>
            </div>`;
        return template;
    }

    getHTMLText(otp: string) {
        const text = `Welcome to Venture .Your Otp is ${otp}.Otp is valid for the next one hour.`
        return text
    }

    sendMail(recipient: string, otp: string) {
        const msg = {
            from: 'P4 PASAL <dev.onlydev93@gmail.com>',
            to: recipient,
            subject: 'OTP for Venture signup',
            text: this.getHTMLText(otp),
            html: this.getHTMLMail(otp)
        }

        return sgMail
            .send(msg)
            .then((response) => {
                console.log('mail send', response[0].statusCode)
                return response
            })
            .catch((error) => {
                console.error(error);
                return error
            })
    }


}

