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
            name: 'Accounts',
            value: 'accounts',
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
            name: 'Transactions',
            value: 'transactions',
          },
          {
            name: 'Schedules',
            value: 'schedules',
          }
        ],
        default: 'accounts',
      },
      // Operation dropdowns per resource
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
      // Parameter definitions
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
      case 'accounts':
        return [await executeAccountsOperations.call(this, items)];
      case 'tokens':
        return [await executeTokensOperations.call(this, items)];
      case 'nfts':
        return [await executeNftsOperations.call(this, items)];
      case 'topics':
        return [await executeTopicsOperations.call(this, items)];
      case 'transactions':
        return [await executeTransactionsOperations.call(this, items)];
      case 'schedules':
        return [await executeSchedulesOperations.call(this, items)];
      default:
        throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not supported`);
    }
  }
}

// ============================================================
// Resource Handler Functions
// ============================================================

async function executeAccountsOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('hederahashgraphApi') as any;

  const baseUrl = credentials.baseUrl || 'https://mainnet-public.mirrornode.hedera.com/api/v1';

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'getAccounts': {
          const limit = this.getNodeParameter('limit', i, 25) as number;
          const order = this.getNodeParameter('order', i, 'asc') as string;
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

          const options: any = {
            method: 'GET',
            url: `${baseUrl}/accounts/${accountId}`,
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

        case 'getAccountBalances': {
          const accountId = this.getNodeParameter('accountId', i) as string;
          const timestamp = this.getNodeParameter('timestamp', i, '') as string;

          let url = `${baseUrl}/accounts/${accountId}/balances`;
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

        case 'submitTransaction': {
          const signedTransaction = this.getNodeParameter('signedTransaction', i) as any;

          let transactionBytes: string;
          if (typeof signedTransaction === 'string') {
            transactionBytes = signedTransaction;
          } else if (typeof signedTransaction === 'object' && signedTransaction.bytes) {
            transactionBytes = signedTransaction.bytes;
          } else {
            throw new NodeOperationError(
              this.getNode(),
              'Invalid signed transaction format. Expected base64 encoded transaction bytes.',
              { itemIndex: i }
            );
          }

          const options: any = {
            method: 'POST',
            url: `${baseUrl}/transactions`,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              signedTransactionBytes: transactionBytes,
            }),
            json: true,
          };

          if (credentials.apiKey) {
            options.headers.Authorization = `Bearer ${credentials.apiKey}`;
          }

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(
            this.getNode(),
            `Unknown operation: ${operation}`,
            { itemIndex: i }
          );
      }

      returnData.push({
        json: result,
        pairedItem: { item: i },
      });
    } catch (error: any) {
      if (this.continueOnFail()) {
        const errorMessage = error.cause?.body?.message || error.message || 'Unknown error occurred';
        returnData.push({
          json: { 
            error: errorMessage,
            statusCode: error.cause?.httpCode || error.statusCode,
            operation: operation 
          },
          pairedItem: { item: i },
        });
      } else {
        if (error.cause?.body?.message) {
          throw new NodeApiError(this.getNode(), error.cause.body, { 
            message: error.cause.body.message,
            httpCode: error.cause.httpCode?.toString() || '400',
            itemIndex: i 
          });
        }
        throw new NodeOperationError(this.getNode(), error.message, { itemIndex: i });
      }
    }
  }

  return returnData;
}

async function executeTokensOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('hederahashgraphApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'getTokens': {
          const limit = this.getNodeParameter('limit', i) as number;
          const order = this.getNodeParameter('order', i) as string;
          const tokenId = this.getNodeParameter('tokenId', i) as string;
          const type = this.getNodeParameter('type', i) as string;

          const params = new URLSearchParams();
          if (limit) params.append('limit', limit.toString());
          if (order) params.append('order', order);
          if (tokenId) params.append('token.id', tokenId);
          if (type !== 'all') params.append('type', type);

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/tokens?${params.toString()}`,
            headers: {
              'Accept': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getToken': {
          const tokenId = this.getNodeParameter('tokenId', i) as string;
          if (!tokenId) {
            throw new NodeOperationError(this.getNode(), 'Token ID is required');
          }

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/tokens/${tokenId}`,
            headers: {
              'Accept': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getTokenBalances': {
          const tokenId = this.getNodeParameter('tokenId', i) as string;
          if (!tokenId) {
            throw new NodeOperationError(this.getNode(), 'Token ID is required');
          }

          const accountId = this.getNodeParameter('accountId', i) as string;
          const limit = this.getNodeParameter('limit', i) as number;

          const params = new URLSearchParams();
          if (accountId) params.append('account.id', accountId);
          if (limit) params.append('limit', limit.toString());

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/tokens/${tokenId}/balances?${params.toString()}`,
            headers: {
              'Accept': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'createToken': {
          const tokenName = this.getNodeParameter('tokenName', i) as string;
          const tokenSymbol = this.getNodeParameter('tokenSymbol', i) as string;
          const decimals = this.getNodeParameter('decimals', i) as number;
          const initialSupply = this.getNodeParameter('initialSupply', i) as number;
          const treasuryAccountId = this.getNodeParameter('treasuryAccountId', i) as string;
          const adminKeyStr = this.getNodeParameter('adminKey', i) as string;
          const memo = this.getNodeParameter('memo', i) as string;

          const client = Client.forMainnet();
          const adminKey = PrivateKey.fromString(adminKeyStr);
          client.setOperator(AccountId.fromString(treasuryAccountId), adminKey);

          const tokenCreateTx = new TokenCreateTransaction()
            .setTokenName(tokenName)
            .setTokenSymbol(tokenSymbol)
            .setDecimals(decimals)
            .setInitialSupply(initialSupply)
            .setTreasuryAccountId(AccountId.fromString(treasuryAccountId))
            .setAdminKey(adminKey);

          if (memo) {
            tokenCreateTx.setTokenMemo(memo);
          }

          const txResponse = await tokenCreateTx.execute(client);
          const receipt = await txResponse.getReceipt(client);
          
          result = {
            transactionId: txResponse.transactionId?.toString(),
            tokenId: receipt.tokenId?.toString(),
            status: receipt.status.toString(),
          };
          break;
        }

        case 'updateToken': {
          const tokenId = this.getNodeParameter('tokenId', i) as string;
          const adminKeyStr = this.getNodeParameter('adminKey', i) as string;
          const memo = this.getNodeParameter('memo', i) as string;

          if (!tokenId) {
            throw new NodeOperationError(this.getNode(), 'Token ID is required');
          }

          const client = Client.forMainnet();
          const adminKey = PrivateKey.fromString(adminKeyStr);
          client.setOperator(adminKey.publicKey.toAccountId(0, 0, 2), adminKey);

          const tokenUpdateTx = new TokenUpdateTransaction()
            .setTokenId(tokenId);

          if (memo) {
            tokenUpdateTx.setTokenMemo(memo);
          }

          const txResponse = await tokenUpdateTx.execute(client);
          const receipt = await txResponse.getReceipt(client);

          result = {
            transactionId: txResponse.transactionId?.toString(),
            status: receipt.status.toString(),
          };
          break;
        }

        case 'deleteToken': {
          const tokenId = this.getNodeParameter('tokenId', i) as string;
          const adminKeyStr = this.getNodeParameter('adminKey', i) as string;

          if (!tokenId) {
            throw new NodeOperationError(this.getNode(), 'Token ID is required');
          }

          const client = Client.forMainnet();
          const adminKey = PrivateKey.fromString(adminKeyStr);
          client.setOperator(adminKey.publicKey.toAccountId(0, 0, 2), adminKey);

          const tokenDeleteTx = new TokenDeleteTransaction()
            .setTokenId(tokenId);

          const txResponse = await tokenDeleteTx.execute(client);
          const receipt = await txResponse.getReceipt(client);

          result = {
            transactionId: txResponse.transactionId?.toString(),
            status: receipt.status.toString(),
          };
          break;
        }

        case 'associateToken': {
          const tokenId = this.getNodeParameter('tokenId', i) as string;
          const targetAccountId = this.getNodeParameter('targetAccountId', i) as string;
          const accountKeyStr = this.getNodeParameter('accountKey', i) as string;

          if (!tokenId) {
            throw new NodeOperationError(this.getNode(), 'Token ID is required');
          }

          const client = Client.forMainnet();
          const accountKey = PrivateKey.fromString(accountKeyStr);
          client.setOperator(AccountId.fromString(targetAccountId), accountKey);

          const tokenAssociateTx = new TokenAssociateTransaction()
            .setAccountId(AccountId.fromString(targetAccountId))
            .setTokenIds([tokenId]);

          const txResponse = await tokenAssociateTx.execute(client);
          const receipt = await txResponse.getReceipt(client);

          result = {
            transactionId: txResponse.transactionId?.toString(),
            status: receipt.status.toString(),
          };
          break;
        }

        case 'transferToken': {
          const tokenId = this.getNodeParameter('tokenId', i) as string;
          const fromAccountId = this.getNodeParameter('fromAccountId', i) as string;
          const toAccountId = this.getNodeParameter('toAccountId', i) as string;
          const amount = this.getNodeParameter('amount', i) as number;
          const accountKeyStr = this.getNodeParameter('accountKey', i) as string;
          const memo = this.getNodeParameter('memo', i) as string;

          if (!tokenId) {
            throw new NodeOperationError(this.getNode(), 'Token ID is required');
          }

          const client = Client.forMainnet();
          const accountKey = PrivateKey.fromString(accountKeyStr);
          client.setOperator(AccountId.fromString(fromAccountId), accountKey);

          const transferTx = new TransferTransaction()
            .addTokenTransfer(tokenId, AccountId.fromString(fromAccountId), -amount)
            .addTokenTransfer(tokenId, AccountId.fromString(toAccountId), amount);

          if (memo) {
            transferTx.setTransactionMemo(memo);
          }

          const txResponse = await transferTx.execute(client);
          const receipt = await txResponse.getReceipt(client);

          result = {
            transactionId: txResponse.transactionId?.toString(),
            status: receipt.status.toString(),
          };
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
        throw new NodeApiError(this.getNode(), error);
      }
    }
  }

  return returnData;
}

