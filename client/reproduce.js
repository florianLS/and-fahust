  /**
   * reproduction en deux Mystic token
   * @param {*} idTokenOne 
   */
   function reproduce(idTokenOne,idTokenTwo,addressTwo){
    getAbi().then((abi)=>{
      fetch('http://localhost:3000/acceptInvit', {
        method: 'post',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "addrOne": ethereum.selectedAddress.toString(),"addrTwo": addressTwo.toString(),"idTokenOne":idTokenOne,"idTokenTwo":idTokenTwo})
      }).then(res => res.json())
        .then(res => {
          //A REMETTRE APRES VALIDATION DU TEST
          let contract = new web3.eth.Contract(abi, CONTRACT_ADDRESS);//0x400919F8f5740436d1A1769bC241477275C61545
          contract.methods.reproduce(res.egg1.parts, idTokenOne, res.egg2.parts, addressTwo, idTokenTwo).send({
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
   function renderInvits(res){
    //receive
    receiveHtml='<table class="table">'
      +'<thead class="thead-dark">'
        +'<tr>'
          +'<th scope="col"># Breed invitations receive</th>'
          +'<th scope="col">interact</th>'
        +'</tr>'
      +'</thead>'
      +'<tbody>';
      if(res.invitsReceive){
        Object.keys(res.invitsReceive).forEach(receive => {
          receiveHtml+='<tr>'
            +'<th scope="row">#'+res.invitsReceive[receive]+'</th>'
            +'<th scope="row"><button class="btn btn-success" onclick="reproduce('+myMysticId+','+res.invitsReceive[receive]+',`'+receive+'`)">accept</button><button class="btn btn-danger" onclick="deleteInvitReceive('+myMysticId+',`'+receive+'`)">decline</button></th>'
          +'</tr>'
        });
      }
      receiveHtml+='</tbody></table>'
      $('#myInvitsReceive').html(receiveHtml)
      //sended
      sendedHtml='<table class="table">'
      +'<thead class="thead-dark">'
        +'<tr>'
          +'<th scope="col"># Breed invitations sended</th>'
          +'<th scope="col">interact</th>'
        +'</tr>'
      +'</thead>'
      +'<tbody>';
      if(res.invitsSended){
        Object.keys(res.invitsSended).forEach(sended => {
          sendedHtml+='<tr>'
            +'<th scope="row">#'+res.invitsSended[sended]+'</th>'
            +'<th scope="row"><button class="btn btn-danger" onclick="deleteInvitSended('+res.invitsSended[sended]+','+sended+')">decline</button></th>'
          +'</tr>'
        });
      }
      sendedHtml+='</tbody></table>'
      $('#myInvitsSended').html(sendedHtml)
  }

  /**
   * envoyer une invitation pour reproduction a un mystic qui n'est pas le scien
   * @param {*} idToken 
   */
  function sendInvit(idToken,addr){
    getAbi().then((abi)=>{
      let contract = new web3.eth.Contract(abi, CONTRACT_ADDRESS);
      //ajoute l'addresse du mystic a qui l'ont envoi l'invitation pour quand il acceptera être sur que vous l'avez bien envoyé
      contract.methods.addSubInvitation(myMysticId, idToken, true).send({
        from: ethereum.selectedAddress,
      }).catch((error)=>{console.log('error transfer',error)}).then((invit)=>{
        
        console.log(invit)

        fetch('http://localhost:3000/addInvit', {
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
      contract.methods.addSubInvitation(myMysticId, 0, false).send({
        from: ethereum.selectedAddress,
        gasPrice: '1',
      }).catch((error)=>{console.log('error transfer',error)}).then((invit)=>{

        fetch('http://localhost:3000/deleteInvitSended', {
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
    getAbi().then((abi)=>{
      let contract = new web3.eth.Contract(abi, CONTRACT_ADDRESS);
      //ajoute l'addresse du mystic a qui l'ont envoi l'invitation pour quand il acceptera être sur que vous l'avez bien envoyé
      contract.methods.addSubInvitation(idToken, 0, false).send({
        from: ethereum.selectedAddress,
        gasPrice: '1',
      }).catch((error)=>{console.log('error transfer',error)}).then((invit)=>{
        fetch('http://localhost:3000/deleteInvitReceive', {
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