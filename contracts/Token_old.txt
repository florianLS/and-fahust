pragma solidity 0.8.0;

import '../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '../node_modules/@openzeppelin/contracts/access/Ownable.sol';

contract DelegateContract {
    address addressContract;

    function setAddress(address _address) external{
        addressContract = _address;
    }

}

contract Token is ERC721, Ownable{
    /**
    Ici on créer l'objet Token avec lequel on remplira des variables
     */
    struct  Mystic {
        uint8 numberReproduce;
        uint8 mother;
        uint8 father;
        uint8[] parts;
        bool inSell;
        bool egg;
        uint256 createdAt;
        uint256 price;
        uint256 tokenIdReproducable;
    }

    uint256 priceEggOne = 100000000000000000;
    uint256 priceEggTwo= 20000000000000000;
    uint256 priceEggThree = 10000000000000000;
    uint256 nonce = 0;
    uint256 nextId = 0;//Le premier Id token et on incrémente a chaque création
    uint256 nbrMystic = 0;//Le nombre total de token
    uint256 balance = 0;//Le nombre d'eth envoyé sur le contrat

    mapping( uint256 => Mystic ) private _tokenDetails;

    constructor(string memory name, string memory symbol) ERC721(name, symbol){ }

    /**
    Fonction de création de token
     */
    function mint(uint8 typeMint) public payable {//onlyOwner
        uint8 bonus = 0;
        require(typeMint == 1 || typeMint == 2 || typeMint == 3,"Type not good");
        if(typeMint == 1){require(msg.value >= priceEggOne,"0.1 ETH required");bonus = 8;}
        if(typeMint == 2){require(msg.value >= priceEggTwo,"0.02 ETH required");bonus = 4;}
        if(typeMint == 3){require(msg.value >= priceEggThree,"0.01 ETH required");bonus = 0;}
        uint8[] memory randomParts = new uint8[](6);
        randomParts[0] = random(4)+bonus;
        randomParts[1] = random(4)+bonus;
        randomParts[2] = random(4)+bonus;
        randomParts[3] = random(4)+bonus;
        randomParts[4] = random(4)+bonus;
        randomParts[5] = random(4)+bonus;
        _tokenDetails[nextId] = Mystic(0,0,0,randomParts,false,true,block.timestamp,msg.value,0);
        _safeMint(msg.sender, nextId);
        nextId++;nbrMystic++;
    }

    /**
    Quand meurs de veillesse ou jeter le burn
     */
    function priceEgg(uint256 price, uint8 typeEgg) public onlyOwner {
        if(typeEgg==1) priceEggOne = price;
        if(typeEgg==2) priceEggTwo = price;
        if(typeEgg==3) priceEggThree = price;
    }

    /**
    Quand meurs de veillesse ou jeter le burn
     */
    function burn(uint256 tokenId) public{
        _burn(tokenId);
        nbrMystic--;
    }
    
    /*
    faire l'aléatoire depuis le front et mêttre dans parts one et parts two
    */
    function reproduce( uint8[] memory partsOne, uint256 tokenIdOne, uint8[] memory partsTwo, address senderInvit, uint256 tokenIdTwo) public {
        require(_tokenDetails[tokenIdOne].createdAt != 0 && _tokenDetails[tokenIdTwo].createdAt != 0,"Mystic not exist");
        require((tokenIdOne != _tokenDetails[tokenIdTwo].mother && tokenIdOne != _tokenDetails[tokenIdTwo].father && tokenIdTwo != _tokenDetails[tokenIdOne].mother && tokenIdOne != _tokenDetails[tokenIdOne].father && _tokenDetails[tokenIdOne].father != _tokenDetails[tokenIdTwo].father && _tokenDetails[tokenIdOne].father != _tokenDetails[tokenIdTwo].mother && _tokenDetails[tokenIdOne].mother != _tokenDetails[tokenIdTwo].father && _tokenDetails[tokenIdOne].mother != _tokenDetails[tokenIdTwo].mother) || (_tokenDetails[tokenIdTwo].mother == 0 && _tokenDetails[tokenIdTwo].father == 0 && _tokenDetails[tokenIdOne].mother == 0 && _tokenDetails[tokenIdOne].father == 0) ,"Parently too close");
        require(_tokenDetails[tokenIdTwo].tokenIdReproducable == tokenIdOne && ownerOf(tokenIdOne) == msg.sender && ownerOf(tokenIdTwo) == senderInvit && _tokenDetails[tokenIdTwo].numberReproduce < 3 && _tokenDetails[tokenIdOne].numberReproduce < 3 ,"Too many reproduce time");
        
        _tokenDetails[nextId] = Mystic(0,0,0,partsOne,false,true,block.timestamp,_tokenDetails[tokenIdOne].price,0);
        _safeMint(msg.sender, nextId);
        nextId++;

        _tokenDetails[nextId] = Mystic(0,0,0,partsTwo,false,true,block.timestamp,_tokenDetails[tokenIdTwo].price,0);
        _safeMint(senderInvit, nextId);
        nextId++;
        
        _tokenDetails[tokenIdOne].numberReproduce++;
        _tokenDetails[tokenIdTwo].numberReproduce++;
        _tokenDetails[tokenIdTwo].tokenIdReproducable = 0;
    }

    /**
    Récupérer le token et ces variable grace a son token id
     */
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

    /*function transfer(address to, uint256 tokenId) public {
        require(_tokenDetails[tokenId].createdAt != 0,"Mystic not exist");
        require(ownerOf(tokenId) == msg.sender,"Not Your mystic");
        require(ownerOf(tokenId) != to, "User already owned this mystic");
        uint256 tokenCount = balanceOf(to);
        if(tokenCount == 0){
            _safeTransfer(msg.sender, to, tokenId, "");
        }
        else{
            uint[] memory result = new uint256[](tokenCount);
            uint256 totalMystics = nextId;
            uint256 resultIndex = 0;
            uint256 i;
            for(i = 0; i < totalMystics; i++){
                if(ownerOf(i) == to && _tokenDetails[i].egg == false){
                    resultIndex++;
                }
            }
            require(resultIndex <= 1, "User already have a mystic");
            _safeTransfer(msg.sender, to, tokenId, "");
        }
    }

    function purchase(address contactAddr, uint256 tokenId, uint256 amount) external payable {
        balance = balance+msg.value;
        Mystic memory mystic = _tokenDetails[tokenId];
        require(msg.value >= mystic.price * amount, "insufficient fonds sent");
        require(ownerOf(tokenId) != msg.sender, "Already Owned");
        uint256 tokenCount = balanceOf(msg.sender);
        if(tokenCount == 0){
            _safeTransfer(contactAddr, msg.sender, tokenId, "");
        }
        else{
            uint[] memory result = new uint256[](tokenCount);
            uint256 totalMystics = nextId;
            uint256 resultIndex = 0;
            uint256 i;
            for(i = 0; i < totalMystics; i++){
                if(ownerOf(i) == msg.sender && _tokenDetails[i].egg == false){
                    resultIndex++;
                }
            }
            require(resultIndex <= 1, "Already have a mystic");
            _safeTransfer(contactAddr, msg.sender, tokenId, "");
        }
    }*/

    /**
    Fonction de transfer ou d'achat d'un token d'un compte user a un autre en passant par metamask, ultra secure
    Et comme tu le vois au dessus, y avais les mêmes fonctions sauf que pour l'opti je les ai transformer en une fonction plus légère
     */
    function purchaseAndTransfer(address contactAddr, uint256 tokenId, uint256 amount,bool purchase) external payable {
        balance = balance+msg.value;
        Mystic memory mystic = _tokenDetails[tokenId];
        if(amount != 0) require(msg.value >= mystic.price * amount, "Insufficient fonds sent");
        require(ownerOf(tokenId) != (purchase?msg.sender:contactAddr), "Already Owned");
        uint256 totalMystics = nextId;
        uint256 resultIndex = 0;
        uint256 i;
        for(i = 0; i < totalMystics; i++){
            if(ownerOf(i) == (purchase?msg.sender:contactAddr) && _tokenDetails[i].egg == false){
                resultIndex++;
            }
        }
        require(resultIndex <= 1, "Already have a mystic");
        _tokenDetails[i].inSell=false;
        _safeTransfer((purchase?contactAddr:msg.sender), (purchase?msg.sender:contactAddr), tokenId, "");
    }

    /**
    Modifier les paramètre d'un token en utilisant son id
     */
    function paramsMystic(uint256 tokenId,bool sellable,bool egg, uint8 tokenIdReproducable) public {
        require(ownerOf(tokenId) == msg.sender,"Not Your mystic");
        _tokenDetails[tokenId].inSell = sellable;
        if(_tokenDetails[tokenId].egg != egg) _tokenDetails[tokenId].createdAt = block.timestamp;
        _tokenDetails[tokenId].egg = egg;
        _tokenDetails[tokenId].tokenIdReproducable = tokenIdReproducable;
    }

    function random(uint8 maxNumber) public returns (uint8) {
        uint256 randomnumber = uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender, nonce))) % maxNumber;
        randomnumber = randomnumber ;
        nonce++;
        return uint8(randomnumber);
    }

}