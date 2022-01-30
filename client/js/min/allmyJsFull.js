/** Connect to Moralis server */
//Mettre côter serveur, a récupérer avant tout autre choses avec un fetch puis lancer la function startMain
const serverUrl = "https://9rotklamvhur.usemoralis.com:2053/server";
const appId = "32qjS96gLON4ZUxrPSXbqM73w1h3HGDpFlbQ9tMM";
const CONTRACT_ADDRESS = "0x0afDD0BB50E643EEAC33Fc1e445077A89B46732b";
//DEV : 0xD66e3e871D0d0c3Ec4e42e14DA2B24ccd36CBA84
//PROD : 0x0afDD0BB50E643EEAC33Fc1e445077A89B46732b

var myMysticId = undefined;
startMain();

var web3 = undefined;


async function startMain(){
    await Moralis.enableWeb3()
    window.web3 = new Web3(Moralis.provider)
    let connected = await window.web3.eth.net.isListening();
    document.getElementById("btn-login").onclick = login;
    document.getElementById("btn-log-meta").onclick = login;
    document.getElementById("btn-logout").onclick = logOut;
  
    //window.web3 = await Moralis.Web3.enableWeb3();
      //let connected = await window.web3.eth.net.isListening();
      if(connected == true){
          let abi = await getAbi();
          let contract = new web3.eth.Contract(abi, CONTRACT_ADDRESS);
          window.web3 = await Moralis.Web3.enableWeb3();
          let eggOneRemain = await contract.methods.getParamsContract("eggOneRemain").call({from: ethereum.selectedAddress});
          let eggTwoRemain = await contract.methods.getParamsContract("eggTwoRemain").call({from: ethereum.selectedAddress});
          let eggThreeRemain = await contract.methods.getParamsContract("eggThreeRemain").call({from: ethereum.selectedAddress});
  
          $(".iconic-egg-remain").html("Buy ( "+(eggOneRemain)+" / 100 )")
          $(".rare-egg-remain").html("Buy ( "+(eggTwoRemain)+" / 900 )")
          $(".classic-egg-remain").html("Buy ( "+(eggThreeRemain)+" / 9000 )")
     }
  
  }

