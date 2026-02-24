/**
 * Copyright (c) 2026 Velocity BPA
 * Licensed under the Business Source License 1.1
 */

import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { HederaHashgraph } from '../nodes/Hedera Hashgraph/Hedera Hashgraph.node';

// Mock n8n-workflow
jest.mock('n8n-workflow', () => ({
  ...jest.requireActual('n8n-workflow'),
  NodeApiError: class NodeApiError extends Error {
    constructor(node: any, error: any) { super(error.message || 'API Error'); }
  },
  NodeOperationError: class NodeOperationError extends Error {
    constructor(node: any, message: string) { super(message); }
  },
}));

describe('HederaHashgraph Node', () => {
  let node: HederaHashgraph;

  beforeAll(() => {
    node = new HederaHashgraph();
  });

  describe('Node Definition', () => {
    it('should have correct basic properties', () => {
      expect(node.description.displayName).toBe('Hedera Hashgraph');
      expect(node.description.name).toBe('hederahashgraph');
      expect(node.description.version).toBe(1);
      expect(node.description.inputs).toContain('main');
      expect(node.description.outputs).toContain('main');
    });

    it('should define 6 resources', () => {
      const resourceProp = node.description.properties.find(
        (p: any) => p.name === 'resource'
      );
      expect(resourceProp).toBeDefined();
      expect(resourceProp!.type).toBe('options');
      expect(resourceProp!.options).toHaveLength(6);
    });

    it('should have operation dropdowns for each resource', () => {
      const operations = node.description.properties.filter(
        (p: any) => p.name === 'operation'
      );
      expect(operations.length).toBe(6);
    });

    it('should require credentials', () => {
      expect(node.description.credentials).toBeDefined();
      expect(node.description.credentials!.length).toBeGreaterThan(0);
      expect(node.description.credentials![0].required).toBe(true);
    });

    it('should have parameters with proper displayOptions', () => {
      const params = node.description.properties.filter(
        (p: any) => p.displayOptions?.show?.resource
      );
      for (const param of params) {
        expect(param.displayOptions.show.resource).toBeDefined();
        expect(Array.isArray(param.displayOptions.show.resource)).toBe(true);
      }
    });
  });

  // Resource-specific tests
describe('Accounts Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://mainnet-public.mirrornode.hedera.com/api/v1',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  test('should get accounts successfully', async () => {
    const mockResponse = {
      accounts: [
        {
          account: '0.0.1001',
          balance: { balance: 1000000000 },
          key: { _type: 'ED25519' }
        }
      ],
      links: { next: null }
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'getAccounts';
        case 'limit': return 25;
        case 'order': return 'asc';
        case 'accountIdFilter': return '';
        default: return undefined;
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const items = [{ json: {} }];
    const result = await executeAccountsOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://mainnet-public.mirrornode.hedera.com/api/v1/accounts?limit=25&order=asc',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer test-api-key',
      },
      json: true,
    });
  });

  test('should get specific account successfully', async () => {
    const mockResponse = {
      account: '0.0.1001',
      balance: { balance: 1000000000 },
      key: { _type: 'ED25519' }
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'getAccount';
        case 'accountId': return '0.0.1001';
        default: return undefined;
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const items = [{ json: {} }];
    const result = await executeAccountsOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://mainnet-public.mirrornode.hedera.com/api/v1/accounts/0.0.1001',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer test-api-key',
      },
      json: true,
    });
  });

  test('should get account transactions successfully', async () => {
    const mockResponse = {
      transactions: [
        {
          consensus_timestamp: '1234567890.123456789',
          transaction_id: '0.0.1001-1234567890-123456789',
          transfers: []
        }
      ],
      links: { next: null }
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'getAccountTransactions';
        case 'accountId': return '0.0.1001';
        case 'limit': return 25;
        case 'order': return 'desc';
        case 'timestamp': return '';
        default: return undefined;
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const items = [{ json: {} }];
    const result = await executeAccountsOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://mainnet-public.mirrornode.hedera.com/api/v1/accounts/0.0.1001/transactions?limit=25&order=desc',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer test-api-key',
      },
      json: true,
    });
  });

  test('should get account balances successfully', async () => {
    const mockResponse = {
      timestamp: '1234567890.123456789',
      balances: [
        {
          account: '0.0.1001',
          balance: 1000000000
        }
      ]
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'getAccountBalances';
        case 'accountId': return '0.0.1001';
        case 'timestamp': return '';
        default: return undefined;
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const items = [{ json: {} }];
    const result = await executeAccountsOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://mainnet-public.mirrornode.hedera.com/api/v1/accounts/0.0.1001/balances',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer test-api-key',
      },
      json: true,
    });
  });

  test('should submit transaction successfully', async () => {
    const mockResponse = {
      transaction_id: '0.0.1001-1234567890-123456789',
      status: 'SUCCESS'
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'submitTransaction';
        case 'signedTransaction': return 'base64encodedtransactionbytes';
        default: return undefined;
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const items = [{ json: {} }];
    const result = await executeAccountsOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://mainnet-public.mirrornode.hedera.com/api/v1/transactions',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer test-api-key',
      },
      body: JSON.stringify({
        signedTransactionBytes: 'base64encodedtransactionbytes',
      }),
      json: true,
    });
  });

  test('should handle API errors with continueOnFail', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'getAccount';
        case 'accountId': return '0.0.invalid';
        default: return undefined;
      }
    });

    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    const apiError = new Error('Account not found');
    apiError.cause = {
      httpCode: 404,
      body: { message: 'Account not found' }
    };
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(apiError);

    const items = [{ json: {} }];
    const result = await executeAccountsOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual({
      error: 'Account not found',
      statusCode: 404,
      operation: 'getAccount'
    });
  });

  test('should throw error for unknown operation', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'unknownOperation';
      return undefined;
    });

    const items = [{ json: {} }];

    await expect(executeAccountsOperations.call(mockExecuteFunctions, items))
      .rejects
      .toThrow('Unknown operation: unknownOperation');
  });
});

