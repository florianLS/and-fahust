var http = require('http');
const fs = require('fs');
//const fetch = require('node-fetch');
//const { start } = require('repl');
const { Worker } = require('worker_threads')
var bodyParser = require('body-parser')

function btw2v(val1,val2){//between two value
    return Math.random() < 0.5 ? val1 : val2;
}

var listConnection = {};
var allUsers = {};
var allMystics = {};
var newMysticData = {
    exp:0,
    expMax:100,
    lvl:0,
    lastReproduction:Date.now(),

    food:0,

    hungry:100,
    moral:100,
    cleanliness:100,
    rested:100,
    life:100,
    action:0//action du mystic 
}

/**
 * Action de chaque mystic, toutes les heures
 * pour plus d'opti quand il y en aura beaucoup le faire toutes les heures divisé par le nombre de mystic avec un id incremente de traitement
 */
setInterval(() => {
    Object.keys(allMystics).forEach(mstc => {
        if(life > 0){
            if(allMystics[mstc].data.action == 0){// en attente
                allMystics[mstc].data.hungry -= 1;
                allMystics[mstc].data.cleanliness -= 1;
                allMystics[mstc].data.rested -= 1;
            }else if(allMystics[mstc].data.action == 1){// repos (ce fais automatiquement ou sur demande)
                allMystics[mstc].data.hungry -= 0.5;
                allMystics[mstc].data.cleanliness -= 0.5;
                allMystics[mstc].data.rested += 1;
            }else if(allMystics[mstc].data.action == 2){// cherche de la nourriture
                allMystics[mstc].data.hungry -= 1.5;
                allMystics[mstc].data.cleanliness -= 1;
                allMystics[mstc].data.rested -= 1.5;
                allMystics[mstc].data.food += Math.floor(btw2v(2,3)*(1+(allMystics[mstc].data.level/10)));
            }else if(allMystics[mstc].data.action == 3){// s'entraine
                allMystics[mstc].data.hungry -= 2;
                allMystics[mstc].data.cleanliness -= 2;
                allMystics[mstc].data.rested += 2;
                allMystics[mstc].data.exp += 1;
                if(allMystics[mstc].data.exp >= allMystics[mstc].data.expMax){
                    allMystics[mstc].data.lvl++;
                    allMystics[mstc].data.exp = 0;
                    allMystics[mstc].data.expMax = allMystics[mstc].data.expMax*allMystics[mstc].data.lvl;
                }
            }
    
            if(allMystics[mstc].data.hungry <= 0){allMystics[mstc].data.hungry = 0;allMystics[mstc].data.life -= 1;}
            if(allMystics[mstc].data.cleanliness <= 0){allMystics[mstc].data.cleanliness = 0;allMystics[mstc].data.life -= 1;}
            if(allMystics[mstc].data.rested <= 0){allMystics[mstc].data.rested = 0;allMystics[mstc].data.life -= 1;allMystics[mstc].data.action = 1;}
            fs.writeFile("mystics/"+mstc+".json", JSON.stringify(allMystics[mstc]), (err) => {if (err) throw err;});
        }
        
    });
}, 60000*60);//par minute

const express = require('express')
const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

// Add headers before the routes are defined
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

/**
 * A la connection de l'user, enregistrer son mystic
 */
