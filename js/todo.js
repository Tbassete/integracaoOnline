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

                  imgUrl: downloadURL,
                  // pergunta: todoForm.pergunta.value,
                  pergunta: todoForm.pergunta.value,
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
  

  // funções que exibem os videos e perguntas na tela.

function carregarVideosFirebase() {
  const dbRefVideos = firebase.database().ref('videos');
  const listVideos = document.getElementById('listVideos');
  const showQuests = document.getElementById('showQuests');
  const containerIframe = showQuests.querySelector('.containerIframe');
  const containerPerguntas = document.getElementById('ContainerPerguntas');

  dbRefVideos.once('value')
    .then(snapshot => {
      listVideos.innerHTML = '<h1>Aqui começa a <br>sua jornada!</h1>'; // limpa e reinsere o título

      snapshot.forEach(videoSnap => {
        const video = videoSnap.val();
        const videoId = videoSnap.key;

        // Criação do card
        const videoDiv = document.createElement('div');
        videoDiv.classList.add('allVideos');
        videoDiv.id = videoId;

        const img = document.createElement('img');
        img.src = video.imgUrl;
        img.alt = 'Capa do vídeo';
        img.classList.add('imgCapa');

        videoDiv.appendChild(img);

        // Evento de clique
        videoDiv.addEventListener('click', () => {
          // Mostra a div com o iframe + perguntas
          showQuests1()
          let embedUrl = video.linkVideo;

          if (embedUrl.includes('watch?v=')) {
            embedUrl = embedUrl.replace('watch?v=', 'embed/');
          } else if (embedUrl.includes('youtu.be/')) {
            const videoId = embedUrl.split('youtu.be/')[1].split('?')[0];
            embedUrl = `https://www.youtube.com/embed/${videoId}`;
          }
          
          containerIframe.innerHTML = `
          <iframe width="560" height="315" 
     
          src="${embedUrl}" 
          title="YouTube video player" 
          frameborder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
          referrerpolicy="strict-origin-when-cross-origin" 
          allowfullscreen>
          </iframe>
          `;
          // Converte automaticamente links padrão do YouTube em formato embed

          // // Atualiza a pergunta e respostas
          // containerPerguntas.innerHTML = `
          //   <h2>${video.pergunta}</h2>
          //   <form>
          //     <label>
          //       <input type="radio" name="pergunta" value="1">
          //       ${video.resposta1}
          //     </label>
          //     <label>
          //       <input type="radio" name="pergunta" value="2">
          //       ${video.resposta2}
          //     </label>
          //     <label>
          //       <input type="radio" name="pergunta" value="3">
          //       ${video.resposta3}
          //     </label>
          //     <label>
          //       <input type="radio" name="pergunta" value="4">
          //       ${video.resposta4}
          //     </label>
          //   </form>
          //   <button class="ButtonStyleBlue" verificarResposta(${video.key}, ${video.correta})>CONCLUIR</button>
          // `;
          
containerPerguntas.innerHTML = `
  <h2>${video.pergunta}</h2>
  <form id="formPergunta">
    <label><input type="radio" name="pergunta" value="1">${video.resposta1}</label>
    <label><input type="radio" name="pergunta" value="2">${video.resposta2}</label>
    <label><input type="radio" name="pergunta" value="3">${video.resposta3}</label>
    <label><input type="radio" name="pergunta" value="4">${video.resposta4}</label>
    <button type="submit" class="ButtonStyleBlue">CONCLUIR</button>
  </form>
`;

document.getElementById('formPergunta').onsubmit = function (e) {
  e.preventDefault();
  verificarResposta(videoId, video.correta); // ✅ usa direto, sem redeclarar
};
        });

        // Adiciona o card à lista
        listVideos.appendChild(videoDiv);
      });

// 🔹 Cria o container com classe e ID padrão
const espacoExtra = document.createElement('div');
espacoExtra.id = 'soParaDarVolume';
espacoExtra.classList.add('containerIframe');

// 🔹 PASSO 1: Botão "Imprimir Certificado"
const btnCertificado = document.createElement('button');
btnCertificado.textContent = 'Imprimir Certificado';
btnCertificado.onclick = imprimirCertificado;
btnCertificado.id = 'btnImprimirCertificado';
btnCertificado.classList.add('ButtonStyleBlue');

// 🔹 PASSO 2: Container do certificado (inicialmente oculto)
const certificadoContainer = document.createElement('div');
certificadoContainer.id = 'certificadoContainer';
certificadoContainer.classList.add('startHidden');

certificadoContainer.innerHTML = `
  <div id="certificadoContent"></div>
  <button onclick="window.print()">Imprimir agora</button>
`;

// 🔹 PASSO 3: Área de resposta (caso não tenha concluído todos os vídeos)
const responder = document.createElement('div');
responder.id = 'responderCertificado';
responder.style.marginTop = '1rem';

// 🔹 Adiciona tudo dentro do espacoExtra
espacoExtra.appendChild(btnCertificado);
espacoExtra.appendChild(certificadoContainer);
espacoExtra.appendChild(responder);

// 🔹 Adiciona ao DOM principal
listVideos.appendChild(espacoExtra);
    })
    .catch(error => {
      console.error('Erro ao buscar vídeos:', error);
    });
}

