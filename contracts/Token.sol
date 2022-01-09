pragma solidity 0.8.0;

import '../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '../node_modules/@openzeppelin/contracts/access/Ownable.sol';

contract Token is ERC721, Ownable{
    /**
    Ici on créer l'objet Token avec lequel on remplira des variables
     */
    struct  Mystic {
        uint8 price;
        uint8 numberReproduce;
        uint8[] parts;
        uint8 tokenIdReproducable;
        bool inSell;
        bool egg;
        uint256 createdAt;
    }
    
    uint256 nextId = 1;//Le premier Id token et on incrémente a chaque création
    uint256 nbrMystic = 0;//Le nombre total de token
    uint256 balance = 0;//Le nombre d'eth envoyé sur le contrat

    mapping( uint256 => Mystic ) private _tokenDetails;

    constructor(string memory name, string memory symbol) ERC721(name, symbol){ }

    /**
    Fonction de création de token
     */
    function mint(uint8 price, uint8[] memory parts) public  {//onlyOwner
        _tokenDetails[nextId] = Mystic(price,0,parts,0,false,true,block.timestamp);
        _safeMint(msg.sender, nextId);
        nextId++;nbrMystic++;
    }

    /**
    Quand meurs de veillesse ou jeter le burn
     */
    // function burn(uint256 tokenId) public{
    //     _burn(tokenId);
    //     nbrMystic--;
    // }
    
    /*
    faire l'aléatoire depuis le front et mêttre dans parts one et parts two
    */
    function reproduce( uint8[] memory partsOne, uint256 tokenIdOne, uint8[] memory partsTwo, address senderInvit, uint256 tokenIdTwo) public {
        require(_tokenDetails[tokenIdOne].createdAt != 0,"Mystic not exist");
        require(_tokenDetails[tokenIdTwo].createdAt != 0,"Mystic not exist");
        
        if(_tokenDetails[tokenIdTwo].tokenIdReproducable == tokenIdOne && ownerOf(tokenIdOne) == msg.sender && ownerOf(tokenIdTwo) == senderInvit && _tokenDetails[tokenIdTwo].numberReproduce < 3 && _tokenDetails[tokenIdOne].numberReproduce < 3 ){
            _tokenDetails[nextId] = Mystic(_tokenDetails[tokenIdOne].price,_tokenDetails[tokenIdOne].numberReproduce+1,partsOne,0,false,true,block.timestamp);
            _safeMint(msg.sender, nextId);
            nextId++;

            _tokenDetails[nextId] = Mystic(_tokenDetails[tokenIdTwo].price,_tokenDetails[tokenIdTwo].numberReproduce+1,partsTwo,0,false,true,block.timestamp);
            _safeMint(senderInvit, nextId);
            nextId++;
            _tokenDetails[tokenIdTwo].tokenIdReproducable = 0;
        }
    }

    /**
    Récupérer le token et ces variable grace a son token id
     */
    function getTokenDetails(uint256 tokenId) public view returns (Mystic memory){
        return _tokenDetails[tokenId];
    }

    /**
    ça c'est pour modifier la variable qui contient le token id avec lequel le joueur veux reproduire son token
    En vrai ont pourrais la bouger dans params ce sera plus leger pour le contrat
     */
    function addSubInvitation(uint256 tokenId, uint8 tokenIdReproducable, bool add) public {
        if(ownerOf(tokenId) == msg.sender) _tokenDetails[tokenId].tokenIdReproducable = (add?tokenIdReproducable:0);
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
        uint256 tokenCount = balanceOf((purchase?msg.sender:contactAddr));
        uint[] memory result = new uint256[](tokenCount);
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
    function params(uint256 tokenId,bool sellable,bool egg) public {
        require(ownerOf(tokenId) == msg.sender,"Not Your mystic");
        _tokenDetails[tokenId].inSell = sellable;
        if(_tokenDetails[tokenId].egg != egg) _tokenDetails[tokenIdTwo].createdAt = block.timestamp;
        _tokenDetails[tokenId].egg = egg;
    }

}