# Monad Guard 🛡️

**Protect your crypto wallet from scams and hacks**

Monad Guard is a free tool that helps you stay safe when using Web3 apps. It checks websites, reviews transactions, and warns you before you lose money.

---

## 📖 What Does It Do?

Imagine you're about to sign something on a website. Before you hit "Approve", Monad Guard asks:

- **Is this website real or a scam?** 
- **What will this transaction actually do?**
- **Did I already approve this contract?**
- **Is my money safe?**

If something looks wrong, it warns you. You can then cancel and avoid losing your crypto.

---

## 🚀 Quick Start

### 1. Install & Run

```bash
# Get the code
git clone https://github.com/yashbalpande/monadguard.git
cd wallet-sentinel

# Install everything
npm install

# Start the app
npm run dev
```

Open your browser to `http://localhost:5173`

### 2. Connect Your Wallet

Click **"Connect Wallet"** and select MetaMask (or another Web3 wallet)
- Choose **Monad Testnet** (Chain ID: 10143)
- Approve the connection
- Done! You're ready to use it

---

## 🎯 Five Main Features (How to Use Each)

### Feature #1: Domain Checker 🌐

**What it does:** Check if a website is real or fake

**Why you need it:** 
- Fake sites like `uniswapp.xyz` (extra p) trick you into signing bad transactions
- Real site: `uniswap.org` 
- Fake site: `uniswapp-swap.xyz`

**How to use it:**
1. Click the **"Domain Check"** tab in the dashboard
2. Type any website URL (e.g., `opensea.io`)
3. Click **"Check"**
4. See the result:
   - 🟢 **Green** = Safe to use
   - 🟡 **Yellow** = Unknown (be careful)
   - 🔴 **Red** = DANGEROUS! Don't connect

**What it checks:**
- Known scam databases
- Typos & typosquatting (uniswap vs uniswapp)
- Suspicious domains (.xyz, .click, .top)
- Verified safe sites (whitelist)
- Trust score out of 100

**Example result:**
```
Domain: uniswapp-swap.xyz
Status: ⚠️ SUSPICIOUS
Reason: Typo domain. Real site is uniswap.org
Trust Score: 15/100
Recommendation: Do NOT connect your wallet
```

---

### Feature #2: Approval Manager ✅

**What it does:** See and remove token approvals

**Why you need it:**
- When you use DeFi (like Uniswap), you "approve" apps to spend your tokens
- You might approve **unlimited amount** (very bad!)
- If that app gets hacked, hackers can steal all your tokens

**How to use it:**
1. Click the **"Approvals"** tab
2. See all contracts you approved
3. For each approval, you see:
   - **Token:** What you approved (USDC, USDT, etc.)
   - **Spender:** Which app you approved
   - **Amount:** How much they can spend
   - **Risk Level:** Green (safe) or Red (dangerous)
4. Click **"Revoke"** to remove approval instantly

**Color coding:**
- 🟢 **Green:** Limited amount (e.g., 100 USDC) = Safe
- 🔴 **Red:** Unlimited (e.g., 999,999,999) = DANGEROUS!

**Example:**
```
Token: USDC
Approved to: OpenSea (NFT platform)
Amount: UNLIMITED (999,999,999)
Risk: 🔴 CRITICAL
Action: Click "Revoke" immediately!
```

**What happens when you revoke?**
- That app can NO LONGER spend your tokens
- Your money is protected
- You can approve them again if you need to use them

---

### Feature #3: Address Labels 📝

**What it does:** Label and remember blockchain addresses

**Why you need it:**
- Wallet addresses are long (0x1234567890abcdef...)
- Easy to forget or confuse
- Could send money to wrong place by mistake

**How to use it:**
1. Click the **"Addresses"** tab
2. Click **"Add New Label"**
3. Paste the address you want to label
4. Give it a name (e.g., "My Coinbase", "Unsafe Wallet")
5. Choose a type:
   - 🟢 **Trusted:** Safe addresses I use often
   - 🔴 **Risky:** Addresses to avoid
   - 💜 **Personal:** My own wallets
   - 🟦 **Other:** Everything else
6. Add a note (optional, e.g., "Withdrawal address")
7. Save

**Example:**
```
Address: 0x1234567890abcdef...
Label: My Spend Wallet
Type: Personal 💜
Note: Use this for trading daily
```

**How it helps:**
- Next time you see that address, you remember what it is
- Color-coded so you can spot risky addresses instantly
- Labels saved in your browser (private, only you see them)

---

### Feature #4: Transaction Decoder 🔍

**What it does:** Show you exactly what a transaction will do

**Why you need it:**
- Transaction data looks like: `0xa9059cbb000000...` (random hex)
- But hidden in that code is the real action (send tokens, swap, etc.)
- Hackers hide bad actions in complex hex code

**How to use it:**
1. Click the **"Decoder"** tab
2. Paste the transaction data (the `data` field from MetaMask)
3. Click **"Decode"**
4. See what it really does in plain English

**Example transactions it decodes:**

**Transfer Function** = Sending tokens to someone
```
Function: transfer()
To: 0x123...abc (your address)
Amount: 100 USDC
= Sending 100 USDC to your address
```

**Approve Function** = Giving approval to spend tokens
```
Function: approve()
Spender: 0x789...def (Uniswap)
Amount: 50 USDT
= Approving Uniswap to spend 50 USDT
```

**Swap Function** = Trading on Uniswap
```
Function: exactInputSingle()
From: 100 USDC
To: ~85 ETH
= Swapping 100 USDC for about 85 ETH
```

**How to find transaction data:**
1. Look at MetaMask popup before you approve
2. Scroll down to see "Data" section
3. Copy that hex code
4. Paste it in Transaction Decoder

---