describe('Tokens Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://mainnet-public.mirrornode.hedera.com/api/v1',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  describe('getTokens operation', () => {
    it('should retrieve list of tokens successfully', async () => {
      const mockResponse = {
        tokens: [
          {
            token_id: '0.0.123456',
            name: 'Test Token',
            symbol: 'TEST',
            type: 'FUNGIBLE_COMMON',
          },
        ],
      };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getTokens')
        .mockReturnValueOnce(25)
        .mockReturnValueOnce('desc')
        .mockReturnValueOnce('')
        .mockReturnValueOnce('all');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeTokensOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://mainnet-public.mirrornode.hedera.com/api/v1/tokens?limit=25&order=desc',
        headers: { 'Accept': 'application/json' },
        json: true,
      });
    });
  });

  describe('getToken operation', () => {
    it('should retrieve specific token successfully', async () => {
      const mockResponse = {
        token_id: '0.0.123456',
        name: 'Test Token',
        symbol: 'TEST',
        type: 'FUNGIBLE_COMMON',
      };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getToken')
        .mockReturnValueOnce('0.0.123456');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeTokensOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://mainnet-public.mirrornode.hedera.com/api/v1/tokens/0.0.123456',
        headers: { 'Accept': 'application/json' },
        json: true,
      });
    });

    it('should throw error when token ID is missing', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getToken')
        .mockReturnValueOnce('');

      await expect(
        executeTokensOperations.call(mockExecuteFunctions, [{ json: {} }])
      ).rejects.toThrow('Token ID is required');
    });
  });

  describe('getTokenBalances operation', () => {
    it('should retrieve token balances successfully', async () => {
      const mockResponse = {
        balances: [
          {
            account: '0.0.789',
            balance: 1000000,
          },
        ],
      };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getTokenBalances')
        .mockReturnValueOnce('0.0.123456')
        .mockReturnValueOnce('')
        .mockReturnValueOnce(25);

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeTokensOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://mainnet-public.mirrornode.hedera.com/api/v1/tokens/0.0.123456/balances?limit=25',
        headers: { 'Accept': 'application/json' },
        json: true,
      });
    });
  });

  describe('error handling', () => {
    it('should handle API errors gracefully when continueOnFail is true', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getTokens');
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

      const result = await executeTokensOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json.error).toBe('API Error');
    });

    it('should throw error when continueOnFail is false', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getTokens');
      mockExecuteFunctions.continueOnFail.mockReturnValue(false);
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

      await expect(
        executeTokensOperations.call(mockExecuteFunctions, [{ json: {} }])
      ).rejects.toThrow();
    });
  });

  describe('unknown operation', () => {
    it('should throw error for unknown operation', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('unknownOperation');

      await expect(
        executeTokensOperations.call(mockExecuteFunctions, [{ json: {} }])
      ).rejects.toThrow('Unknown operation: unknownOperation');
    });
  });
});

