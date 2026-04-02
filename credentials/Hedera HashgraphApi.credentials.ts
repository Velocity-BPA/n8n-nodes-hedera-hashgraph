import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class HederaHashgraphApi implements ICredentialType {
	name = 'hederaHashgraphApi';
	displayName = 'Hedera Hashgraph API';
	documentationUrl = 'https://docs.hedera.com/hedera/';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			description: 'API key for Hedera network authentication (required for transaction submission)',
			required: false,
		},
		{
			displayName: 'API Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://mainnet-public.mirrornode.hedera.com/api/v1',
			description: 'Base URL for Hedera Mirror Node API',
			required: true,
		},
		{
			displayName: 'Network',
			name: 'network',
			type: 'options',
			options: [
				{
					name: 'Mainnet',
					value: 'mainnet',
				},
				{
					name: 'Testnet',
					value: 'testnet',
				},
				{
					name: 'Previewnet',
					value: 'previewnet',
				},
			],
			default: 'mainnet',
			description: 'Hedera network to connect to',
		},
	];
}