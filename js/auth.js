firebase.auth().languageCode = 'pt-br'


function loginWithPassword(event){
        showItem2(loading)
        // event.preventDefault()
                firebase.auth().signInWithEmailAndPassword(authForm.email.value, 
            authForm.password.value ).catch(function (error){
                    showError('falha no acesso ', error)
            }).finally(function(){
                hideItem(loading)
            })
}

// função que permite o usuario se deslogar do app 
function signOut(){
    showItem2(loading)
    firebase.auth().signOut().catch(function(error){
        showError('erro ao sair '+ error)
        hideItem2(loading)
    }).finally(function(){
        hideItem2(loading)
    })
    // hideItem(LogOut)
}

function NewUser(){
            const auth = firebase.auth();
        showItem2(loading)
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
                hideItem2(loading)
            })
            .catch((error) => {
                showError('Falha no cadastro', error);
                hideItem2(loading)
            });
}

  function signInWithGoogle(){
    showItem2(loading)
    firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider()).catch(function(error){
        console.log(error)
    }).finally(function(){
        hideItem2(loading)
        console.log("logou pela google")
    })
  }

firebase.auth().onAuthStateChanged(function(user){
    // showItem2(loading)
    if(user){
        console.log("logou")
        hideItem2(step2)
        showUserContent(user)
        hideItem2(loading)
    }else{
        hideItem2(loading)
        console.log("nao logou")
        showAuth()
    }
})

function showAuth(){

showItem(step2)
  hideItem(step4)
}

function updateProfile() {
  const auth = firebase.auth();
  const user = auth.currentUser;
 showItem2(loading)
  // Captura os valores dos campos do formulário mantendo case-sensitive
  const nome = document.querySelector('input[name="Nome"]').value;
  const cargo = document.querySelector('#cargoUser').value;
  const turno = document.querySelector('#turnoUser').value;
  const area = document.querySelector('#areaUser').value;
  const admissao = document.querySelector('#admissaoUser').value;

    // Verifica se algum campo está vazio
  if (!nome || !cargo || !turno || !area || !admissao) {
    alert("Por favor, preencha todos os campos antes de prosseguir.");
    hideItem2(loading)
    return;
  }

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
    hideItem2(loading)
  })
  .catch(error => {
    console.error("Erro ao atualizar perfil:", error);
    hideItem2(loading)
  });
}