function randRang(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

eggRenderImg(0);
eggRenderImg(4);
eggRenderImg(8);

function eggRenderImg(type){
    colorInt = randRang(0,3);
    if(colorInt == 0)color ="blue"
    if(colorInt == 1)color ="green"
    if(colorInt == 2)color ="purple"
    if(colorInt == 3)color ="red"
    type1 = randRang(0,3)+type;
    type1 ="img/eggs/type1/"+color+"/"+(type1+1)+".webp"
    type2 = randRang(0,3)+type;
    type2 ="img/eggs/type2/"+color+"/"+(type2+1)+".webp"
    type3 = randRang(0,3)+type;
    type3 ="img/eggs/type3/"+color+"/"+(type3+1)+".webp"
    type4 = randRang(0,3)+type;
    type4 ="img/eggs/type4/"+color+"/"+(type4+1)+".webp"
    let card = $(".card-fourth");
    let classType = "layer-egg-classic";
    if(type==4){card = $(".card-third");classType = "layer-egg-rare";}
    if(type==8){card = $(".card-second");classType = "layer-egg-iconic";}
    card.prepend("<div class='eggLayer'>"
    +'<img loading="lazy" src="img/eggs/egg_color'+(((colorInt+1)+(type==0||type==4?0:4)))+'.webp" class="layer-egg '+classType+'" alt="mystic">'
    +'<img loading="lazy" src="'+type4+'" class="layer-egg" style="opacity:0.5;" alt="mystic">'
    +'<img loading="lazy" src="'+type3+'" class="layer-egg" style="opacity:0.8;" alt="mystic">'
    +'<img loading="lazy" src="'+type2+'" class="layer-egg" alt="mystic">'
    +'<img loading="lazy" src="'+type1+'" class="layer-egg" style="opacity:0.8;" alt="mystic">'
    +"<div>") 
    
    var rotated = 0;
    setInterval(() => {
        var slides = document.getElementsByClassName("eggLayer");
        for (var i = 0; i < slides.length; i++) {
            
            var div = slides[i],
                deg = rotated ? -randRang(0,6) : randRang(0,6);
        
            div.style.webkitTransform = 'rotate('+deg+'deg)'; 
            div.style.mozTransform    = 'rotate('+deg+'deg)'; 
            div.style.msTransform     = 'rotate('+deg+'deg)'; 
            div.style.oTransform      = 'rotate('+deg+'deg)'; 
            div.style.transform       = 'rotate('+deg+'deg)'; 
        
            rotated = !rotated;
        }
    }, randRang(2000,4900));

}



  /**
   * Login 
   */
  async function login() {
    await Moralis.enableWeb3()
    window.web3 = new Web3(Moralis.provider)
    let connected = await window.web3.eth.net.isListening();
    if(connected == true){
    try {
       // user = await Moralis.authenticate({ signingMessage: "Connect to mystic tamable !" })
        renderGame();
    } catch(error) {
      console.log(error)
    }
    }else{
      renderGame();
    }
  }

  /**
   * logout
   */
  async function logOut() {
    await Moralis.User.logOut();
    $(".unlogged-btn").fadeIn("fast");
    $(".logged-btn").fadeOut("fast");

    $("#contentBody").fadeOut("fast");
    $("#myMystics").html('');
  }

  function navAllUnactive(){
    $(".nav-link").each(function(){
      $(this).removeClass("active")
    })
  }

  async function faq(){
      $(".modal-title").html("FAQ");
      $(".modal-body").html(
        '<div class="container mt-5">'
        
        +'<h4 class="mt-5">Can I earn money by playing ? : </h4>'
        +'<p>Yes with the breeding system, however it will take time (one month minimum per reproduction) and each creature will be able to give only 3 eggs maximum, to limit the number of tokens.</p><br/>'

        +'<h4 class="mt-5">How to buy NYXIES? : </h4>'
        +'<p>You will need a <a href="https://metamask.io/download/">meta mask</a> account to start, then you will need to <a href="https://autofarm.gitbook.io/autofarm-network/how-tos/polygon-chain-matic/metamask-add-polygon-matic-network">add the polygon network</a>, and add MATIC crypto <a href="https://wallet.polygon.technology/gas-swap/">by converting your eth</a>, or your dollars, you will finally just click on the egg you want and then buy it</p><br/>'
        
        +'<h4 class="mt-5">Why Polygon Network ? : </h4>'
        +'<p>Because it is ecological, economical, and simple to use, it may scare some at the installation, but this network is simple to use and you will gain a lot in gas costs, your MATIC will also be very easily convertible into ETH or other coin at very low cost.</p><br/>'
        
        +'<h4 class="mt-5">Can we buy more than one egg ? : </h4>'
        +'<p>Yes, but you can only have one adult at a time, to control the speed of reproduction.</p><br/>'
        
        +'<h4 class="mt-5">Can we sell our eggs ? : </h4>'
        +'<p>Yes at the minimum price or you will buy them, however this will be done only on our platform to avoid abuse.</p><br/>'

        +'<h4 class="mt-5">Can my nft be lost permanently ? : </h4>'
        +'<p>Yes, if you treat it badly, but it happens if you don\'t take care of it for several days.</p>'
        +'<p>But a creature has also a limited lifespan, it will live several months, then die of old age, in this case your token is lost, you will have to have reproduced your creature before that happens not to have losses</p><br/>'

        +'<h4 class="mt-5">How long will the game take me by day ? : </h4>'
        +'<p>In general, the game will not take you more than 10 minutes per day, you can also put your account in vacation mode as many times as you want </p><br/>'

        +'<h4 class="mt-5">How to add my nyxies balances to meta mask ? : </h4>'
        +'<p>You just have to launch meta mask, click on "import tokens", then add the following contract address 0xfB68d56954f011C3Ea24691df9BEf073C8a78F51 , give it a name (NYXIES preferably) and a decimal ( 1 )</p><br/>'

        
        +'<h4 class="mt-5">Who are you ? : </h4>'
        +'<p>We are a team of an experienced blockchain and smart contract backend developer, a web integrator, a graphic designer and a digital marketing professional, each with between three and seven years experience.</p>'
        +'<a href="https://www.linkedin.com/in/kevin-dell-ova-270431184/">Dell\'Ova Kevin</a><br/>'
        +'<a href="https://www.linkedin.com/in/florian-scouarnec-7829856a/">Florian Lescouarnec</a><br/>'
        +'<a href="https://www.linkedin.com/in/vinibch/">Vincent Boucher</a><br/>'


        +'</div>'
      );
  }
  
  /**
   * récuperer Le abi (ensemble des fonctions du smart contract)
   */
  function getAbi(){
    return new Promise((res)=>{
      $.getJSON("js/Token.json",((json)=>{
        res(json.abi)
      }))
    })
    
  }

  function timeSince(date) {

    var seconds = Math.floor((new Date() - date) / 1000);
  
    var interval = seconds / 31536000;
  
    if (interval > 1) {
      return Math.floor(interval) + " years";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return Math.floor(interval) + " months";
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) + " days";
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return Math.floor(interval) + " hours";
    }
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + " minutes";
    }
    return Math.floor(seconds) + " seconds";
  }


  const headers = document.querySelectorAll('.highlight');
  const modal = document.querySelector('#aboutModal');
  // debounce function to limit function running to 1 time every 10ms. just copied directly from stackoverflow
  function debounce(func, wait = 10, immediate = true) {
      var timeout;
      return function() {
        var context = this, args = arguments;
        var later = function() {
           timeout = null;
           if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
      };
   }
  
  // function that will make headers font-size increase when scrolled into view!
  function dynamicHeaders(e){
      headers.forEach(header => {
  const totalScroll = (modal.scrollTop + window.innerHeight);
  const inView = totalScroll > header.offsetTop;
  const headerBottom = (header.offsetTop + header.clientHeight); 
  const notScrolledPast = headerBottom < totalScroll;
      if(inView){
      header.classList.add('fadeIntoView');	
      } else {
          header.classList.remove('fadeIntoView');	
          }
      })
  };


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


// fetch('https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=BTC,USD,EUR', {
//   method: 'get',
//   headers: {
//     'Accept': 'application/json, text/plain, */*',
//     'Content-Type': 'application/json'
//   },
// }).then(res => res.json())
// .then(res => {
//   $(".convert-eth").each(function(){
//     //console.log(($(this).data("price")))
//     $(this).html(($(this).data("price"))+" MATIC"/* +Math.round(($(this).data("price"))*res.USD)+" USD"*/)
//   })
// });

$(".convert-eth").each(function(){
    //console.log(($(this).data("price")))
    $(this).html(($(this).data("price"))+" MATIC")
  })



// $(".pop-food").each(function(){
//   setTimeout(() => {
//     $(this).css("animation-duration", getRandomArbitrary(2,4)+"s")
//   }, randRang(1000,5000));
// })

$("#title-mystic").fadeIn("fast", function() {
  $("#subtitle-mystic").fadeIn("fast", function() {

  })
})

/**
   * Créer un mystic de façon aléatoire et l'envoyé vers le contrat intélligent
   */
  async function mint(typeMint) {
    await Moralis.enableWeb3()
    window.web3 = new Web3(Moralis.provider)
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
        //gasPrice: '1',
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
  async function renderGame(){
      
    let abi = await getAbi();
    let contract = new web3.eth.Contract(abi, CONTRACT_ADDRESS);
    window.web3 = await Moralis.Web3.enableWeb3();

    $(".unlogged-btn").fadeOut("fast");

    $("#contentBody").fadeIn("fast");
    $("#myMystics").fadeOut("fast").fadeIn("fast")
    $("#myEggs").fadeIn("fast")

    setTimeout(() => {
      let parent = $("#btn-log-meta").parent();
      $("#btn-log-meta").html("Your Eggs")
      $("#btn-log-meta").attr('data-toggle', 'modal')
      $("#btn-log-meta").attr('data-target', '#Modal')
      parent.find("h3").html('Nest')
      parent.find("p").html('Explore your nest and look at your previously purchased eggs')
      document.getElementById("btn-log-meta").onclick = allEggs;
    }, 1000);


    await Moralis.enableWeb3()
    window.web3 = new Web3(Moralis.provider)
    
    let connected = await window.web3.eth.net.isListening();
    if(connected == true){
      let abi = await getAbi();
      let contract = new web3.eth.Contract(abi, CONTRACT_ADDRESS);
      let mystics = await contract.methods.getAllTokensForUser(ethereum.selectedAddress).call({from: ethereum.selectedAddress}).catch((error)=>{console.log(error)});

      let eggOneRemain = await contract.methods.getParamsContract("eggOneRemain").call({from: ethereum.selectedAddress});
      let eggTwoRemain = await contract.methods.getParamsContract("eggTwoRemain").call({from: ethereum.selectedAddress});
      let eggThreeRemain = await contract.methods.getParamsContract("eggThreeRemain").call({from: ethereum.selectedAddress});

      $(".iconic-egg-remain").html("Buy ( "+(eggOneRemain)+" / 100 )")
      $(".rare-egg-remain").html("Buy ( "+(eggTwoRemain)+" / 900 )")
      $(".classic-egg-remain").html("Buy ( "+(eggThreeRemain)+" / 9000 )")

      var lastMystic=undefined;
      var lastIdMystic=undefined;
      $("#myMystics").html('');
      //renderEggs = '';
      await mystics.forEach((MSTC) => {
        //error map viens d'ici
        contract.methods.getTokenDetails(MSTC).call({from: ethereum.selectedAddress}).catch((error)=>{console.log(error)}).then((data)=>{
          if(data.egg==true){
            eggs[MSTC] = data;
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
          $('#nest-egg').fadeIn("fast")
          $('#mail-box').fadeIn("fast")

          $("#title-mystic").fadeOut()
          $(".img-intro").fadeOut()
          $("#subtitle-mystic").fadeOut("fast")
          $(".logged-btn").fadeIn("fast")

        }else{
          $("#btn-logout").parent().fadeIn("fast")
          
            $("#title-mystic").fadeIn("fast", function() {
              $("#subtitle-mystic").fadeIn("fast", function() {
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
    $("#myMystics").fadeOut("fast").fadeIn("fast")
    $("#myEggs").fadeOut("fast")
    fetch('http://localhost:3000/getAllMystics', {
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
//   async function mintToNodeServer(mystic,id){
//     let connected = await window.web3.eth.net.isListening();
//     if(connected == true){
//       $('#myInvitsSended').fadeOut("fast");
//       if(mystic){
//         fetch('http://localhost:3000/mint', {
//           method: 'post',
//           headers: {
//             'Accept': 'application/json, text/plain, */*',
//             'Content-Type': 'application/json'
//           },
//           body: JSON.stringify({ "addr": ethereum.selectedAddress, "mystic": {createdAt:mystic.params256[0],invitsSended:mystic.params256[2],numberReproduce:mystic.params256[5],parts:mystic.params8,price:mystic.params256[1],id:mystic.params256[6],egg:mystic.egg,inSell:mystic.inSell}})
//         }).then(res => res.json())
//         .then(res => {
//           $("#myMystics").html(renderMystic(id,res.mystic,true,ethereum.selectedAddress));
//           $('#myInvitsSended').fadeIn("fast");
          
//           life = res.mystic.data.life;
//           hungry = res.mystic.data.hungry;
//           cleanliness = res.mystic.data.cleanliness;
//           moral = res.mystic.data.moral;
//           rested = res.mystic.data.rested;
//           invitsReceive = res.invitsReceive;
//           invitsSended = res.invitsSended;
//           foodByZone = res.mystic.data.foodByZone;
//           myMysticData = res.mystic;
//           items = res.mystic.data.foods;
//           reloadFoodByZone()
//         });
//       }
//     }
//   }

//   async function reloadFoodByZone(){
//     if(foodByZone!=undefined){
//       $('.pop-food').each(function(){
//         if(foodByZone[$(this).data("zone")] < Date.now()-60000){
//           $(this).fadeIn("fast")
//         }else{
//           $(this).fadeOut("fast")
//         }
//       })
//     }
//   }

  /**
   * transferer un mystic d'un compte a un autre
   */
  // async function transfer(addrSeller){
  //   let connected = await window.web3.eth.net.isListening();
  //   if(connected == true){
  //     let abi = await getAbi();
  //     let contract = new web3.eth.Contract(abi, CONTRACT_ADDRESS);//0x400919F8f5740436d1A1769bC241477275C61545
  //     let transfer = await contract.methods.purchaseAndTransfer(ethereum.selectedAddress,myMysticId,false).send({from: ethereum.selectedAddress, gasPrice: '1',}).catch((error)=>{console.log('error transfer',error)}).then(()=>{
  //       fetch('http://localhost:3000/buyOrTransfer', {
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
        //gasPrice: '1',
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
        //gasPrice: '1',
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
    }
  }
  
  /**
   * Fonction permettant de faire le rendu html d'un mystic
   * @param {*} id 
   * @param {*} data 
   * @param {*} owned 
   * @returns 
   */
//    function renderMystic(id,data,owned,addr){
//     dataStringified = (JSON.stringify(data.mystic).replaceAll("\"", '%84'));
//     date = (new Date(data.mystic.createdAt* 1000));

//     return '<div class="mystic">'
//     +'<img src="img/ori.png" class="img-fluid rounded-start" alt="mystic">'
//     +'</div>';
//    }

//    function inAction(action){
//     if(action == 0) return "In wait";
//     if(action == 1) return "Sleep";
//     if(action == 2) return "Search food";
//     if(action == 3) return "Wash";
//     if(action == 4) return "In Train";
//    }

  /**
   * Fonction permettant de faire le rendu html d'un mystic
   * @param {*} id 
   * @param {*} data 
   * @param {*} owned 
   * @returns 
   */
//   function renderMysticCard(id,data,owned,addr){
//     dataStringified = (JSON.stringify(data.mystic).replaceAll("\"", '%84'));
//     date = (new Date(data.mystic.createdAt* 1000));
//     //console.log('data',data)
//     return '<div class="mb-12 col m-12" >'
//       +'<div class="row g-0">'
//         +'<div class="col-md-4">'
//         +  '<img src="img/ori.png" style="width:150px;" class="" alt="mystic">'
//         +'</div>'
//         +'<div class="col-md-8">'
//           +'<div class="card-body">'
//             +'<h5 class="card-title">#'+id+'</h5>'
            
//             +(owned?'<p class="card-text">'+inAction(myMysticData.data.action)+'</p>':'')
            
//             +'<p class="card-text"><small class="text-muted">'+timeSince(date)+'</small></p>'

//             +'<div class="btn-group">'
//               +(owned?'<button type="button" onclick="action(0)" class="btn btn-primary">Stop</button>':'')
//               +(owned?'<button type="button" onclick="action(1)" class="btn btn-success">Sleep</button>':'')
//               +(owned?'<button type="button" onclick="action(3)" class="btn btn-secondary">Wash</button>':'')
//               +(owned?'<button type="button" onclick="action(4)" class="btn btn-danger">Train</button>':'')
//               +'<button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></button>'
//               +'<ul class="dropdown-menu">'
//                 +(owned?'<li><a class="dropdown-item" href="#" onclick="transfer(`'+addr+'`)">Transfer</a></li>':'')
//                 +(owned?(data.mystic.inSell?'<li><a class="dropdown-item inSell" href="#" onclick="paramsMystic('+id+','+false+','+data.mystic.egg+','+data.mystic.tokenIdReproducable+')">Stop sell</a></li>':'<li><a class="dropdown-item inSell" href="#" onclick="paramsMystic('+id+','+true+','+data.mystic.egg+','+data.mystic.tokenIdReproducable+')">Sell</a></li>'):'')
//                 +(owned&&myMysticId==undefined?(data.mystic.egg?'<li class="born"><a class="dropdown-item" href="#" onclick="paramsMystic('+id+','+data.mystic.inSell+','+false+','+data.mystic.tokenIdReproducable+')">Born</a></li>':''):'')
//                 +(!owned?'<li><a class="dropdown-item" href="#" onclick="sendInvit('+myMysticId+','+data.mystic.inSell+','+data.mystic.egg+','+id+',`'+addr+'`)">Invitation to reproduce</a></li>':'')
//                 +(!owned&&data.mystic.inSell?'<li><a class="dropdown-item" href="#" onclick="buy(`'+addr+'`,`'+dataStringified+'`,'+id+')">Buy</a></li>':'')
//                 +'</ul>'
//             +'</div>'

//           +'</div>'
//         +'</div>'
//       +'</div>'
//     +'</div>';
//     //$('#mystic_starvation_time').html(new Date((parseInt(data.lastMeal)+parseInt(data.endurance))*1000))
    
//   }

  /**
   * Fonction permettant de faire le rendu html d'un mystic
   * @param {*} id 
   * @param {*} data 
   * @param {*} owned 
   * @returns 
   */
  function renderEgg(id,data,owned,addr){
    console.log(data)
    
    colorInt = parseInt(data["params8"][0]);
    if(colorInt == 0)color ="blue"
    if(colorInt == 1)color ="green"
    if(colorInt == 2)color ="purple"
    if(colorInt == 3)color ="red"
    type1 = parseInt(data["params8"][1]);
    type1 ="img/eggs/type1/"+color+"/"+(type1+1)+".webp"
    type2 = parseInt(data["params8"][2]);
    type2 ="img/eggs/type2/"+color+"/"+(type2+1)+".webp"
    type3 = parseInt(data["params8"][3]);
    type3 ="img/eggs/type3/"+color+"/"+(type3+1)+".webp"
    type4 = parseInt(data["params8"][4]);
    type4 ="img/eggs/type4/"+color+"/"+(type4+1)+".webp"
    let classType = "layer-egg-classic";
    if(data["params256"][7]==1){card = $(".card-third");classType = "layer-egg-rare";}
    if(data["params256"][7]==0){card = $(".card-second");classType = "layer-egg-iconic";}

    dataStringified = (JSON.stringify(data).replaceAll("\"", '%84'));
    date = (new Date(data.createdAt* 1000));
    return '<div class="col-lg-4 col-md-12 col-sm-12 col-xs-12">'
    +'<div class="card '+(data.params256[7]==0?"card-second":(data.params256[7]==1?"card-third":("card-fourth")))+'">'
    +"<div class='eggLayer'>"
    +'<img loading="lazy" src="img/eggs/egg_color'+(((colorInt+1)+(data["params256"][7]==0||data["params256"][7]==1?0:4)))+'.webp" class="layer-egg '+classType+'" alt="mystic">'
    +'<img loading="lazy" src="'+type4+'" class="layer-egg" style="opacity:0.5;" alt="mystic">'
    +'<img loading="lazy" src="'+type3+'" class="layer-egg" style="opacity:0.8;" alt="mystic">'
    +'<img loading="lazy" src="'+type2+'" class="layer-egg" alt="mystic">'
    +'<img loading="lazy" src="'+type1+'" class="layer-egg" style="opacity:0.8;" alt="mystic">'
    +'</div>'
    +"<div>"
      +'<div class="content">'
        +'<h3 class="title">'+(data.params256[7]==0?"Iconic Egg":(data.params256[7]==1?"Rare Egg":("Classic Egg")))+'</h3>'
        +'<p class="copy">#'+id+'</p>'
        +'<span>An egg that seems to be as soft as it is restless</span>'
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
//   function renderItems(id,data,owned,addr){
//     return '<div class="mb-12 col m-12">'
//       +'<div class="row g-0">'
//         +'<div class="col-md-4">'
//         +  '<img src="img/'+(id)+'.png" style="width:50px" alt="egg">'
//         +'</div>'
//         +'<div class="col-md-8">'
//           +'<div class="card-body">'
//             +'<div class="btn-group">'
//               +'<button type="button" onclick="feed(`'+id+'`)" class="btn btn-secondary">Feed with '+id+' ('+data+')</button>'
//             +'</div>'
//           +'</div>'
//         +'</div>'
//       +'</div>'
//     +'</div>';
//     //$('#mystic_starvation_time').html(new Date((parseInt(data.lastMeal)+parseInt(data.endurance))*1000))
//   }

  

  /**
   * Faire un appel au server node.js pour nourrir le mystic
   */
//   async function feed(food){
//     let connected = await window.web3.eth.net.isListening();
//     if(connected == true){
//       fetch('http://localhost:3000/feed', {
//         method: 'post',
//         headers: {
//           'Accept': 'application/json, text/plain, */*',
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ "addr": ethereum.selectedAddress,"food":food})
//       }).then(res => res.json())
//       .then(res => {
//         foods = res.data.foods;
//         items = res.data.items;
//         renderGame();
//       });
//     }
//   }

  /**
   * Faire un appel au server node.js pour farm, rapporte du bois, de la nourriture, dormir, ou autre action
   */
//   async function action(actionId){
//     let connected = await window.web3.eth.net.isListening();
//     if(connected == true){
//       fetch('http://localhost:3000/action', {
//         method: 'post',
//         headers: {
//           'Accept': 'application/json, text/plain, */*',
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ "addr": ethereum.selectedAddress, "action": actionId})
//       }).then(res => res.json())
//       .then(res => {
//         renderGame();
//       });
//     }
//   }

//   function pickFood(name,value,foodId){
//     fetch('http://localhost:3000/pickFood', {
//       method: 'post',
//       headers: {
//         'Accept': 'application/json, text/plain, */*',
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({ "addr": ethereum.selectedAddress,"foodId":foodId, "food": {"name":name,"value":value}})
//     }).then(res => res.json())
//     .then(res => {
//       foods = res.data.foods;
//       renderGame();
//     });
//   }

  /**
   * FAIRE UN SYSTEME DE COMBAT PVP ET PVE EN PIERRE FEUILLE PAPIER CISEAUX
   */

  /** Useful Resources  */

  // https://docs.moralis.io/moralis-server/users/crypto-login
  // https://docs.moralis.io/moralis-server/getting-started/quick-start#user
  // https://docs.moralis.io/moralis-server/users/crypto-login#metamask

  /** Moralis Forum */

  // https://forum.moralis.io/


  (function() {
    window.addEventListener('scroll', function(event) {
      var depth, layer, layers, movement, topDistance, translate3d, _i, _len;
      topDistance = this.pageYOffset;
      layers = document.querySelectorAll("[data-type='parallax']");
      for (_i = 0, _len = layers.length; _i < _len; _i++) {
        layer = layers[_i];
        depth = layer.getAttribute('data-depth');
        movement = -(topDistance * depth);
        translate3d = 'translate3d(0, ' + movement + 'px, 0)';
        layer.style['-webkit-transform'] = translate3d;
        layer.style['-moz-transform'] = translate3d;
        layer.style['-ms-transform'] = translate3d;
        layer.style['-o-transform'] = translate3d;
        layer.style.transform = translate3d;
      }
    });
  
  }).call(this);


    /**
   * reproduction en deux Mystic token
   * @param {*} idTokenOne 
   */
    //  function reproduce(idTokenOne,idTokenTwo,addressTwo){
    //     getAbi().then((abi)=>{
    //       fetch('http://localhost:3000/acceptInvit', {
    //         method: 'post',
    //         headers: {
    //           'Accept': 'application/json, text/plain, */*',
    //           'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify({ "addrOne": ethereum.selectedAddress.toString(),"addrTwo": addressTwo.toString(),"idTokenOne":idTokenOne,"idTokenTwo":idTokenTwo})
    //       }).then(res => res.json())
    //         .then(res => {
    //           let contract = new web3.eth.Contract(abi, CONTRACT_ADDRESS);//0x400919F8f5740436d1A1769bC241477275C61545
    //           contract.methods.reproduce( idTokenOne, addressTwo, idTokenTwo).send({
    //             from: ethereum.selectedAddress,
    //             //gasPrice: '1',
    //           }).catch((error)=>{console.log('error transfer',error)}).then((reproduceVar)=>{
    //             console.log(reproduceVar)
    //           }).then(()=>{
    //             renderGame()
    //           });
    
    //         });
          
    //     });
    //   }
    
      
      /**
       * render les invitations
       */
    //    function renderInvits(){
    //     //receive
    //     modalHtml='<h5>Receive</h5><div class="hiddenContainer">';
    //       if(invitsReceive){
    //         Object.keys(invitsReceive).forEach(receive => {
    
    //           modalHtml+='<div>'
    //               +'<a href="#" >'
    //               +'<i class="fas fa-envelope"></i>#'+invitsReceive[receive]+'</a> '
    //               +'<button class="btn btn-success" onclick="reproduce('+myMysticId+','+invitsReceive[receive]+',`'+receive+'`)">accept</button>'
    //               +'<button class="btn btn-danger" onclick="deleteInvitReceive('+myMysticId+',`'+receive+'`)">decline</button>'
    //             +'</div>'
    
    
    //         });
    //       }
    //       modalHtml+='</div><h5>Sended</h5><div class="hiddenContainer">';
    //       if(invitsSended){
    //         Object.keys(invitsSended).forEach(sended => {
    //           modalHtml+='<div>'
    //               +'<a href="#" >'
    //               +'<i class="fas fa-envelope"></i>#'+invitsSended[sended]+'</a> '
    //               +'<button class="btn btn-danger" onclick="deleteInvitSended('+invitsSended[sended]+','+sended+')">decline</button>'
    //             +'</div>'
    
    //         });
    //       }
    //       //sendedHtml+='</tbody></table>'
    //       $(".modal-title").html("Invitation");
    //       $(".modal-body").html(modalHtml+"</div>")
    //   }
    
    //   /**
    //    * envoyer une invitation pour reproduction a un mystic qui n'est pas le scien
    //    * @param {*} idToken 
    //    */
    //   function sendInvit(idToken,sell,egg,tokenIdReproducable,addr){
    //       getAbi().then((abi)=>{
    //         let contract = new web3.eth.Contract(abi, CONTRACT_ADDRESS);
    //         //ajoute l'addresse du mystic a qui l'ont envoi l'invitation pour quand il acceptera être sur que vous l'avez bien envoyé
            
    //         contract.methods.paramsMystic(idToken,sell,egg,tokenIdReproducable).send({
    //           from: ethereum.selectedAddress,
    //         }).catch((error)=>{console.log('error transfer',error)}).then(()=>{
    
    //           fetch('http://localhost:3000/addInvit', {
    //             method: 'post',
    //             headers: {
    //               'Accept': 'application/json, text/plain, */*',
    //               'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify({ "addrOne": ethereum.selectedAddress.toString(),"addrTwo": addr.toString(),"idTokenOne":myMysticId,"idTokenTwo":idToken})
    //           }).then(res => res.json())
    //             .then(res => {
    //             });
    
              
    //         });
    //       });
    //   }
    
    //   /**
    //    * annuler l'invitation envoyé
    //    * @param {*} idToken 
    //    */
    //   function deleteInvitSended(idToken,addr){
    //       getAbi().then((abi)=>{
    //         let contract = new web3.eth.Contract(abi, CONTRACT_ADDRESS);
    //         //ajoute l'addresse du mystic a qui l'ont envoi l'invitation pour quand il acceptera être sur que vous l'avez bien envoyé
    //         //contract.methods.addSubInvitation(myMysticId, 0, false).send({
    //         contract.methods.paramsMystic(myMysticId,myMystic.sell,myMystic.egg,0).send({
    //           from: ethereum.selectedAddress,
    //           //gasPrice: '1',
    //         }).catch((error)=>{console.log('error transfer',error)}).then((invit)=>{
    
    //           fetch('http://localhost:3000/deleteInvitSended', {
    //             method: 'post',
    //             headers: {
    //               'Accept': 'application/json, text/plain, */*',
    //               'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify({ "addrOne": ethereum.selectedAddress,"addrTwo": addr,"idTokenOne":myMysticId,"idTokenTwo":idToken})
    //           }).then(res => {
    //             renderGame()
    //           });
    //         });
    //       });
    //   }
    
    //   /**
    //    * annuler l'invitation envoyé
    //    * @param {*} idToken 
    //    */
    //   function deleteInvitReceive(idToken,addr){
    //         fetch('http://localhost:3000/deleteInvitReceive', {
    //           method: 'post',
    //           headers: {
    //             'Accept': 'application/json, text/plain, */*',
    //             'Content-Type': 'application/json'
    //           },
    //           body: JSON.stringify({ "addrOne": ethereum.selectedAddress,"addrTwo": addr,"idTokenOne":myMysticId,"idTokenTwo":idToken})
    //         }).then(res => {
    //             renderGame()
    //           });
    //   }