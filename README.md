# n8n-nodes-hedera-hashgraph

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

An n8n community node providing comprehensive integration with Hedera Hashgraph's distributed ledger technology. This node implements 6 core resources enabling account management, transaction processing, token operations, scheduled transactions, consensus messaging, and smart contract interactions on the Hedera network.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Hedera](https://img.shields.io/badge/Hedera-Hashgraph-purple)
![DLT](https://img.shields.io/badge/DLT-Ready-green)
![Enterprise](https://img.shields.io/badge/Enterprise-Grade-orange)

## Features

- **Account Management** - Create, update, and query Hedera accounts with comprehensive balance and transaction history tracking
- **Transaction Processing** - Execute HBAR transfers, multi-signature transactions, and complex payment workflows with finality guarantees
- **Token Operations** - Create, mint, burn, transfer, and manage fungible and non-fungible tokens on Hedera Token Service
- **Scheduled Transactions** - Create, sign, and execute time-delayed transactions with multi-party approval workflows
- **Consensus Service** - Submit and subscribe to topic messages for decentralized messaging and audit trails
- **Smart Contract Integration** - Deploy, call, and query Hedera smart contracts with full EVM compatibility
- **Real-time Monitoring** - Track transaction status, account changes, and network events with instant finality
- **Enterprise Security** - Multi-signature support, threshold keys, and enterprise-grade cryptographic operations

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** → **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-hedera-hashgraph`
5. Click **Install**

### Manual Installation

```bash
cd ~/.n8n
npm install n8n-nodes-hedera-hashgraph
```

### Development Installation

```bash
git clone https://github.com/Velocity-BPA/n8n-nodes-hedera-hashgraph.git
cd n8n-nodes-hedera-hashgraph
npm install
npm run build
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-hedera-hashgraph
n8n start
```

## Credentials Setup

| Field | Description | Required |
|-------|-------------|----------|
| Network | Hedera network environment (mainnet, testnet, previewnet) | Yes |
| Account ID | Your Hedera account ID (format: 0.0.xxxxx) | Yes |
| Private Key | Account private key in DER or hex format | Yes |
| API Key | Optional API key for enhanced rate limits | No |

## Resources & Operations

### 1. Account

| Operation | Description |
|-----------|-------------|
| Create | Create a new Hedera account with initial balance |
| Get Balance | Retrieve account balance and token holdings |
| Get Info | Get detailed account information and properties |
| Update | Modify account properties and keys |
| Delete | Mark account for deletion and transfer remaining balance |
| Get Records | Retrieve account transaction history |

### 2. Transaction

| Operation | Description |
|-----------|-------------|
| Transfer HBAR | Send HBAR between accounts with memo support |
| Transfer Tokens | Transfer fungible or non-fungible tokens |
| Get Transaction | Retrieve transaction details by transaction ID |
| Get Receipt | Get transaction receipt and status |
| Get Record | Get complete transaction record with fees |
| Multi Transfer | Execute complex multi-party transfers in single transaction |

### 3. Token

| Operation | Description |
|-----------|-------------|
| Create | Create new fungible or non-fungible token |
| Mint | Mint additional token supply |
| Burn | Burn tokens from treasury or associated accounts |
| Associate | Associate token with account for transfers |
| Dissociate | Remove token association from account |
| Update | Modify token properties and settings |
| Get Info | Retrieve token metadata and supply information |
| Freeze/Unfreeze | Control token transferability for specific accounts |

### 4. Schedule

| Operation | Description |
|-----------|-------------|
| Create | Create scheduled transaction for future execution |
| Sign | Add signature to pending scheduled transaction |
| Get Info | Retrieve scheduled transaction details and signers |
| Delete | Cancel pending scheduled transaction |
| Execute | Manually trigger scheduled transaction execution |

### 5. TopicMessage

| Operation | Description |
|-----------|-------------|
| Create Topic | Create new consensus topic |
| Submit Message | Submit message to consensus topic |
| Get Topic Info | Retrieve topic metadata and settings |
| Update Topic | Modify topic properties and access controls |
| Delete Topic | Mark topic for deletion |
| Subscribe | Subscribe to real-time topic message stream |

### 6. Contract

| Operation | Description |
|-----------|-------------|
| Create | Deploy smart contract to Hedera network |
| Call | Execute contract function with parameters |
| Query | Read contract state without state changes |
| Get Info | Retrieve contract metadata and bytecode |
| Update | Modify contract properties and admin key |
| Delete | Mark contract for deletion |
| Get Records | Retrieve contract execution history |

## Usage Examples

```javascript
// Transfer HBAR between accounts
{
  "resource": "Transaction",
  "operation": "Transfer HBAR",
  "fromAccountId": "0.0.12345",
  "toAccountId": "0.0.67890",
  "amount": "100.50",
  "memo": "Payment for services"
}
```

```javascript
// Create a new fungible token
{
  "resource": "Token",
  "operation": "Create",
  "name": "MyToken",
  "symbol": "MTK",
  "decimals": 2,
  "initialSupply": "1000000",
  "treasuryAccountId": "0.0.12345"
}
```

```javascript
// Submit message to consensus topic
{
  "resource": "TopicMessage", 
  "operation": "Submit Message",
  "topicId": "0.0.54321",
  "message": "Important audit log entry",
  "submitKey": "302e020100300506032b657004220420..."
}
```

```javascript
// Create scheduled transaction
{
  "resource": "Schedule",
  "operation": "Create",
  "scheduledTransaction": {
    "type": "Transfer HBAR",
    "fromAccountId": "0.0.12345",
    "toAccountId": "0.0.67890", 
    "amount": "500.00"
  },
  "memo": "Scheduled payment"
}
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| INSUFFICIENT_ACCOUNT_BALANCE | Account lacks sufficient HBAR for transaction | Verify account balance and reduce transaction amount |
| INVALID_ACCOUNT_ID | Malformed or non-existent account ID | Check account ID format (0.0.xxxxx) and existence |
| INVALID_SIGNATURE | Transaction signature verification failed | Verify private key matches account and signature format |
| TOKEN_NOT_ASSOCIATED_TO_ACCOUNT | Account not associated with token | Associate token to account before transfer |
| TRANSACTION_EXPIRED | Transaction exceeded validity duration | Reduce transaction validity period or retry |
| INSUFFICIENT_TOKEN_BALANCE | Account lacks sufficient token balance | Verify token balance before transfer |

## Development

```bash
npm install
npm run build
npm test
npm run lint
npm run dev
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license.

For licensing inquiries: **licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

Contributions are welcome! Please ensure:

1. Code follows existing style conventions
2. All tests pass (`npm test`)
3. Linting passes (`npm run lint`)
4. Documentation is updated for new features
5. Commit messages are descriptive

## Support

- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-hedera-hashgraph/issues)
- **Hedera Documentation**: [docs.hedera.com](https://docs.hedera.com)
- **Developer Portal**: [portal.hedera.com](https://portal.hedera.com)