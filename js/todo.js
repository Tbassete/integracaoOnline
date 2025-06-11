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
                  nomeVideo: todoForm.nomeVideo.value,
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

      // 1) Transforma snapshot em array
      const videos = [];
      snapshot.forEach(videoSnap => {
        const video = videoSnap.val();
        const videoId = videoSnap.key;
        videos.push({ video, videoId });
      });

      // 2) Ordena numericamente pelo campo "ordem"
      videos.sort((a, b) => Number(a.video.ordem) - Number(b.video.ordem));

      // 3) Renderiza na ordem correta
      videos.forEach(({ video, videoId }) => {
        // Criação do card
        const videoDiv = document.createElement('div');
        videoDiv.classList.add('allVideos');
        videoDiv.id = videoId;

        // Wrapper para a imagem e o ícone SVG
        const wrapper = document.createElement('div');
        wrapper.classList.add('videoWrapper');

        const img = document.createElement('img');
        img.src = video.imgUrl;
        img.alt = 'Capa do vídeo';
        img.classList.add('imgCapa');

        const svg = document.createElement('div');
        svg.innerHTML = `
<svg xmlns="http://www.w3.org/2000/svg" width="70" height="70" fill="currentColor" class="playIcon bi bi-play-circle" viewBox="0 0 16 16">
  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
  <path d="M6.271 5.055a.5.5 0 0 1 .52.038l3.5 2.5a.5.5 0 0 1 0 .814l-3.5 2.5A.5.5 0 0 1 6 10.5v-5a.5.5 0 0 1 .271-.445"/>
</svg>
`;

        wrapper.appendChild(img);
        wrapper.appendChild(svg);
        videoDiv.appendChild(wrapper);

        // Evento de clique
        videoDiv.addEventListener('click', () => {
          showQuests1();

          let embedUrl = video.linkVideo;
          if (embedUrl.includes('watch?v=')) {
            embedUrl = embedUrl.replace('watch?v=', 'embed/');
          } else if (embedUrl.includes('youtu.be/')) {
            const vidId = embedUrl.split('youtu.be/')[1].split('?')[0];
            embedUrl = `https://www.youtube.com/embed/${vidId}`;
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

          containerPerguntas.innerHTML = `
            <h2>${video.pergunta}</h2>
            <form id="formPergunta">
              <label><input type="radio" name="pergunta" value="1">${video.resposta1}</label>
              <label><input type="radio" name="pergunta" value="2">${video.resposta2}</label>
              <label><input type="radio" name="pergunta" value="3">${video.resposta3}</label>
              <label><input type="radio" name="pergunta" value="4">${video.resposta4}</label>
              <p id="responderRespostas"></p>
              <button type="submit" class="ButtonStyleBlue">CONCLUIR</button>
            </form>
          `;

          document.getElementById('formPergunta').onsubmit = function (e) {
            e.preventDefault();
            verificarResposta(videoId, video.correta);
          };
        });

        // Adiciona o card à lista
        listVideos.appendChild(videoDiv);
      });

      // 🔹 Cria o container com classe e ID padrão
      const espacoExtra = document.createElement('div');
      espacoExtra.id = 'soParaDarVolume';
      espacoExtra.classList.add('containerIframe1');

      // 🔹 PASSO 1: Botão "Imprimir Certificado"
      const btnCertificado = document.createElement('button');
      btnCertificado.textContent = 'Imprimir Certificado';
      btnCertificado.onclick = imprimirCertificado;
      btnCertificado.id = 'btnImprimirCertificado';
      btnCertificado.classList.add('ButtonStyleMinimalistCertificado');

      const certificadoContainer = document.createElement('div');
      certificadoContainer.id = 'certificadoContainer';
      certificadoContainer.classList.add('startHidden');
      certificadoContainer.innerHTML = `
        <div id="certificadoContent"></div>
        <button onclick="window.print()">Imprimir agora</button>
      `;

      // 🔹 PASSO 3: Área de resposta
      const responder = document.createElement('div');
      responder.id = 'responderCertificado';
      responder.style.marginTop = '1rem';

      espacoExtra.appendChild(btnCertificado);
      espacoExtra.appendChild(certificadoContainer);
      espacoExtra.appendChild(responder);
      listVideos.appendChild(espacoExtra);
    })
    .catch(error => {
      console.error('Erro ao buscar vídeos:', error);
    });
}



// fim do carregar videos

