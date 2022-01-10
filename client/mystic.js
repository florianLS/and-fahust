var life = 0;
var hungry = 0;
var cleanliness = 0;
var moral = 0;
var rested = 0;

/**
   * Créer un mystic de façon aléatoire et l'envoyé vers le contrat intélligent
   */
  async function mint() {
    window.web3 = await Moralis.Web3.enableWeb3();
    let abi = await getAbi();
    let contract = new web3.eth.Contract(abi, CONTRACT_ADDRESS);
    let minted = await contract.methods.mint(1,[randRang(0, 4),randRang(0, 4),randRang(0, 4),randRang(0, 4),randRang(0, 4),randRang(0, 4)]).send({from: ethereum.selectedAddress,gasPrice: '1',}).catch((error)=>{console.log(error)}).then((success)=>{
      console.log(success)
    });
    //renderGame();
  }


  /**
   * démarage du jeu après connection, affiché les buttons, connection au contrat puis trouver le mystic et les oeufs de l'user, les affichés, puis envoyé ces datas au serveur node.js
   */
  async function renderGame(){
    $("#btn-login").hide("slow");
    $("#btn-show").hide("slow");
    $("#btn-transfer").show("slow");
    $("#btn-logout").show("slow");
    $("#btn-my").show("slow");
    $("#btn-all").show("slow");
    $("#contentBody").show("slow");
    $("#myMystics").hide("slow").show("slow")
    //$("#myEggs").show("slow")

    navAllUnactive();
    $("#btn-my").addClass("active");

    window.web3 = await Moralis.Web3.enableWeb3();
    let abi = await getAbi();
    let contract = new web3.eth.Contract(abi, CONTRACT_ADDRESS);
    let mystics = await contract.methods.getAllTokensForUser(ethereum.selectedAddress).call({from: ethereum.selectedAddress}).catch((error)=>{console.log(error)});
    var lastMystic=undefined;
    var lastIdMystic=undefined;
    $("#myMystics").html('');
    renderEggs = '';
    await mystics.forEach((MSTC) => {
      //error map viens d'ici
      contract.methods.getTokenDetails(MSTC).call({from: ethereum.selectedAddress}).catch((error)=>{console.log(error)}).then((data)=>{
        if(data.egg==true){
          if(renderEggs == '') renderEggs += '<div class="row">';
          renderEggs += renderEgg(MSTC,data,true,ethereum.selectedAddress)
        }else{
          lastMystic = data;
          lastIdMystic = MSTC;
          myMysticId = MSTC;
        }
      });
    })

    
      setTimeout(() => {
        if(renderEggs != '') $("#myEggs").html(renderEggs+"</div>");
        if(lastMystic){
          mintToNodeServer(lastMystic,lastIdMystic)
          console.log($(".born").length)
          $(".born").remove()
        } 
      }, 500);
    
  }

  /**
   * Appels vers le serveur pour récuperer tous les mystics enregistré dans le serveur puis les affichés
   */
  function allMystics(){
    $("#myMystics").hide("slow").show("slow")
    $("#myEggs").hide("slow")
    fetch('http://localhost:3000/getAllMystics', {
    method: 'get',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
  }).then(res => res.json())
    .then(res => {
      navAllUnactive();
      $("#btn-all").addClass("active");
      var allMysticsRender = "";
      Object.keys(res).forEach((MSTC) => {
          allMysticsRender += renderMystic(res[MSTC].mystic.id,res[MSTC],(parseInt(MSTC)==parseInt(ethereum.selectedAddress))?true:false,MSTC);
      })
      $("#myMystics").html(allMysticsRender);
    });
  }

  /**
   * A la connection, envoyé le mystic dans le serveur node js
   */
  function mintToNodeServer(mystic,id){
    console.log("mintToNodeServer")
    $('#myInvitsSended').hide("slow");
    if(mystic){
      fetch('http://localhost:3000/mint', {
        method: 'post',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "addr": ethereum.selectedAddress, "mystic": {createdAt:mystic.createdAt,invitsSended:mystic.invitsSended,numberReproduce:mystic.numberReproduce,parts:mystic.parts,price:mystic.price,id:id,egg:mystic.egg,inSell:mystic.inSell}})
      }).then(res => res.json())
      .then(res => {
        $("#myMystics").html(renderMystic(id,res.mystic,true,ethereum.selectedAddress));
        $('#myInvitsSended').show("slow");
        
        life = res.mystic.data.life;
        hungry = res.mystic.data.hungry;
        cleanliness = res.mystic.data.cleanliness;
        moral = res.mystic.data.moral;
        rested = res.mystic.data.rested;
        renderInvits(res)
      });
    }
  }

  /**
   * transferer un mystic d'un compte a un autre
   */
  async function transfer(addrSeller){
    let mysticId = 0;
    //window.web3 = await Moralis.Web3.enableWeb3();
    let abi = await getAbi();
    let contract = new web3.eth.Contract(abi, CONTRACT_ADDRESS);//0x400919F8f5740436d1A1769bC241477275C61545
    let transfer = await contract.methods.transfer(ethereum.selectedAddress,myMysticId,0,false).send({from: ethereum.selectedAddress, gasPrice: '1',}).catch((error)=>{console.log('error transfer',error)}).then(()=>{
      fetch('http://localhost:3000/buyOrTransfer', {
          method: 'post',
          headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ "addrBuyer": ethereum.selectedAddress,"addrSeller": addrSeller})
        }).then(res => res.json())
          .then(res => {
            renderGame()
          });
    });
  }

  /**
   * acheter un mystic en chequant d'abord si il est en vente
   */
  async function buy(addrSeller,mystic,id){
    let abi = await getAbi();
    let contract = new web3.eth.Contract(abi, CONTRACT_ADDRESS);//0x400919F8f5740436d1A1769bC241477275C61545
    let buyVar = await contract.methods.purchaseAndTransfer(addrSeller,id,JSON.parse(mystic.replaceAll("%84", '\"')).price,true).send({
      from: ethereum.selectedAddress,
      value:web3.utils.toWei(JSON.parse(mystic.replaceAll("%84", '\"')).price, "ether"),
      to:ethereum.selectedAddress,
      gasPrice: '1',
    }).catch((error)=>{console.log('error transfer',error)}).then(()=>{
      fetch('http://localhost:3000/buyOrTransfer', {
          method: 'post',
          headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ "addrBuyer": ethereum.selectedAddress,"addrSeller": addrSeller})
        }).then(res => res.json())
          .then(res => {
            renderGame()
          });
    });
    console.log(buyVar)
  }

  /**
   * mettre en vente votre mystic ou vos oeufs
   */
  async function params(id,sell,egg){
    let abi = await getAbi();
    let contract = new web3.eth.Contract(abi, CONTRACT_ADDRESS);
    await contract.methods.params(id,sell,egg).send({
      from: ethereum.selectedAddress,
      //gasPrice: '1000000000',//gwei 1
      gasPrice: '1',
      //gas: 21000,
      
    }).catch((error)=>{console.log('error transfer',error)}).then(()=>{
      renderGame()
    });
  }

  /**
   * récupérer tous les token d'un utilisateur
   */
  async function getAllTokensForUser(){
    let abi = await getAbi();
    let contract = new web3.eth.Contract(abi, CONTRACT_ADDRESS);//0x400919F8f5740436d1A1769bC241477275C61545
    let mystics = await contract.methods.getAllTokensForUser(ethereum.selectedAddress).call({from: ethereum.selectedAddress}).catch((error)=>{console.log(error)});
    mystics.forEach(MSTC => {
      console.log(MSTC.toNumber());
    });
  }

  /**
   * Fonction permettant de faire le rendu html d'un mystic
   * @param {*} id 
   * @param {*} data 
   * @param {*} owned 
   * @returns 
   */
  function renderMystic(id,data,owned,addr){
    dataStringified = (JSON.stringify(data.mystic).replaceAll("\"", '%84'));
    date = (new Date(data.mystic.createdAt* 1000));

    return '<div class="mystic">'
    +'<img src="ori.png" class="img-fluid rounded-start" alt="...">'
    +'</div>';
    /*return '<div class="card mb-3 col m-1" style="width: 18rem;" >'
      +'<div class="row g-0">'
        +'<div class="col-md-4">'
        +  '<img src="ori.png" class="img-fluid rounded-start" alt="...">'
        +'</div>'
        +'<div class="col-md-8">'
          +'<div class="card-body">'
            +'<h5 class="card-title">#'+id+'</h5>'
            +'<p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>'
            
            
            +'<div class="progress">'
              +'<div class="progress-bar progress-bar-striped bg-warning" role="progressbar" style="width: '+data?.data?.hungry+'%" aria-valuenow="'+data?.data?.hungry+'" aria-valuemin="0" aria-valuemax="100"></div>'
            +'</div>'
            +'<div class="progress mt-2">'
              +'<div class="progress-bar progress-bar-striped bg-danger" role="progressbar" style="width: '+data?.data?.moral+'%" aria-valuenow="'+data?.data?.moral+'" aria-valuemin="0" aria-valuemax="100"></div>'
            +'</div>'
            +'<div class="progress mt-2">'
              +'<div class="progress-bar progress-bar-striped bg-success" role="progressbar" style="width: '+data?.data?.cleanliness+'%" aria-valuenow="'+data?.data?.cleanliness+'" aria-valuemin="0" aria-valuemax="100"></div>'
            +'</div>'
            +'<div class="progress mt-2">'
              +'<div class="progress-bar progress-bar-striped bg-info" role="progressbar" style="width: '+data?.data?.rested+'%" aria-valuenow="'+data?.data?.rested+'" aria-valuemin="0" aria-valuemax="100"></div>'
            +'</div>'
            +'<div class="progress mt-2">'
              +'<div class="progress-bar progress-bar-striped bg-success" role="progressbar" style="width: '+data?.data?.life+'%" aria-valuenow="'+data?.data?.life+'" aria-valuemin="0" aria-valuemax="100"></div>'
            +'</div>'

            +'<p class="card-text"><small class="text-muted">'+timeSince(date)+'</small></p>'

            +'<div class="btn-group">'
              +'<button type="button" class="btn btn-outline-primary">See</button>'
              +(owned?'<button type="button" class="btn btn-outline-secondary">Feed</button>':'')
              +(owned?'<button type="button" class="btn btn-outline-success">Farm</button>':'')
              +(owned?'<button type="button" class="btn btn-outline-danger">Train</button>':'')
              +'<button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></button>'
              +'<ul class="dropdown-menu">'
                +(owned?'<li><a class="dropdown-item" href="#" onclick="transfer(`'+addr+'`)">Transfer</a></li>':'')
                +(owned?(data.mystic.inSell?'<li><a class="dropdown-item inSell" href="#" onclick="params('+id+','+false+','+data.mystic.egg+')">Stop sell</a></li>':'<li><a class="dropdown-item inSell" href="#" onclick="params('+id+','+true+','+data.mystic.egg+')">Sell</a></li>'):'')
                +(owned&&myMysticId==undefined?(data.mystic.egg?'<li class="born"><a class="dropdown-item" href="#" onclick="params('+id+','+data.mystic.inSell+','+false+')">Born</a></li>':''):'')
                +(!owned?'<li><a class="dropdown-item" href="#" onclick="sendInvit('+id+',`'+addr+'`)">Invitation to reproduce</a></li>':'')
                +(!owned&&data.mystic.inSell?'<li><a class="dropdown-item" href="#" onclick="buy(`'+addr+'`,`'+dataStringified+'`,'+id+')">Buy</a></li>':'')
                +'</ul>'
            +'</div>'

          +'</div>'
        +'</div>'
      +'</div>'
    +'</div>';*/
    //$('#mystic_starvation_time').html(new Date((parseInt(data.lastMeal)+parseInt(data.endurance))*1000))
    
  }

  /**
   * Fonction permettant de faire le rendu html d'un mystic
   * @param {*} id 
   * @param {*} data 
   * @param {*} owned 
   * @returns 
   */
  function renderEgg(id,data,owned,addr){
    dataStringified = (JSON.stringify(data).replaceAll("\"", '%84'));
    date = (new Date(data.createdAt* 1000));
    console.log(data)
    return '<div class="card mb-3 col m-1" style="width: 18rem;">'
      +'<div class="row g-0">'
        +'<div class="col-md-4">'
        +  '<img src="egg.jpg" class="img-fluid rounded-start" alt="...">'
        +'</div>'
        +'<div class="col-md-8">'
          +'<div class="card-body">'
            +'<h5 class="card-title">#'+id+'</h5>'
            +'<p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>'
            +'<p class="card-text"><small class="text-muted">'+timeSince(date)+'</small></p>'

            +'<div class="btn-group">'
              +'<button type="button" class="btn btn-secondary">See</button>'
              +'<button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></button>'
              +'<ul class="dropdown-menu">'
                +(owned?'<li><a class="dropdown-item" href="#" onclick="transfer(`'+addr+'`)">Transfer</a></li>':'')
                +(owned?(data.inSell?'<li><a class="dropdown-item inSell" href="#" onclick="params('+id+','+false+','+data.egg+')">Stop sell</a></li>':'<li><a class="dropdown-item inSell" href="#" onclick="params('+id+','+true+','+data.egg+')">Sell</a></li>'):'')
                +(owned?(data.egg?'<li class="born"><a class="dropdown-item" href="#" onclick="params('+id+','+data.inSell+','+false+')">Born</a></li>':''):'')
                +(!owned?'<li><a class="dropdown-item" href="#" onclick="sendInvit('+id+',`'+addr+'`)">Invitation to reproduce</a></li>':'')
                +(!owned&&data.inSell?'<li><a class="dropdown-item" href="#" onclick="buy(`'+addr+'`,`'+dataStringified+'`,'+id+')">Buy</a></li>':'')
                +'</ul>'
            +'</div>'

          +'</div>'
        +'</div>'
      +'</div>'
    +'</div>';
    //$('#mystic_starvation_time').html(new Date((parseInt(data.lastMeal)+parseInt(data.endurance))*1000))
  }

  /**
   * Faire un appel au server node.js pour nourrir le mystic
   */
  async function feed(mysticId,contract){
  }

  /**
   * Faire un appel au server node.js pour farm, rapporte du bois, de la nourriture, ou autre
   */
  async function farm(mysticId,contract){
  }

  /**
   * Faire un appel au server node.js pour entrainer, augmente l'xp jusqu'a level up
   */
  async function train(mysticId,contract){
  }

  /**
   * FAIRE UN SYSTEME DE COMBAT PVP ET PVE EN PIERRE FEUILLE PAPIER CISEAUX
   */

  /** Useful Resources  */

  // https://docs.moralis.io/moralis-server/users/crypto-login
  // https://docs.moralis.io/moralis-server/getting-started/quick-start#user
  // https://docs.moralis.io/moralis-server/users/crypto-login#metamask

  /** Moralis Forum */

  // https://forum.moralis.io/
