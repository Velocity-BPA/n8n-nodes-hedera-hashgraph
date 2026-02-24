import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class HederaHashgraphApi implements ICredentialType {
	name = 'hederaHashgraphApi';
	displayName = 'Hedera Hashgraph API';
	properties: INodeProperties[] = [
		{
			displayName: 'Environment',
			name: 'environment',
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
			description: 'The Hedera network environment to connect to',
		},
		{
			displayName: 'Mirror Node URL',
			name: 'mirrorNodeUrl',
			type: 'string',
			default: 'https://mainnet-public.mirrornode.hedera.com/api/v1',
			description: 'Base URL for the Hedera Mirror Node API',
		},
		{
			displayName: 'Account ID',
			name: 'accountId',
			type: 'string',
			default: '',
			placeholder: '0.0.123456',
			description: 'Your Hedera account ID (required for transaction operations)',
		},
		{
			displayName: 'Private Key',
			name: 'privateKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			description: 'Your Hedera account private key (required for transaction operations)',
		},
		{
			displayName: 'Public Key',
			name: 'publicKey',
			type: 'string',
			default: '',
			description: 'Your Hedera account public key (optional, derived from private key if not provided)',
		},
	];
}