function verificarResposta(videoId, respostaCorreta) {
  const user = firebase.auth().currentUser;

  // Pega qual input está marcado
  const respostaSelecionada = document.querySelector('input[name="pergunta"]:checked');

  if (!respostaSelecionada) {
      var responderRespostas = document.getElementById('responderRespostas')

      responderRespostas.innerHTML = 'SELECIONE A SUA RESPOSTA'
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
    mostrarPopupNaoConcluido()
  }
}


// imprimir certificados

function imprimirCertificado() {
  const user = firebase.auth().currentUser;


  const uid = user.uid;
  const db = firebase.database();

  const refConcluidos = db.ref(`users/${uid}/videosConcluded`);
  const refVideos = db.ref('videos');

  Promise.all([
    refConcluidos.once('value'),
    refVideos.once('value'),
    db.ref(`users/${uid}`).once('value')
  ])
.then(([concluidosSnap, videosSnap, nomeSnap]) => {
  const concluidos = concluidosSnap.val() || {};
  const todosVideosConcluded = Object.keys(concluidos).length;
  const allVideos = videosSnap.numChildren();

  if (todosVideosConcluded >= allVideos && allVideos > 0) {
    const usercert = nomeSnap.val() || 'Usuário';
    let listaVideosHTML = '<ul>';
videosSnap.forEach(videoSnap => {
  const videoKey = videoSnap.key;
  const videoData = videoSnap.val();

  if (concluidos[videoKey]) {
    listaVideosHTML += `<li>${videoData.nomeVideo}</li>`; // Assumindo que `nome` é o campo do título do vídeo
  }
});
const certificadoHTML = `
  <div class="certificado">
    <div class="certificado-topo"></div>
    <div class="certificado-conteudo">
      <h1 class="titulo">Certificado de conclusão</h1>
      <p class="nome">${usercert.nomeCompleto}</p>
      <p class="texto">
        participou e concluiu o Processo de Integração Online,  
        realizado com sucesso por meio da nossa plataforma online, em ${usercert.dataConclusaoUltimoVideo}
      </p>
      <p class="texto"><strong>Treinamentos realizados:</strong>${listaVideosHTML}</p>
            <div id="assinaturaCaneta">
      <img class="assinaturaPen" src="img/assinatura.png">
      </div>
      <div class="assinatura">
        <img class="logo-vertical" src="img/sapamega.png">
        <p class="instrutora">Gerência de Recursos Humanos<br> <span>Sapa-Megatech do Brasil</span></p>
      </div>

    </div>
  </div>
`;

    certificadoContentUser.innerHTML = certificadoHTML;
    showCertificadoUser(certificadoContentUser)
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Criar botão de imprimir
const btnPrint = document.createElement('button');
btnPrint.textContent = 'Salvar / Imprimir Certificado';
btnPrint.classList.add('ButtonStyleMinimalist');
btnPrint.onclick = () => window.print();

const instrutora = document.getElementsByClassName('instrutora')[0];
if (instrutora) {
  instrutora.appendChild(btnPrint);
}

const agora = new Date();
const dataFormatada = agora.toLocaleDateString('pt-BR');

return dbRefUsers.child(user.uid).update({
  dataConclusaoUltimoVideo: dataFormatada
});

  } else {
    document.getElementById('btnImprimirCertificado').innerText = 'Você ainda não concluiu todos os vídeos.';
  }
})
.catch(error => {
  console.error('Erro ao verificar certificado:', error);
});

}


