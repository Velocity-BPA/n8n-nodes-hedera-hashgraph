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
describe('Account Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key', 
        baseUrl: 'https://mainnet-public.mirrornode.hedera.com/api/v1' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn() 
      },
    };
  });

  it('should get all accounts successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getAllAccounts')
      .mockReturnValueOnce(25)
      .mockReturnValueOnce('desc')
      .mockReturnValueOnce('');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      accounts: [{ account: '0.0.123', balance: { balance: 1000000000 } }]
    });

    const result = await executeAccountOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    );

    expect(result).toHaveLength(1);
    expect(result[0].json.accounts).toBeDefined();
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'GET',
        url: expect.stringContaining('/accounts'),
      })
    );
  });

  it('should get specific account successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getAccount')
      .mockReturnValueOnce('0.0.123')
      .mockReturnValueOnce('');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      account: '0.0.123',
      balance: { balance: 1000000000 }
    });

    const result = await executeAccountOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    );

    expect(result).toHaveLength(1);
    expect(result[0].json.account).toBe('0.0.123');
  });

  it('should get account transactions successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getAccountTransactions')
      .mockReturnValueOnce('0.0.123')
      .mockReturnValueOnce(25)
      .mockReturnValueOnce('desc')
      .mockReturnValueOnce('');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      transactions: [{ transaction_id: '0.0.123-1234567890-123456789' }]
    });

    const result = await executeAccountOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    );

    expect(result).toHaveLength(1);
    expect(result[0].json.transactions).toBeDefined();
  });

  it('should get account tokens successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getAccountTokens')
      .mockReturnValueOnce('0.0.123')
      .mockReturnValueOnce(25)
      .mockReturnValueOnce('desc');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      tokens: [{ token_id: '0.0.456', balance: 100 }]
    });

    const result = await executeAccountOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    );

    expect(result).toHaveLength(1);
    expect(result[0].json.tokens).toBeDefined();
  });

  it('should handle API errors gracefully', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getAllAccounts');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);

    const result = await executeAccountOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    );

    expect(result).toHaveLength(1);
    expect(result[0].json.error).toBe('API Error');
  });

  it('should throw error for unknown operation', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('unknownOperation');

    await expect(
      executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }])
    ).rejects.toThrow('Unknown operation: unknownOperation');
  });
});

describe('Transaction Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key', 
        baseUrl: 'https://mainnet-public.mirrornode.hedera.com/api/v1'
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { httpRequest: jest.fn(), requestWithAuthentication: jest.fn() },
    };
  });

  describe('getAllTransactions', () => {
    it('should get all transactions successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getAllTransactions')
        .mockReturnValueOnce(25)
        .mockReturnValueOnce('desc')
        .mockReturnValueOnce('')
        .mockReturnValueOnce('');
      
      const mockResponse = { transactions: [{ transaction_id: '0.0.123@1234567890.123456789' }] };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeTransactionOperations.call(mockExecuteFunctions, [{ json: {} }]);
      
      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://mainnet-public.mirrornode.hedera.com/api/v1/transactions?limit=25&order=desc',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test-key',
        },
        json: true,
      });
    });

    it('should handle getAllTransactions error', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getAllTransactions');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

      await expect(executeTransactionOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow('API Error');
    });
  });

  describe('getTransaction', () => {
    it('should get specific transaction successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getTransaction')
        .mockReturnValueOnce('0.0.123@1234567890.123456789');
      
      const mockResponse = { transaction_id: '0.0.123@1234567890.123456789' };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeTransactionOperations.call(mockExecuteFunctions, [{ json: {} }]);
      
      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://mainnet-public.mirrornode.hedera.com/api/v1/transactions/0.0.123@1234567890.123456789',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test-key',
        },
        json: true,
      });
    });

    it('should handle getTransaction error', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getTransaction');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Transaction not found'));

      await expect(executeTransactionOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow('Transaction not found');
    });
  });

  describe('submitTransaction', () => {
    it('should submit transaction successfully', async () => {
      const signedTx = { signedTransaction: 'base64encodedtransaction' };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('submitTransaction')
        .mockReturnValueOnce(signedTx);
      
      const mockResponse = { transaction_id: '0.0.123@1234567890.123456789', status: 'SUCCESS' };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeTransactionOperations.call(mockExecuteFunctions, [{ json: {} }]);
      
      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://mainnet-public.mirrornode.hedera.com/api/v1/transactions',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test-key',
        },
        body: signedTx,
        json: true,
      });
    });

    it('should handle submitTransaction error', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('submitTransaction');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Invalid transaction'));

      await expect(executeTransactionOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow('Invalid transaction');
    });
  });
});

