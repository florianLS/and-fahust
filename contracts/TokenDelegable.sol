pragma solidity 0.8.0;

import '../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '../node_modules/@openzeppelin/contracts/access/Ownable.sol';

contract DelegateContract is Ownable {

    constructor(address _addressContract) {
        addressContract = _addressContract;
        TokenDelegable contrat = TokenDelegable(addressContract);
        paramsContract["nextId"] = contrat.getParamsContract("nextId");
        paramsContract["priceEggOne"] = 100000000000000000000;//dev:100000000000000000
        paramsContract["priceEggTwo"] = 20000000000000000000;//dev:20000000000000000
        paramsContract["priceEggThree"] = 10000000000000000000;//dev:10000000000000000
        
        paramsContract["eggOneRemain"] = 1000;
        paramsContract["eggTwoRemain"] = 3000;
        paramsContract["eggThreeRemain"] = 6000;
    }

    address addressContract;
    mapping( string => uint ) paramsContract;

    function setAddressContract(address _addressContract) external onlyOwner {
        addressContract = _addressContract;
    }

    function setParamsContract(string memory keyParams, uint valueParams) external onlyOwner {
        paramsContract[keyParams] = valueParams;
    }

    function getParamsContract(string memory keyParams) external view returns (uint256){
        return paramsContract[keyParams];
    }

    function setParamsDelegate(string memory keyParams, uint256 valueParams ) external {
        TokenDelegable contrat = TokenDelegable(addressContract);
        contrat.setParamsContract(keyParams, valueParams);
    }

    function randomParams8(uint8 bonus) internal virtual returns (uint8[] memory) {
        uint8[] memory randomParts = new uint8[](6);
        randomParts[0] = random(4);//color
        randomParts[1] = random(4)+bonus;//part1
        randomParts[2] = random(4)+bonus;//part2
        randomParts[3] = random(4)+bonus;//part3
        randomParts[4] = random(4)+bonus;//part4
        return randomParts;
    }

    function randomParams256(uint256 price, uint8 typeMint) internal virtual returns (uint256[] memory) {
        uint256[] memory randomParams = new uint256[](10);
        randomParams[0] = block.timestamp;
        randomParams[1] = price;
        randomParams[2] = 0;//idreproduce
        randomParams[3] = 0;//mother
        randomParams[4] = 0;//father
        randomParams[5] = 0;//nbrreproduce
        randomParams[6] = paramsContract["nextId"];//tokenId
        randomParams[7] = typeMint;//type
        return randomParams;
    }

    function giveNyxie(uint8 typeMint, address to) public onlyOwner{
        uint8 bonus = 0;
        uint256 price = 0;
        require(typeMint == 0 || typeMint == 1 || typeMint == 2,"Type not good");
        if(typeMint == 0){
            bonus = 8;
            price = paramsContract["priceEggOne"];
        }else if(typeMint == 1){
            bonus = 4;
            price = paramsContract["priceEggTwo"];
        }else if(typeMint == 2){
            bonus = 0;
            price = paramsContract["priceEggThree"];
        }

        uint8[] memory randomParts = randomParams8(bonus);
        uint256[] memory randomParams = randomParams256(price,typeMint);
        paramsContract["nextId"]++;

        TokenDelegable contrat = TokenDelegable(addressContract);
        contrat.mint(to, randomParts, randomParams);
    }

    function mintDelegate(uint8 typeMint) public payable{
        uint8 bonus = 0;
        require(typeMint == 0 || typeMint == 1 || typeMint == 2,"Type not good");
        if(typeMint == 0){
            require(msg.value >= paramsContract["priceEggOne"],"More ETH required");
            require(paramsContract["eggOneRemain"] > 0,"No eggs remaining");
            bonus = 8;
            paramsContract["eggOneRemain"]--;
        }else if(typeMint == 1){
            require(msg.value >= paramsContract["priceEggTwo"],"More ETH required");
            require(paramsContract["eggTwoRemain"] > 0,"No eggs remaining");
            bonus = 4;
            paramsContract["eggTwoRemain"]--;
        }else if(typeMint == 2){
            require(msg.value >= paramsContract["priceEggThree"],"More ETH required");
            require(paramsContract["eggThreeRemain"] > 0,"No eggs remaining");
            bonus = 0;
            paramsContract["eggThreeRemain"]--;
        }
        
        uint8[] memory randomParts = randomParams8(bonus);
        uint256[] memory randomParams = randomParams256(msg.value,typeMint);
        paramsContract["nextId"]++;

        //uint256 number = uint256(typeMint+1);
        TokenDelegable contrat = TokenDelegable(addressContract);
        contrat.mint(msg.sender, randomParts, randomParams);
    }

    
    function paramsNyxies(uint256 tokenId,bool sellable,bool egg, uint256 tokenIdReproducable) public {
        
        TokenDelegable contrat = TokenDelegable(addressContract);
        TokenDelegable.Nyxies memory nyxiesTemp =  contrat.getTokenDetails(tokenId);
        nyxiesTemp.inSell = sellable;
        if(nyxiesTemp.egg != egg) nyxiesTemp.params256[0] = block.timestamp;
        nyxiesTemp.egg = egg;
        nyxiesTemp.params256[2] = tokenIdReproducable;

        contrat.updateToken(nyxiesTemp,tokenId,msg.sender);
    }

    function transfer(address contactAddr, uint256 tokenId) external payable {
        TokenDelegable contrat = TokenDelegable(addressContract);
        require(contrat.getOwnerOf(tokenId) != msg.sender, "Not your nixies");
        contrat.transfer(contactAddr, msg.sender, tokenId);
    }

    function purchase(address contactAddr, uint256 tokenId) external payable {//vendre que des oeufs
        TokenDelegable contrat = TokenDelegable(addressContract);
        TokenDelegable.Nyxies memory nyxie = contrat.getTokenDetails(tokenId);
        require(msg.value >= nyxie.params256[1], "Insufficient fonds sent");
        require(contrat.getOwnerOf(tokenId) != msg.sender, "Already Owned");
        /*if(nyxie.egg == false){
            uint256[] memory resultIndex = contrat.getAllTokensForUser(msg.sender);
            bool alreadyHaveAdult = false;
            uint256 i;
            for(i = 0; i < resultIndex.length; i++){
                //TokenDelegable.Nyxies memory nyxieOwned = contrat.getTokenDetails(resultIndex[i]);
                if(contrat.getTokenDetails(resultIndex[i]).egg == false) alreadyHaveAdult = true;
            }
            require(alreadyHaveAdult == false, "Already have a nyxies");
        }*/
        nyxie.inSell=false;
        contrat.updateToken(nyxie,tokenId,msg.sender);
        contrat.transfer(contactAddr, msg.sender, tokenId);
    }

    function getAllTokensForUser(address user) external view returns (uint256[] memory){
        TokenDelegable contrat = TokenDelegable(addressContract);
        return contrat.getAllTokensForUser(user);
    }

    function getTokenDetails(uint256 tokenId) external view returns (TokenDelegable.Nyxies memory){
        TokenDelegable contrat = TokenDelegable(addressContract);
        return contrat.getTokenDetails(tokenId);
    }

    /*function reproduce( uint256 tokenIdOne, address senderInvit, uint256 tokenIdTwo) public {

        TokenDelegable contrat = TokenDelegable(addressContract);
        TokenDelegable.Nyxies memory nyxiesOne =  contrat.getTokenDetails(tokenIdOne);
        TokenDelegable.Nyxies memory nyxiesTwo =  contrat.getTokenDetails(tokenIdTwo);

        require(nyxiesOne.params256[0] != 0 && nyxiesTwo.params256[0] != 0,"Nyxies not exist");
        require((tokenIdOne != nyxiesTwo.params256[3] && tokenIdOne != nyxiesTwo.params256[4] && tokenIdTwo != nyxiesOne.params256[3] && tokenIdOne != nyxiesOne.params256[4] && nyxiesOne.params256[4] != nyxiesTwo.params256[4] && nyxiesOne.params256[4] != nyxiesTwo.params256[3] && nyxiesOne.params256[3] != nyxiesTwo.params256[4] && nyxiesOne.params256[3] != nyxiesTwo.params256[3]) || (nyxiesTwo.params256[3] == 0 && nyxiesTwo.params256[4] == 0 && nyxiesOne.params256[3] == 0 && nyxiesOne.params256[4] == 0) ,"Parently too close");
        require(nyxiesTwo.params256[2] == tokenIdOne && contrat.getOwnerOf(tokenIdOne) == msg.sender && contrat.getOwnerOf(tokenIdTwo) == senderInvit && nyxiesTwo.params256[5] < 3 && nyxiesOne.params256[5] < 3 ,"Too many reproduce time");

        
        uint8[] memory randomParts = new uint8[](6);
        uint256[] memory randomParams = new uint256[](10);
        randomParts[0] = random(2)==0?nyxiesOne.params8[0]:nyxiesTwo.params8[0];
        randomParts[1] = random(2)==0?nyxiesOne.params8[1]:nyxiesTwo.params8[1];
        randomParts[2] = random(2)==0?nyxiesOne.params8[2]:nyxiesTwo.params8[2];
        randomParts[3] = random(2)==0?nyxiesOne.params8[3]:nyxiesTwo.params8[3];
        randomParts[4] = random(2)==0?nyxiesOne.params8[4]:nyxiesTwo.params8[4];
        randomParts[5] = random(2)==0?nyxiesOne.params8[5]:nyxiesTwo.params8[5];
        randomParams[0] = block.timestamp;
        randomParams[1] = (nyxiesOne.params256[1]+nyxiesTwo.params256[1])/2;
        randomParams[2] = 0;//idreproduce
        randomParams[3] = tokenIdOne;//mother
        randomParams[4] = tokenIdTwo;//father
        randomParams[5] = 0;//nbrreproduce
        randomParams[6] = paramsContract["nextId"];//tokenId
        randomParams[7] = 3;//type

        
        contrat.mint(msg.sender, randomParts, randomParams);
        paramsContract["nextId"]++;
        randomParts[0] = random(2)==0?nyxiesOne.params8[0]:nyxiesTwo.params8[0];
        randomParts[1] = random(2)==0?nyxiesOne.params8[1]:nyxiesTwo.params8[1];
        randomParts[2] = random(2)==0?nyxiesOne.params8[2]:nyxiesTwo.params8[2];
        randomParts[3] = random(2)==0?nyxiesOne.params8[3]:nyxiesTwo.params8[3];
        randomParts[4] = random(2)==0?nyxiesOne.params8[4]:nyxiesTwo.params8[4];
        randomParts[5] = random(2)==0?nyxiesOne.params8[5]:nyxiesTwo.params8[5];
        randomParams[6] = paramsContract["nextId"];//tokenId
        contrat.mint(senderInvit, randomParts, randomParams);
        paramsContract["nextId"]++;
        
        nyxiesOne.params256[5]++;
        nyxiesTwo.params256[5]++;
        nyxiesTwo.params256[1] = 0;
        
        contrat.updateToken(nyxiesOne,tokenIdOne,msg.sender);
        contrat.updateToken(nyxiesTwo,tokenIdTwo,senderInvit);
    }*/

    function random(uint8 maxNumber) public returns (uint8) {
        uint256 randomnumber = uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender, paramsContract["nonce"]))) % maxNumber;
        paramsContract["nonce"]++;
        return uint8(randomnumber);
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





