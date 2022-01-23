/** Connect to Moralis server */
//Mettre côter serveur, a récupérer avant tout autre choses avec un fetch puis lancer la function startMain
const serverUrl = "https://9rotklamvhur.usemoralis.com:2053/server";
const appId = "32qjS96gLON4ZUxrPSXbqM73w1h3HGDpFlbQ9tMM";
const CONTRACT_ADDRESS = "0xb2000CB13790af91a69c639fdc64d6cB05EEE159";

var myMysticId = undefined;
startMain();


async function startMain(){
  //Moralis.start({ serverUrl, appId });

  //$("#contentBody").fadeOut("slow");
  document.getElementById("btn-login").onclick = login;
  document.getElementById("btn-log-meta").onclick = login;
  document.getElementById("btn-logout").onclick = logOut;

  
  //window.web3 = await Moralis.Web3.enableWeb3();
  /*console.log(window.web3)
  let abi = await getAbi();
  console.log(web3.eth)
  let contract = new web3.eth.Contract(abi, CONTRACT_ADDRESS);
  let eggOneRemain = await contract.methods.getParamsContract("eggOneRemain").call({from: ethereum.selectedAddress});
  let eggTwoRemain = await contract.methods.getParamsContract("eggTwoRemain").call({from: ethereum.selectedAddress});
  let eggThreeRemain = await contract.methods.getParamsContract("eggThreeRemain").call({from: ethereum.selectedAddress});*/

  $(".iconic-egg-remain").html("( "+(eggOneRemain)+" / 100 )")
  $(".rare-egg-remain").html("( "+(eggTwoRemain)+" / 900 )")
  $(".classic-egg-remain").html("( "+(eggThreeRemain)+" / 9000 )")

}

  function randRang(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

  /**
   * Login 
   */
  async function login() {
    let user = Moralis.User.current();
    if (!user) {
    try {
        user = await Moralis.authenticate({ signingMessage: "Connect to mystic tamable !" })
        
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
    $(".unlogged-btn").fadeIn("slow");
    $(".logged-btn").fadeOut("slow");

    $("#contentBody").fadeOut("slow");
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
        +'<p>Yes with the breeding system, however it will take time (one month minimum per reproduction) and each creature will be able to give only 3 eggs maximum, to limit the number of tokens.</p>'
        
        +'<h4 class="mt-5">Can we buy more than one egg ? : </h4>'
        +'<p>Yes, but you can only have one adult at a time, to control the speed of reproduction.</p>'
        
        +'<h4 class="mt-5">Can we sell our eggs ? : </h4>'
        +'<p>Yes at the minimum price or you will buy them, however this will be done only on our platform to avoid abuse.</p>'

        +'<h4 class="mt-5">Can my nft be lost permanently ? : </h4>'
        +'<p>Yes, if you treat it badly, but it happens if you don\'t take care of it for several days.</p>'
        +'<p>But a creature has also a limited lifespan, it will live several months, then die of old age, in this case your token is lost, you will have to have reproduced your creature before that happens not to have losses</p>'

        +'<h4 class="mt-5">How long will the game take me by day ? : </h4>'
        +'<p>In general, the game will not take you more than 10 minutes per day, you can also put your account in vacation mode as many times as you want </p>'
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

  /** Useful Resources  */

  // https://docs.moralis.io/moralis-server/users/crypto-login
  // https://docs.moralis.io/moralis-server/getting-started/quick-start#user
  // https://docs.moralis.io/moralis-server/users/crypto-login#metamask

  /** Moralis Forum */

  // https://forum.moralis.io/
