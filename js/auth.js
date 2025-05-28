firebase.auth().languageCode = 'pt-br'


function loginWithPassword(event){
        showItem2(loading)
        // event.preventDefault()
                firebase.auth().signInWithEmailAndPassword(authForm.email.value, 
            authForm.password.value ).catch(function (error){
                    showError('falha no acesso ', error)
                    showItem2(ResponderAuth)
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
                // showError('Falha no cadastro', error);
                ResponderAuthNewUser.innerHTML =`${error}`
                showItem2(ResponderAuthNewUser)
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
        
              const dbRef = firebase.database().ref('users/' + user.uid);

    dbRef.once('value').then(snapshot => {
      const dados = snapshot.val() || {};

      const atualizacoes = {};
      if (!dados.photoURL && user.photoURL) {
        atualizacoes.photoURL = user.photoURL;
      }
      if (!dados.nomeCompleto && user.displayName) {
        atualizacoes.nomeCompleto = user.displayName;
      }

      if (Object.keys(atualizacoes).length > 0) {
        dbRef.update(atualizacoes).then(() => {
          console.log('✅ Dados sincronizados com o login');
        });
      }
    });
    }else{
        hideItem2(loading)
        console.log("nao logou")
        showAuth()
    }
})

function showAuth(){

  showItem(step2)
  hideItem(step4)
  if(step35){
    hideItem(step35)
  }
}

    //reset de senha

  function  sendPasswordResetEmail(){
    var email = authForm.email.value
    if(email){
        showItem2(loading)
        firebase.auth().sendPasswordResetEmail(email, actionCodeSettings).then(function(){
            ResponderAuth.innerHTML = `ENVIAMOS O EMAIL PARA REDEFINIR A SENHA NO SEU EMAIL: ${email}`
            hideItem2(loading)
            showItem2(ResponderAuth)
        }).catch(function(error){
            ResponderAuth.innerHTML = `falha ao enviar email para redefinir a senha ${error}`
            showItem2(ResponderAuth)
        }).finally(function(){
            hideItem2(loading)
        })
    }else{
        ResponderAuth.innerHTML = 'PREENCHA O CAMPO DE EMAIL COM O SEU EMAIL'
    }
  }

//   função para atualizar a foto de perfil
function showFormUpdateImgProfile(){
    showItem(updatePhoto)
    hideItem(step3)
}


const profilePhotoInput = document.getElementById('profilePhotoInput');
const imagePreview = document.getElementById('imagePreview');


profilePhotoInput.addEventListener('change', function () {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            imagePreview.src = e.target.result;
            imagePreview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    } else {
        imagePreview.style.display = 'none';
        imagePreview.src = '';
    }
});

const profilePhotoForm = document.getElementById('profilePhotoForm');
// const profilePhotoInput = document.getElementById('profilePhotoInput');
const uploadProgress = document.getElementById('uploadProgress');
const uploadPercent = document.getElementById('uploadPercent');

profilePhotoForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const file = profilePhotoInput.files[0];
    if (!file) {
        responderImgUpdate.innerHTML = 'POR FAVOR, SELECIONE UMA IMAGEM';
        responderImgUpdate.style.color = 'red';
        return;
    }

    const storageRef = firebase.storage().ref();
    const user = firebase.auth().currentUser;
    const photoRef = storageRef.child(`profilePhotos/${user.uid}/${file.name}`);
    const uploadTask = photoRef.put(file);

    uploadProgress.style.display = 'block';
    uploadPercent.style.display = 'inline';

    uploadTask.on(
        'state_changed',
        function(snapshot) {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            uploadProgress.value = progress;
            uploadPercent.textContent = Math.floor(progress) + '%';
        },
        function(error) {
            console.error('Erro no upload:', error);
            alert('Erro ao enviar a foto.');
            uploadProgress.style.display = 'none';
            uploadPercent.style.display = 'none';
        },
        function() {
            uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                // Atualiza no Auth
                return user.updateProfile({
                    photoURL: downloadURL
                }).then(() => {
                    // Também salva no Realtime Database
                    const dbRefUsers = firebase.database().ref('users');
                    return dbRefUsers.child(user.uid).update({
                        photoURL: downloadURL
                    });
                }).then(() => {
                    alert('Foto de perfil atualizada com sucesso!');
                    uploadProgress.style.display = 'none';
                    uploadPercent.style.display = 'none';
                    hideItem(updatePhoto);
                    hideItem2(loading);
                    showItem(UserContent);
                });
            }).catch(function(error) {
                console.error('Erro ao atualizar perfil e database:', error);
            });
        }
    );
});



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
    // alert("Por favor, preencha todos os campos antes de prosseguir.");
    h1ColetaDados.innerHTML = 'Por favor, preencha todos os campos antes de prosseguir.'
    h1ColetaDados.style.color = 'red';
    h1ColetaDados.style.fontSize = '1.9rem';
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



