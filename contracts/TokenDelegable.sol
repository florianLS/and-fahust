pragma solidity 0.8.0;

import '../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '../node_modules/@openzeppelin/contracts/access/Ownable.sol';

contract DelegateContract is Ownable {

    constructor(address _addressContract) {
        addressContract = _addressContract;
        paramsContract["nextId"] = TokenDelegable(addressContract).getParamsContract("nextId");
        paramsContract["priceEggOne"] = 100000000000000000;
        paramsContract["priceEggTwo"] = 20000000000000000;
        paramsContract["priceEggThree"] = 10000000000000000;
        
        paramsContract["eggOneRemain"] = 100;
        paramsContract["eggTwoRemain"] = 900;
        paramsContract["eggThreeRemain"] = 9000;
     }

    address addressContract;
    mapping( string => uint ) paramsContract;

    function setParamsContract(string memory keyParams, uint valueParams) external onlyOwner {
        paramsContract[keyParams] = valueParams;
    }

    function getParamsContract(string memory keyParams) external view returns (uint256){
        return paramsContract[keyParams];
    }

    function random(uint8 maxNumber) public returns (uint8) {
        uint256 randomnumber = uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender, paramsContract["nonce"]))) % maxNumber;
        randomnumber = randomnumber ;
        paramsContract["nonce"]++;
        return uint8(randomnumber);
    }

    function setParamsDelegate(string memory keyParams, uint256 valueParams ) external {
        TokenDelegable contrat = TokenDelegable(addressContract);
        contrat.setParamsContract(keyParams, valueParams);
    }

    function mintDelegate(uint8 typeMint) public payable{

        uint8 bonus = 0;
        require(typeMint == 0 || typeMint == 1 || typeMint == 2,"Type not good");
        if(typeMint == 0){
            require(msg.value >= paramsContract["priceEggOne"],"More ETH required");
            require(paramsContract["eggOneRemain"] > 0,"No eggs remaining");
            bonus = 8;
            paramsContract["eggOneRemain"]--;
        }
        if(typeMint == 1){
            require(msg.value >= paramsContract["priceEggTwo"],"More ETH required");
            require(paramsContract["eggTwoRemain"] > 0,"No eggs remaining");
            bonus = 4;
            paramsContract["eggTwoRemain"]--;
        }
        if(typeMint == 2){
            require(msg.value >= paramsContract["priceEggThree"],"More ETH required");
            require(paramsContract["eggThreeRemain"] > 0,"No eggs remaining");
            bonus = 0;
            paramsContract["eggThreeRemain"]--;
        }
        uint8[] memory randomParts = new uint8[](6);
        uint256[] memory randomParams = new uint256[](10);
        randomParts[0] = random(4)+bonus;
        randomParts[1] = random(4)+bonus;
        randomParts[2] = random(4)+bonus;
        randomParts[3] = random(4)+bonus;
        randomParts[4] = random(4)+bonus;
        randomParts[5] = random(4)+bonus;
        randomParams[0] = block.timestamp;
        randomParams[1] = msg.value;
        randomParams[2] = 0;//idreproduce
        randomParams[3] = 0;//mother
        randomParams[4] = 0;//father
        randomParams[5] = 0;//nbrreproduce
        randomParams[6] = paramsContract["nextId"];//tokenId
        randomParams[7] = typeMint;//type
        //_tokenDetails[nextId] = Mystic(0,0,0,randomParts,false,true,block.timestamp,msg.value,0);
        //_safeMint(msg.sender, nextId);
        paramsContract["nextId"]++;

        TokenDelegable contrat = TokenDelegable(addressContract);
        contrat.mint(msg.sender, randomParts, randomParams);
    }

    
    function paramsMystic(uint256 tokenId,bool sellable,bool egg, uint256 tokenIdReproducable) public {
        
        TokenDelegable contrat = TokenDelegable(addressContract);
        TokenDelegable.Mystic memory mysticTemp =  contrat.getTokenDetails(tokenId);
        mysticTemp.inSell = sellable;
        if(mysticTemp.egg != egg) mysticTemp.params256[0] = block.timestamp;
        mysticTemp.egg = egg;
        mysticTemp.params256[1] = tokenIdReproducable;

        contrat.updateToken(mysticTemp,tokenId,msg.sender);
    }

    /*function purchaseAndTransfer(address contactAddr, uint256 tokenId,bool purchase) external payable {
        TokenDelegable contrat = TokenDelegable(addressContract);
        TokenDelegable.Mystic memory mystic =  contrat.getTokenDetails(tokenId);
        require(msg.value >= mystic.params256[1], "Insufficient fonds sent");
        require(contrat.getOwnerOf(tokenId) != (purchase?msg.sender:contactAddr), "Already Owned");
        uint256[] memory resultIndex = contrat.getAllTokensForUser(msg.sender);
        require(resultIndex.length <= 1, "Already have a mystic");
        mystic.inSell=false;
        contrat.updateToken(mystic,tokenId,msg.sender);
        contrat.transfer((purchase?contactAddr:msg.sender), (purchase?msg.sender:contactAddr), tokenId);
    }*/

    function purchase(address contactAddr, uint256 tokenId) external payable {
        TokenDelegable contrat = TokenDelegable(addressContract);
        TokenDelegable.Mystic memory mystic =  contrat.getTokenDetails(tokenId);
        require(msg.value >= mystic.params256[1], "Insufficient fonds sent");
        require(contrat.getOwnerOf(tokenId) != msg.sender, "Already Owned");
        uint256[] memory resultIndex = contrat.getAllTokensForUser(msg.sender);
        require(resultIndex.length <= 1, "Already have a mystic");
        mystic.inSell=false;
        contrat.updateToken(mystic,tokenId,msg.sender);
        contrat.transfer(contactAddr, msg.sender, tokenId);
    }

    function getAllTokensForUser(address user) external view returns (uint256[] memory){
        TokenDelegable contrat = TokenDelegable(addressContract);
        return contrat.getAllTokensForUser(user);
    }

    function getTokenDetails(uint256 tokenId) external view returns (TokenDelegable.Mystic memory){
        TokenDelegable contrat = TokenDelegable(addressContract);
        return contrat.getTokenDetails(tokenId);
    }

    
    /*
    faire l'aléatoire depuis le front et mêttre dans parts one et parts two
    */
    function reproduce( uint256 tokenIdOne, address senderInvit, uint256 tokenIdTwo) public {

        TokenDelegable contrat = TokenDelegable(addressContract);
        TokenDelegable.Mystic memory mysticOne =  contrat.getTokenDetails(tokenIdOne);
        TokenDelegable.Mystic memory mysticTwo =  contrat.getTokenDetails(tokenIdTwo);

        require(mysticOne.params256[0] != 0 && mysticTwo.params256[0] != 0,"Mystic not exist");
        require((tokenIdOne != mysticTwo.params256[3] && tokenIdOne != mysticTwo.params256[4] && tokenIdTwo != mysticOne.params256[3] && tokenIdOne != mysticOne.params256[4] && mysticOne.params256[4] != mysticTwo.params256[4] && mysticOne.params256[4] != mysticTwo.params256[3] && mysticOne.params256[3] != mysticTwo.params256[4] && mysticOne.params256[3] != mysticTwo.params256[3]) || (mysticTwo.params256[3] == 0 && mysticTwo.params256[4] == 0 && mysticOne.params256[3] == 0 && mysticOne.params256[4] == 0) ,"Parently too close");
        require(mysticTwo.params256[2] == tokenIdOne && contrat.getOwnerOf(tokenIdOne) == msg.sender && contrat.getOwnerOf(tokenIdTwo) == senderInvit && mysticTwo.params256[5] < 3 && mysticOne.params256[5] < 3 ,"Too many reproduce time");

        
        uint8[] memory randomParts = new uint8[](6);
        uint256[] memory randomParams = new uint256[](10);
        randomParts[0] = random(2)==0?mysticOne.params8[0]:mysticTwo.params8[0];
        randomParts[1] = random(2)==0?mysticOne.params8[1]:mysticTwo.params8[1];
        randomParts[2] = random(2)==0?mysticOne.params8[2]:mysticTwo.params8[2];
        randomParts[3] = random(2)==0?mysticOne.params8[3]:mysticTwo.params8[3];
        randomParts[4] = random(2)==0?mysticOne.params8[4]:mysticTwo.params8[4];
        randomParts[5] = random(2)==0?mysticOne.params8[5]:mysticTwo.params8[5];
        randomParams[0] = block.timestamp;
        randomParams[1] = mysticOne.params256[1];
        randomParams[2] = 0;//idreproduce
        randomParams[3] = tokenIdOne;//mother
        randomParams[4] = tokenIdTwo;//father
        randomParams[5] = 0;//nbrreproduce

        
        contrat.mint(msg.sender, randomParts, randomParams);paramsContract["nextId"]++;
        randomParts[0] = random(2)==0?mysticOne.params8[0]:mysticTwo.params8[0];
        randomParts[1] = random(2)==0?mysticOne.params8[1]:mysticTwo.params8[1];
        randomParts[2] = random(2)==0?mysticOne.params8[2]:mysticTwo.params8[2];
        randomParts[3] = random(2)==0?mysticOne.params8[3]:mysticTwo.params8[3];
        randomParts[4] = random(2)==0?mysticOne.params8[4]:mysticTwo.params8[4];
        randomParts[5] = random(2)==0?mysticOne.params8[5]:mysticTwo.params8[5];
        contrat.mint(senderInvit, randomParts, randomParams);paramsContract["nextId"]++;
        
        mysticOne.params256[5]++;
        mysticTwo.params256[5]++;
        mysticTwo.params256[1] = 0;
        
        contrat.updateToken(mysticOne,tokenIdOne,msg.sender);
        contrat.updateToken(mysticTwo,tokenIdTwo,senderInvit);
    }


    /*FUNDS*/

    function withdraw() public onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
    }

    function deposit(uint256 amount) payable public onlyOwner {
        require(msg.value == amount);
    }

    function getBalance() public view returns (uint256)  {
        return address(this).balance;
    }

}










