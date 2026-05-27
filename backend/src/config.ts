import { readFileSync } from 'fs'

export default JSON.parse(readFileSync(process.cwd() + '/config.json', 'utf8')) as {
	token: string
	server: string
	channel: string
	webhook: string,
	port: number
	unixSocket?: string,
	wikis: Record<string, {
		baseUrl: string;
		scriptPath: string;
		articlePath: string;
		isLocal?: boolean;
		discourse?: string;
	}>
}
