/** Connect to Moralis server */
//Mettre côter serveur, a récupérer avant tout autre choses avec un fetch puis lancer la function startMain
const serverUrl = "https://devnihk4zwc7.usemoralis.com:2053/server";
const appId = "YsHmEnYCWJrVMysXSmrdIwsp0MJsna1K0bsXgben";
const CONTRACT_ADDRESS = "0x16d723954c5F4a7a7c0Ce7b1a3F3f1509C56bd25";//0x16d723954c5F4a7a7c0Ce7b1a3F3f1509C56bd25

var myMysticId = undefined;

startMain();


function startMain(){
  Moralis.start({ serverUrl, appId });

  $("#btn-transfer").hide("slow");
  $("#btn-logout").hide("slow");
  $("#btn-my").hide("slow");
  $("#btn-all").hide("slow");
  $("#contentBody").hide("slow");

  document.getElementById("btn-login").onclick = login;
  document.getElementById("btn-logout").onclick = logOut;

}

  function randRang(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Login 
   */
  async function login() {
    let user = Moralis.User.current();
    if (!user) {
    try {
        user = await Moralis.authenticate({ signingMessage: "Hello World!" })
        
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
    $("#btn-login").show("slow");
    $("#btn-logout").hide("slow");
    $("#btn-my").hide("slow");
    $("#btn-all").hide("slow");
    $("#contentBody").hide("slow");
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
      $.getJSON("Token.json",((json)=>{
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
