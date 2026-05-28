import { Agent, fetch, RequestInit } from 'undici';
import config from './config';
import { parse } from 'node-html-parser';

interface WikiUserInfo {
	id: number;
	name: string;
	blocked: boolean;
	changed?: LastEditInfo;
	isTemp: boolean;
}

export interface LastEditInfo {
	fromrev: number;
	torev: number;
}

interface UserFeedback {
	title: string;
	articleUrl: string;
	diffUrl: string;
	content: string;
}

function getWikiConfig(wiki: string) {
	const wikiConfig = config.wikis[wiki];
	if (!wikiConfig) {
		throw new Error(`Wiki "${wiki}" not found in configuration.`);
	}
	return wikiConfig;
}

function getWikiApiUrl(wiki: string): [URL, RequestInit] {
	const wikiConfig = getWikiConfig(wiki);
	const apiUrl = new URL(`${wikiConfig.baseUrl}${wikiConfig.scriptPath}/api.php`);
	const userAgent = 'utdrwiki/widget';
	if (wikiConfig.isLocal) {
		const wikiHost = apiUrl.host;
		apiUrl.host = 'localhost';
		return [apiUrl, {
			dispatcher: new Agent({
				connect: {
					rejectUnauthorized: false
				}
			}),
			headers: {
				...(wikiConfig.authorization ?
					{ Authorization: wikiConfig.authorization } :
					{}),
				Host: wikiHost,
				'User-Agent': userAgent,
			}
		}];
	}
	return [apiUrl, {
		headers: {
			'User-Agent': userAgent
		}
	}];
}

export async function getUserInfo(cookies: string, wiki: string): Promise<WikiUserInfo> {
	const [apiUrl, apiOptions] = getWikiApiUrl(wiki);
	const oneMinuteAgo = new Date(new Date().getTime() - 60 * 1000);
	apiUrl.search = new URLSearchParams({
		action: 'query',
		format: 'json',
		formatversion: '2',
		// Current user information
		meta: 'userinfo',
		uiprop: 'blockinfo|groups',
		// Last 1 minute of article feedback changes
		list: 'recentchanges',
		rcstart: oneMinuteAgo.toISOString(),
		rcnamespace: '1',
		rctag: 'articlefeedback',
		rcprop: 'ids',
		rclimit: '10',
		rctype: 'edit',
		rcslot: 'main',
	}).toString();
	const apiRequest = await fetch(apiUrl, {
		...apiOptions,
		headers: {
			...apiOptions.headers,
			Cookie: cookies
		}
	});
	if (!apiRequest.ok) {
		throw new Error(`Failed to fetch user info from wiki API: ${apiRequest.status} ${apiRequest.statusText}`);
	}
	const apiResponse: any = await apiRequest.json();
	console.debug('Wiki API response:', apiResponse);
	const {
		query: {
			userinfo: { id, name, blockid, groups },
			recentchanges
		}
	} = apiResponse;
	const userInfo: WikiUserInfo = {
		id,
		name,
		blocked: Boolean(blockid),
		isTemp: groups.includes('temp')
	};
	if (!id) {
		throw new Error('User is not logged in', {
			cause: apiResponse
		});
	}
	const recentChange = recentchanges.find((c: any) => c.user === name);
	if (recentChange) {
		return {
			...userInfo,
			changed: {
				fromrev: recentChange.old_revid,
				torev: recentChange.revid
			}
		}
	}
	return userInfo;
}

export async function getUserFeedback(editInfo: LastEditInfo, wiki: string): Promise<UserFeedback> {
	const [apiUrl, apiOptions] = getWikiApiUrl(wiki);
	apiUrl.search = new URLSearchParams({
		action: 'compare',
		fromrev: editInfo.fromrev.toString(),
		torev: editInfo.torev.toString(),
		prop: 'title|diff',
		format: 'json',
		formatversion: '2'
	}).toString();
	const apiRequest = await fetch(apiUrl, apiOptions);
	if (!apiRequest.ok) {
		throw new Error(`Failed to fetch edit info from wiki API: ${apiRequest.status} ${apiRequest.statusText}`);
	}
	const apiResponse: any = await apiRequest.json();
	const { compare: { title, body } } = apiResponse;
	const wikiConfig = getWikiConfig(wiki);
	return {
		title: title.split(':').slice(1).join(':'),
		articleUrl: `${wikiConfig.baseUrl}${wikiConfig.articlePath.replace(
			'$1',
			encodeURIComponent(title)
		)}`,
		diffUrl: `${wikiConfig.baseUrl}${wikiConfig.scriptPath}/?diff=${editInfo.torev}&ref=articlefeedback`,
		content: parse(`<table>${body}</table>`)
			.querySelectorAll('.diff-addedline')
			.slice(4, -1)
			.map(line => line.textContent)
			.join('\n')
	};
}
