import { readFileSync } from 'fs'

export default JSON.parse(readFileSync(process.cwd() + '/config.json', 'utf8')) as {
	token: string
	server: string
	channel: string
	webhook: string,
	port: number
	unixSocket?: string,
	modRole: string,
	wikis: Record<string, {
		baseUrl: string;
		scriptPath: string;
		articlePath: string;
		isLocal?: boolean;
		authorization?: string;
		discourse?: string;
	}>
}