describe('Nfts Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://mainnet-public.mirrornode.hedera.com/api/v1',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  it('should get NFTs for token successfully', async () => {
    const mockResponse = {
      nfts: [
        {
          token_id: '0.0.123456',
          serial_number: 1,
          metadata: 'dGVzdCBtZXRhZGF0YQ==',
        },
      ],
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      switch (paramName) {
        case 'operation':
          return 'getNfts';
        case 'tokenId':
          return '0.0.123456';
        case 'limit':
          return 25;
        case 'order':
          return 'asc';
        default:
          return undefined;
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeNftsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://mainnet-public.mirrornode.hedera.com/api/v1/tokens/0.0.123456/nfts?limit=25&order=asc',
      headers: {
        'Content-Type': 'application/json',
      },
      json: true,
    });
  });

  it('should get specific NFT successfully', async () => {
    const mockResponse = {
      token_id: '0.0.123456',
      serial_number: 1,
      metadata: 'dGVzdCBtZXRhZGF0YQ==',
      account_id: '0.0.987654',
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      switch (paramName) {
        case 'operation':
          return 'getNft';
        case 'tokenId':
          return '0.0.123456';
        case 'serialNumber':
          return 1;
        default:
          return undefined;
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeNftsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://mainnet-public.mirrornode.hedera.com/api/v1/tokens/0.0.123456/nfts/1',
      headers: {
        'Content-Type': 'application/json',
      },
      json: true,
    });
  });

  it('should get account NFTs successfully', async () => {
    const mockResponse = {
      nfts: [
        {
          token_id: '0.0.123456',
          serial_number: 1,
          account_id: '0.0.987654',
        },
      ],
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      switch (paramName) {
        case 'operation':
          return 'getAccountNfts';
        case 'accountId':
          return '0.0.987654';
        case 'limit':
          return 25;
        case 'filterTokenId':
          return '';
        default:
          return undefined;
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeNftsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://mainnet-public.mirrornode.hedera.com/api/v1/accounts/0.0.987654/nfts?limit=25',
      headers: {
        'Content-Type': 'application/json',
      },
      json: true,
    });
  });

  it('should mint NFT successfully', async () => {
    const mockResponse = {
      status: 'SUCCESS',
      transaction_id: '0.0.123@1234567890.123456789',
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      switch (paramName) {
        case 'operation':
          return 'mintNft';
        case 'signedTransaction':
          return '0x1234567890abcdef';
        default:
          return undefined;
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeNftsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://mainnet-public.mirrornode.hedera.com/api/v1/transactions',
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        signedTransaction: '0x1234567890abcdef',
      },
      json: true,
    });
  });

  it('should handle errors correctly', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      switch (paramName) {
        case 'operation':
          return 'getNfts';
        case 'tokenId':
          return '0.0.123456';
        default:
          return undefined;
      }
    });

    const error = new Error('API Error');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(error);
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);

    const result = await executeNftsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
  });

  it('should throw error for unknown operation', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      if (paramName === 'operation') {
        return 'unknownOperation';
      }
      return undefined;
    });

    await expect(
      executeNftsOperations.call(mockExecuteFunctions, [{ json: {} }])
    ).rejects.toThrow('Unknown operation: unknownOperation');
  });
});

