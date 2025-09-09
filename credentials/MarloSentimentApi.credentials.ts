import type { ICredentialType, INodeProperties } from 'n8n-workflow';

export class MarloSentimentApi implements ICredentialType {
	name = 'marloSentimentApi';
	displayName = 'Marlo Sentiment API';
	documentationUrl = 'https://rapidapi.com/marlo-tee/api/marlo-sentiment';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			description: 'Your RapidAPI key for the Marlo Sentiment API',
			required: true,
		},
		{
			displayName: 'RapidAPI Host',
			name: 'rapidApiHost',
			type: 'string',
			default: 'marlo-sentiment.p.rapidapi.com',
			description: 'RapidAPI host for the Marlo Sentiment API',
			required: true,
		},
	];
}