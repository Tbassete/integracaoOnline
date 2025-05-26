function adicionarVideosPerguntas() {
    const auth = firebase.auth();
    const user = auth.currentUser;
  
  
    if (todoForm.name.value !== '') {
      const file = todoForm.file.files[0];
  
      if (file) {
        if (file.type.includes('image')) {
          const imgName = firebase.database().ref().push().key + '-' + file.name;
          const imgPath = 'todoListFiles/' + user.uid + '/' + imgName;
          const storageRef = firebase.storage().ref(imgPath);
          const upload = storageRef.put(file);
  
          trackUpload(upload).then(function () {
            storageRef.getDownloadURL().then(function (downloadURL) {
              const respostaCorreta = document.querySelector('input[name="respostaCorreta"]:checked')?.value;
  
                // const nomeDoUsuario = snapshot.val() || 'Nome não encontrado';
  
                const data = {
                  uid: user.uid,
                //   nomeUsuario: nomeDoUsuario,
                  imgUrl: downloadURL,
                  pergunta: todoForm.pergunta.value,
                //   nameToLowerCase: todoForm.name.value.toLowerCase(),
                  name: todoForm.name.value,
                  linkVideo: todoForm.linkVideo.value,
                  resposta1: todoForm.resposta1.value,
                  resposta2: todoForm.resposta2.value,
                  resposta3: todoForm.resposta3.value,
                  resposta4: todoForm.resposta4.value,
                  correta: respostaCorreta,
                  createdAt: new Date().toISOString()
                };
  
                const videoKey = firebase.database().ref().child('videos').push().key;
  
                const updates = {};
                updates['/videos/' + videoKey] = data;
                updates['/users/' + user.uid + '/videos/' + videoKey] = data;
  
                firebase.database().ref().update(updates).then(function () {
                  console.log('Vídeo adicionado com sucesso em videos/ e users/' + user.uid + '/videos/');
                  todoForm.reset();
                  document.getElementById('previewImage').style.display = 'none';
                }).catch(function (error) {
                    console.log('Erro ao salvar o vídeo:', error);
                });
  

  
            }).catch(function (error) {
              console.log('Erro ao obter URL da imagem', error);
            });
          });
  
        } else {
          alert('O arquivo selecionado não é uma imagem.');
        }
      } else {
        alert('O vídeo precisa de uma foto da capa.');
      }
    } else {
      alert('O título do vídeo não pode estar vazio.');
    }
  }

  function trackUpload(uploadTask) {
    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        function progress(snapshot) {
          // Você pode usar isso para mostrar progresso de upload se quiser
          const percent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload em andamento: ${percent.toFixed(0)}%`);
        },
        function error(err) {
          console.error('Erro no upload:', err);
          reject(err);
        },
        function complete() {
          console.log('Upload completo');
          resolve(); // Continua o fluxo após o upload
        }
      );
    });
  }
  