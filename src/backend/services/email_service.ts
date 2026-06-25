import { Resend } from 'resend';
import { resendApiKey, domainEmail  } from '../config';

const resend = new Resend(resendApiKey);

export async function sendEmail(email: string, subject: string, html: string){
		await resend.emails.send({
		from: domainEmail,
		to: email,
		subject: subject,
		html: html
	});
}