contract TokenDelegable is ERC721, Ownable{
    struct  Mystic {
        bool inSell;
        bool egg;
        uint8[] params8;//parts 
        uint256[] params256;//params
    }

    address adressDelegateContract;
    mapping( string => uint ) paramsContract;
    mapping( uint256 => Mystic ) private _tokenDetails;

    constructor(string memory name, string memory symbol) ERC721(name, symbol){
        paramsContract["nextId"] = 0;
        paramsContract["nbrMystic"] = 0;
    }

    modifier byDelegate() {
        require(msg.sender == adressDelegateContract,"Not good delegate contract");
        _;
    }

    function mint(address sender, uint8[] memory params8, uint256[] memory params256) external payable {
        _tokenDetails[paramsContract["nextId"]] = Mystic(false,true,params8,params256);
        _safeMint(sender, paramsContract["nextId"]);
        paramsContract["nextId"]++;
        paramsContract["nbrMystic"]++;
    }
    
    function burn(uint256 tokenId) public byDelegate {
        _burn(tokenId);
        paramsContract["nbrMystic"]--;
    }

    function transfer(address from, address to ,uint256 tokenId) external byDelegate {
        _safeTransfer(from, to, tokenId, "");
    }

    function getTokenDetails(uint256 tokenId) external view returns (Mystic memory){
        return _tokenDetails[tokenId];
    }

    function getAllTokensForUser(address user) external view returns (uint256[] memory){
        uint256 tokenCount = balanceOf(user);
        if(tokenCount == 0){
            return new uint256[](0);
        }
        else{
            uint[] memory result = new uint256[](tokenCount);
            uint256 totalMystics = paramsContract["nextId"];
            uint256 resultIndex = 0;
            uint256 i;
            for(i = 0; i < totalMystics; i++){
                if(ownerOf(i) == user){
                    result[resultIndex] = i;
                    resultIndex++;
                }
            }
            return result;
        }
    }

    function getOwnerOf(uint256 tokenId) external view returns (address) {
        return ownerOf(tokenId);
    }

    function updateToken(Mystic memory mysticTemp,uint256 tokenId,address owner) external byDelegate {
        require(ownerOf(tokenId) == owner,"Not Your mystic");
        _tokenDetails[tokenId] = mysticTemp;
    }

    function setParamsContract(string memory keyParams, uint valueParams) external onlyOwner {
        paramsContract[keyParams] = valueParams;
    }

    function getParamsContract(string memory keyParams) external view returns (uint){
        return paramsContract[keyParams];
    }

    function setAdressDelegateContract(address _adress) external onlyOwner {
        adressDelegateContract = _adress;
    }

}

