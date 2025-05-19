var dontHaveAccount = document.getElementById('dontHaveAccount');
var haveAccount = document.getElementById('haveAccount');
var step1 = document.getElementById('step1')
var white = document.getElementById('white')
var white2 = document.getElementById('white2')
var step2 = document.getElementById('step2')
var step3 = document.getElementById('step3')
var step4 = document.getElementById('step4')
var sectionVideos = document.getElementById('sectionVideos')
var sectionConcluded = document.getElementById('sectionConcluded')
var userProfile = document.getElementById('userProfile')
var ShowQuests = document.getElementById('showQuests')
var authForm = document.getElementById('authForm')
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


function showUserContent(){

    hideItem(step2)
    showItem(step3)
    updateVideoStyles();
    // if(verify = false){
    //     showItem(step3)
    // }else{
    //     showItem(step4)
    // }
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
  hideItem(loading);

  switch (error.code) {
    case 'auth/invalid-email':
    case 'auth/wrong-password':
      alert(prefix + ' email ou senha incorretos');
      break;
    default:
      alert(prefix + ' ' + error.message);
      break;
  }
}

var database = firebase.database()
var dbRefUsers = database.ref('users')

var actionCodeSettings = {
  // url: 'https://todo-13563.firebaseapp.com' //voltar para esse depois
  // url: 'https://megatecabrasil.web.app/'
  URL: 'https://127.0.0.1'
}