var dontHaveAccount = document.getElementById('dontHaveAccount');
var haveAccount = document.getElementById('haveAccount');
var step1 = document.getElementById('step1')
var white = document.getElementById('white')
var white2 = document.getElementById('white2')
var step2 = document.getElementById('step2')
var step3 = document.getElementById('step3')
var step35 = document.getElementById('step35')
var step4 = document.getElementById('step4')
var sectionVideos = document.getElementById('sectionVideos')
var sectionConcluded = document.getElementById('sectionConcluded')
var userProfile = document.getElementById('userProfile')
var ShowQuests = document.getElementById('showQuests')
var authForm = document.getElementById('authForm')
var authFormNew = document.getElementById('authFormNew')
var UserContent = document.getElementById('UserContent')
var loading = document.getElementById('loading')
var ResponderAuthNewUser = document.getElementById('ResponderAuthNewUser')
var ResponderAuth = document.getElementById('ResponderAuth')
var h1ColetaDados = document.getElementById('h1ColetaDados')
var redefinirSenha = document.getElementById('redefinirSenha')
var userImg = document.getElementById('userImg')
var admissaoUser2 = document.getElementById('admissaoUser2')
var areaUser2 = document.getElementById('areaUser2')
var turnoUser2 = document.getElementById('turnoUser2')
var userEmail2 = document.getElementById('userEmail2')
var userName = document.getElementById('userName')
var cargoUser2 = document.getElementById('cargoUser2')
var responderImgUpdate = document.getElementById('responderImgUpdate')

function showItem(element) {
    element.classList.add('transition-item');
  
    element.style.display = 'block';
    let height = element.scrollHeight + 'px';
  
    requestAnimationFrame(() => {
      element.style.height = '0px';
      element.style.opacity = '0';
  
      requestAnimationFrame(() => {
        element.style.transition = 'opacity 0.4s ease, height 0.4s ease';
        element.style.height = height;
        element.style.opacity = '1';
      });
    });
  }

  function hideItem(element) {
    element.style.transition = 'opacity 0.4s ease, height 0.4s ease';
    element.style.height = element.scrollHeight + 'px';
    element.style.opacity = '1';
  
    requestAnimationFrame(() => {
      element.style.height = '0px';
      element.style.opacity = '0';
    });
  
    // Após a animação, remove do layout
    setTimeout(() => {
      element.style.display = 'none';
    }, 400);
  }
  
  function showItem2(element) {
    // element.classList.add('transition-item');
    // element.style.opacity = '0';
    requestAnimationFrame(() => {

        element.style.opacity = '0';
    
        requestAnimationFrame(() => {
          element.style.transition = 'opacity 0.4s ease, height 0.4s ease';

          element.style.opacity = '1';
        });
      });

    element.style.display = 'flex';
  }

  function hideItem2(element) {
    element.style.transition = 'opacity 0.4s ease, height 0.4s ease';
    // element.style.height = element.scrollHeight + 'px';
    element.style.opacity = '1';
  
    requestAnimationFrame(() => {

        element.style.opacity = '0';
      });
    setTimeout(() => {
      element.style.display = 'none';
    }, 400);
  }




function toggleToAccess() {
  showItem(haveAccount);
  hideItem(dontHaveAccount);
}

function toggleToRegister() {
  showItem(dontHaveAccount);
  hideItem(haveAccount);
}

function closetep1(){
    hideItem2(step1)
    hideItem2(white)
    hideItem2(white2)
}

function showtep1() {
    showItem2(step1);
    showItem2(white);
    showItem2(white2);
  }
  
// Chama a função a cada 1 hora
setInterval(showtep1, 3600000);

function closeUpdates(){
  const auth = firebase.auth();
  const user = auth.currentUser;
  showUserContent(user)
}
function showUserContent(user) {
    // hideItem(step2);
    if(!step1){

      showItem2(loading)
    }
    const userId = user.uid;
    const dbRefUsers = firebase.database().ref('users');


    dbRefUsers.once('value')
        .then(snapshot => {
            const usersData = snapshot.val();

            if (usersData && usersData[userId] && usersData[userId].dataUpdated === true) {
                if (user.emailVerified) {
                  if(!user.photoURL){
                     showFormUpdateImgProfile()
                     imagePreview.src = user.photoURL ? user.photoURL : 'img/unknownUser.png'
                  }else{
                  // getVideos()
                  showItem(step4);
                  hideItem(step3)
                  hideItem2(loading)
                  
                  // usersData[userId].dataUpdated
                    
                    userImg.src = user.photoURL ? user.photoURL : 'img/unknownUser.png'
                    userName.innerHTML = user.displayName
                    userEmail2.innerHTML= user.email
                    areaUser2.innerHTML = usersData[userId].area || 'Não informado';
                    turnoUser2.innerHTML = usersData[userId].turno || 'Não informado';
                    admissaoUser2.innerHTML = usersData[userId].admissao || 'Não informado';
                    cargoUser2.innerHTML = usersData[userId].cargo || 'Não informado';
                    console.log(cargoUser2)
                  }
                }else{
                  hideItem(step3)
                  showItem(step35);
                  hideItem2(loading)
                  sendEmailVerification()
                }
            } else {
                showItem(step3);
                hideItem2(loading)
            }
        })
        .catch(error => {
            console.error("Erro ao buscar dados do usuário:", error);
            showItem(step3); // fallback seguro
            hideItem2(loading)
        });
}



function sendEmailVerification(){
    showItem2(loading)
    var user = firebase.auth().currentUser
    user.sendEmailVerification(actionCodeSettings).then(function(){
        alert('email de verificação foi enviado')
    }).catch(function(error){
      console.log(error)
        // showError('falha ao enviar email de verificação '+ error)
    }).finally(function(){
        hideItem2(loading)
    })
    
}

function showstep4(){
    hideItem(step3)
    showItem(step4)
}

function showConcluded(){
    hideItem(userProfile)
    hideItem(sectionVideos)
    hideItem(ShowQuests)
    showItem(sectionConcluded)
}

function showProfile(){
    hideItem(sectionConcluded)
    hideItem(sectionVideos)
    hideItem(ShowQuests)
    showItem(userProfile)
}

function showVideos(){
    hideItem(userProfile)
    hideItem(sectionConcluded)
    hideItem(ShowQuests)
    showItem(sectionVideos)
}

function editProfile(){


  showItem(step3)
}

function showQuests1(){
  hideItem(sectionVideos)
  hideItem(userProfile)
  hideItem(sectionConcluded)
  showItem(ShowQuests)
}

// cebtralizar e traduzir erros 
function showError(prefix, error) {
  
  console.log(error.code);
  // hideItem(loading);

  switch (error.code) {
    case 'auth/invalid-email':
    case 'auth/wrong-password':
    // case 'auth/internal-error':
      ResponderAuth.innerHTML = `${prefix}   email ou senha incorretos`
      showItem2(redefinirSenha)
      break;
    default:
        ResponderAuth.innerHTML = `${prefix}  email ou senha incorretos '${error.code}'  `
        showItem2(redefinirSenha)
      break;
  }
}

var database = firebase.database()
var dbRefUsers = database.ref('users')

var actionCodeSettings = {
  // url: 'https://todo-13563.firebaseapp.com' //voltar para esse depois
  url: 'https://welcome-to-megatech.web.app'
  // url: 'https://127.0.0.1:5504'
}