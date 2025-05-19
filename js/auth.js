firebase.auth().languageCode = 'pt-br'
function loginWithPassword(event){
        event.preventDefault()
                firebase.auth().signInWithEmailAndPassword(authForm.email.value, 
            authForm.password.value ).catch(function (error){
                    showError('falha no acesso ', error)
            })
}
authForm.onsubmit = function(event){
    // showItem(loading)
    event.preventDefault()
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