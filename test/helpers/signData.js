const ethers = require("ethers");
const utils = ethers.utils;
const ethUtil = require("ethereumjs-util");

//this, _investor, _fromTime, _toTime, _validTo
function signData(tmAddress, investorAddress, fromTime, toTime, expiryTime, restricted, validFrom, validTo, nonce, pk) {

    let packedData = utils
        .solidityKeccak256(
            ["address", "address", "uint256", "uint256", "uint256", "bool", "uint256", "uint256", "uint256"],
            [tmAddress, investorAddress, fromTime, toTime, expiryTime, restricted, validFrom, validTo, nonce]
        )
        .slice(2);
    packedData = new Buffer(packedData, "hex");
    packedData = Buffer.concat([new Buffer(`\x19Ethereum Signed Message:\n${packedData.length.toString()}`), packedData]);
    packedData = web3.sha3(`0x${packedData.toString("hex")}`, { encoding: "hex" });
    return ethUtil.ecsign(new Buffer(packedData.slice(2), "hex"), new Buffer(pk, "hex"));
}

// sign data for verify tranfer function
function signDataVerifyTransfer (tmAddress, fromAddress, toAddress, amount, account, nonce) {
    let packedData = utils
        .solidityKeccak256(
            ["address", "address", "address", "uint256"],
            [tmAddress, fromAddress, toAddress, amount]
        )
        .slice(2);
    packedData = new Buffer(packedData, "hex");
    packedData = Buffer.concat([new Buffer(`\x19Ethereum Signed Message:\n${packedData.length.toString()}`), packedData]);
    packedData = web3.sha3(`0x${packedData.toString("hex")}`, { encoding: "hex" });

    let signedData = web3.eth.sign(account, packedData).substring(2);
    let nonceData = new Buffer(toBytesInt32(nonce), "hex").toString("hex");
    return tmAddress + nonceData + signedData;
}

function toBytesInt32(num) {
    let arr = new ArrayBuffer(32); // an Int32 takes 4 bytes
    let view = new DataView(arr);
    view.setUint32(0, num, false); // byteOffset = 0; litteEndian = false
    return arr;
}

module.exports = {
    signData, signDataVerifyTransfer
};