app.post('/mint', (req, res) => {

    var invitsReceive = undefined;
    var invitsSended = undefined;

    if (fs.existsSync("invitations/receive/"+req.body.addr+".json")) {
        invitsReceive = JSON.parse(fs.readFileSync("invitations/receive/"+req.body.addr+".json"));
    }
    if (fs.existsSync("invitations/sended/"+req.body.addr+".json")) {
        invitsSended = JSON.parse(fs.readFileSync("invitations/sended/"+req.body.addr+".json"));
    }
    
    if (fs.existsSync("mystics/"+req.body.addr+".json")) {
        fs.readFile("mystics/"+req.body.addr+".json", (err, data) => {
            if (err) throw err;mystic = JSON.parse(data);
            mysticTemp = {"mystic":req.body.mystic,"data":mystic.data,"addr":req.body.addr};
            allMystics[req.body.addr] = mysticTemp
            fs.writeFile("mystics/"+req.body.addr+".json", JSON.stringify(mysticTemp), (err) => {if (err) throw err;});
            res.send(JSON.stringify({invitsReceive:invitsReceive,invitsSended:invitsSended,mystic:mysticTemp}));
        });
    }else{
        mysticTemp = {"mystic":req.body.mystic,"data":newMysticData,"addr":req.body.addr};
        allMystics[req.body.addr] = mysticTemp;
        fs.writeFile("mystics/"+req.body.addr+".json", JSON.stringify(mysticTemp), (err) => {if (err) throw err;});
        res.send(JSON.stringify({invitsReceive:invitsReceive,invitsSended:invitsSended,mystic:mysticTemp}));
    }
    
})

/**
 * Recupere les data d'un user enregistrer au préalable
 */
 app.post('/getOneUser', (req, res) => {
    if (fs.existsSync("mystics/"+req.body.addr+".json")) {
        fs.readFile("mystics/"+req.body.addr+".json", (err, data) => {
            if (err) throw err;messages = JSON.parse(data);
            res.send(data);
        });
    }else{
        res.send('User not exist!')
    }
})

/**
 * Supprime le mystic de l'user qui vend et l'ajoute a celui qui achète
 */
 app.post('/buyOrTransfer', (req, res) => {
    var newMystic = undefined;
   if (fs.existsSync("mystics/"+req.body.addrSeller+".json")) {
       fs.readFile("mystics/"+req.body.addrSeller+".json", (err, data) => {
           if (err) throw err;mystic = JSON.parse(data);
           newMystic = mystic.mystic;
           mysticTemp = {"mystic":{},"data":newMysticData,"addr":req.body.addrSeller};
           delete allMystics[req.body.addrSeller];
           fs.writeFile("mystics/"+req.body.addrSeller+".json", JSON.stringify(mysticTemp), (err) => {if (err) throw err;});
       });
   }
   if (fs.existsSync("mystics/"+req.body.addrBuyer+".json")) {
       fs.readFile("mystics/"+req.body.addrBuyer+".json", (err, data) => {
           if (err) throw err;mystic = JSON.parse(data);
           mysticTemp = {"mystic":newMystic,"data":newMysticData,"addr":req.body.addrBuyer};
           allMystics[req.body.addrBuyer] = mysticTemp
           fs.writeFile("mystics/"+req.body.addrBuyer+".json", JSON.stringify(mysticTemp), (err) => {if (err) throw err;});
       });
   }
})

/**
 * Recupere les data de tous les mystics
 */
app.get('/getAllMystics', (req, res) => {
    console.log('all',allMystics)
    res.send(JSON.stringify(allMystics))
})

/**
 * Donner une value par parts du mystic (pour les damages , life , ect)
 */
function partsPoints(part){//max 24
    if(part==0)return 12;
    if(part==1)return 4;
    if(part==2)return 6;
    if(part==3)return 18;
}


/**
 * PARTIE RECHERCHE
 */
 app.post('/filterMystics', (req, res) => {
    if (fs.existsSync("mystics/"+req.body.addr+".json")) {
        fs.readFile("mystics/"+req.body.addr+".json", (err, data) => {
            if (err) throw err;messages = JSON.parse(data);
            res.send(data);
        });
    }else{
        res.send('User not exist!')
    }
})



/**
 * PARTIE INVITATION ET REPRODUCTION
 */

/**
 * Envoi une invitation qui peut être accepter ou refuser pour faire reproduction entre deux mystic
 */
