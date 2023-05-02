declare module "nodemailer-sendgrid-transport" {
	import { Transporter } from "nodemailer";

	interface Options {
		auth: {
			api_key: string;
		};
	}

	function createTransport(options: Options): Transporter;

	export = createTransport;
}
