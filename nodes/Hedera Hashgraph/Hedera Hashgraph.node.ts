/**
 * Copyright (c) 2026 Velocity BPA
 * 
 * Licensed under the Business Source License 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     https://github.com/VelocityBPA/n8n-nodes-hederahashgraph/blob/main/LICENSE
 * 
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
  NodeApiError,
} from 'n8n-workflow';

import { Client, AccountId, PrivateKey, TokenCreateTransaction, TokenUpdateTransaction, TokenDeleteTransaction, TokenAssociateTransaction, TransferTransaction, Hbar } from '@hashgraph/sdk';

export class HederaHashgraph implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Hedera Hashgraph',
    name: 'hederahashgraph',
    icon: 'file:hederahashgraph.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with the Hedera Hashgraph API',
    defaults: {
      name: 'Hedera Hashgraph',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'hederahashgraphApi',
        required: true,
      },
    ],
    properties: [
      // Resource selector
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Account',
            value: 'account',
          },
          {
            name: 'Accounts',
            value: 'accounts',
          },
          {
            name: 'Transaction',
            value: 'transaction',
          },
          {
            name: 'Transactions',
            value: 'transactions',
          },
          {
            name: 'Token',
            value: 'token',
          },
          {
            name: 'Tokens',
            value: 'tokens',
          },
          {
            name: 'Nfts',
            value: 'nfts',
          },
          {
            name: 'Topics',
            value: 'topics',
          },
          {
            name: 'TopicMessage',
            value: 'topicMessage',
          },
          {
            name: 'Schedule',
            value: 'schedule',
          },
          {
            name: 'Schedules',
            value: 'schedules',
          },
          {
            name: 'Contract',
            value: 'contract',
          }
        ],
        default: 'account',
      },
      // Operation dropdowns per resource
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['account'] } },
  options: [
    { name: 'Get All Accounts', value: 'getAllAccounts', description: 'Get list of accounts on network', action: 'Get all accounts' },
    { name: 'Get Account', value: 'getAccount', description: 'Get specific account information', action: 'Get an account' },
    { name: 'Get Account Transactions', value: 'getAccountTransactions', description: 'Get transactions for account', action: 'Get account transactions' },
    { name: 'Get Account Tokens', value: 'getAccountTokens', description: 'Get token balances for account', action: 'Get account tokens' }
  ],
  default: 'getAllAccounts',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['accounts'],
    },
  },
  options: [
    {
      name: 'Get Accounts',
      value: 'getAccounts',
      description: 'Get list of accounts',
      action: 'Get list of accounts',
    },
    {
      name: 'Get Account',
      value: 'getAccount',
      description: 'Get specific account details',
      action: 'Get account details',
    },
    {
      name: 'Get Account Transactions',
      value: 'getAccountTransactions',
      description: 'Get account transaction history',
      action: 'Get account transactions',
    },
    {
      name: 'Get Account Balances',
      value: 'getAccountBalances',
      description: 'Get account balance history',
      action: 'Get account balances',
    },
    {
      name: 'Submit Transaction',
      value: 'submitTransaction',
      description: 'Submit HBAR transfer transaction',
      action: 'Submit transaction',
    },
  ],
  default: 'getAccounts',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['transaction'] } },
  options: [
    { name: 'Get All Transactions', value: 'getAllTransactions', description: 'Get list of transactions', action: 'Get all transactions' },
    { name: 'Get Transaction', value: 'getTransaction', description: 'Get specific transaction details', action: 'Get a transaction' },
    { name: 'Submit Transaction', value: 'submitTransaction', description: 'Submit signed transaction to network', action: 'Submit a transaction' }
  ],
  default: 'getAllTransactions',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['transactions'],
    },
  },
  options: [
    {
      name: 'Get Transactions',
      value: 'getTransactions',
      description: 'Get a list of transactions',
      action: 'Get transactions',
    },
    {
      name: 'Get Transaction',
      value: 'getTransaction',
      description: 'Get specific transaction details',
      action: 'Get transaction details',
    },
    {
      name: 'Get Transaction State Proof',
      value: 'getTransactionStateProof',
      description: 'Get transaction state proof',
      action: 'Get transaction state proof',
    },
    {
      name: 'Submit Transaction',
      value: 'submitTransaction',
      description: 'Submit a signed transaction to the network',
      action: 'Submit transaction',
    },
    {
      name: 'Get Account Transactions',
      value: 'getAccountTransactions',
      description: 'Get transactions for a specific account',
      action: 'Get account transactions',
    },
  ],
  default: 'getTransactions',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['token'] } },
  options: [
    { name: 'Get All Tokens', value: 'getAllTokens', description: 'Get list of tokens on network', action: 'Get all tokens' },
    { name: 'Get Token', value: 'getToken', description: 'Get specific token information', action: 'Get token' },
    { name: 'Get Token Balances', value: 'getTokenBalances', description: 'Get token holder balances', action: 'Get token balances' },
    { name: 'Get Token NFTs', value: 'getTokenNfts', description: 'Get NFTs for token', action: 'Get token NFTs' }
  ],
  default: 'getAllTokens',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['tokens'],
    },
  },
  options: [
    {
      name: 'Get Tokens',
      value: 'getTokens',
      description: 'Get list of all tokens',
      action: 'Get list of all tokens',
    },
    {
      name: 'Get Token',
      value: 'getToken',
      description: 'Get specific token details',
      action: 'Get specific token details',
    },
    {
      name: 'Get Token Balances',
      value: 'getTokenBalances',
      description: 'Get token balance distribution',
      action: 'Get token balance distribution',
    },
    {
      name: 'Create Token',
      value: 'createToken',
      description: 'Create new token',
      action: 'Create new token',
    },
    {
      name: 'Update Token',
      value: 'updateToken',
      description: 'Update token properties',
      action: 'Update token properties',
    },
    {
      name: 'Delete Token',
      value: 'deleteToken',
      description: 'Delete token',
      action: 'Delete token',
    },
    {
      name: 'Associate Token',
      value: 'associateToken',
      description: 'Associate token with account',
      action: 'Associate token with account',
    },
    {
      name: 'Transfer Token',
      value: 'transferToken',
      description: 'Transfer tokens between accounts',
      action: 'Transfer tokens between accounts',
    },
  ],
  default: 'getTokens',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['nfts'],
    },
  },
  options: [
    {
      name: 'Get NFTs for Token',
      value: 'getNfts',
      description: 'Get all NFTs for a specific token',
      action: 'Get NFTs for token',
    },
    {
      name: 'Get Specific NFT',
      value: 'getNft',
      description: 'Get details of a specific NFT by serial number',
      action: 'Get specific NFT',
    },
    {
      name: 'Get Account NFTs',
      value: 'getAccountNfts',
      description: 'Get all NFTs owned by an account',
      action: 'Get account NFTs',
    },
    {
      name: 'Mint NFT',
      value: 'mintNft',
      description: 'Mint a new NFT',
      action: 'Mint NFT',
    },
    {
      name: 'Transfer NFT',
      value: 'transferNft',
      description: 'Transfer NFT ownership to another account',
      action: 'Transfer NFT',
    },
    {
      name: 'Burn NFT',
      value: 'burnNft',
      description: 'Burn/destroy an NFT',
      action: 'Burn NFT',
    },
    {
      name: 'Update NFT Metadata',
      value: 'updateNftMetadata',
      description: 'Update metadata of an existing NFT',
      action: 'Update NFT metadata',
    },
  ],
  default: 'getNfts',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['topics'],
    },
  },
  options: [
    {
      name: 'Get Topics',
      value: 'getTopics',
      description: 'Get list of consensus topics',
      action: 'Get topics',
    },
    {
      name: 'Get Topic',
      value: 'getTopic',
      description: 'Get specific topic details',
      action: 'Get topic details',
    },
    {
      name: 'Get Topic Messages',
      value: 'getTopicMessages',
      description: 'Get messages for a topic',
      action: 'Get topic messages',
    },
    {
      name: 'Get Topic Message',
      value: 'getTopicMessage',
      description: 'Get specific topic message by sequence number',
      action: 'Get topic message',
    },
    {
      name: 'Create Topic',
      value: 'createTopic',
      description: 'Create new consensus topic',
      action: 'Create topic',
    },
    {
      name: 'Update Topic',
      value: 'updateTopic',
      description: 'Update topic properties',
      action: 'Update topic',
    },
    {
      name: 'Delete Topic',
      value: 'deleteTopic',
      description: 'Delete consensus topic',
      action: 'Delete topic',
    },
    {
      name: 'Submit Message',
      value: 'submitMessage',
      description: 'Submit message to topic',
      action: 'Submit message',
    },
  ],
  default: 'getTopics',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['topicMessage'] } },
  options: [
    { name: 'Get Topic Messages', value: 'getTopicMessages', description: 'Get messages from a consensus topic', action: 'Get topic messages' },
    { name: 'Get Topic Message', value: 'getTopicMessage', description: 'Get a specific topic message by sequence number', action: 'Get topic message' },
    { name: 'Submit Topic Message', value: 'submitTopicMessage', description: 'Submit a message to a consensus topic', action: 'Submit topic message' }
  ],
  default: 'getTopicMessages',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['schedule'],
    },
  },
  options: [
    {
      name: 'Get All Schedules',
      value: 'getAllSchedules',
      description: 'Get list of scheduled transactions',
      action: 'Get all schedules',
    },
    {
      name: 'Get Schedule',
      value: 'getSchedule',
      description: 'Get specific scheduled transaction',
      action: 'Get a schedule',
    },
  ],
  default: 'getAllSchedules',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['schedules'],
    },
  },
  options: [
    {
      name: 'Get Schedules',
      value: 'getSchedules',
      description: 'Get list of scheduled transactions',
      action: 'Get list of scheduled transactions',
    },
    {
      name: 'Get Schedule',
      value: 'getSchedule',
      description: 'Get specific scheduled transaction',
      action: 'Get specific scheduled transaction',
    },
    {
      name: 'Create Schedule',
      value: 'createSchedule',
      description: 'Create new scheduled transaction',
      action: 'Create new scheduled transaction',
    },
    {
      name: 'Sign Schedule',
      value: 'signSchedule',
      description: 'Add signature to scheduled transaction',
      action: 'Add signature to scheduled transaction',
    },
    {
      name: 'Delete Schedule',
      value: 'deleteSchedule',
      description: 'Delete scheduled transaction',
      action: 'Delete scheduled transaction',
    },
  ],
  default: 'getSchedules',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['contract'],
		},
	},
	options: [
		{
			name: 'Get All Contracts',
			value: 'getAllContracts',
			description: 'Get list of smart contracts',
			action: 'Get all contracts',
		},
		{
			name: 'Get Contract',
			value: 'getContract',
			description: 'Get specific contract information',
			action: 'Get a contract',
		},
		{
			name: 'Get Contract Results',
			value: 'getContractResults',
			description: 'Get contract execution results',
			action: 'Get contract results',
		},
		{
			name: 'Get Contract Result',
			value: 'getContractResult',
			description: 'Get specific contract result',
			action: 'Get a contract result',
		},
	],
	default: 'getAllContracts',
},
// New API parameters
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  displayOptions: { show: { resource: ['account'], operation: ['getAllAccounts'] } },
  default: 25,
  description: 'Maximum number of accounts to return',
},
{
  displayName: 'Order',
  name: 'order',
  type: 'options',
  displayOptions: { show: { resource: ['account'], operation: ['getAllAccounts'] } },
  options: [
    { name: 'Ascending', value: 'asc' },
    { name: 'Descending', value: 'desc' }
  ],
  default: 'desc',
  description: 'Sort order for results',
},
{
  displayName: 'Account ID Filter',
  name: 'accountIdFilter',
  type: 'string',
  displayOptions: { show: { resource: ['account'], operation: ['getAllAccounts'] } },
  default: '',
  description: 'Filter accounts by ID (format: 0.0.123)',
  placeholder: '0.0.123',
},
{
  displayName: 'Account ID',
  name: 'accountId',
  type: 'string',
  displayOptions: { show: { resource: ['account'], operation: ['getAccount', 'getAccountTransactions', 'getAccountTokens'] } },
  required: true,
  default: '',
  description: 'The account identifier (format: 0.0.123)',
  placeholder: '0.0.123',
},
{
  displayName: 'Timestamp',
  name: 'timestamp',
  type: 'string',
  displayOptions: { show: { resource: ['account'], operation: ['getAccount', 'getAccountTransactions'] } },
  default: '',
  description: 'The timestamp for which to return data (format: seconds.nanoseconds)',
  placeholder: '1234567890.123456789',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  displayOptions: { show: { resource: ['account'], operation: ['getAccountTransactions', 'getAccountTokens'] } },
  default: 25,
  description: 'Maximum number of items to return',
},
{
  displayName: 'Order',
  name: 'order',
  type: 'options',
  displayOptions: { show: { resource: ['account'], operation: ['getAccountTransactions', 'getAccountTokens'] } },
  options: [
    { name: 'Ascending', value: 'asc' },
    { name: 'Descending', value: 'desc' }
  ],
  default: 'desc',
  description: 'Sort order for results',
},
{
  displayName: 'Transaction ID',
  name: 'transactionId',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['transaction'], operation: ['getTransaction'] } },
  default: '',
  description: 'The ID of the transaction to retrieve',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  displayOptions: { show: { resource: ['transaction'], operation: ['getAllTransactions'] } },
  default: 25,
  description: 'The maximum number of transactions to return',
  typeOptions: { minValue: 1, maxValue: 100 },
},
{
  displayName: 'Order',
  name: 'order',
  type: 'options',
  displayOptions: { show: { resource: ['transaction'], operation: ['getAllTransactions'] } },
  options: [
    { name: 'ASC', value: 'asc' },
    { name: 'DESC', value: 'desc' }
  ],
  default: 'desc',
  description: 'The order of transactions by timestamp',
},
{
  displayName: 'Timestamp',
  name: 'timestamp',
  type: 'string',
  displayOptions: { show: { resource: ['transaction'], operation: ['getAllTransactions'] } },
  default: '',
  description: 'The consensus timestamp in seconds.nanoseconds format',
},
{
  displayName: 'Account ID',
  name: 'accountId',
  type: 'string',
  displayOptions: { show: { resource: ['transaction'], operation: ['getAllTransactions'] } },
  default: '',
  description: 'Filter transactions by account ID (format: shard.realm.account)',
},
{
  displayName: 'Signed Transaction',
  name: 'signedTransaction',
  type: 'json',
  required: true,
  displayOptions: { show: { resource: ['transaction'], operation: ['submitTransaction'] } },
  default: '',
  description: 'The signed transaction in protobuf format (base64 encoded)',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  default: 25,
  description: 'Maximum number of tokens to return',
  displayOptions: { show: { resource: ['token'], operation: ['getAllTokens'] } },
},
{
  displayName: 'Order',
  name: 'order',
  type: 'options',
  options: [
    { name: 'Ascending', value: 'asc' },
    { name: 'Descending', value: 'desc' }
  ],
  default: 'asc',
  description: 'Sort order for results',
  displayOptions: { show: { resource: ['token'], operation: ['getAllTokens'] } },
},
{
  displayName: 'Token ID',
  name: 'tokenIdFilter',
  type: 'string',
  default: '',
  description: 'Filter by token ID',
  displayOptions: { show: { resource: ['token'], operation: ['getAllTokens'] } },
},
{
  displayName: 'Token ID',
  name: 'tokenId',
  type: 'string',
  required: true,
  default: '',
  description: 'The ID of the token to retrieve',
  displayOptions: { show: { resource: ['token'], operation: ['getToken'] } },
},
{
  displayName: 'Timestamp',
  name: 'timestamp',
  type: 'string',
  default: '',
  description: 'Timestamp to query token state at specific time',
  displayOptions: { show: { resource: ['token'], operation: ['getToken'] } },
},
{
  displayName: 'Token ID',
  name: 'tokenId',
  type: 'string',
  required: true,
  default: '',
  description: 'The ID of the token to get balances for',
  displayOptions: { show: { resource: ['token'], operation: ['getTokenBalances'] } },
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  default: 25,
  description: 'Maximum number of balance records to return',
  displayOptions: { show: { resource: ['token'], operation: ['getTokenBalances'] } },
},
{
  displayName: 'Order',
  name: 'order',
  type: 'options',
  options: [
    { name: 'Ascending', value: 'asc' },
    { name: 'Descending', value: 'desc' }
  ],
  default: 'asc',
  description: 'Sort order for balance results',
  displayOptions: { show: { resource: ['token'], operation: ['getTokenBalances'] } },
},
{
  displayName: 'Token ID',
  name: 'tokenId',
  type: 'string',
  required: true,
  default: '',
  description: 'The ID of the token to get NFTs for',
  displayOptions: { show: { resource: ['token'], operation: ['getTokenNfts'] } },
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  default: 25,
  description: 'Maximum number of NFTs to return',
  displayOptions: { show: { resource: ['token'], operation: ['getTokenNfts'] } },
},
{
  displayName: 'Order',
  name: 'order',
  type: 'options',
  options: [
    { name: 'Ascending', value: 'asc' },
    { name: 'Descending', value: 'desc' }
  ],
  default: 'asc',
  description: 'Sort order for NFT results',
  displayOptions: { show: { resource: ['token'], operation: ['getTokenNfts'] } },
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['schedule'],
      operation: ['getAllSchedules'],
    },
  },
  default: 25,
  description: 'The maximum number of schedules to return',
  typeOptions: {
    minValue: 1,
    maxValue: 100,
  },
},
{
  displayName: 'Order',
  name: 'order',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['schedule'],
      operation: ['getAllSchedules'],
    },
  },
  options: [
    {
      name: 'ASC',
      value: 'asc',
    },
    {
      name: 'DESC',
      value: 'desc',
    },
  ],
  default: 'desc',
  description: 'The order to return results',
},
{
  displayName: 'Schedule ID',
  name: 'scheduleIdFilter',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['schedule'],
      operation: ['getAllSchedules'],
    },
  },
  default: '',
  description: 'Filter by specific schedule ID',
},
{
  displayName: 'Schedule ID',
  name: 'scheduleId',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['schedule'],
      operation: ['getSchedule'],
    },
  },
  default: '',
  required: true,
  description: 'The ID of the scheduled transaction to retrieve',
},
{
  displayName: 'Topic ID',
  name: 'topicId',
  type: 'string',
  required: true,
  displayOptions: { 
    show: { 
      resource: ['topicMessage'], 
      operation: ['getTopicMessages', 'getTopicMessage', 'submitTopicMessage'] 
    } 
  },
  default: '',
  description: 'The topic ID (e.g., 0.0.123456)',
},
{
  displayName: 'Message',
  name: 'message',
  type: 'string',
  required: true,
  displayOptions: { 
    show: { 
      resource: ['topicMessage'], 
      operation: ['submitTopicMessage'] 
    } 
  },
  default: '',
  description: 'The message content to submit to the topic',
},
{
  displayName: 'Sequence Number',
  name: 'sequenceNumber',
  type: 'number',
  required: true,
  displayOptions: { 
    show: { 
      resource: ['topicMessage'], 
      operation: ['getTopicMessage'] 
    } 
  },
  default: 1,
  description: 'The sequence number of the specific message to retrieve',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  displayOptions: { 
    show: { 
      resource: ['topicMessage'], 
      operation: ['getTopicMessages'] 
    } 
  },
  default: 25,
  description: 'The maximum number of messages to return (default: 25)',
},
{
  displayName: 'Order',
  name: 'order',
  type: 'options',
  options: [
    { name: 'Ascending', value: 'asc' },
    { name: 'Descending', value: 'desc' }
  ],
  displayOptions: { 
    show: { 
      resource: ['topicMessage'], 
      operation: ['getTopicMessages'] 
    } 
  },
  default: 'desc',
  description: 'The order of returned messages',
},
{
  displayName: 'Timestamp',
  name: 'timestamp',
  type: 'string',
  displayOptions: { 
    show: { 
      resource: ['topicMessage'], 
      operation: ['getTopicMessages'] 
    } 
  },
  default: '',
  description: 'Filter messages by timestamp (e.g., gte:1234567890.123456789)',
},
{
  displayName: 'Sequence Number Filter',
  name: 'sequenceNumberFilter',
  type: 'string',
  displayOptions: { 
    show: { 
      resource: ['topicMessage'], 
      operation: ['getTopicMessages'] 
    } 
  },
  default: '',
  description: 'Filter messages by sequence number (e.g., gte:100)',
},
{
	displayName: 'Contract ID',
	name: 'contractId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['contract'],
			operation: ['getContract'],
		},
	},
	default: '',
	description: 'The ID of the contract to retrieve',
},
{
	displayName: 'Transaction ID',
	name: 'transactionId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['contract'],
			operation: ['getContractResult'],
		},
	},
	default: '',
	description: 'The transaction ID of the contract result to retrieve',
},
{
	displayName: 'Limit',
	name: 'limit',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['contract'],
			operation: ['getAllContracts', 'getContractResults'],
		},
	},
	default: 25,
	description: 'Maximum number of contracts to return',
	typeOptions: {
		minValue: 1,
		maxValue: 100,
	},
},
{
	displayName: 'Order',
	name: 'order',
	type: 'options',
	options: [
		{
			name: 'Ascending',
			value: 'asc',
		},
		{
			name: 'Descending',
			value: 'desc',
		},
	],
	displayOptions: {
		show: {
			resource: ['contract'],
			operation: ['getAllContracts', 'getContractResults'],
		},
	},
	default: 'desc',
	description: 'The order to sort results',
},
{
	displayName: 'Contract Filter ID',
	name: 'contractFilterId',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['contract'],
			operation: ['getAllContracts'],
		},
	},
	default: '',
	description: 'Filter contracts by contract ID',
},
{
	displayName: 'Timestamp',
	name: 'timestamp',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['contract'],
			operation: ['getContractResults'],
		},
	},
	default: '',
	description: 'Filter results by timestamp (format: seconds.nanoseconds)',
},
      // Preserve existing parameters
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['accounts'],
      operation: ['getAccounts'],
    },
  },
  default: 25,
  description: 'Maximum number of accounts to return (1-100)',
  typeOptions: {
    minValue: 1,
    maxValue: 100,
  },
},
{
  displayName: 'Order',
  name: 'order',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['accounts'],
      operation: ['getAccounts'],
    },
  },
  options: [
    {
      name: 'Ascending',
      value: 'asc',
    },
    {
      name: 'Descending',
      value: 'desc',
    },
  ],
  default: 'asc',
  description: 'Order of results',
},
{
  displayName: 'Account ID',
  name: 'accountIdFilter',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['accounts'],
      operation: ['getAccounts'],
    },
  },
  default: '',
  description: 'Filter by specific account ID (optional)',
},
{
  displayName: 'Account ID',
  name: 'accountId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['accounts'],
      operation: ['getAccount', 'getAccountTransactions', 'getAccountBalances'],
    },
  },
  default: '',
  description: 'The account ID (format: 0.0.xxxxx)',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['accounts'],
      operation: ['getAccountTransactions'],
    },
  },
  default: 25,
  description: 'Maximum number of transactions to return (1-100)',
  typeOptions: {
    minValue: 1,
    maxValue: 100,
  },
},
{
  displayName: 'Order',
  name: 'order',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['accounts'],
      operation: ['getAccountTransactions'],
    },
  },
  options: [
    {
      name: 'Ascending',
      value: 'asc',
    },
    {
      name: 'Descending',
      value: 'desc',
    },
  ],
  default: 'desc',
  description: 'Order of results',
},
{
  displayName: 'Timestamp',
  name: 'timestamp',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['accounts'],
      operation: ['getAccountTransactions', 'getAccountBalances'],
    },
  },
  default: '',
  description: 'Filter by timestamp (format: YYYY-MM-DDTHH:mm:ss.sssZ) (optional)',
},
{
  displayName: 'Signed Transaction',
  name: 'signedTransaction',
  type: 'json',
  required: true,
  displayOptions: {
    show: {
      resource: ['accounts'],
      operation: ['submitTransaction'],
    },
  },
  default: '',
  description: 'The signed transaction bytes (base64 encoded)',
  typeOptions: {
    rows: 4,
  },
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['tokens'],
      operation: ['getTokens'],
    },
  },
  default: 25,
  description: 'Maximum number of tokens to return',
},
{
  displayName: 'Order',
  name: 'order',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['tokens'],
      operation: ['getTokens'],
    },
  },
  options: [
    {
      name: 'Ascending',
      value: 'asc',
    },
    {
      name: 'Descending',
      value: 'desc',
    },
  ],
  default: 'desc',
  description: 'Order of results',
},
{
  displayName: 'Token ID',
  name: 'tokenId',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['tokens'],
      operation: ['getTokens', 'getToken', 'getTokenBalances'],
    },
  },
  default: '',
  description: 'Token ID to filter or retrieve',
},
{
  displayName: 'Type',
  name: 'type',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['tokens'],
      operation: ['getTokens'],
    },
  },
  options: [
    {
      name: 'All',
      value: 'all',
    },
    {
      name: 'Fungible',
      value: 'FUNGIBLE_COMMON',
    },
    {
      name: 'Non-Fungible',
      value: 'NON_FUNGIBLE_UNIQUE',
    },
  ],
  default: 'all',
  description: 'Type of tokens to retrieve',
},
{
  displayName: 'Account ID',
  name: 'accountId',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['tokens'],
      operation: ['getTokenBalances'],
    },
  },
  default: '',
  description: 'Filter balances by specific account ID',
},
{
  displayName: 'Token Name',
  name: 'tokenName',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['tokens'],
      operation: ['createToken'],
    },
  },
  default: '',
  description: 'Name of the token to create',
},
{
  displayName: 'Token Symbol',
  name: 'tokenSymbol',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['tokens'],
      operation: ['createToken'],
    },
  },
  default: '',
  description: 'Symbol of the token to create',
},
{
  displayName: 'Decimals',
  name: 'decimals',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['tokens'],
      operation: ['createToken'],
    },
  },
  default: 0,
  description: 'Number of decimal places for the token (0 for NFTs)',
},
{
  displayName: 'Initial Supply',
  name: 'initialSupply',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['tokens'],
      operation: ['createToken'],
    },
  },
  default: 0,
  description: 'Initial supply of tokens (0 for NFTs)',
},
{
  displayName: 'Treasury Account ID',
  name: 'treasuryAccountId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['tokens'],
      operation: ['createToken'],
    },
  },
  default: '',
  description: 'Treasury account ID that will hold the initial supply',
},
{
  displayName: 'Admin Private Key',
  name: 'adminKey',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['tokens'],
      operation: ['createToken', 'updateToken', 'deleteToken'],
    },
  },
  default: '',
  description: 'Private key for token administration',
},
{
  displayName: 'Account Private Key',
  name: 'accountKey',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['tokens'],
      operation: ['associateToken', 'transferToken'],
    },
  },
  default: '',
  description: 'Private key of the account performing the operation',
},
{
  displayName: 'Target Account ID',
  name: 'targetAccountId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['tokens'],
      operation: ['associateToken'],
    },
  },
  default: '',
  description: 'Account ID to associate the token with',
},
{
  displayName: 'From Account ID',
  name: 'fromAccountId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['tokens'],
      operation: ['transferToken'],
    },
  },
  default: '',
  description: 'Account ID to transfer tokens from',
},
{
  displayName: 'To Account ID',
  name: 'toAccountId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['tokens'],
      operation: ['transferToken'],
    },
  },
  default: '',
  description: 'Account ID to transfer tokens to',
},
{
  displayName: 'Amount',
  name: 'amount',
  type: 'number',
  required: true,
  displayOptions: {
    show: {
      resource: ['tokens'],
      operation: ['transferToken'],
    },
  },
  default: 0,
  description: 'Amount of tokens to transfer',
},
{
  displayName: 'Memo',
  name: 'memo',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['tokens'],
      operation: ['createToken', 'updateToken', 'deleteToken', 'associateToken', 'transferToken'],
    },
  },
  default: '',
  description: 'Optional memo for the transaction',
},
{
  displayName: 'Token ID',
  name: 'tokenId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['nfts'],
      operation: ['getNfts', 'getNft'],
    },
  },
  default: '',
  description: 'The token ID to get NFTs for',
},
{
  displayName: 'Serial Number',
  name: 'serialNumber',
  type: 'number',
  required: true,
  displayOptions: {
    show: {
      resource: ['nfts'],
      operation: ['getNft'],
    },
  },
  default: 1,
  description: 'The serial number of the specific NFT',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['nfts'],
      operation: ['getNfts', 'getAccountNfts'],
    },
  },
  default: 25,
  description: 'Maximum number of results to return',
},
{
  displayName: 'Order',
  name: 'order',
  type: 'options',
  options: [
    {
      name: 'Ascending',
      value: 'asc',
    },
    {
      name: 'Descending',
      value: 'desc',
    },
  ],
  displayOptions: {
    show: {
      resource: ['nfts'],
      operation: ['getNfts'],
    },
  },
  default: 'asc',
  description: 'The order of results',
},
{
  displayName: 'Account ID',
  name: 'accountId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['nfts'],
      operation: ['getAccountNfts'],
    },
  },
  default: '',
  description: 'The account ID to get NFTs for',
},
{
  displayName: 'Filter Token ID',
  name: 'filterTokenId',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['nfts'],
      operation: ['getAccountNfts'],
    },
  },
  default: '',
  description: 'Filter NFTs by specific token ID',
},
{
  displayName: 'Signed Transaction',
  name: 'signedTransaction',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['nfts'],
      operation: ['mintNft', 'transferNft', 'burnNft', 'updateNftMetadata'],
    },
  },
  default: '',
  description: 'The signed transaction bytes in hex format',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['topics'],
      operation: ['getTopics', 'getTopicMessages'],
    },
  },
  default: 25,
  description: 'Maximum number of results to return',
},
{
  displayName: 'Order',
  name: 'order',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['topics'],
      operation: ['getTopics', 'getTopicMessages'],
    },
  },
  options: [
    {
      name: 'Ascending',
      value: 'asc',
    },
    {
      name: 'Descending',
      value: 'desc',
    },
  ],
  default: 'desc',
  description: 'Order of results',
},
{
  displayName: 'Topic ID',
  name: 'topicId',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['topics'],
      operation: ['getTopics'],
    },
  },
  default: '',
  description: 'Filter by specific topic ID',
},
{
  displayName: 'Topic ID',
  name: 'topicId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['topics'],
      operation: ['getTopic', 'getTopicMessages', 'getTopicMessage'],
    },
  },
  default: '',
  description: 'The topic ID to query',
},
{
  displayName: 'Timestamp',
  name: 'timestamp',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['topics'],
      operation: ['getTopicMessages'],
    },
  },
  default: '',
  description: 'Filter messages by timestamp (format: seconds.nanoseconds)',
},
{
  displayName: 'Sequence Number',
  name: 'sequenceNumber',
  type: 'number',
  required: true,
  displayOptions: {
    show: {
      resource: ['topics'],
      operation: ['getTopicMessage'],
    },
  },
  default: 1,
  description: 'The sequence number of the message',
},
{
  displayName: 'Signed Transaction',
  name: 'signedTransaction',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['topics'],
      operation: ['createTopic', 'updateTopic', 'deleteTopic', 'submitMessage'],
    },
  },
  default: '',
  description: 'The signed transaction in hex format',
},
{
  displayName: 'Admin Key',
  name: 'adminKey',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['topics'],
      operation: ['createTopic'],
    },
  },
  default: '',
  description: 'The admin key for the topic (optional)',
},
{
  displayName: 'Submit Key',
  name: 'submitKey',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['topics'],
      operation: ['createTopic'],
    },
  },
  default: '',
  description: 'The submit key for the topic (optional)',
},
{
  displayName: 'Topic Memo',
  name: 'topicMemo',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['topics'],
      operation: ['createTopic', 'updateTopic'],
    },
  },
  default: '',
  description: 'The memo for the topic (optional)',
},
{
  displayName: 'Message',
  name: 'message',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['topics'],
      operation: ['submitMessage'],
    },
  },
  default: '',
  description: 'The message content to submit',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['transactions'],
      operation: ['getTransactions', 'getAccountTransactions'],
    },
  },
  default: 25,
  description: 'Maximum number of transactions to return',
},
{
  displayName: 'Order',
  name: 'order',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['transactions'],
      operation: ['getTransactions', 'getAccountTransactions'],
    },
  },
  options: [
    {
      name: 'Ascending',
      value: 'asc',
    },
    {
      name: 'Descending',
      value: 'desc',
    },
  ],
  default: 'desc',
  description: 'Sort order for transactions',
},
{
  displayName: 'Account ID',
  name: 'accountId',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['transactions'],
      operation: ['getTransactions'],
    },
  },
  default: '',
  description: 'Filter by account ID (format: 0.0.xxxxx)',
},
{
  displayName: 'Timestamp',
  name: 'timestamp',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['transactions'],
      operation: ['getTransactions'],
    },
  },
  default: '',
  description: 'Filter by timestamp (format: gte:1234567890.123456789)',
},
{
  displayName: 'Transaction Type',
  name: 'transactionType',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['transactions'],
      operation: ['getTransactions'],
    },
  },
  default: '',
  description: 'Filter by transaction type (e.g., CRYPTOTRANSFER, TOKENCREATION)',
},
{
  displayName: 'Transaction ID',
  name: 'transactionId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['transactions'],
      operation: ['getTransaction', 'getTransactionStateProof'],
    },
  },
  default: '',
  description: 'The transaction ID to retrieve (format: 0.0.xxxxx-1234567890-123456789)',
},
{
  displayName: 'Signed Transaction',
  name: 'signedTransaction',
  type: 'json',
  required: true,
  displayOptions: {
    show: {
      resource: ['transactions'],
      operation: ['submitTransaction'],
    },
  },
  default: '',
  description: 'The signed transaction in base64 format',
},
{
  displayName: 'Account ID',
  name: 'accountId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['transactions'],
      operation: ['getAccountTransactions'],
    },
  },
  default: '',
  description: 'The account ID to get transactions for (format: 0.0.xxxxx)',
},
{
  displayName: 'Transaction Type',
  name: 'type',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['transactions'],
      operation: ['getAccountTransactions'],
    },
  },
  default: '',
  description: 'Filter by transaction type (e.g., CRYPTOTRANSFER, TOKENCREATION)',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['schedules'],
      operation: ['getSchedules'],
    },
  },
  default: 25,
  description: 'Maximum number of schedules to return',
},
{
  displayName: 'Order',
  name: 'order',
  type: 'options',
  options: [
    {
      name: 'ASC',
      value: 'asc',
    },
    {
      name: 'DESC',
      value: 'desc',
    },
  ],
  displayOptions: {
    show: {
      resource: ['schedules'],
      operation: ['getSchedules'],
    },
  },
  default: 'desc',
  description: 'Order of results',
},
{
  displayName: 'Schedule ID',
  name: 'scheduleId',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['schedules'],
      operation: ['getSchedules'],
    },
  },
  default: '',
  description: 'Filter by specific schedule ID',
},
{
  displayName: 'Schedule ID',
  name: 'scheduleId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['schedules'],
      operation: ['getSchedule'],
    },
  },
  default: '',
  description: 'The ID of the scheduled transaction to retrieve',
},
{
  displayName: 'Signed Transaction',
  name: 'signedTransaction',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['schedules'],
      operation: ['createSchedule'],
    },
  },
  default: '',
  description: 'Base64 encoded signed transaction bytes for creating a schedule',
},
{
  displayName: 'Signed Transaction',
  name: 'signedTransaction',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['schedules'],
      operation: ['signSchedule'],
    },
  },
  default: '',
  description: 'Base64 encoded signed transaction bytes for signing a schedule',
},
{
  displayName: 'Signed Transaction',
  name: 'signedTransaction',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['schedules'],
      operation: ['deleteSchedule'],
    },
  },
  default: '',
  description: 'Base64 encoded signed transaction bytes for deleting a schedule',
},
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const resource = this.getNodeParameter('resource', 0) as string;

    switch (resource) {
      case 'account':
        return [await executeAccountOperations.call(this, items)];
      case 'accounts':
        return [await executeAccountsOperations.call(this, items)];
      case 'transaction':
        return [await executeTransactionOperations.call(this, items)];
      case 'transactions':
        return [await executeTransactionsOperations.call(this, items)];
      case 'token':
        return [await executeTokenOperations.call(this, items)];
      case 'tokens':
        return [await executeTokensOperations.call(this, items)];
      case 'nfts':
        return [await executeNftsOperations.call(this, items)];
      case 'topics':
        return [await executeTopicsOperations.call(this, items)];
      case 'topicMessage':
        return [await executeTopicMessageOperations.call(this, items)];
      case 'schedule':
        return [await executeScheduleOperations.call(this, items)];
      case 'schedules':
        return [await executeSchedulesOperations.call(this, items)];
      case 'contract':
        return [await executeContractOperations.call(this, items)];
      default:
        throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not supported`);
    }
  }
}

// ============================================================
// Resource Handler Functions (New API)
// ============================================================

async function executeAccountOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('hederahashgraphApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      const baseUrl = credentials.baseUrl || 'https://mainnet-public.mirrornode.hedera.com/api/v1';

      switch (operation) {
        case 'getAllAccounts': {
          const limit = this.getNodeParameter('limit', i, 25) as number;
          const order = this.getNodeParameter('order', i, 'desc') as string;
          const accountIdFilter = this.getNodeParameter('accountIdFilter', i, '') as string;

          let url = `${baseUrl}/accounts?limit=${limit}&order=${order}`;
          if (accountIdFilter) {
            url += `&account.id=${accountIdFilter}`;
          }

          const options: any = {
            method: 'GET',
            url: url,
            headers: {
              'Content-Type': 'application/json',
            },
            json: true,
          };

          if (credentials.apiKey) {
            options.headers.Authorization = `Bearer ${credentials.apiKey}`;
          }

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getAccount': {
          const accountId = this.getNodeParameter('accountId', i) as string;
          const timestamp = this.getNodeParameter('timestamp', i, '') as string;

          let url = `${baseUrl}/accounts/${accountId}`;
          if (timestamp) {
            url += `?timestamp=${timestamp}`;
          }

          const options: any = {
            method: 'GET',
            url: url,
            headers: {
              'Content-Type': 'application/json',
            },
            json: true,
          };

          if (credentials.apiKey) {
            options.headers.Authorization = `Bearer ${credentials.apiKey}`;
          }

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getAccountTransactions': {
          const accountId = this.getNodeParameter('accountId', i) as string;
          const limit = this.getNodeParameter('limit', i, 25) as number;
          const order = this.getNodeParameter('order', i, 'desc') as string;
          const timestamp = this.getNodeParameter('timestamp', i, '') as string;

          let url = `${baseUrl}/accounts/${accountId}/transactions?limit=${limit}&order=${order}`;
          if (timestamp) {
            url += `&timestamp=${timestamp}`;
          }

          const options: any = {
            method: 'GET',
            url: url,
            headers: {
              'Content-Type': 'application/json',
            },
            json: true,
          };

          if (credentials.apiKey) {
            options.headers.Authorization = `Bearer ${credentials.apiKey}`;
          }

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getAccountTokens': {
          const accountId = this.getNodeParameter('accountId', i) as string;
          const limit = this.getNodeParameter('limit', i, 25) as number;
          const order = this.getNodeParameter('order', i, 'desc') as string;

          const url = `${baseUrl}/accounts/${accountId}/tokens?limit=${limit}&order=${order}`;

          const options: any = {
            method: 'GET',
            url: url,
            headers: {
              'Content-Type': 'application/json',
            },
            json: true,
          };

          if (credentials.apiKey) {
            options.headers.Authorization = `Bearer ${credentials.apiKey}`;
          }

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeTransactionOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCred