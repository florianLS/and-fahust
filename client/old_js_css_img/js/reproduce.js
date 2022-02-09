  /**
   * reproduction en deux Mystic token
   * @param {*} idTokenOne 
   */
   function reproduce(idTokenOne,idTokenTwo,addressTwo){
    getAbi().then((abi)=>{
      fetch('https://localhost:31093/acceptInvit', {
        method: 'post',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "addrOne": ethereum.selectedAddress.toString(),"addrTwo": addressTwo.toString(),"idTokenOne":idTokenOne,"idTokenTwo":idTokenTwo})
      }).then(res => res.json())
        .then(res => {
          let contract = new web3.eth.Contract(abi, CONTRACT_ADDRESS);//0x400919F8f5740436d1A1769bC241477275C61545
          contract.methods.reproduce( idTokenOne, addressTwo, idTokenTwo).send({
            from: ethereum.selectedAddress,
            //gasPrice: '1',
          }).catch((error)=>{console.log('error transfer',error)}).then((reproduceVar)=>{
            console.log(reproduceVar)
          }).then(()=>{
            renderGame()
          });

        });
      
    });
  }

  
  /**
   * render les invitations
   */
   function renderInvits(){
    //receive
    modalHtml='<h5>Receive</h5><div class="hiddenContainer">';
      if(invitsReceive){
        Object.keys(invitsReceive).forEach(receive => {

          modalHtml+='<div>'
              +'<a href="#" >'
              +'<i class="fas fa-envelope"></i>#'+invitsReceive[receive]+'</a> '
              +'<button class="btn btn-success" onclick="reproduce('+myMysticId+','+invitsReceive[receive]+',`'+receive+'`)">accept</button>'
              +'<button class="btn btn-danger" onclick="deleteInvitReceive('+myMysticId+',`'+receive+'`)">decline</button>'
            +'</div>'


          /*receiveHtml+='<tr>'
            +'<th scope="row">#'+res.invitsReceive[receive]+'</th>'
            +'<th scope="row"><button class="btn btn-success" onclick="reproduce('+myMysticId+','+res.invitsReceive[receive]+',`'+receive+'`)">accept</button><button class="btn btn-danger" onclick="deleteInvitReceive('+myMysticId+',`'+receive+'`)">decline</button></th>'
          +'</tr>'*/
        });
      }
      //receiveHtml+='</tbody></table>'
      //sended
      modalHtml+='</div><h5>Sended</h5><div class="hiddenContainer">';
      if(invitsSended){
        Object.keys(invitsSended).forEach(sended => {
          modalHtml+='<div>'
              +'<a href="#" >'
              +'<i class="fas fa-envelope"></i>#'+invitsSended[sended]+'</a> '
              +'<button class="btn btn-danger" onclick="deleteInvitSended('+invitsSended[sended]+','+sended+')">decline</button>'
            +'</div>'

          /*sendedHtml+='<tr>'
            +'<th scope="row">#'+res.invitsSended[sended]+'</th>'
            +'<th scope="row"><button class="btn btn-danger" onclick="deleteInvitSended('+res.invitsSended[sended]+','+sended+')">decline</button></th>'
          +'</tr>'*/
        });
      }
      //sendedHtml+='</tbody></table>'
      $(".modal-title").html("Invitation");
      $(".modal-body").html(modalHtml+"</div>")
  }

  /**
   * envoyer une invitation pour reproduction a un mystic qui n'est pas le scien
   * @param {*} idToken 
   */
  function sendInvit(idToken,sell,egg,tokenIdReproducable,addr){
      getAbi().then((abi)=>{
        let contract = new web3.eth.Contract(abi, CONTRACT_ADDRESS);
        //ajoute l'addresse du mystic a qui l'ont envoi l'invitation pour quand il acceptera être sur que vous l'avez bien envoyé
        
        contract.methods.paramsMystic(idToken,sell,egg,tokenIdReproducable).send({
          from: ethereum.selectedAddress,
        }).catch((error)=>{console.log('error transfer',error)}).then(()=>{

          fetch('https://localhost:31093/addInvit', {
            method: 'post',
            headers: {
              'Accept': 'application/json, text/plain, */*',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "addrOne": ethereum.selectedAddress.toString(),"addrTwo": addr.toString(),"idTokenOne":myMysticId,"idTokenTwo":idToken})
          }).then(res => res.json())
            .then(res => {
            });

          
        });
      });
  }

  /**
   * annuler l'invitation envoyé
   * @param {*} idToken 
   */
  function deleteInvitSended(idToken,addr){
      getAbi().then((abi)=>{
        let contract = new web3.eth.Contract(abi, CONTRACT_ADDRESS);
        //ajoute l'addresse du mystic a qui l'ont envoi l'invitation pour quand il acceptera être sur que vous l'avez bien envoyé
        //contract.methods.addSubInvitation(myMysticId, 0, false).send({
        contract.methods.paramsMystic(myMysticId,myMystic.sell,myMystic.egg,0).send({
          from: ethereum.selectedAddress,
          gasPrice: '1',
        }).catch((error)=>{console.log('error transfer',error)}).then((invit)=>{

          fetch('https://localhost:31093/deleteInvitSended', {
            method: 'post',
            headers: {
              'Accept': 'application/json, text/plain, */*',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "addrOne": ethereum.selectedAddress,"addrTwo": addr,"idTokenOne":myMysticId,"idTokenTwo":idToken})
          }).then(res => {
            renderGame()
          });
        });
      });
  }

  /**
   * annuler l'invitation envoyé
   * @param {*} idToken 
   */
  function deleteInvitReceive(idToken,addr){
    /*getAbi().then((abi)=>{
      let contract = new web3.eth.Contract(abi, CONTRACT_ADDRESS);
      //ajoute l'addresse du mystic a qui l'ont envoi l'invitation pour quand il acceptera être sur que vous l'avez bien envoyé
      //contract.methods.addSubInvitation(idToken, 0, false).send({
      contract.methods.paramsMystic(idToken,myMystic.sell,myMystic.egg,0).send({
        from: ethereum.selectedAddress,
        gasPrice: '1',
      }).catch((error)=>{console.log('error transfer',error)}).then((invit)=>{*/
        fetch('https://localhost:31093/deleteInvitReceive', {
          method: 'post',
          headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ "addrOne": ethereum.selectedAddress,"addrTwo": addr,"idTokenOne":myMysticId,"idTokenTwo":idToken})
        }).then(res => {
            renderGame()
          });
      //});
    //});
  }