describe('Topics Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://mainnet-public.mirrornode.hedera.com/api/v1',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  describe('getTopics', () => {
    it('should get list of topics successfully', async () => {
      const mockResponse = {
        topics: [
          {
            topic_id: '0.0.1234',
            memo: 'Test topic',
            running_hash: 'abc123',
            running_hash_version: 3,
          },
        ],
        links: { next: null },
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string, itemIndex: number, fallback?: any) => {
        if (paramName === 'operation') return 'getTopics';
        if (paramName === 'limit') return 25;
        if (paramName === 'order') return 'desc';
        if (paramName === 'topicId') return '';
        return fallback;
      });
      
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeTopicsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([
        {
          json: mockResponse,
          pairedItem: { item: 0 },
        },
      ]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://mainnet-public.mirrornode.hedera.com/api/v1/topics?limit=25&order=desc',
        headers: {
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });
  });

  describe('getTopic', () => {
    it('should get specific topic successfully', async () => {
      const mockResponse = {
        topic_id: '0.0.1234',
        memo: 'Test topic',
        running_hash: 'abc123',
        running_hash_version: 3,
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string, itemIndex: number, fallback?: any) => {
        if (paramName === 'operation') return 'getTopic';
        if (paramName === 'topicId') return '0.0.1234';
        return fallback;
      });
      
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeTopicsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([
        {
          json: mockResponse,
          pairedItem: { item: 0 },
        },
      ]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://mainnet-public.mirrornode.hedera.com/api/v1/topics/0.0.1234',
        headers: {
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });
  });

  describe('getTopicMessages', () => {
    it('should get topic messages successfully', async () => {
      const mockResponse = {
        messages: [
          {
            consensus_timestamp: '1234567890.123456789',
            topic_id: '0.0.1234',
            message: 'SGVsbG8gV29ybGQ=',
            running_hash: 'abc123',
            sequence_number: 1,
          },
        ],
        links: { next: null },
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string, itemIndex: number, fallback?: any) => {
        if (paramName === 'operation') return 'getTopicMessages';
        if (paramName === 'topicId') return '0.0.1234';
        if (paramName === 'limit') return 25;
        if (paramName === 'order') return 'desc';
        if (paramName === 'timestamp') return '';
        return fallback;
      });
      
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeTopicsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([
        {
          json: mockResponse,
          pairedItem: { item: 0 },
        },
      ]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://mainnet-public.mirrornode.hedera.com/api/v1/topics/0.0.1234/messages?limit=25&order=desc',
        headers: {
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });
  });

  describe('createTopic', () => {
    it('should create topic successfully', async () => {
      const mockResponse = {
        transaction_id: '0.0.123@1234567890.123456789',
        status: 'SUCCESS',
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string, itemIndex: number, fallback?: any) => {
        if (paramName === 'operation') return 'createTopic';
        if (paramName === 'signedTransaction') return 'abcd1234';
        return fallback;
      });
      
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeTopicsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([
        {
          json: mockResponse,
          pairedItem: { item: 0 },
        },
      ]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://mainnet-public.mirrornode.hedera.com/api/v1/transactions',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          signedTransaction: 'abcd1234',
        }),
        json: true,
      });
    });
  });

  describe('submitMessage', () => {
    it('should submit message successfully', async () => {
      const mockResponse = {
        transaction_id: '0.0.123@1234567890.123456789',
        status: 'SUCCESS',
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string, itemIndex: number, fallback?: any) => {
        if (paramName === 'operation') return 'submitMessage';
        if (paramName === 'signedTransaction') return 'abcd1234';
        return fallback;
      });
      
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeTopicsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([
        {
          json: mockResponse,
          pairedItem: { item: 0 },
        },
      ]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://mainnet-public.mirrornode.hedera.com/api/v1/transactions',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          signedTransaction: 'abcd1234',
        }),
        json: true,
      });
    });
  });

  describe('error handling', () => {
    it('should handle API errors', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string, itemIndex: number, fallback?: any) => {
        if (paramName === 'operation') return 'getTopic';
        if (paramName === 'topicId') return '0.0.invalid';
        return fallback;
      });

      const apiError = new Error('Topic not found');
      apiError.response = {
        body: { message: 'Topic not found', status: 404 },
      };
      
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(apiError);

      await expect(
        executeTopicsOperations.call(mockExecuteFunctions, [{ json: {} }])
      ).rejects.toThrow();
    });

    it('should continue on fail when configured', async () => {
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string, itemIndex: number, fallback?: any) => {
        if (paramName === 'operation') return 'getTopic';
        if (paramName === 'topicId') return '0.0.invalid';
        return fallback;
      });

      const apiError = new Error('Topic not found');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(apiError);

      const result = await executeTopicsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([
        {
          json: { error: 'Topic not found' },
          pairedItem: { item: 0 },
        },
      ]);
    });
  });
});