describe('Token Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key', 
        baseUrl: 'https://mainnet-public.mirrornode.hedera.com/api/v1' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { httpRequest: jest.fn(), requestWithAuthentication: jest.fn() },
    };
  });

  test('getAllTokens should fetch tokens list successfully', async () => {
    const mockResponse = { tokens: [{ token_id: '0.0.123', name: 'TestToken' }] };
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getAllTokens')
      .mockReturnValueOnce(25)
      .mockReturnValueOnce('asc')
      .mockReturnValueOnce('');
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeTokenOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://mainnet-public.mirrornode.hedera.com/api/v1/tokens?limit=25&order=asc',
      headers: { 'Accept': 'application/json', 'Authorization': 'Bearer test-key' },
      json: true,
    });
    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
  });

  test('getToken should fetch specific token successfully', async () => {
    const mockResponse = { token_id: '0.0.123', name: 'TestToken', symbol: 'TT' };
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getToken')
      .mockReturnValueOnce('0.0.123')
      .mockReturnValueOnce('');
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeTokenOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://mainnet-public.mirrornode.hedera.com/api/v1/tokens/0.0.123',
      headers: { 'Accept': 'application/json', 'Authorization': 'Bearer test-key' },
      json: true,
    });
    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
  });

  test('getTokenBalances should fetch token balances successfully', async () => {
    const mockResponse = { balances: [{ account: '0.0.456', balance: 1000 }] };
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getTokenBalances')
      .mockReturnValueOnce('0.0.123')
      .mockReturnValueOnce(25)
      .mockReturnValueOnce('asc');
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeTokenOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://mainnet-public.mirrornode.hedera.com/api/v1/tokens/0.0.123/balances?limit=25&order=asc',
      headers: { 'Accept': 'application/json', 'Authorization': 'Bearer test-key' },
      json: true,
    });
    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
  });

  test('getTokenNfts should fetch token NFTs successfully', async () => {
    const mockResponse = { nfts: [{ token_id: '0.0.123', serial_number: 1 }] };
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getTokenNfts')
      .mockReturnValueOnce('0.0.123')
      .mockReturnValueOnce(25)
      .mockReturnValueOnce('asc');
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeTokenOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://mainnet-public.mirrornode.hedera.com/api/v1/tokens/0.0.123/nfts?limit=25&order=asc',
      headers: { 'Accept': 'application/json', 'Authorization': 'Bearer test-key' },
      json: true,
    });
    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
  });

  test('should handle API errors gracefully', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getAllTokens');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);

    const result = await executeTokenOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
  });

  test('should throw error for unknown operation', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('unknownOperation');

    await expect(executeTokenOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow('Unknown operation: unknownOperation');
  });
});