async function executeNftsOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('hederahashgraphApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'getNfts': {
          const tokenId = this.getNodeParameter('tokenId', i) as string;
          const limit = this.getNodeParameter('limit', i, 25) as number;
          const order = this.getNodeParameter('order', i, 'asc') as string;
          const serialNumber = this.getNodeParameter('serialNumber', i, undefined) as number | undefined;

          let url = `${credentials.baseUrl}/tokens/${tokenId}/nfts?limit=${limit}&order=${order}`;
          if (serialNumber !== undefined) {
            url += `&serialnumber=${serialNumber}`;
          }

          const options: any = {
            method: 'GET',
            url,
            headers: {
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getNft': {
          const tokenId = this.getNodeParameter('tokenId', i) as string;
          const serialNumber = this.getNodeParameter('serialNumber', i) as number;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/tokens/${tokenId}/nfts/${serialNumber}`,
            headers: {
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getAccountNfts': {
          const accountId = this.getNodeParameter('accountId', i) as string;
          const limit = this.getNodeParameter('limit', i, 25) as number;
          const filterTokenId = this.getNodeParameter('filterTokenId', i, '') as string;

          let url = `${credentials.baseUrl}/accounts/${accountId}/nfts?limit=${limit}`;
          if (filterTokenId) {
            url += `&token.id=${filterTokenId}`;
          }

          const options: any = {
            method: 'GET',
            url,
            headers: {
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'mintNft': {
          const signedTransaction = this.getNodeParameter('signedTransaction', i) as string;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/transactions`,
            headers: {
              'Content-Type': 'application/json',
            },
            body: {
              signedTransaction,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'transferNft': {
          const signedTransaction = this.getNodeParameter('signedTransaction', i) as string;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/transactions`,
            headers: {
              'Content-Type': 'application/json',
            },
            body: {
              signedTransaction,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'burnNft': {
          const signedTransaction = this.getNodeParameter('signedTransaction', i) as string;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/transactions`,
            headers: {
              'Content-Type': 'application/json',
            },
            body: {
              signedTransaction,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'updateNftMetadata': {
          const signedTransaction = this.getNodeParameter('signedTransaction', i) as string;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/transactions`,
            headers: {
              'Content-Type': 'application/json',
            },
            body: {
              signedTransaction,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(
            this.getNode(),
            `Unknown operation: ${operation}`,
            { itemIndex: i }
          );
      }

      returnData.push({ json: result, pairedItem: { item: i } });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        throw new NodeApiError(this.getNode(), error, { itemIndex: i });
      }
    }
  }

  return returnData;
}

async function executeTopicsOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('hederahashgraphApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'getTopics': {
          const queryParams: any = {};
          const limit = this.getNodeParameter('limit', i, 25) as number;
          const order = this.getNodeParameter('order', i, 'desc') as string;
          const topicId = this.getNodeParameter('topicId', i, '') as string;

          if (limit) queryParams.limit = limit;
          if (order) queryParams.order = order;
          if (topicId) queryParams['topic.id'] = topicId;

          const queryString = new URLSearchParams(queryParams).toString();
          const url = `${credentials.baseUrl}/topics${queryString ? '?' + queryString : ''}`;

          const options: any = {
            method: 'GET',
            url,
            headers: {
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getTopic': {
          const topicId = this.getNodeParameter('topicId', i) as string;
          const url = `${credentials.baseUrl}/topics/${topicId}`;

          const options: any = {
            method: 'GET',
            url,
            headers: {
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getTopicMessages': {
          const topicId = this.getNodeParameter('topicId', i) as string;
          const queryParams: any = {};
          const limit = this.getNodeParameter('limit', i, 25) as number;
          const order = this.getNodeParameter('order', i, 'desc') as string;
          const timestamp = this.getNodeParameter('timestamp', i, '') as string;

          if (limit) queryParams.limit = limit;
          if (order) queryParams.order = order;
          if (timestamp) queryParams.timestamp = timestamp;

          const queryString = new URLSearchParams(queryParams).toString();
          const url = `${credentials.baseUrl}/topics/${topicId}/messages${queryString ? '?' + queryString : ''}`;

          const options: any = {
            method: 'GET',
            url,
            headers: {
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getTopicMessage': {
          const topicId = this.getNodeParameter('topicId', i) as string;
          const sequenceNumber = this.getNodeParameter('sequenceNumber', i) as number;
          const url = `${credentials.baseUrl}/topics/${topicId}/messages/${sequenceNumber}`;

          const options: any = {
            method: 'GET',
            url,
            headers: {
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'createTopic': {
          const signedTransaction = this.getNodeParameter('signedTransaction', i) as string;
          const url = `${credentials.baseUrl}/transactions`;

          const options: any = {
            method: 'POST',
            url,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              signedTransaction,
            }),
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'updateTopic': {
          const signedTransaction = this.getNodeParameter('signedTransaction', i) as string;
          const url = `${credentials.baseUrl}/transactions`;

          const options: any = {
            method: 'POST',
            url,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              signedTransaction,
            }),
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'deleteTopic': {
          const signedTransaction = this.getNodeParameter('signedTransaction', i) as string;
          const url = `${credentials.baseUrl}/transactions`;

          const options: any = {
            method: 'POST',
            url,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              signedTransaction,
            }),
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'submitMessage': {
          const signedTransaction = this.getNodeParameter('signedTransaction', i) as string;
          const url = `${credentials.baseUrl}/transactions`;

          const options: any = {
            method: 'POST',
            url,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              signedTransaction,
            }),
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i },
      });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        if (error.response && error.response.body) {
          throw new NodeApiError(this.getNode(), error.response.body, { itemIndex: i });
        } else {
          throw new NodeOperationError(this.getNode(), error.message, { itemIndex: i });
        }
      }
    }
  }

  return returnData;
}

async function executeTransactionsOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('hederahashgraphApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'getTransactions': {
          const limit = this.getNodeParameter('limit', i) as number;
          const order = this.getNodeParameter('order', i) as string;
          const accountId = this.getNodeParameter('accountId', i) as string;
          const timestamp = this.getNodeParameter('timestamp', i) as string;
          const transactionType = this.getNodeParameter('transactionType', i) as string;

          const queryParams: any = {
            limit: limit.toString(),
            order,
          };

          if (accountId) queryParams['account.id'] = accountId;
          if (timestamp) queryParams.timestamp = timestamp;
          if (transactionType) queryParams.transactiontype = transactionType;

          const queryString = new URLSearchParams(queryParams).toString();

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/transactions?${queryString}`,
            headers: {
              'Accept': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getTransaction': {
          const transactionId = this.getNodeParameter('transactionId', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/transactions/${encodeURIComponent(transactionId)}`,
            headers: {
              'Accept': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getTransactionStateProof': {
          const transactionId = this.getNodeParameter('transactionId', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/transactions/${encodeURIComponent(transactionId)}/stateproof`,
            headers: {
              'Accept': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'submitTransaction': {
          const signedTransaction = this.getNodeParameter('signedTransaction', i) as any;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/transactions`,
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: signedTransaction,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getAccountTransactions': {
          const accountId = this.getNodeParameter('accountId', i) as string;
          const limit = this.getNodeParameter('limit', i) as number;
          const order = this.getNodeParameter('order', i) as string;
          const type = this.getNodeParameter('type', i) as string;

          const queryParams: any = {
            limit: limit.toString(),
            order,
          };

          if (type) queryParams.type = type;

          const queryString = new URLSearchParams(queryParams).toString();

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/accounts/${encodeURIComponent(accountId)}/transactions?${queryString}`,
            headers: {
              'Accept': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i },
      });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        throw new NodeApiError(this.getNode(), error);
      }
    }
  }

  return returnData;
}

async function executeSchedulesOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('hederahashgraphApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'getSchedules': {
          const limit = this.getNodeParameter('limit', i) as number;
          const order = this.getNodeParameter('order', i) as string;
          const scheduleId = this.getNodeParameter('scheduleId', i) as string;

          const queryParams: any = {
            limit: limit.toString(),
            order: order,
          };

          if (scheduleId) {
            queryParams['schedule.id'] = scheduleId;
          }

          const queryString = new URLSearchParams(queryParams).toString();

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/schedules?${queryString}`,
            headers: {
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getSchedule': {
          const scheduleId = this.getNodeParameter('scheduleId', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/schedules/${scheduleId}`,
            headers: {
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'createSchedule': {
          const signedTransaction = this.getNodeParameter('signedTransaction', i) as string;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/transactions`,
            headers: {
              'Content-Type': 'application/json',
            },
            body: {
              signedTransaction: signedTransaction,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'signSchedule': {
          const signedTransaction = this.getNodeParameter('signedTransaction', i) as string;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/transactions`,
            headers: {
              'Content-Type': 'application/json',
            },
            body: {
              signedTransaction: signedTransaction,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'deleteSchedule': {
          const signedTransaction = this.getNodeParameter('signedTransaction', i) as string;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/transactions`,
            headers: {
              'Content-Type': 'application/json',
            },
            body: {
              signedTransaction: signedTransaction,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ 
          json: { error: error.message }, 
          pairedItem: { item: i } 
        });
      } else {
        throw new NodeApiError(this.getNode(), error);
      }
    }
  }

  return returnData;
}
