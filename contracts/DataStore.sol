pragma solidity ^0.4.17;

contract DataStore {
    struct Data {
        string Name;
        uint Id;
        uint PreviousId;
        uint Timestamp;
        string Secret;
    }

    mapping(uint => Data) Map;
    uint16 MapCount=0;

    function AddNewData(uint Id, string Name, string Secret) public {
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
    }

    function GetMapCount() public view returns (uint16) {
        return MapCount;
    }

    function GetDataByNumber(uint16 number) public view returns (string, uint, uint, uint, string) {
        return (Map[number].Name, Map[number].Id, Map[number].PreviousId, Map[number].Timestamp, Map[number].Secret);
    }
}