describe('Schedule Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-key',
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

  describe('getAllSchedules', () => {
    it('should get all schedules successfully', async () => {
      const mockResponse = {
        schedules: [
          {
            schedule_id: '0.0.123',
            creator_account_id: '0.0.456',
            admin_key: null,
            executed_timestamp: null,
          },
        ],
      };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getAllSchedules')
        .mockReturnValueOnce(25)
        .mockReturnValueOnce('desc')
        .mockReturnValueOnce('');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executeScheduleOperations.call(mockExecuteFunctions, items);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://mainnet-public.mirrornode.hedera.com/api/v1/schedules?limit=25&order=desc',
        headers: {
          'Authorization': 'Bearer test-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });

      expect(result).toEqual([
        {
          json: mockResponse,
          pairedItem: { item: 0 },
        },
      ]);
    });

    it('should handle getAllSchedules with schedule ID filter', async () => {
      const mockResponse = {
        schedules: [
          {
            schedule_id: '0.0.123',
            creator_account_id: '0.0.456',
            admin_key: null,
            executed_timestamp: null,
          },
        ],
      };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getAllSchedules')
        .mockReturnValueOnce(10)
        .mockReturnValueOnce('asc')
        .mockReturnValueOnce('0.0.123');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executeScheduleOperations.call(mockExecuteFunctions, items);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://mainnet-public.mirrornode.hedera.com/api/v1/schedules?limit=10&order=asc&schedule.id=0.0.123',
        headers: {
          'Authorization': 'Bearer test-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });

      expect(result).toEqual([
        {
          json: mockResponse,
          pairedItem: { item: 0 },
        },
      ]);
    });

    it('should handle getAllSchedules error', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getAllSchedules')
        .mockReturnValueOnce(25)
        .mockReturnValueOnce('desc')
        .mockReturnValueOnce('');

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const items = [{ json: {} }];
      const result = await executeScheduleOperations.call(mockExecuteFunctions, items);

      expect(result).toEqual([
        {
          json: { error: 'API Error' },
          pairedItem: { item: 0 },
        },
      ]);
    });
  });

  describe('getSchedule', () => {
    it('should get specific schedule successfully', async () => {
      const mockResponse = {
        schedule_id: '0.0.123',
        creator_account_id: '0.0.456',
        admin_key: null,
        executed_timestamp: null,
        scheduled_transaction_body: {},
      };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getSchedule')
        .mockReturnValueOnce('0.0.123');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executeScheduleOperations.call(mockExecuteFunctions, items);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://mainnet-public.mirrornode.hedera.com/api/v1/schedules/0.0.123',
        headers: {
          'Authorization': 'Bearer test-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });

      expect(result).toEqual([
        {
          json: mockResponse,
          pairedItem: { item: 0 },
        },
      ]);
    });

    it('should handle getSchedule error', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getSchedule')
        .mockReturnValueOnce('0.0.123');

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Schedule not found'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const items = [{ json: {} }];
      const result = await executeScheduleOperations.call(mockExecuteFunctions, items);

      expect(result).toEqual([
        {
          json: { error: 'Schedule not found' },
          pairedItem: { item: 0 },
        },
      ]);
    });
  });
});

describe('TopicMessage Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-key',
        baseUrl: 'https://mainnet-public.mirrornode.hedera.com/api/v1'
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn()
      }
    };
  });

  describe('getTopicMessages operation', () => {
    it('should get topic messages successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getTopicMessages')
        .mockReturnValueOnce('0.0.123456')
        .mockReturnValueOnce(25)
        .mockReturnValueOnce('desc')
        .mockReturnValueOnce('')
        .mockReturnValueOnce('');

      const mockResponse = {
        messages: [
          { sequence_number: 1, consensus_timestamp: '1234567890.123456789', message: 'dGVzdA==' }
        ]
      };

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeTopicMessageOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toEqual([{
        json: mockResponse,
        pairedItem: { item: 0 }
      }]);
    });

    it('should handle get topic messages error', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getTopicMessages')
        .mockReturnValueOnce('invalid-topic');

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Topic not found'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeTopicMessageOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toEqual([{
        json: { error: 'Topic not found' },
        pairedItem: { item: 0 }
      }]);
    });
  });

  describe('getTopicMessage operation', () => {
    it('should get specific topic message successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getTopicMessage')
        .mockReturnValueOnce('0.0.123456')
        .mockReturnValueOnce(1);

      const mockResponse = {
        sequence_number: 1,
        consensus_timestamp: '1234567890.123456789',
        message: 'dGVzdA=='
      };

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeTopicMessageOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toEqual([{
        json: mockResponse,
        pairedItem: { item: 0 }
      }]);
    });
  });

  describe('submitTopicMessage operation', () => {
    it('should submit topic message successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('submitTopicMessage')
        .mockReturnValueOnce('0.0.123456')
        .mockReturnValueOnce('test message');

      const mockResponse = {
        transaction_id: '0.0.123456@1234567890.123456789',
        status: 'SUCCESS'
      };

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeTopicMessageOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toEqual([{
        json: mockResponse,
        pairedItem: { item: 0 }
      }]);
    });

    it('should handle submit message error', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('submitTopicMessage')
        .mockReturnValueOnce('0.0.123456')
        .mockReturnValueOnce('test message');

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Insufficient HBAR balance'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeTopicMessageOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toEqual([{
        json: { error: 'Insufficient HBAR balance' },
        pairedItem: { item: 0 }
      }]);
    });
  });
});