contract TokenDelegable is ERC721Enumerable, Ownable{
    using Strings for uint256;
    
    struct Nyxies {
        bool inSell;
        bool egg;
        uint8[] params8;//parts 
        uint256[] params256;//params
    }

    address adressDelegateContract;
    mapping( string => uint ) paramsContract;
    mapping( uint256 => Nyxies ) private _tokenDetails;
    string public baseURI;
    string public baseExtension = ".json";
    bool public paused = false;

    constructor(string memory name, string memory symbol, string memory _initBaseURI) ERC721(name, symbol){
        paramsContract["nextId"] = 0;
        paramsContract["nbrNyxies"] = 0;
        setBaseURI(_initBaseURI);
    }

    function multipleMintOwner(uint8 number) public onlyOwner{
        for(uint8 i = 0; i < number; i++){
            uint8[] memory params8 = new uint8[](6);
            params8[0] = random(4);//color
            params8[1] = random(4);//part1
            params8[2] = random(4);//part2
            params8[3] = random(4);//part3
            params8[4] = random(4);//part4
            uint256[] memory params256 = new uint256[](10);
            params256[0] = block.timestamp;
            params256[1] = 10000000000000000000;
            params256[2] = 0;//idreproduce
            params256[3] = 0;//mother
            params256[4] = 0;//father
            params256[5] = 0;//nbrreproduce
            params256[6] = paramsContract["nextId"];//tokenId
            params256[7] = 2;//type
            _tokenDetails[paramsContract["nextId"]] = Nyxies(false,true,params8,params256);
            _safeMint(msg.sender, paramsContract["nextId"]);
            paramsContract["nextId"]++;
        }
    }

    function random(uint8 maxNumber) public returns (uint8) {
        uint256 randomnumber = uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender, paramsContract["nonce"]))) % maxNumber;
        paramsContract["nonce"]++;
        return uint8(randomnumber);
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }

     function setBaseURI(string memory _newBaseURI) public onlyOwner {
        baseURI = _newBaseURI;
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require( _exists(tokenId), "ERC721Metadata: URI query for nonexistent token" );
        string memory currentBaseURI = _baseURI();
        return bytes(currentBaseURI).length > 0 ? string(abi.encodePacked(currentBaseURI, tokenId.toString(), baseExtension)) : "";
    }

    modifier byDelegate() {
        require((msg.sender == adressDelegateContract || adressDelegateContract == address(0))&& !paused,"Not good delegate contract");
        _;
    }

    function pause(bool _state) public onlyOwner {
        paused = _state;
    }

    function mint(address sender, uint8[] memory params8, uint256[] memory params256) external payable byDelegate {
        _tokenDetails[paramsContract["nextId"]] = Nyxies(false,true,params8,params256);
        _safeMint(sender, paramsContract["nextId"]);
        paramsContract["nextId"]++;
        paramsContract["nbrNyxies"]++;
    }
    
    function burn(uint256 tokenId) public byDelegate {
        _burn(tokenId);
        paramsContract["nbrNyxies"]--;
    }

    function transfer(address from, address to ,uint256 tokenId) external byDelegate {
        _safeTransfer(from, to, tokenId, "");
    }

    function getTokenDetails(uint256 tokenId) external view returns (Nyxies memory){
        return _tokenDetails[tokenId];
    }

    function getAllTokensForUser(address user) external view returns (uint256[] memory){
        uint256 tokenCount = balanceOf(user);
        if(tokenCount == 0){
            return new uint256[](0);
        }
        else{
            uint[] memory result = new uint256[](tokenCount);
            uint256 totalNyxiess = paramsContract["nextId"];
            uint256 resultIndex = 0;
            uint256 i;
            for(i = 0; i < totalNyxiess; i++){
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

    function getBalanceOf(address user) external view returns (uint) {
        return balanceOf(user);
    }

    function updateToken(Nyxies memory nyxiesTemp,uint256 tokenId,address owner) external byDelegate {
        require(ownerOf(tokenId) == owner,"Not Your nyxies");
        _tokenDetails[tokenId] = nyxiesTemp;
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