function carregarVideosConcluidos() {
  const user = firebase.auth().currentUser;
  if (!user) {
    alert('Usuário não autenticado.');
    return;
  }

  const uid = user.uid;
  const db = firebase.database();
  const dbRefVideos = db.ref('videos');
  const refConcluidos = db.ref(`users/${uid}/videosConcluded`);

  const sectionConcluded = document.getElementById('sectionConcluded');
  const listConcluded = document.getElementById('listConcluded');
  const showQuests = document.getElementById('showQuests');
  const containerIframe = showQuests.querySelector('.containerIframe');
  const containerPerguntas = document.getElementById('ContainerPerguntas');

  refConcluidos.once('value').then(concluidosSnap => {
    const concluidos = concluidosSnap.val() || {};

    dbRefVideos.once('value').then(snapshot => {
      // Limpa a lista mantendo o título
      listConcluded.innerHTML = '<h1>Vídeos Concluídos</h1>';
      console.log(snapshot)

      snapshot.forEach(videoSnap => {
        const video = videoSnap.val();
        const videoId = videoSnap.key;
        // listConcluded.innerHTML = '<h1>Vídeos Concluídos</h1>';
        if (concluidos[videoId]) {
          console.log("video foreach ",video)
          // Criação da estrutura do vídeo concluído
          const videoDiv = document.createElement('div');
          videoDiv.classList.add('allConcludedVideos');
          videoDiv.id = videoId;
            
          videoDiv.onclick = () => {
            showQuests1();

            // Embed seguro do YouTube
            let embedUrl = video.linkVideo;
            if (embedUrl.includes('watch?v=')) {
              embedUrl = embedUrl.replace('watch?v=', 'embed/');
            } else if (embedUrl.includes('youtu.be/')) {
              const youtubeId = embedUrl.split('youtu.be/')[1].split('?')[0];
              embedUrl = `https://www.youtube.com/embed/${youtubeId}`;
            }

            // Exibir vídeo
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

            // Exibir título e mensagem de conclusão
            containerPerguntas.innerHTML = `
              <h2>${video.pergunta}</h2>
              <p style="margin-top: 1rem; font-weight: bold; color: green;">
                Você já concluiu este vídeo ✅
              </p>
            `;
          };

          // Imagem da capa
          const img = document.createElement('img');
          img.src = video.imgUrl;

          // Nome do vídeo
          const p = document.createElement('p');
          p.textContent = video.nomeVideo || 'Vídeo Concluído';

          // Adiciona elementos à div
          videoDiv.appendChild(img);
          videoDiv.appendChild(p);

          // Insere o vídeo na lista
          listConcluded.appendChild(videoDiv);
        }else{
          // listConcluded.innerHTML = '<h1>SEUS VÍDEOS CONCLUÍDOS APARECERÃO AQUI!</h1>';
          
        }
      });

      // 🔚 Adiciona a lista completa dentro da seção visível
      sectionConcluded.appendChild(listConcluded);
      sectionConcluded.classList.remove('startHidden');
    });
  }).catch(error => {
    console.error('Erro ao carregar vídeos concluídos:', error);
  });
}


async function listarTodosUsuarios(filtro = null) {
  const db = firebase.database();
  const usersRef = db.ref('users');
  const videosRef = db.ref('videos');
  const container = document.getElementById('usersContainer');
  container.innerHTML = 'Carregando...';

  console.log('🔍 Buscando dados dos usuários e vídeos...');

  try {
    const [usersSnap, videosSnap] = await Promise.all([
      usersRef.once('value'),
      videosRef.once('value')
    ]);


    const totalVideos = videosSnap.numChildren();
    const usuarios = [];

    usersSnap.forEach(userSnap => {
      const user = userSnap.val();
      const uid = userSnap.key;
      const concluidos = user.videosConcluded ? Object.keys(user.videosConcluded).length : 0;

const dadosUsuario = {
  uid,
  foto: user.photoURL || 'https://www.w3schools.com/howto/img_avatar.png',
  nome: user.nomeCompleto || 'Sem nome',
  admissao: user.admissao || '',
  cargo: user.cargo,
  isAdmin: user.isAdmin || false,
  dataConclusaoUltimoVideo: user.dataConclusaoUltimoVideo || 'sem data',
  concluidos,
  concluiuTudo: concluidos >= totalVideos
};


      usuarios.push(dadosUsuario);
    });

    // Aplicar filtro
    let filtrados = usuarios;
    if (filtro === 'tempo') {
      filtrados = usuarios.filter(u => u.admissao)
        .sort((a, b) => new Date(a.admissao) - new Date(b.admissao));

    } else if (filtro === 'concluidos') {
      filtrados = usuarios.filter(u => u.concluiuTudo);

    } else if (filtro === 'naoConcluidos') {
      filtrados = usuarios.filter(u => !u.concluiuTudo);

    }

    console.log('🎯 Usuários após filtro:', filtrados.length);
    container.innerHTML = '';

    if (filtrados.length === 0) {
      container.innerHTML = '<p>Nenhum usuário encontrado com este filtro.</p>';
      return;
    }

filtrados.forEach(u => {
  const div = document.createElement('div');
  div.className = 'userCard';

  div.innerHTML = `
    <img class="imgsUsers" src="${u.foto}">
    <p><strong>${u.nome}</strong></p>
    <p>Admissão: ${u.admissao}</p>
    <p>Cargo: ${u.cargo}</p>
    <p>Status: ${u.isAdmin ? 'Admin' : 'Usuário comum'}</p>
    <p>Vídeos concluídos: ${u.concluidos}</p>
    <hr>
  `;

  // Botão: Imprimir certificado
  if (u.concluiuTudo) {
    const btnCertificado = document.createElement('button');
    btnCertificado.textContent = 'Imprimir Certificado';
    btnCertificado.className = 'ButtonStyleMinimalist';
    btnCertificado.addEventListener('click', () => imprimirCertificadoUsers(u));
    div.appendChild(btnCertificado);
  }

  // Botão: Remover admin
  if (u.isAdmin) {
    const btnRemoverAdmin = document.createElement('button');
    btnRemoverAdmin.textContent = 'Remover Admin';
    btnRemoverAdmin.className = 'ButtonStyleMinimalist';
    btnRemoverAdmin.addEventListener('click', () => removerAdmin(u.uid));
    div.appendChild(btnRemoverAdmin);
  }

  // Botão: Tornar admin
  if (!u.isAdmin) {
    const btnTornarAdmin = document.createElement('button');
    btnTornarAdmin.textContent = 'Tornar Admin';
    btnTornarAdmin.className = 'ButtonStyleMinimalist';
    btnTornarAdmin.addEventListener('click', () => tornarAdmin(u.uid));
    div.appendChild(btnTornarAdmin);
  }

  container.appendChild(div);
});
  } catch (error) {
    console.error('❌ Erro ao listar usuários:', error);
    container.innerHTML = 'Erro ao carregar dados.';
  }
}

function imprimirCertificadoUsers(uuid) {
  const db = firebase.database();

  const refConcluidos = db.ref(`users/${uuid.uid}/videosConcluded`);
  const refVideos = db.ref('videos');

  Promise.all([
    refConcluidos.once('value'),
    refVideos.once('value')
  ])
  .then(([concluidosSnap, videosSnap]) => {
    const concluidos = concluidosSnap.val() || {};

    let listaVideosHTML = '<ul>';
    videosSnap.forEach(videoSnap => {
      const videoKey = videoSnap.key;
      const videoData = videoSnap.val();

      if (concluidos[videoKey]) {
        listaVideosHTML += `<li>${videoData.nomeVideo}</li>`;
      }
    });
    listaVideosHTML += '</ul>';

    const certificadoHTML = `
      <div class="certificado">
        <div class="certificado-topo"></div>
        <div class="certificado-conteudo">
          <br>
          <br>
          <br>
          <br>
          <h1 class="titulo">Certificado de conclusão</h1>
          <p class="nome">${uuid.nome}</p>
          <p class="texto">
            concluiu o Processo de Integração Online,  
            realizado com sucesso por meio da nossa plataforma online, em ${uuid.dataConclusaoUltimoVideo}
          </p>
          <p class="texto"><strong>Treinamentos realizados:</strong>${listaVideosHTML}</p>
                <div id="assinaturaCaneta">
      <img class="assinaturaPen" src="img/assinatura.png">
      </div>
          <div class="assinatura">
            <img class="logo-vertical" src="img/sapamega.png">
            <p class="instrutora">Gerência de Recursos Humanos<br> <span>Sapa-Megatech do Brasil</span></p>

          </div>


        </div>
      </div>
    `;

    certificadoContentUser.innerHTML = certificadoHTML;

    // Botão imprimir
    const btnPrint = document.createElement('button');
    btnPrint.textContent = 'Salvar / Imprimir Certificado';
    btnPrint.classList.add('ButtonStyleMinimalist');
    btnPrint.onclick = () => window.print();

    // Botão fechar
    const btnCloseCert = document.createElement('button');
    btnCloseCert.textContent = 'Fechar Certificado';
    btnCloseCert.classList.add('ButtonStyleMinimalist');
    btnCloseCert.onclick = () => {
      hideItem(certificadoContentUser);
      showItem(usersList);
    };

    certificadoContentUser.appendChild(btnCloseCert);
    certificadoContentUser.appendChild(btnPrint);

    showItem(certificadoContentUser);
    hideItem(usersList);
  })
  .catch(error => {
    console.error('Erro ao carregar dados dos vídeos concluídos:', error);
  });
}


function filtrarportempodecasa() {
  listarTodosUsuarios('tempo');
}

function filtrarporTodosComOsVideosConcluidos() {
  listarTodosUsuarios('concluidos');
}

function filtrarporTodosComOsVideosConcluidosFalse() {
  listarTodosUsuarios('naoConcluidos');
}

function tornarAdmin(uid) {
  const db = firebase.database();
  db.ref(`users/${uid}`).update({ isAdmin: true }).then(() => {
    alert('Usuário promovido a admin!');
    listarTodosUsuarios(); // recarrega a lista
  });
}

function removerAdmin(uid) {
  const db = firebase.database();
  db.ref(`users/${uid}`).update({ isAdmin: false }).then(() => {
    alert('Usuário não é mais admin');
    listarTodosUsuarios(); // recarrega a lista
  });
}