app.post('/addInvit', (req, res) => {console.log("addinvit",req.body)
    if (!fs.existsSync("invitations/sended/"+req.body.addrOne.toString()+".json")) {
        fs.writeFile("invitations/sended/"+req.body.addrOne.toString()+".json", JSON.stringify({[req.body.addrTwo.toString()]:req.body.idTokenTwo}), (err) => {if (err) throw err;});
    }else{
        fs.readFile("invitations/sended/"+req.body.addrOne.toString()+".json", (err, data) => {
            if (err) throw err;let invit = JSON.parse(data);
            invit[req.body.addrTwo.toString()] = req.body.idTokenTwo;
            fs.writeFile("invitations/sended/"+req.body.addrOne.toString()+".json", JSON.stringify(invit), (err) => {if (err) throw err;});
        });
    }

    if (!fs.existsSync("invitations/receive/"+req.body.addrTwo.toString()+".json")) {
        fs.writeFile("invitations/receive/"+req.body.addrTwo.toString()+".json", JSON.stringify({[req.body.addrOne.toString()]:req.body.idTokenOne}), (err) => {if (err) throw err;});
    }else{
        fs.readFile("invitations/receive/"+req.body.addrTwo.toString()+".json", (err, data) => {
            if (err) throw err;let invit = JSON.parse(data);
            invit[req.body.addrOne.toString()] = req.body.idTokenOne;
            fs.writeFile("invitations/receive/"+req.body.addrTwo.toString()+".json", JSON.stringify(invit), (err) => {if (err) throw err;});
        });
    }
})

/**
 * Accepter l'invitation d'une reproduction de mystic
 * renvoi le code de la 
 */
app.post('/acceptInvit', (req, res) => {
    if (fs.existsSync("invitations/receive/"+req.body.addrOne+".json")) {
        fs.readFile("invitations/receive/"+req.body.addrOne+".json", (err, data) => {
            if (err) throw err;let invit = JSON.parse(data);let valid = false;
            if(invit[req.body.addrTwo]){
                delete invit[req.body.addrTwo];
                valid = true;
            } 
            //A REMETTRE APRES TESTS
            fs.writeFile("invitations/receive/"+req.body.addrOne+".json", JSON.stringify(invit), (err) => {if (err) throw err;});
            reproduce(req,res);
        });
    }
})

/**
 * Supprimé l'invitation reçu par l'utilisateur et supprime aussi l'invitation envoyé
 */
app.post('/deleteInvitReceive', (req, res) => {
    if (fs.existsSync("invitations/receive/"+req.body.addrOne+".json")) {
        fs.readFile("invitations/receive/"+req.body.addrOne+".json", (err, data) => {
            if (err) throw err;let invit = JSON.parse(data);
            if(invit[req.body.addrTwo]) delete invit[req.body.addrTwo];
            fs.writeFile("invitations/receive/"+req.body.addrOne+".json", JSON.stringify(invit), (err) => {if (err) throw err;});
        });
    }
    if (fs.existsSync("invitations/sended/"+req.body.addrTwo+".json")) {
        fs.readFile("invitations/sended/"+req.body.addrTwo+".json", (err, data) => {
            if (err) throw err;let invit = JSON.parse(data);
            if(invit[req.body.addrOne]) delete invit[req.body.addrOne];
            fs.writeFile("invitations/sended/"+req.body.addrTwo+".json", JSON.stringify(invit), (err) => {if (err) throw err;});
        });
    }
    res.send("ok");
})

/**
 * Supprimé l'invitation envoyé par l'utilisateur et supprime aussi l'invitation reçu
 */
