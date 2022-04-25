const SHA256 = require('crypto-js/sha256');
/**
 * This is the single block of a chain.
 */
class Block {
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }
    /**
     * This method calculates the hash of the block.
     * @returns {string} - The hash of the block.
     */
    calculateHash() {
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }
    mineBlock(difficulty) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log('Block mined: ' + this.hash);
    }
}

/**
 * This is the blockchain.
 */
class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 4;
    }
    /**
     * This method is used to create the first block of a chain. First need to be created manually and it is called genesis block.
     * @returns {Block} - The first block of the chain.
     */
    createGenesisBlock() {
        return new Block(0, "01/01/2018", "Genesis Block", "000");
    }
    /**
     * This method is used to get the latest block of the chain.
     * @returns {Block} - The latest block of the chain.
     */
    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }
    /**
     * This method is used to add a new block to the chain.
     * @param {Object} newBlock - The new block to be added to the chain.
     */
    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }
    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];
            if (currentBlock.hash !== currentBlock.calculateHash()) return false;
            if (currentBlock.previousHash !== previousBlock.hash) return false;
        }
        return true;
    }
}

let falconCoin = new Blockchain();
console.log('Mining block 1 . . .')
falconCoin.addBlock(new Block(1, "01/01/2018", { amount: 4 }));
console.log('Mining block 2 . . .')
falconCoin.addBlock(new Block(2, "10/01/2018", { amount: 10 }));