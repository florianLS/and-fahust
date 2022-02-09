var life = 0;
var hungry = 0;
var cleanliness = 0;
var moral = 0;
var rested = 0;
var eggs = {};
var foods = {};
var items = {};
var myMystic = {};
var invitsReceive = undefined;
var invitsSended = undefined;
var foodByZone = undefined;
var myMysticData = undefined;
var priceEth = 0;
var paramsContract = undefined;


fetch('https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=BTC,USD,EUR', {
  method: 'get',
  headers: {
    'Accept': 'application/json, text/plain, */*',
    'Content-Type': 'application/json'
  },
}).then(res => res.json())
.then(res => {
  console.log(priceEth = res.USD)
  $(".convert-eth").each(function(){
    //console.log(($(this).data("price")))
    $(this).html(($(this).data("price"))+" ETH - " +Math.round(($(this).data("price"))*res.USD)+" USD")
  })
});



$(".pop-food").each(function(){
  setTimeout(() => {
    $(this).css("animation-duration", getRandomArbitrary(2,4)+"s")
  }, randRang(1000,5000));
})

$("#title-mystic").fadeIn("slow", function() {
  $("#subtitle-mystic").fadeIn("slow", function() {

  })
})

/**
   * Créer un mystic de façon aléatoire et l'envoyé vers le contrat intélligent
   */
  async function mint(typeMint) {
    window.web3 = await Moralis.Web3.enableWeb3();
    let connected = await window.web3.eth.net.isListening();
    if(connected == true){
      let abi = await getAbi();
      let contract = new web3.eth.Contract(abi, CONTRACT_ADDRESS);
      let price = 0;
      if(typeMint==0)price = await contract.methods.getParamsContract("priceEggOne").call({from: ethereum.selectedAddress});
      if(typeMint==1)price = await contract.methods.getParamsContract("priceEggTwo").call({from: ethereum.selectedAddress});
      if(typeMint==2)price = await contract.methods.getParamsContract("priceEggThree").call({from: ethereum.selectedAddress});
      let minted = await contract.methods.mintDelegate(typeMint).send({
        from: ethereum.selectedAddress,
        value:web3.utils.toWei(price, "wei"),
        gasPrice: '1',
      }).catch((error)=>{console.log(error)}).then((success)=>{
        console.log(success)
      });
    }
    //renderGame();
  }

  async function modalBuy(){
    $(".modal-body").html(
      "<h4 class='title-first-egg'>BUY YOUR FIRST EGG</h4>"
      +"<p style='margin:20'>Préparer vous à acheter votre première créature</br>Ces créatures sont des NFT, échangeable et reproductible avec d'autres utilisateurs</br>Attention ils sont à durer limité, chaque mystic possède une durée de vie, soutenez le depuis sa tendre jeunesse, jusqu'au vieil age</br></p>"
      +"<button class='btn btn-secondary modal-close' style='margin:10px' onClick='mint()'>BUY CLASSIC EGG (3 euros)</button>"
      +"<button class='btn btn-secondary modal-close' style='margin:10px' onClick='mint()'>BUY RARE EGG (30 euros)</button>"
    );
  }


  /**
   * démarage du jeu après connection, affiché les buttons, connection au contrat puis trouver le mystic et les oeufs de l'user, les affichés, puis envoyé ces datas au serveur node.js
   */
  async function renderGame(){console.log('render')
    $(".unlogged-btn").fadeOut("slow");

    $("#contentBody").fadeIn("slow");
    $("#myMystics").fadeOut("slow").fadeIn("slow")
    $("#myEggs").fadeIn("slow")

    setTimeout(() => {
      let parent = $("#btn-log-meta").parent();
      $("#btn-log-meta").html("Your Eggs")
      $("#btn-log-meta").attr('data-toggle', 'modal')
      $("#btn-log-meta").attr('data-target', '#Modal')
      parent.find("h3").html('Nest')
      parent.find("p").html('Explore your nest and look at your previously purchased eggs')
      document.getElementById("btn-log-meta").onclick = allEggs;
    }, 1000);


    window.web3 = await Moralis.Web3.enableWeb3();
    let connected = await window.web3.eth.net.isListening();
    if(connected == true){console.log('connected')
      let abi = await getAbi();
      let contract = new web3.eth.Contract(abi, CONTRACT_ADDRESS);
      let mystics = await contract.methods.getAllTokensForUser(ethereum.selectedAddress).call({from: ethereum.selectedAddress}).catch((error)=>{console.log(error)});

      let eggOneRemain = await contract.methods.getParamsContract("eggOneRemain").call({from: ethereum.selectedAddress});
      let eggTwoRemain = await contract.methods.getParamsContract("eggTwoRemain").call({from: ethereum.selectedAddress});
      let eggThreeRemain = await contract.methods.getParamsContract("eggThreeRemain").call({from: ethereum.selectedAddress});

      $(".iconic-egg-remain").html("( "+(eggOneRemain)+" / 100 )")
      $(".rare-egg-remain").html("( "+(eggTwoRemain)+" / 900 )")
      $(".classic-egg-remain").html("( "+(eggThreeRemain)+" / 9000 )")

      var lastMystic=undefined;
      var lastIdMystic=undefined;
      $("#myMystics").html('');
      //renderEggs = '';
      await mystics.forEach((MSTC) => {
        //error map viens d'ici
        contract.methods.getTokenDetails(MSTC).call({from: ethereum.selectedAddress}).catch((error)=>{console.log(error)}).then((data)=>{
          if(data.egg==true){console.log('data',data)
            eggs[MSTC] = data;
            /*if(renderEggs == '') renderEggs += '<div class="row">';
            renderEggs += renderEgg(MSTC,data,true,ethereum.selectedAddress)*/
          }else{
            lastMystic = data;
            lastIdMystic = MSTC;
            myMysticId = MSTC;
            myMystic = data;
          }
        });
      })

      setTimeout(() => {
        if(lastMystic){
          mintToNodeServer(lastMystic,lastIdMystic)
          $(".born").remove()
          $('#nest-egg').fadeIn("slow")
          $('#mail-box').fadeIn("slow")

          $("#title-mystic").fadeOut()
          $(".img-intro").fadeOut()
          $("#subtitle-mystic").fadeOut("slow")
          /*$(".left-up").fadeOut("slow")
          $(".right-middle").fadeOut("slow")
          $(".left-down").fadeOut("slow")
          $(".egg-center").fadeOut("slow")*/
          $(".logged-btn").fadeIn("slow")

        }else{
          $("#btn-logout").parent().fadeIn("slow")
          
            $("#title-mystic").fadeIn("slow", function() {
              $("#subtitle-mystic").fadeIn("slow", function() {
                /*$(".left-up").fadeIn("slow", function() {
                  $(".right-middle").fadeIn("slow", function() {
                    $(".left-down").fadeIn("slow", function() {
                      $(".egg-center").fadeIn("slow")
                      $(".img-intro").fadeIn()
                    })
                  })
                })*/
              })
            })
        }
      }, 500);
    }
  }

  function myMysticModal(){
    var myMisticRender = renderMysticCard(myMysticId,{mystic:myMystic},true,ethereum.selectedAddress);
      $(".modal-title").html("My Mystic");
      $(".modal-body").html(myMisticRender);
  }

  async function allEggs(){
    $(".modal-title").html("My Eggs");
    $(".modal-body").html("");
    let connected = await window.web3.eth.net.isListening();
    if(connected == true){
      renderEggs = '';
      await Object.keys(eggs).forEach((egg) => {
        renderEggs += renderEgg(egg,eggs[egg],true,ethereum.selectedAddress)
      });
      $(".modal-body").html(renderEggs);
    }
  }

  async function allItems(){
    let connected = await window.web3.eth.net.isListening();
    if(connected == true){
      renderItemsHtml = '';
      console.log('items',items)
      await Object.keys(items).forEach((item) => {
        renderItemsHtml += renderItems(item,items[item],true,ethereum.selectedAddress)
      });
      $(".modal-title").html("My Items");
      $(".modal-body").html(renderItemsHtml);
    }
  }

  

  /**
   * Appels vers le serveur pour récuperer tous les mystics enregistré dans le serveur puis les affichés
   */
  function allMystics(){
    $("#myMystics").fadeOut("slow").fadeIn("slow")
    $("#myEggs").fadeOut("slow")
    fetch('https://localhost:31093/getAllMystics', {
    method: 'get',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
  }).then(res => res.json())
    .then(res => {
      var allMysticsRender = "";
      Object.keys(res).forEach((MSTC) => {
          allMysticsRender += renderMysticCard(res[MSTC].mystic.id,res[MSTC],(parseInt(MSTC)==parseInt(ethereum.selectedAddress))?true:false,MSTC);
      })
      $(".modal-title").html("All Mystics");
      $(".modal-body").html(allMysticsRender);
    });
  }

  /**
   * A la connection, envoyé le mystic dans le serveur node js
   */
  async function mintToNodeServer(mystic,id){
    let connected = await window.web3.eth.net.isListening();
    if(connected == true){
      $('#myInvitsSended').fadeOut("slow");
      if(mystic){
        fetch('https://localhost:31093/mint', {
          method: 'post',
          headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ "addr": ethereum.selectedAddress, "mystic": {createdAt:mystic.params256[0],invitsSended:mystic.params256[2],numberReproduce:mystic.params256[5],parts:mystic.params8,price:mystic.params256[1],id:mystic.params256[6],egg:mystic.egg,inSell:mystic.inSell}})
        }).then(res => res.json())
        .then(res => {
          $("#myMystics").html(renderMystic(id,res.mystic,true,ethereum.selectedAddress));
          $('#myInvitsSended').fadeIn("slow");
          
          life = res.mystic.data.life;
          hungry = res.mystic.data.hungry;
          cleanliness = res.mystic.data.cleanliness;
          moral = res.mystic.data.moral;
          rested = res.mystic.data.rested;
          invitsReceive = res.invitsReceive;
          invitsSended = res.invitsSended;
          foodByZone = res.mystic.data.foodByZone;
          myMysticData = res.mystic;
          console.log(res.mystic.data.foods)
          items = res.mystic.data.foods;
          reloadFoodByZone()
        });
      }
    }
  }

  async function reloadFoodByZone(){console.log(foodByZone)
    if(foodByZone!=undefined){
      $('.pop-food').each(function(){
        if(foodByZone[$(this).data("zone")] < Date.now()-60000){
          $(this).fadeIn("slow")
        }else{
          $(this).fadeOut("slow")
        }
      })
    }
  }

  /**
   * transferer un mystic d'un compte a un autre
   */
  // async function transfer(addrSeller){
  //   let connected = await window.web3.eth.net.isListening();
  //   if(connected == true){
  //     let abi = await getAbi();
  //     let contract = new web3.eth.Contract(abi, CONTRACT_ADDRESS);//0x400919F8f5740436d1A1769bC241477275C61545
  //     let transfer = await contract.methods.purchaseAndTransfer(ethereum.selectedAddress,myMysticId,false).send({from: ethereum.selectedAddress, gasPrice: '1',}).catch((error)=>{console.log('error transfer',error)}).then(()=>{
  //       fetch('https://localhost:31093/buyOrTransfer', {
  //           method: 'post',
  //           headers: {
  //             'Accept': 'application/json, text/plain, */*',
  //             'Content-Type': 'application/json'
  //           },
  //           body: JSON.stringify({ "addrBuyer": ethereum.selectedAddress,"addrSeller": addrSeller})
  //         }).then(res => res.json())
  //           .then(res => {
  //             renderGame()
  //           });
  //     });
  //   }
  // }

  /**
   * acheter un mystic en chequant d'abord si il est en vente
   */
  async function buy(addrSeller,mystic,id){
    let connected = await window.web3.eth.net.isListening();
    if(connected == true){
      let abi = await getAbi();
      let contract = new web3.eth.Contract(abi, CONTRACT_ADDRESS);
      let buyVar = await contract.methods.purchase(addrSeller,id).send({
        from: ethereum.selectedAddress,
        value:web3.utils.toWei(JSON.parse(mystic.replaceAll("%84", '\"')).price, "ether"),
        to:ethereum.selectedAddress,
        gasPrice: '1',
      }).catch((error)=>{console.log('error transfer',error)}).then(()=>{
        fetch('https://localhost:31093/buyOrTransfer', {
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
  }

  /**
   * mettre en vente votre mystic ou vos oeufs
   */
  async function paramsMystic(id,sell,egg,invitationToReproduce){
    let connected = await window.web3.eth.net.isListening();
    if(connected == true){
      let abi = await getAbi();
      let contract = new web3.eth.Contract(abi, CONTRACT_ADDRESS);
      await contract.methods.paramsMystic(id,sell,egg,invitationToReproduce).send({
        from: ethereum.selectedAddress,
        //gasPrice: '1000000000',//gwei 1
        gasPrice: '1',
        //gas: 21000,
        
      }).catch((error)=>{console.log('error transfer',error)}).then(()=>{
        renderGame()
      });
    }
  }

  /**
   * récupérer tous les token d'un utilisateur
   */
  async function getAllTokensForUser(){
    let connected = await window.web3.eth.net.isListening();
    if(connected == true){
      let abi = await getAbi();
      let contract = new web3.eth.Contract(abi, CONTRACT_ADDRESS);
      let mystics = await contract.methods.getAllTokensForUser(ethereum.selectedAddress).call({from: ethereum.selectedAddress}).catch((error)=>{console.log(error)});
      mystics.forEach(MSTC => {
        console.log(MSTC.toNumber());
      });
    }
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
    +'<img src="img/ori.png" class="img-fluid rounded-start" alt="mystic">'
    +'</div>';
   }

   function inAction(action){
    if(action == 0) return "In wait";
    if(action == 1) return "Sleep";
    if(action == 2) return "Search food";
    if(action == 3) return "Wash";
    if(action == 4) return "In Train";
   }

  /**
   * Fonction permettant de faire le rendu html d'un mystic
   * @param {*} id 
   * @param {*} data 
   * @param {*} owned 
   * @returns 
   */
  function renderMysticCard(id,data,owned,addr){
    dataStringified = (JSON.stringify(data.mystic).replaceAll("\"", '%84'));
    date = (new Date(data.mystic.createdAt* 1000));
    console.log(myMysticData)
    //console.log('data',data)
    return '<div class="mb-12 col m-12" >'
      +'<div class="row g-0">'
        +'<div class="col-md-4">'
        +  '<img src="img/ori.png" style="width:150px;" class="" alt="mystic">'
        +'</div>'
        +'<div class="col-md-8">'
          +'<div class="card-body">'
            +'<h5 class="card-title">#'+id+'</h5>'
            
            +(owned?'<p class="card-text">'+inAction(myMysticData.data.action)+'</p>':'')
            
            +'<p class="card-text"><small class="text-muted">'+timeSince(date)+'</small></p>'

            +'<div class="btn-group">'
              +(owned?'<button type="button" onclick="action(0)" class="btn btn-primary">Stop</button>':'')
              +(owned?'<button type="button" onclick="action(1)" class="btn btn-success">Sleep</button>':'')
              +(owned?'<button type="button" onclick="action(3)" class="btn btn-secondary">Wash</button>':'')
              +(owned?'<button type="button" onclick="action(4)" class="btn btn-danger">Train</button>':'')
              +'<button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></button>'
              +'<ul class="dropdown-menu">'
                +(owned?'<li><a class="dropdown-item" href="#" onclick="transfer(`'+addr+'`)">Transfer</a></li>':'')
                +(owned?(data.mystic.inSell?'<li><a class="dropdown-item inSell" href="#" onclick="paramsMystic('+id+','+false+','+data.mystic.egg+','+data.mystic.tokenIdReproducable+')">Stop sell</a></li>':'<li><a class="dropdown-item inSell" href="#" onclick="paramsMystic('+id+','+true+','+data.mystic.egg+','+data.mystic.tokenIdReproducable+')">Sell</a></li>'):'')
                +(owned&&myMysticId==undefined?(data.mystic.egg?'<li class="born"><a class="dropdown-item" href="#" onclick="paramsMystic('+id+','+data.mystic.inSell+','+false+','+data.mystic.tokenIdReproducable+')">Born</a></li>':''):'')
                +(!owned?'<li><a class="dropdown-item" href="#" onclick="sendInvit('+myMysticId+','+data.mystic.inSell+','+data.mystic.egg+','+id+',`'+addr+'`)">Invitation to reproduce</a></li>':'')
                +(!owned&&data.mystic.inSell?'<li><a class="dropdown-item" href="#" onclick="buy(`'+addr+'`,`'+dataStringified+'`,'+id+')">Buy</a></li>':'')
                +'</ul>'
            +'</div>'

          +'</div>'
        +'</div>'
      +'</div>'
    +'</div>';
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
    return '<div class="col-lg-4 col-md-12 col-sm-12 col-xs-12">'
    +'<div class="card '+(data.params256[7]==0?"card-second":(data.params256[7]==1?"card-third":("card-fourth")))+'">'
      +'<div class="content">'
        +'<h3 class="title">'+(data.params256[7]==0?"Iconic Egg":(data.params256[7]==1?"Rare Egg":("Classic Egg")))+'</h3>'
        +'<p class="copy">#'+id+'</p>'
        +'<span></span>'
        +'<button class="btn iconic-egg-remain"></button>'
      +'</div>'
      +'</div>'
    +'</div>'

    /*'<div class="mb-12 col m-12">'
      +'<div class="row g-0">'
        +'<div class="col-md-4">'
        +  '<img src="img/egg.png" style="width:150px" alt="egg">'
        +'</div>'
        +'<div class="col-md-8">'
          +'<div class="card-body">'
            +'<h5 class="card-title">#'+id+'</h5>'
            +'<p class="card-text"></p>'
            +'<p class="card-text"><small class="text-muted">'+timeSince(date)+'</small></p>'

            +'<div class="btn-group">'
              +'<button type="button" class="btn btn-secondary">See</button>'
              +'<button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></button>'
              +'<ul class="dropdown-menu">'
                +(owned?'<li><a class="dropdown-item" href="#" onclick="transfer(`'+addr+'`)">Transfer</a></li>':'')
                +(owned?(data.inSell?'<li><a class="dropdown-item inSell" href="#" onclick="paramsMystic('+id+','+false+','+data.egg+','+data.tokenIdReproducable+')">Stop sell</a></li>':'<li><a class="dropdown-item inSell" href="#" onclick="paramsMystic('+id+','+true+','+data.egg+','+data.tokenIdReproducable+')">Sell</a></li>'):'')
                +(owned?(data.egg?'<li class="born"><a class="dropdown-item" href="#" onclick="paramsMystic('+id+','+data.inSell+','+false+','+data.tokenIdReproducable+')">Born</a></li>':''):'')
                +(!owned?'<li><a class="dropdown-item" href="#" onclick="sendInvit('+myMysticId+','+data.inSell+','+data.egg+','+id+',`'+addr+'`)">Invitation to reproduce</a></li>':'')
                +(!owned&&data.inSell?'<li><a class="dropdown-item" href="#" onclick="buy(`'+addr+'`,`'+dataStringified+'`,'+id+')">Buy</a></li>':'')
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
  function renderItems(id,data,owned,addr){console.log(data)
    return '<div class="mb-12 col m-12">'
      +'<div class="row g-0">'
        +'<div class="col-md-4">'
        +  '<img src="img/'+(id)+'.png" style="width:50px" alt="egg">'
        +'</div>'
        +'<div class="col-md-8">'
          +'<div class="card-body">'
            +'<div class="btn-group">'
              +'<button type="button" onclick="feed(`'+id+'`)" class="btn btn-secondary">Feed with '+id+' ('+data+')</button>'
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
  async function feed(food){console.log('feed')
    let connected = await window.web3.eth.net.isListening();
    if(connected == true){
      fetch('https://localhost:31093/feed', {
        method: 'post',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "addr": ethereum.selectedAddress,"food":food})
      }).then(res => res.json())
      .then(res => {
        foods = res.data.foods;
        items = res.data.items;
        renderGame();
      });
    }
  }

  /**
   * Faire un appel au server node.js pour farm, rapporte du bois, de la nourriture, dormir, ou autre action
   */
  async function action(actionId){
    let connected = await window.web3.eth.net.isListening();
    if(connected == true){
      fetch('https://localhost:31093/action', {
        method: 'post',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "addr": ethereum.selectedAddress, "action": actionId})
      }).then(res => res.json())
      .then(res => {
        renderGame();
      });
    }
  }

  function pickFood(name,value,foodId){
    fetch('https://localhost:31093/pickFood', {
      method: 'post',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ "addr": ethereum.selectedAddress,"foodId":foodId, "food": {"name":name,"value":value}})
    }).then(res => res.json())
    .then(res => {
      foods = res.data.foods;
      renderGame();
    });
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