### Feature #5: Overview Dashboard 📊

**What it does:** See all your wallet activity in one place

**How it works:**
- Shows recent transactions
- Color-coded by risk level
- Timeline of events
- Quick alerts if something suspicious

**What you see:**
- 🟢 Normal transactions
- 🟡 Warning transactions
- 🔴 Dangerous transactions

---

## 🔒 Smart Contracts (Optional)

Monad Guard includes 3 smart contracts on Monad Testnet for advanced users:

### 1. EmergencyGuard
**What:** Freeze your account in an emergency
**Use:** If you think your wallet is hacked, activate emergency mode to stop ALL transactions

### 2. ApprovalManager
**What:** Manage approvals on the blockchain itself
**Use:** Keep tracking of all approvals on-chain, not just locally

### 3. TransactionValidator
**What:** Score any transaction for risk
**Use:** Get a risk score (0-100) before signing

**Deploy contracts:**
```bash
# Set up your .env file first
cp .env.example .env
# Add: PRIVATE_KEY=your_key_here

# Deploy to Monad Testnet
npm run contracts:deploy
```

---

## ⚠️ Important Things to Know

### What Monad Guard CAN Do:
✅ Catch known scam websites
✅ Warn about unlimited approvals
✅ Decode transaction data
✅ Remember address labels
✅ Show risk warnings

### What Monad Guard CANNOT Do:
❌ Protect against brand new scams (unknown patterns)
❌ Guarantee 100% safety
❌ Stop you from making mistakes if you ignore warnings
❌ Recover lost money
❌ Predict future hacks

### IMPORTANT RULES:
1. **Monad Guard is a HELPER, not a protector**
   - Always use your own judgment
   - Don't blindly trust any tool

2. **Always double-check yourself**
   - Verify URLs in address bar
   - Check blockchain explorer
   - Look up contracts before approving

3. **Keep your seed phrase safe**
   - Never enter it anywhere
   - Never share it with anyone
   - No tool can save you if someone has your seed phrase

4. **Pattern matching only**
   - Uses rules, not AI
   - Can miss new scams
   - Not real-time monitoring

---

## 🎓 Real Examples

### Example 1: Saved from Phishing

```
User visits: etherscan-verify.top
Uses Domain Checker
Result: 🔴 SUSPICIOUS
Reason: Mimics etherscan.io but has typo
Action: User cancels connection
Saved: From signing malicious transaction ✓
```

### Example 2: Found Dangerous Approval

```
User checks Approvals tab
Sees: Uniswap has UNLIMITED approval for USDC
Result: 🔴 CRITICAL RISK
Action: Clicks "Revoke"
Saved: From potential token theft ✓
```

### Example 3: Understood Complex Swap

```
User gets swap transaction to sign
Hex data: 0xa414d4d5...
Uses Decoder
Gets: "Swap 100 USDC for ~85 ETH"
Action: Recognizes the amounts, confirms it's correct
Result: Safely completes transaction ✓
```

---

## 🛠️ Troubleshooting

### "Wallet won't connect"
1. Make sure MetaMask is installed
2. Check you're on Monad Testnet (Chain 10143)
3. Restart MetaMask
4. Try a different browser

### "Domain Checker shows error"
1. Make sure you typed the URL correctly
2. Try without "https://"
3. Clear browser cache (Ctrl+Shift+Delete)

### "Can't see my approvals"
1. Disconnect and reconnect wallet
2. Make sure you're on the right network
3. Try opening in incognito/private mode

### "Address labels disappeared"
1. They're stored in browser local storage
2. Clearing cache deletes them
3. Use same browser to see them again

### App is slow or frozen
1. Clear browser cache
2. Reload the page (F5)
3. Try different browser
4. Close other tabs

---

## 📱 System Requirements

- **Browser:** Chrome, Firefox, Edge, or Safari (latest version)
- **Wallet:** MetaMask or any EVM wallet
- **Network:** Monad Testnet (Chain ID: 10143)
- **Internet:** Fast connection
- **Storage:** 10MB for app + browser cache

---

## 🚀 For Developers

### Build for Production
```bash
npm run build
```

### Compile Smart Contracts
```bash
npm run contracts:compile
```

### Run Tests
```bash
npm run test
```

### Deploy Contracts
```bash
npm run contracts:deploy
```

---

## 📚 Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Wagmi** - Wallet connection
- **Viem** - Blockchain interactions
- **Solidity** - Smart contracts
- **Hardhat** - Contract development

---

## 💡 Tips for Maximum Safety

### DO ✅
- Check domains before connecting wallet
- Revoke old approvals you don't use
- Label all your important addresses
- Decode transactions before signing
- Use this tool + your own judgment
- Keep wallet backups

### DON'T ❌
- Trust any tool 100%
- Skip checking small transactions
- Give out your private key
- Use same password everywhere
- Approve unlimited amounts
- Click unknown links

---

## 🔗 Quick Links

- **GitHub:** https://github.com/yashbalpande/monadguard.git
- **Monad Testnet:** https://testnet.monad.xyz
- **Get Test Tokens:** https://faucet.monad.xyz
- **Block Explorer:** https://testnet.monad.xyz

---

## 📄 License

MIT License - Free to use, modify, and distribute

---

## 🙏 Stay Safe Out There

The Web3 space has real dangers. Tools like Monad Guard + your own caution = best protection.

**Remember:** If something seems official but feels off, it probably IS an attempt to trick you.

Trust your instincts. Use tools like this. Verify everything.

Stay safe! 🛡️

---

## 🤝 Questions?

Have questions or found a bug? Open an issue on GitHub:
https://github.com/yashbalpande/monadguard.git/issues

---

**Last Updated:** February 2026
**Status:** Active Development
**Network:** Monad Testnet (Coming to Mainnet)


