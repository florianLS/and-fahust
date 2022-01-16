/** Connect to Moralis server */
//Mettre côter serveur, a récupérer avant tout autre choses avec un fetch puis lancer la function startMain
const serverUrl = "https://devnihk4zwc7.usemoralis.com:2053/server";
const appId = "YsHmEnYCWJrVMysXSmrdIwsp0MJsna1K0bsXgben";
const CONTRACT_ADDRESS = "0xb2000CB13790af91a69c639fdc64d6cB05EEE159";

var myMysticId = undefined;
console.log(window.web3)
startMain();


async function startMain(){
  Moralis.start({ serverUrl, appId });

  //$("#contentBody").fadeOut("slow");
  document.getElementById("btn-login").onclick = login;
  document.getElementById("btn-log-meta").onclick = login;
  document.getElementById("btn-logout").onclick = logOut;

  
  window.web3 = await Moralis.Web3.enableWeb3();
  let abi = await getAbi();
  let contract = new web3.eth.Contract(abi, CONTRACT_ADDRESS);
  let eggOneRemain = await contract.methods.getParamsContract("eggOneRemain").call({from: ethereum.selectedAddress});
  let eggTwoRemain = await contract.methods.getParamsContract("eggTwoRemain").call({from: ethereum.selectedAddress});
  let eggThreeRemain = await contract.methods.getParamsContract("eggThreeRemain").call({from: ethereum.selectedAddress});

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
