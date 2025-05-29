import fs from 'fs';
import path from 'path';
import { Resend } from 'resend';

const configJson =  JSON.parse(fs.readFileSync(path.join(__dirname, '..','/config.json'), 'utf8'));
const resendApi = configJson.resend;
const domainEmail = configJson.domainEmail;
const resend = new Resend(resendApi);

export async function sendEmail(email: string, subject: string, html: string){
		await resend.emails.send({
		from: domainEmail,
		to: email,
		subject: subject,
		html: html
	});
}