pragma solidity ^0.4.18;

contract DataStore {
    
    address public creator;
    address ReceivingAccount = 0x5AEDA56215b167893e80B4fE645BA6d5Bab767DE;

    struct Data {
        string Name;
        uint Id;
        uint PreviousId;
        uint Timestamp;
        string Secret;
    }

    mapping(uint => Data) Map;
    uint16 MapCount=0;

    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event LogFundsReceived(address sender, uint amount);
    event LogFundsSent(address receiver, uint amount);
    

    function() payable {
        LogFundsReceived(msg.sender, msg.value);
    }

    function Oursurance() payable {
        creator = msg.sender;
        LogFundsReceived(msg.sender, msg.value);
    }

    function kill() {
        selfdestruct(creator);
    }

    function send(address target, uint256 amount) payable {
        target.transfer(amount);
        LogFundsSent(target, amount);
    }


    function AddNewData(uint Id, string Name, uint amount, string Secret) public payable returns(bool sufficient) {

        // Transfer(msg.sender, ReceivingAccount, amount);
        LogFundsReceived(msg.sender, msg.value);

        // ReceivingAccount.transfer(TransferCost);
        ReceivingAccount.transfer(msg.value);
        // ReceivingAccount.send(TransferCost);

        LogFundsSent(ReceivingAccount, msg.value);


        Data memory newData;
        newData.Id = Id;
        newData.Name = Name;
        newData.Secret = Secret;
        newData.Timestamp = now;

        if (MapCount != 0) {
            newData.PreviousId = Map[MapCount-1].Id;
        }

        Map[MapCount] = newData;
        MapCount++;

        return true;
    }

    function GetMapCount() public view returns (uint16) {
        return MapCount;
    }

    function GetDataByNumber(uint16 number) public view returns (string, uint, uint, uint, string) {
        return (Map[number].Name, Map[number].Id, Map[number].PreviousId, Map[number].Timestamp, Map[number].Secret);
    }
}
