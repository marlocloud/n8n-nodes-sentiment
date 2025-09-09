import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	INodePropertyOptions,
} from 'n8n-workflow';
import { NodeConnectionType, NodeOperationError } from 'n8n-workflow';

const industries: INodePropertyOptions[] = [
	{ name: 'General', value: '' },
	{ name: 'Healthcare', value: 'healthcare' },
	{ name: 'Technology', value: 'technology' },
	{ name: 'Gaming', value: 'gaming' },
	{ name: 'Finance', value: 'finance' },
	{ name: 'Restaurant', value: 'restaurant' },
	{ name: 'Automotive', value: 'automotive' },
	{ name: 'Real Estate', value: 'real_estate' },
	{ name: 'Fitness', value: 'fitness' },
	{ name: 'Education', value: 'education' },
	{ name: 'Retail', value: 'retail' },
];

export class MarloSentiment implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Marlo Sentiment',
		name: 'marloSentiment',
		icon: 'file:marlo.svg',
		group: ['input'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Analyze text sentiment using Marlo AI',
		defaults: {
			name: 'Marlo Sentiment',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'marloSentimentApi',
				required: true,
			},
		],
		usableAsTool: true,
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Analyze Sentiment',
						value: 'analyze',
						description: 'Analyze the sentiment of text',
						action: 'Analyze text sentiment',
					},
				],
				default: 'analyze',
			},
			{
				displayName: 'Text',
				name: 'text',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				default: '',
				placeholder: 'Enter the text to analyze...',
				description: 'The text content to analyze for sentiment',
				required: true,
			},
			{
				displayName: 'Industry',
				name: 'industry',
				type: 'options',
				options: industries,
				default: '',
				description: 'Industry context for more accurate sentiment analysis',
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				options: [
					{
						displayName: 'Include Raw Scores',
						name: 'includeRawScores',
						type: 'boolean',
						default: false,
						description: 'Whether to include detailed sentiment scores in the output',
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const credentials = await this.getCredentials('marloSentimentApi');
		const rapidApiKey = credentials.apiKey as string;
		const rapidApiHost = credentials.rapidApiHost as string;

		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			try {
				const operation = this.getNodeParameter('operation', itemIndex) as string;
				const text = this.getNodeParameter('text', itemIndex) as string;
				const industry = this.getNodeParameter('industry', itemIndex) as string;
				const additionalFields = this.getNodeParameter('additionalFields', itemIndex) as {
					includeRawScores?: boolean;
				};

				if (operation === 'analyze') {
					if (!text || text.trim() === '') {
						throw new NodeOperationError(
							this.getNode(),
							'Text parameter is required and cannot be empty',
							{ itemIndex },
						);
					}

					if (text.length > 5000) {
						throw new NodeOperationError(
							this.getNode(),
							'Text cannot exceed 5000 characters',
							{ itemIndex },
						);
					}

					const requestBody: any = {
						text: text.trim(),
						industry: industry || 'general',
					};

					const options = {
						method: 'POST' as const,
						url: `https://${rapidApiHost}/analyze`,
						headers: {
							'Content-Type': 'application/json',
							'X-RapidAPI-Key': rapidApiKey,
							'X-RapidAPI-Host': rapidApiHost,
						},
						body: requestBody,
						json: true,
					};

					const response = await this.helpers.request(options);

					let outputData: any = {
						sentiment: response.sentiment,
						confidence: response.confidence,
						text_length: response.text_length,
						original_text: text,
					};

					if (industry) {
						outputData.industry = response.industry || industry;
					}

					if (additionalFields.includeRawScores && response.scores) {
						outputData.scores = response.scores;
					}

					returnData.push({
						json: outputData,
						pairedItem: itemIndex,
					});
				}
			} catch (error) {
				if (this.continueOnFail()) {
					const executionErrorData = this.helpers.constructExecutionMetaData(
						[{ json: { error: error.message } }],
						{ itemData: { item: itemIndex } },
					);
					returnData.push(...executionErrorData);
				} else {
					if (error.context) {
						error.context.itemIndex = itemIndex;
						throw error;
					}
					throw new NodeOperationError(this.getNode(), error, {
						itemIndex,
					});
				}
			}
		}

		return [returnData];
	}
}