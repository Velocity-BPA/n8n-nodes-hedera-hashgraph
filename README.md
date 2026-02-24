# n8n-nodes-hedera-hashgraph

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

This n8n community node provides comprehensive integration with Hedera Hashgraph, enabling you to interact with 6 core resources (Accounts, Tokens, NFTs, Topics, Transactions, Schedules) through automated workflows. Build powerful DLT applications with account management, token operations, consensus messaging, and smart contract scheduling capabilities.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Hedera Hashgraph](https://img.shields.io/badge/Hedera-Hashgraph-purple)
![DLT](https://img.shields.io/badge/DLT-Distributed%20Ledger-green)
![Consensus](https://img.shields.io/badge/Consensus-Service-orange)

## Features

- **Account Management** - Create, update, and query Hedera accounts with balance and key management
- **Token Operations** - Mint, burn, transfer, and manage fungible and non-fungible tokens
- **NFT Support** - Full NFT lifecycle management including metadata and ownership transfers
- **Consensus Service** - Publish and subscribe to immutable message streams via HCS topics
- **Transaction Handling** - Execute, query, and monitor transaction status with detailed receipts
- **Smart Scheduling** - Create and manage scheduled transactions for automated execution
- **Multi-Network Support** - Works with mainnet, testnet, and previewnet environments
- **Comprehensive Error Handling** - Detailed error messages and transaction failure diagnostics

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
| Account ID | Your Hedera account ID (format: 0.0.xxxxx) | Yes |
| Private Key | Account private key in DER or hex format | Yes |
| Network | Target network (mainnet, testnet, previewnet) | Yes |
| Mirror Node URL | Optional custom mirror node endpoint | No |
| Operator Key | Additional operator private key for multi-sig operations | No |

## Resources & Operations

### 1. Accounts

| Operation | Description |
|-----------|-------------|
| Create | Create a new Hedera account with initial balance |
| Get Info | Retrieve account information and balance |
| Update | Update account keys, memo, or properties |
| Delete | Delete an account and transfer remaining balance |
| Get Balance | Get current HBAR balance for an account |
| Get Records | Retrieve transaction records for an account |

### 2. Tokens

| Operation | Description |
|-----------|-------------|
| Create | Create a new fungible token with custom properties |
| Mint | Mint additional token supply |
| Burn | Burn tokens from treasury account |
| Transfer | Transfer tokens between accounts |
| Associate | Associate token with an account |
| Dissociate | Dissociate token from an account |
| Freeze | Freeze token transfers for an account |
| Unfreeze | Unfreeze token transfers for an account |
| Grant KYC | Grant KYC status to an account |
| Revoke KYC | Revoke KYC status from an account |
| Update | Update token properties and treasury |
| Delete | Delete a token permanently |
| Get Info | Get token information and supply details |

### 3. NFTs

| Operation | Description |
|-----------|-------------|
| Create Collection | Create a new NFT collection token |
| Mint | Mint new NFTs with metadata |
| Transfer | Transfer NFT ownership between accounts |
| Burn | Burn/destroy specific NFTs |
| Get Info | Get NFT metadata and ownership information |
| Get Collection Info | Get NFT collection details and statistics |
| Update Metadata | Update NFT metadata (if mutable) |

### 4. Topics

| Operation | Description |
|-----------|-------------|
| Create | Create a new HCS consensus topic |
| Update | Update topic properties and admin keys |
| Delete | Delete a consensus topic |
| Submit Message | Submit a message to a topic |
| Get Info | Get topic information and sequence numbers |
| Get Messages | Retrieve messages from a topic |

### 5. Transactions

| Operation | Description |
|-----------|-------------|
| Get | Retrieve transaction details by ID |
| Get Receipt | Get transaction receipt and status |
| Get Record | Get detailed transaction record |
| List | List transactions for an account |
| Monitor Status | Monitor transaction status until consensus |

### 6. Schedules

| Operation | Description |
|-----------|-------------|
| Create | Schedule a transaction for future execution |
| Sign | Add signature to a scheduled transaction |
| Delete | Delete a scheduled transaction |
| Get Info | Get scheduled transaction details |
| List | List scheduled transactions for an account |

## Usage Examples

```javascript
// Create a new Hedera account
const accountData = {
  "initialBalance": 100,
  "publicKey": "302a300506032b6570032100...",
  "memo": "New account created via n8n"
};

// Transfer HBAR between accounts  
const transferData = {
  "fromAccount": "0.0.12345",
  "toAccount": "0.0.67890", 
  "amount": 50.5,
  "memo": "Payment for services"
};

// Submit message to HCS topic
const messageData = {
  "topicId": "0.0.98765",
  "message": "Hello Hedera Consensus Service!",
  "submitKey": "302e020100300506032b657004220420..."
};

// Create and mint NFT
const nftData = {
  "name": "My NFT Collection",
  "symbol": "MNC", 
  "metadata": [
    "https://ipfs.io/ipfs/QmHash1...",
    "https://ipfs.io/ipfs/QmHash2..."
  ],
  "treasuryAccount": "0.0.12345"
};
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| INSUFFICIENT_ACCOUNT_BALANCE | Account lacks sufficient HBAR for transaction | Ensure account has enough HBAR for transaction + fees |
| INVALID_ACCOUNT_ID | Account ID format is incorrect | Use proper format: 0.0.xxxxx |
| INVALID_SIGNATURE | Transaction signature verification failed | Verify private key matches account and is properly formatted |
| TOKEN_NOT_ASSOCIATED_TO_ACCOUNT | Token not associated with target account | Associate token with account before transfer |
| TRANSACTION_EXPIRED | Transaction exceeded validity period | Reduce transaction validity duration or retry |
| TOPIC_EXPIRED | Consensus topic has expired | Create new topic or extend existing topic expiry |

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
- **Hedera Developer Discord**: [discord.gg/hedera](https://discord.gg/hedera)