const Web3 = require('web3')
const Avalanche = require("avalanche").Avalanche;
const ethers = require("ethers");

const calcFeeData = async (
    maxFeePerGas = undefined,
    maxPriorityFeePerGas = undefined
  ) => {
    const chainId = 43113;
    const avalanche = new Avalanche(
      "api.avax-test.network",
      undefined,
      "https",
      chainId
    );
    const cchain = avalanche.CChain();
  
    const baseFee = parseInt(await cchain.getBaseFee(), 16) / 1e9;
    maxPriorityFeePerGas =
      maxPriorityFeePerGas == undefined
        ? parseInt(await cchain.getMaxPriorityFeePerGas(), 16) / 1e9
        : maxPriorityFeePerGas;
    maxFeePerGas =
      maxFeePerGas == undefined ? baseFee + maxPriorityFeePerGas : maxFeePerGas;
  
    if (maxFeePerGas < maxPriorityFeePerGas) {
      throw "Error: Max fee per gas cannot be less than max priority fee per gas";
    }
  
    return {
      maxFeePerGas: maxFeePerGas.toString(),
      maxPriorityFeePerGas: maxPriorityFeePerGas.toString(),
    };
  };

const transferToeknErc20 = async () => {
    const amount = '1000000000000000';
    let maxFeePerGas = undefined;
    let maxPriorityFeePerGas = undefined;
    const jsonInterface = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Paused","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Unpaused","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"burn","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"burnFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"mint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"pause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"paused","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"unpause","outputs":[],"stateMutability":"nonpayable","type":"function"}];
    const contractAddress = '0x7B9a4fF112C7129688B2280458aDCA01cF76BFf6';
    const privateKeyWallet = '14fa60651f3d07762522977d944c46bf551c3a13b7f3a159258d5c25f39d7f05';
    const chainId = 43113;
    const address_to = '0x86a35225248fdD2049F9F0072255E4d16F5697Ae';

  
    //NODE
    const NODE_URL = "https://api.avax-test.network/ext/bc/C/rpc";
    //WEB3
    const web3Global = new Web3( new Web3.providers.HttpProvider(NODE_URL));
    
    //Creamos una cuenta con la llave privada
    const account =  web3Global.eth.accounts.privateKeyToAccount(privateKeyWallet);
    
    //CONTRACT
    const contract = new web3Global.eth.Contract(jsonInterface, contractAddress);
    // If the max fee or max priority fee is not provided, then it will automatically calculate using CChain APIs
    ({ maxFeePerGas, maxPriorityFeePerGas } = await calcFeeData(
      maxFeePerGas,
      maxPriorityFeePerGas
    ));
    
    maxFeePerGas = ethers.utils.parseUnits(maxFeePerGas, "gwei");
    maxPriorityFeePerGas = ethers.utils.parseUnits(maxPriorityFeePerGas, "gwei");
    //////////////////////////////////////////////////////////////////////////////
    
    let estimateGas = await web3Global.eth.estimateGas({
      value: '0x0', // Only tokens
      data: contract.methods.transfer(address_to, amount).encodeABI(),
      from: account.address,
      to: address_to
      });

    //////////////////////////////////////////////////////////////////////////////
    const transactionObject  = {
        value:'0x0',
        data:contract.methods.transfer(address_to, amount).encodeABI(),
      from: account.address,
      to: address_to,
      gas:web3Global.utils.toHex(Math.round(estimateGas * 1.10)),
      gasLimit:web3Global.utils.toHex(Math.round(estimateGas * 1.10)),
      chainId,
    }
    
    //get balanace 
    let balance = await contract.methods.balanceOf(account.address).call();
    console.log('balance init', balance)
    //Sing
    const signText = await web3Global.eth.accounts.signTransaction(transactionObject, privateKeyWallet);
    //Send Transaction
    const reciep = await web3Global.eth.sendSignedTransaction(signText.rawTransaction);
    //get balanace 
    balance = await contract.methods.balanceOf(account.address).call();
    console.log('balance end', balance)
    return null;
   ///////////////////////////////////////////////////////////////////////////////////////
}

transferToeknErc20();