describe('Transactions Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://mainnet-public.mirrornode.hedera.com/api/v1',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  test('should get transactions successfully', async () => {
    const mockResponse = {
      transactions: [
        {
          transaction_id: '0.0.1234-1634567890-123456789',
          consensus_timestamp: '1634567890.123456789',
          result: 'SUCCESS',
          transaction_hash: 'hash123',
        },
      ],
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'getTransactions';
        case 'limit': return 25;
        case 'order': return 'desc';
        case 'accountId': return '0.0.1234';
        case 'timestamp': return '';
        case 'transactionType': return '';
        default: return undefined;
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeTransactionsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([
      {
        json: mockResponse,
        pairedItem: { item: 0 },
      },
    ]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://mainnet-public.mirrornode.hedera.com/api/v1/transactions?limit=25&order=desc&account.id=0.0.1234',
      headers: {
        'Accept': 'application/json',
      },
      json: true,
    });
  });

  test('should get specific transaction successfully', async () => {
    const mockResponse = {
      transaction_id: '0.0.1234-1634567890-123456789',
      consensus_timestamp: '1634567890.123456789',
      result: 'SUCCESS',
      transfers: [],
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'getTransaction';
        case 'transactionId': return '0.0.1234-1634567890-123456789';
        default: return undefined;
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeTransactionsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([
      {
        json: mockResponse,
        pairedItem: { item: 0 },
      },
    ]);
  });

  test('should submit transaction successfully', async () => {
    const mockResponse = {
      transaction_id: '0.0.1234-1634567890-123456789',
      status: 'SUCCESS',
    };

    const signedTransaction = {
      signedTransactionBytes: 'base64encodedtransaction',
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'submitTransaction';
        case 'signedTransaction': return signedTransaction;
        default: return undefined;
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeTransactionsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([
      {
        json: mockResponse,
        pairedItem: { item: 0 },
      },
    ]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://mainnet-public.mirrornode.hedera.com/api/v1/transactions',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: signedTransaction,
      json: true,
    });
  });

  test('should get account transactions successfully', async () => {
    const mockResponse = {
      transactions: [
        {
          transaction_id: '0.0.1234-1634567890-123456789',
          consensus_timestamp: '1634567890.123456789',
          result: 'SUCCESS',
          name: 'CRYPTOTRANSFER',
        },
      ],
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'getAccountTransactions';
        case 'accountId': return '0.0.1234';
        case 'limit': return 25;
        case 'order': return 'desc';
        case 'type': return 'CRYPTOTRANSFER';
        default: return undefined;
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeTransactionsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([
      {
        json: mockResponse,
        pairedItem: { item: 0 },
      },
    ]);
  });

  test('should handle errors gracefully when continueOnFail is true', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'getTransaction';
        case 'transactionId': return 'invalid-transaction-id';
        default: return undefined;
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Transaction not found'));
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);

    const result = await executeTransactionsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([
      {
        json: { error: 'Transaction not found' },
        pairedItem: { item: 0 },
      },
    ]);
  });
});

describe('Schedules Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://mainnet-public.mirrornode.hedera.com/api/v1',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  describe('getSchedules', () => {
    it('should get list of scheduled transactions', async () => {
      const mockResponse = {
        schedules: [
          {
            schedule_id: '0.0.123',
            creator_account_id: '0.0.456',
            executed_timestamp: null,
          },
        ],
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'getSchedules';
          case 'limit': return 25;
          case 'order': return 'desc';
          case 'scheduleId': return '';
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeSchedulesOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: expect.stringContaining('/schedules'),
        headers: { 'Content-Type': 'application/json' },
        json: true,
      });
    });

    it('should handle errors when getting schedules', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'getSchedules';
          case 'limit': return 25;
          case 'order': return 'desc';
          case 'scheduleId': return '';
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

      await expect(
        executeSchedulesOperations.call(mockExecuteFunctions, [{ json: {} }])
      ).rejects.toThrow();
    });
  });

  describe('getSchedule', () => {
    it('should get specific scheduled transaction', async () => {
      const mockResponse = {
        schedule_id: '0.0.123',
        creator_account_id: '0.0.456',
        executed_timestamp: null,
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'getSchedule';
          case 'scheduleId': return '0.0.123';
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeSchedulesOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: expect.stringContaining('/schedules/0.0.123'),
        headers: { 'Content-Type': 'application/json' },
        json: true,
      });
    });
  });

  describe('createSchedule', () => {
    it('should create new scheduled transaction', async () => {
      const mockResponse = {
        transaction_id: '0.0.456@1234567890.123456789',
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'createSchedule';
          case 'signedTransaction': return 'base64encodedtransaction';
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeSchedulesOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: expect.stringContaining('/transactions'),
        headers: { 'Content-Type': 'application/json' },
        body: { signedTransaction: 'base64encodedtransaction' },
        json: true,
      });
    });
  });

  describe('signSchedule', () => {
    it('should add signature to scheduled transaction', async () => {
      const mockResponse = {
        transaction_id: '0.0.456@1234567890.123456789',
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'signSchedule';
          case 'signedTransaction': return 'base64encodedsignature';
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeSchedulesOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: expect.stringContaining('/transactions'),
        headers: { 'Content-Type': 'application/json' },
        body: { signedTransaction: 'base64encodedsignature' },
        json: true,
      });
    });
  });

  describe('deleteSchedule', () => {
    it('should delete scheduled transaction', async () => {
      const mockResponse = {
        transaction_id: '0.0.456@1234567890.123456789',
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'deleteSchedule';
          case 'signedTransaction': return 'base64encodeddeletetx';
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeSchedulesOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: expect.stringContaining('/transactions'),
        headers: { 'Content-Type': 'application/json' },
        body: { signedTransaction: 'base64encodeddeletetx' },
        json: true,
      });
    });
  });
});
});