app.post('/deleteInvitSended', (req, res) => {
    if (fs.existsSync("invitations/sended/"+req.body.addrOne+".json")) {
        fs.readFile("invitations/sended/"+req.body.addrOne+".json", (err, data) => {
            if (err) throw err;let invit = JSON.parse(data);
            if(invit[req.body.addrTwo]) delete invit[req.body.addrTwo];
            fs.writeFile("invitations/sended/"+req.body.addrOne+".json", JSON.stringify(invit), (err) => {if (err) throw err;});
        });
    }
    if (fs.existsSync("invitations/receive/"+req.body.addrTwo+".json")) {
        fs.readFile("invitations/receive/"+req.body.addrTwo+".json", (err, data) => {
            if (err) throw err;let invit = JSON.parse(data);
            if(invit[req.body.addrOne]) delete invit[req.body.addrOne];
            fs.writeFile("invitations/receive/"+req.body.addrTwo+".json", JSON.stringify(invit), (err) => {if (err) throw err;});
        });
    }
})

/**
 * Reproduction entre deux mystics de joueurs
 * On répartit les parts des deux mystics de façon alétoire sur deux oeufs, un pour chaque user
 * Puis a la réponse côter client envoyé les datas vers le contrat intélligent avec web3
 * faire gaffe a la sécurité, peut être mêttre  msg.sender dans la fonction reproduce pour être sur que celui qui accepte est le bon
 */
 function reproduce (req, res) {
    var userOne;
    var userTwo;
    if (fs.existsSync("mystics/"+req.body.addrOne+".json")) {
        if (fs.existsSync("mystics/"+req.body.addrTwo+".json")) {
            fs.readFile("mystics/"+req.body.addrOne+".json", (err, data) => {
                if (err) throw err;userOne = JSON.parse(data).mystic;
                fs.readFile("mystics/"+req.body.addrTwo+".json", (err, data) => {
                    if (err) throw err;userTwo = JSON.parse(data).mystic;
                    //console.log('usertwo',userTwo)
                    //CREATE EGG
                    let egg1 = {"parts":[btw2v(userOne["parts"][0],userTwo["parts"][0]),btw2v(userOne["parts"][1],userTwo["parts"][1]),btw2v(userOne["parts"][2],userTwo["parts"][2]),btw2v(userOne["parts"][3],userTwo["parts"][3]),btw2v(userOne["parts"][4],userTwo["parts"][4]),btw2v(userOne["parts"][5],userTwo["parts"][5])]};
                    let egg2 = {"parts":[btw2v(userOne["parts"][0],userTwo["parts"][0]),btw2v(userOne["parts"][1],userTwo["parts"][1]),btw2v(userOne["parts"][2],userTwo["parts"][2]),btw2v(userOne["parts"][3],userTwo["parts"][3]),btw2v(userOne["parts"][4],userTwo["parts"][4]),btw2v(userOne["parts"][5],userTwo["parts"][5])]};
                    //console.log({"egg1":egg1,"egg2":egg2})
                    res.send(JSON.stringify({"egg1":egg1,"egg2":egg2}));
                });
            });
        }else{
            res.send('User not exist!')
        }
    }else{
        res.send('User not exist!')
    }
}





app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})








function save(){
    try {
        fs.writeFile('saveUsers.json', JSON.stringify(houses), (err) => {if (err) throw err;});
        fs.writeFile('saveMessages.json', JSON.stringify(messages), (err) => {if (err) throw err;});
        
    } catch (err) {
        errors[Date.now()] = {"error":JSON.stringify(error)};
        console.error(err);
    }
}

load();

function load(){

    fs.readdir("mystics", function (err, files) {
        if (err) {
          console.error("Could not list the directory.", err);
          process.exit(1);
        }
      
        files.forEach(function (file, index) {console.log(file)
            if (fs.existsSync("mystics/"+file)) {
                fs.readFile("mystics/"+file, (err, data) => {
                    if (err) throw err;mystic = JSON.parse(data);
                    allMystics[mystic.addr] = mystic
                    //console.log(allMystics)
                });
            }
        });
      });


      /*
    fs.readFile('saveUsers.json', (err, data) => {
        if (err) throw err;houses = JSON.parse(data);
        fs.readFile('saveMessages.json', (err, data) => {
            if (err) throw err;messages = JSON.parse(data);
            

        });
    });*/
}