describe('Contract Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-key',
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

	describe('getAllContracts operation', () => {
		it('should get all contracts successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getAllContracts')
				.mockReturnValueOnce(25)
				.mockReturnValueOnce('desc')
				.mockReturnValueOnce('');

			const mockResponse = {
				contracts: [
					{ contract_id: '0.0.1001', created_timestamp: '1234567890.123456789' },
				],
			};

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeContractOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://mainnet-public.mirrornode.hedera.com/api/v1/contracts?limit=25&order=desc',
				headers: {
					'Authorization': 'Bearer test-key',
					'Content-Type': 'application/json',
				},
				json: true,
			});

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});

		it('should handle getAllContracts error', async () => {
			mockExecuteFunctions.getNodeParameter.mockReturnValue('getAllContracts');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeContractOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
		});
	});

	describe('getContract operation', () => {
		it('should get specific contract successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getContract')
				.mockReturnValueOnce('0.0.1001');

			const mockResponse = {
				contract_id: '0.0.1001',
				created_timestamp: '1234567890.123456789',
			};

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeContractOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://mainnet-public.mirrornode.hedera.com/api/v1/contracts/0.0.1001',
				headers: {
					'Authorization': 'Bearer test-key',
					'Content-Type': 'application/json',
				},
				json: true,
			});

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});

		it('should handle getContract error', async () => {
			mockExecuteFunctions.getNodeParameter.mockReturnValue('getContract');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Contract not found'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeContractOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: { error: 'Contract not found' }, pairedItem: { item: 0 } }]);
		});
	});

	describe('getContractResults operation', () => {
		it('should get contract results successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getContractResults')
				.mockReturnValueOnce(25)
				.mockReturnValueOnce('desc')
				.mockReturnValueOnce('1234567890.123456789');

			const mockResponse = {
				results: [
					{ transaction_id: '0.0.1001@1234567890.123456789' },
				],
			};

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeContractOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://mainnet-public.mirrornode.hedera.com/api/v1/contracts/results?limit=25&order=desc&timestamp=1234567890.123456789',
				headers: {
					'Authorization': 'Bearer test-key',
					'Content-Type': 'application/json',
				},
				json: true,
			});

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});
	});

	describe('getContractResult operation', () => {
		it('should get specific contract result successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getContractResult')
				.mockReturnValueOnce('0.0.1001@1234567890.123456789');

			const mockResponse = {
				transaction_id: '0.0.1001@1234567890.123456789',
				result: 'SUCCESS',
			};

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeContractOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://mainnet-public.mirrornode.hedera.com/api/v1/contracts/results/0.0.1001@1234567890.123456789',
				headers: {
					'Authorization': 'Bearer test-key',
					'Content-Type': 'application/json',
				},
				json: true,
			});

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});
	});
});
});
