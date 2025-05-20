firebase.auth().languageCode = 'pt-br'


function loginWithPassword(event){
        // event.preventDefault()
                firebase.auth().signInWithEmailAndPassword(authForm.email.value, 
            authForm.password.value ).catch(function (error){
                    showError('falha no acesso ', error)
            })
}

// função que permite o usuario se deslogar do app 
function signOut(){

    firebase.auth().signOut().catch(function(error){
        showError('erro ao sair '+ error)
    })
    // hideItem(LogOut)
}

function NewUser(){
            const auth = firebase.auth();
    
        auth.createUserWithEmailAndPassword(authFormNew.emailNew.value, authFormNew.passwordNew.value)
            .then((userCredential) => {
                const user = userCredential.user;
    
                // Atualiza o perfil do usuário com o nome
                // return user.updateProfile({
                //     displayName: authForm.name.value
                // });
            })
            .then(() => {
                console.log("Usuário criado e nome atualizado com sucesso!");
            })
            .catch((error) => {
                showError('Falha no cadastro', error);
            });
}

  function signInWithGoogle(){
    // showItem(loading)
    firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider()).catch(function(error){
        console.log(error)
    }).finally(function(){
        // hideItem(loading)
        console.log("logou pela google")
    })
  }

firebase.auth().onAuthStateChanged(function(user){
    // hideItem(loading)
    if(user){
        // console.log("logou")
       showUserContent(user)
    }else{
        console.log("nao logou")
        showAuth()
    }
})

function showAuth(){
//   hideItem(headerBoots)
  hideItem(userContent)
  showItem(step2)
}


//mostrar conetudo para usuarios authenticated
function showUserContent(user){

//   userImg2.src = user.photoURL ? user.photoURL : 'img/unknownUser.png'
//   userImg.src = user.photoURL ? user.photoURL : 'img/unknownUser.png'
//   userName.innerHTML = user.displayName
//   userEmail.innerHTML= user.email
  hideItem(step2)
  showItem(userContent)

}

authForm.onsubmit = function(event){
    // showItem(loading)
    // event.preventDefault()
    if(authForm.submitAuthForm.innerHTML == 'Acessar'){ 
        firebase.auth().signInWithEmailAndPassword(authForm.email.value, 
            authForm.password.value ).catch(function (error){
                    showError('falha no acesso ', error)
            })
    }else{
        const auth = firebase.auth();
    
        auth.createUserWithEmailAndPassword(authForm.email.value, authForm.password.value)
            .then((userCredential) => {
                const user = userCredential.user;
    
                // Atualiza o perfil do usuário com o nome
                return user.updateProfile({
                    displayName: authForm.name.value
                });
            })
            .then(() => {
                console.log("Usuário criado e nome atualizado com sucesso!");
            })
            .catch((error) => {
                showError('Falha no cadastro', error);
            });
    }
}