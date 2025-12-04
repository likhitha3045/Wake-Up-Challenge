const { ethers } = require('ethers');
const RPC = 'https://sepolia-rpc.publicnode.com';
const provider = new ethers.JsonRpcProvider(RPC);
const address = process.argv[2] || '0x23A8e44f75548B84fB2617F1194e942C991370f5';

(async () => {
  try {
    const bal = await provider.getBalance(address);
    console.log('address:', address);
    console.log('wei:', bal.toString());
    console.log('eth:', ethers.formatEther(bal));
  } catch (e) {
    console.error('error', e.message || e);
    process.exit(1);
  }
})();
