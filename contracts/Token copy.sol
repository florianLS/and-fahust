pragma solidity 0.8.0;

import '../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '../node_modules/@openzeppelin/contracts/access/Ownable.sol';

contract Token is ERC721, Ownable{
    struct  Mystic {
        //uint8 damage;
        //uint8 magic;
        //uint8 lucky;
        //uint16 life;
        //uint256 lastMeal;
        //uint256 lastTrain;
        uint8 price;
        //uint16 exp;
        //uint8 lvl;

        //uint256 lastReproduce;
        uint8 numberReproduce;

        uint8 beak;//bec (bouche)
        uint8 eye;
        uint8 ears;//oreilles
        uint8 horn;//cornes
        uint8 color;
        uint8 body;
        uint256 createdAt;
    }
    
    uint256 nextId = 0;
    uint256 balance = 0;

    mapping( uint256 => Mystic ) private _tokenDetails;

    constructor(string memory name, string memory symbol) ERC721(name, symbol){ }

    function mint(uint8 price, uint8 beak, uint8 eye, uint8 ears, uint8 horn, uint8 color, uint8 body) public onlyOwner {
        _tokenDetails[nextId] = Mystic(price,0,beak,eye,ears,horn,color,body,block.timestamp);
        _safeMint(msg.sender, nextId);
        nextId++;
    }

    /*function partsPoints(uint8 part) public returns  (uint8){//max 24
        if(part==0)return 12;
        if(part==1)return 4;
        if(part==2)return 6;
        if(part==3)return 18;
    }*/
    
    /*

    */
    function reproduce(uint8 priceOne, uint8[] memory partsOne, address addrOne, uint256 tokenIdOne, uint8 priceTwo, uint8[] memory partsTwo, address addrTwo, uint256 tokenIdTwo) public onlyOwner {//faire l'aléatoire depuis le front et mêttre dans parts one et parts two
        require(_tokenDetails[tokenIdOne].createdAt != 0,"Mystic not exist");
        require(_tokenDetails[tokenIdTwo].createdAt != 0,"Mystic not exist");
        //require(_tokenDetails[tokenIdOne].lastReproduce+2629800000 < block.timestamp,"Mystic reproduce too close (1 month)");
        //require(_tokenDetails[tokenIdTwo].lastReproduce+2629800000 < block.timestamp,"Mystic reproduce too close (1 month)");

        /*uint8 damage = partsPoints(partsOne[0]);
        uint8 magic = partsPoints(partsOne[1]);
        uint8 lucky = partsPoints(partsOne[2]);
        uint8 life = partsPoints(partsOne[3]);*/

        _tokenDetails[nextId] = Mystic(priceOne,_tokenDetails[tokenIdOne].numberReproduce+1,partsOne[0],partsOne[1],partsOne[2],partsOne[3],partsOne[4],partsOne[5],block.timestamp);
        _safeMint(addrOne, nextId);
        nextId++;

        _tokenDetails[nextId] = Mystic(priceTwo,_tokenDetails[tokenIdTwo].numberReproduce+1,partsOne[0],partsOne[1],partsOne[2],partsOne[3],partsOne[4],partsOne[5],block.timestamp);
        _safeMint(addrTwo, nextId);
        nextId++;
    }

    function getTokenDetails(uint256 tokenId) public view returns (Mystic memory){
        return _tokenDetails[tokenId];
    }

    function getAllTokensForUser(address user) public view returns (uint256[] memory){
        uint256 tokenCount = balanceOf(user);
        if(tokenCount == 0){
            return new uint256[](0);
        }
        else{
            uint[] memory result = new uint256[](tokenCount);
            uint256 totalMystics = nextId;
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

    function transfer(address to, uint256 tokenId) public {
        require(_tokenDetails[tokenId].createdAt != 0,"Mystic not exist");
        _safeTransfer(msg.sender, to, tokenId, "");
    }

    /*function feed(uint256 tokenId) public {
        Mystic storage mystic = _tokenDetails[tokenId];
        //require(mystic.lastMeal + mystic.endurance > block.timestamp);
        mystic.lastMeal = block.timestamp;
    }*/

    function purchase(address contactAddr, uint256 tokenId, uint256 amount) external payable {
        balance = balance+msg.value;
        Mystic memory mystic = _tokenDetails[tokenId];
        require(msg.value >= mystic.price * amount, "insufficient fonds sent");
    }

    /*function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal override {
        Mystic storage mystic = _tokenDetails[nextId];
        require(mystic.lastMeal + mystic.endurance > block.timestamp);
    }*/

}