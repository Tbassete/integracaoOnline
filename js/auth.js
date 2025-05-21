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
        console.log("logou")
        hideItem(step2)
       showUserContent(user)
    }else{
        console.log("nao logou")
        showAuth()
    }
})

function showAuth(){
//   hideItem(headerBoots)
showItem(step2)
  hideItem(step4)
}

function updateProfile() {
  const auth = firebase.auth();
  const user = auth.currentUser;

  // Captura os valores dos campos do formulário mantendo case-sensitive
  const nome = document.querySelector('input[name="Nome"]').value;
  const cargo = document.querySelector('#cargoUser').value;
  const turno = document.querySelector('#turnoUser').value;
  const area = document.querySelector('#areaUser').value;
  const admissao = document.querySelector('#admissaoUser').value;

    // Verifica se algum campo está vazio
//   if (!nome || !cargo || !turno || !area || !admissao) {
//     alert("Por favor, preencha todos os campos antes de prosseguir.");
//     return;
//   }

  // Atualiza o perfil do usuário no Firebase Authentication
  user.updateProfile({
    displayName: nome
  })
  .then(() => {
    // Atualiza informações adicionais no Realtime Database com nome em letra maiúscula
    var database = firebase.database();
    var dbRefUsers = database.ref('users');
    var dataUpdated = true
    return dbRefUsers.child(user.uid).set({
      cargo: cargo.toUpperCase(),
      turno: turno.toUpperCase(),
      area: area.toUpperCase(),
      admissao: admissao,
      nomeCompleto: nome,
      nomeCompletoUpperCase:nome.toUpperCase(),
      dataUpdated: dataUpdated,
    });
  })
  .then(() => {
      console.log("Perfil e dados atualizados com sucesso!");
      showUserContent(user); // avança para a próxima etapa

  })
  .catch(error => {
    console.error("Erro ao atualizar perfil:", error);
  });
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