function verificarResposta(videoId, respostaCorreta) {
  const user = firebase.auth().currentUser;
  if (!user) {
    alert('Usuário não autenticado.');
    return;
  }

  // Pega qual input está marcado
  const respostaSelecionada = document.querySelector('input[name="pergunta"]:checked');

  if (!respostaSelecionada) {
    alert('Selecione uma resposta para continuar.');
    return;
  }

  const respostaUsuario = respostaSelecionada.value;

  if (respostaUsuario === respostaCorreta) {
    // Marca como concluído no banco de dados
    const userRef = firebase.database().ref(`users/${user.uid}/videosConcluded/${videoId}`);
    userRef.set(true)
      .then(() => {
        mostrarPopupConcluido();
      })
      .catch((error) => {
        console.error('Erro ao marcar vídeo como concluído:', error);
      });
  } else {
    alert('Resposta incorreta. Tente novamente.');
  }
}


// imprimir certificados

function imprimirCertificado() {
  const user = firebase.auth().currentUser;
  if (!user) {
    alert('Usuário não autenticado.');
    return;
  }

  const uid = user.uid;
  const db = firebase.database();

  const refConcluidos = db.ref(`users/${uid}/videosConcluded`);
  const refVideos = db.ref('videos');

  Promise.all([
    refConcluidos.once('value'),
    refVideos.once('value'),
    db.ref(`users/${uid}/nomeCompleto`).once('value')
  ])
    .then(([concluidosSnap, videosSnap, nomeSnap]) => {
      const concluidos = concluidosSnap.val() || {};
      const todosVideosConcluded = Object.keys(concluidos).length;
      const allVideos = videosSnap.numChildren();

      if (todosVideosConcluded >= allVideos && allVideos > 0) {
        const nome = nomeSnap.val() || 'Usuário';

        // Gera o certificado em HTML
        const certificadoHTML = `
          <h1>Certificado de Conclusão</h1>
          <p>Certificamos que <strong>${nome}</strong> concluiu com êxito todos os vídeos da Integração Corporativa.</p>
          <p><em>${new Date().toLocaleDateString()}</em></p>
        `;

        document.getElementById('certificadoContent').innerHTML = certificadoHTML;
        document.getElementById('certificadoContainer').classList.remove('startHidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });

      } else {
        document.getElementById('responderCertificado').innerText = 'Você ainda não concluiu todos os vídeos.';
      }
    })
    .catch(error => {
      console.error('Erro ao verificar certificado:', error);
    });
}