import {
  initializeApp
} from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js';

import {
  getAuth,
  onAuthStateChanged,
  getIdToken
} from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js';


const firebaseConfig = {
  apiKey: 'AIzaSyDYXVjW4ziE8E4WhqzvWoptQWOyIGoshfk',
  authDomain: 'comic-market-brasil.firebaseapp.com',
  projectId: 'comic-market-brasil',
  storageBucket: 'comic-market-brasil.firebasestorage.app',
  messagingSenderId: '790234681665',
  appId: '1:790234681665:web:5f7634c51f7860a34151c0',
  measurementId: 'G-X7YZQSY50J'
};


const APPS_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycby8L2-HwXXDXCeJ9p46eW7ynC0-9EFkY9e6cUZM3BPitAcxZNENZ7dqpxPhHoD6iXMUcw/exec';


/*
 * IMPORTANTE:
 *
 * Se a página onde fica seu login não se chama
 * painel.html, altere somente esta linha.
 */
const PAINEL_URL = 'painel.html';


const MAX_FILE_BYTES =
  8 * 1024 * 1024;


const TIPOS_PERMITIDOS =
  new Set([
    'image/png',
    'image/jpeg',
    'application/pdf'
  ]);


const app =
  initializeApp(firebaseConfig);


const auth =
  getAuth(app);


const $ =
  id => document.getElementById(id);


let usuario = null;

function mostrarOverlay(
  titulo = 'Carregando informações',
  texto = 'Aguarde um instante…'
) {
  $('aa-overlay-title').textContent = titulo;
  $('aa-overlay-text').textContent = texto;
  $('aa-overlay').hidden = false;
}

function esconderOverlay() {
  $('aa-overlay').hidden = true;
}

function mostrarAlerta(
  mensagem,
  tipo = 'info'
) {

  const el =
    $('aa-alert');

  el.textContent =
    mensagem;

  el.dataset.type =
    tipo;

  el.hidden =
    false;

  el.scrollIntoView({
    behavior: 'smooth',
    block: 'nearest'
  });
}



function limparAlerta() {

  $('aa-alert').hidden =
    true;

  $('aa-alert').textContent =
    '';
}



function esconderTudo() {

[
  'aa-status-card',
  'aa-form-card',
  'aa-pagamento-card',
  'aa-comprovante-enviado',
  'aa-pos-confirmado-card'
]
    
    .forEach(id => {

    $(id).hidden =
      true;

  });

}



function normalizarStatus(status) {

  return String(status || '')
    .normalize('NFD')
    .replace(
      /[\u0300-\u036f]/g,
      ''
    )
    .trim()
    .toLowerCase();

}



function statusSlug(status) {

  const s =
    normalizarStatus(status);

  if (s === 'confirmado') {
    return 'confirmado';
  }

  if (s === 'analise do comprovante') {
    return 'analise-do-comprovante';
  }

  if (s === 'aprovado') {
    return 'aprovado';
  }

  if (s === 'reprovado') {
    return 'reprovado';
  }

  if (s === 'fila de espera') {
    return 'fila-de-espera';
  }

  return 'em-analise';
}


function textoPadraoStatus(status) {
  switch (statusSlug(status)) {

    case 'confirmado':
      return 'Sua participação está confirmada.';

    case 'analise-do-comprovante':
      return 'Recebemos seu comprovante e ele está em análise pela nossa equipe.';

    case 'aprovado':
      return 'Sua inscrição foi aprovada.';

    case 'reprovado':
      return 'A análise da sua inscrição foi concluída.';

    case 'fila-de-espera':
      return 'Sua inscrição está na fila de espera.';

    default:
      return 'Recebemos sua inscrição e ela está em análise pela nossa equipe.';
  }
}

function setBotaoOcupado(
  botao,
  ocupado,
  textoOcupado
) {

  if (!botao) {
    return;
  }


  if (ocupado) {

    botao.dataset.textoOriginal =
      botao.textContent;

    botao.textContent =
      textoOcupado;

    botao.disabled =
      true;

  } else {

    botao.textContent =
      botao.dataset.textoOriginal ||
      botao.textContent;

    botao.disabled =
      false;

    delete botao.dataset.textoOriginal;
  }

}



async function tokenAtual() {

  if (!usuario) {

    throw new Error(
      'Sua sessão terminou. Entre novamente.'
    );
  }

  return getIdToken(
    usuario,
    true
  );

}



async function chamarApi(
  acao,
  dados = {}
) {

  const token =
    await tokenAtual();


  const resposta =
    await fetch(
      APPS_SCRIPT_URL,
      {
        method: 'POST',

        redirect: 'follow',

        headers: {
          'Content-Type':
            'text/plain;charset=utf-8'
        },

        body: JSON.stringify({
          acao,
          token,
          ...dados
        })
      }
    );


  const texto =
    await resposta.text();


  let json;


  try {

    json =
      JSON.parse(texto);

  } catch {

    throw new Error(
      'O servidor retornou uma resposta inválida. ' +
      'Atualize a implantação do Apps Script e tente novamente.'
    );
  }


  if (!json.ok) {

    throw new Error(
      json.message ||
      'Não foi possível concluir a operação.'
    );
  }


  return json;

}



function renderizar(estado) {
  esconderTudo();
  limparAlerta();

  $('aa-loading').hidden = true;

  /*
   * A pessoa ainda não se inscreveu.
   */
  if (!estado.inscricao) {
    $('aa-form-card').hidden = false;

    const emailInput =
      $('aa-form').elements.email;

    if (!emailInput.value && usuario?.email) {
      emailInput.value = usuario.email;
    }

    return;
  }

  /*
   * Já possui inscrição.
   */
  const status =
    estado.status || 'Em análise';

  const slug =
    statusSlug(status);
const hero =
  $('aa-hero');

if (hero) {
  hero.dataset.status = slug;
}
  $('aa-status-badge').textContent =
    status;

  $('aa-status-badge').dataset.status =
    slug;

  $('aa-status-texto').textContent =
    textoPadraoStatus(status);

  $('aa-status-card').dataset.status =
    slug;

  $('aa-status-card').hidden =
    false;

atualizarTimeline(
  status
);
  
  /*
   * Mensagem personalizada escrita na planilha.
   */
  const mensagem =
    String(estado.mensagem || '').trim();

  const mensagemEl =
    $('aa-mensagem-admin');

  if (mensagem) {
    mensagemEl.textContent = mensagem;
    mensagemEl.hidden = false;
  } else {
    mensagemEl.textContent = '';
    mensagemEl.hidden = true;
  }

  /*
   * CONFIRMADO:
   * não mostra mais pagamento nem comprovante em análise.
   */
if (slug === 'confirmado') {

  $('aa-pos-confirmado-card').hidden =
    false;

  return;
}

  /*
   * ANÁLISE DO COMPROVANTE:
   * mostra somente o bloco de comprovante recebido.
   */
if (
  slug === 'analise-do-comprovante' ||
  (
    slug === 'aprovado' &&
    estado.comprovanteEnviado
  )
) {

  $('aa-comprovante-enviado').hidden =
    false;

  return;
}

  /*
   * Só existe pagamento quando o status for Aprovado.
   */
  if (slug !== 'aprovado') {
    return;
  }

  /*
   * Aprovado e ainda sem comprovante:
   * mostrar pagamento e upload.
   */
  const pix =
    estado.pix || {};

  $('aa-pix-valor').textContent =
    pix.valor || 'Consulte a organização';

  $('aa-pix-chave').textContent =
    pix.chave || 'Consulte a organização';

  const favorecido =
    String(pix.favorecido || '').trim();

  $('aa-pix-favorecido').textContent =
    favorecido;

  $('aa-pix-favorecido-row').hidden =
    !favorecido;

  $('aa-pagamento-card').hidden = false;
}


async function carregarEstado() {
  $('aa-loading').hidden = false;

  mostrarOverlay(
    'Carregando informações',
    'Estamos verificando sua inscrição.'
  );

  try {
    const resposta =
      await chamarApi('status');

    renderizar(resposta);

  } catch (erro) {
    console.error('Área dos Artistas:', erro);

    $('aa-loading').hidden = true;

    mostrarAlerta(
      erro.message,
      'error'
    );

  } finally {
    esconderOverlay();
  }
}

function arquivoParaBase64(file) {

  return new Promise(
    (
      resolve,
      reject
    ) => {

      const reader =
        new FileReader();


      reader.onload = () => {

        const resultado =
          String(
            reader.result || ''
          );


        const virgula =
          resultado.indexOf(',');


        if (
          virgula < 0
        ) {

          reject(
            new Error(
              'Não foi possível ler o arquivo.'
            )
          );

          return;
        }


        resolve(
          resultado.slice(
            virgula + 1
          )
        );

      };


      reader.onerror = () => {

        reject(
          new Error(
            'Não foi possível ler o arquivo.'
          )
        );

      };


      reader.readAsDataURL(
        file
      );

    }
  );

}



/* =========================================================
   PROTEÇÃO DA PÁGINA
   ========================================================= */

onAuthStateChanged(
  auth,
  async user => {

    mostrarOverlay(
      'Verificando acesso',
      'Aguarde enquanto validamos sua conta.'
    );

    /*
     * Não está logado.
     */
    if (!user) {
      window.location.replace(PAINEL_URL);
      return;
    }

    /*
     * E-mail ainda não foi confirmado.
     */
    if (!user.emailVerified) {
      window.location.replace(PAINEL_URL);
      return;
    }

    usuario = user;

    await carregarEstado();
  }
);


/* =========================================================
   ENVIO DA INSCRIÇÃO
   ========================================================= */

$('aa-form').addEventListener(
  'submit',
  async event => {

    event.preventDefault();


    const form =
      event.currentTarget;


    const botao =
      $('aa-btn-enviar');


    const dados = {

      nome_completo:
        form.elements
          .nome_completo
          .value
          .trim()
          .replace(
            /\s+/g,
            ' '
          ),

      nome_artistico:
        form.elements
          .nome_artistico
          .value
          .trim()
          .replace(
            /\s+/g,
            ' '
          ),

      email:
        form.elements
          .email
          .value
          .trim(),

      portfolio:
        form.elements
          .portfolio
          .value
          .trim(),

      instagram:
        form.elements
          .instagram
          .value
          .trim(),

      sobre:
        form.elements
          .sobre
          .value
          .trim(),

      produto:
        form.elements
          .produto
          .value
          .trim()
    };


    if (
      !dados.nome_completo ||
      !dados.nome_artistico ||
      !dados.email ||
      !dados.portfolio ||
      !dados.instagram ||
      !dados.sobre ||
      !dados.produto
    ) {

      mostrarAlerta(
        'Preencha todos os campos obrigatórios.',
        'error'
      );

      return;
    }


    const confirmar =
      window.confirm(
        'Deseja enviar sua inscrição?\n\n' +
        'Depois do envio, o formulário ficará bloqueado ' +
        'para novas alterações por esta página.'
      );


    if (!confirmar) {
      return;
    }


    limparAlerta();


setBotaoOcupado(
  botao,
  true,
  'Enviando…'
);

mostrarOverlay(
  'Enviando inscrição',
  'Estamos salvando suas informações.'
);

    try {

      await chamarApi(
        'inscrever',
        {
          dados
        }
      );


      form.reset();


      const resposta =
        await chamarApi(
          'status'
        );


      renderizar(
        resposta
      );


      mostrarAlerta(
        'Inscrição enviada com sucesso.',
        'success'
      );

    } catch (erro) {

      console.error(
        'Área dos Artistas — inscrição:',
        erro
      );


      mostrarAlerta(
        erro.message,
        'error'
      );

} finally {

  setBotaoOcupado(
    botao,
    false
  );

  esconderOverlay();

}

  }
);



/* =========================================================
   ENVIO DO COMPROVANTE
   ========================================================= */
$('aa-form-comprovante')
  .addEventListener(
    'submit',
    async event => {

      event.preventDefault();

      const input =
        $('aa-comprovante');

      const file =
        input.files?.[0];

      const botao =
        $('aa-btn-comprovante');

      if (!file) {
        mostrarAlerta(
          'Selecione o comprovante.',
          'error'
        );
        return;
      }

      if (!TIPOS_PERMITIDOS.has(file.type)) {
        mostrarAlerta(
          'Envie um arquivo PNG, JPG/JPEG ou PDF.',
          'error'
        );
        return;
      }

      if (file.size > MAX_FILE_BYTES) {
        mostrarAlerta(
          'O arquivo deve ter no máximo 8 MB.',
          'error'
        );
        return;
      }

      limparAlerta();

      setBotaoOcupado(
        botao,
        true,
        'Enviando comprovante…'
      );

      mostrarOverlay(
        'Enviando comprovante',
        'Seu arquivo está sendo enviado. Aguarde.'
      );

      try {
        const base64 =
          await arquivoParaBase64(file);

        await chamarApi(
          'enviar_comprovante',
          {
            arquivo: {
              nome: file.name,
              mimeType: file.type,
              base64
            }
          }
        );

        input.value = '';

        const resposta =
          await chamarApi('status');

        renderizar(resposta);

        mostrarAlerta(
          'Comprovante enviado com sucesso.',
          'success'
        );

      } catch (erro) {
        console.error(
          'Área dos Artistas — comprovante:',
          erro
        );

        mostrarAlerta(
          erro.message,
          'error'
        );

      } finally {
        setBotaoOcupado(
          botao,
          false
        );

        esconderOverlay();
      }
    }
  );
function atualizarTimeline(status) {

  const slug =
    statusSlug(status);

  const timeline =
    $('aa-timeline');

  if (!timeline) {
    return;
  }

  timeline.dataset.status =
    slug;

  const itens = {

    inscricao:
      timeline.querySelector(
        '[data-step="inscricao"]'
      ),

    aprovacao:
      timeline.querySelector(
        '[data-step="aprovacao"]'
      ),

    comprovante:
      timeline.querySelector(
        '[data-step="comprovante"]'
      ),

    confirmacao:
      timeline.querySelector(
        '[data-step="confirmacao"]'
      )

  };


  /*
   * PRIMEIRO:
   * limpa completamente o estado anterior.
   */
  Object.values(itens).forEach(item => {

    item.classList.remove(
      'is-done',
      'is-current',
      'is-rejected',
      'is-waiting'
    );

  });


  /*
   * Restaura sempre os textos originais.
   * Assim uma atualização de status não herda
   * textos do estado anterior.
   */

  itens.inscricao
    .querySelector('strong')
    .textContent =
      'Inscrição enviada';

  itens.inscricao
    .querySelector('small')
    .textContent =
      'Recebemos seus dados.';


  itens.aprovacao
    .querySelector('strong')
    .textContent =
      'Aprovação';

  itens.aprovacao
    .querySelector('small')
    .textContent =
      'A equipe analisa sua participação.';


  itens.comprovante
    .querySelector('strong')
    .textContent =
      'Comprovante';

  itens.comprovante
    .querySelector('small')
    .textContent =
      'Envio e conferência do pagamento.';


  itens.confirmacao
    .querySelector('strong')
    .textContent =
      'Participação confirmada';

  itens.confirmacao
    .querySelector('small')
    .textContent =
      'Sua vaga está confirmada.';


  /*
   * A inscrição já existe.
   */
  itens.inscricao.classList.add(
    'is-done'
  );


  /*
   * EM ANÁLISE
   */
  if (
    slug === 'em-analise'
  ) {

    itens.aprovacao.classList.add(
      'is-current'
    );

    return;
  }


  /*
   * FILA DE ESPERA
   */
  if (
    slug === 'fila-de-espera'
  ) {

    itens.aprovacao.classList.add(
      'is-waiting'
    );

    itens.aprovacao
      .querySelector('strong')
      .textContent =
        'Fila de espera';

    itens.aprovacao
      .querySelector('small')
      .textContent =
        'Sua inscrição aguarda disponibilidade.';

    return;
  }


  /*
   * REPROVADO
   */
  if (
    slug === 'reprovado'
  ) {

    itens.aprovacao.classList.add(
      'is-rejected'
    );

    itens.aprovacao
      .querySelector('strong')
      .textContent =
        'Não aprovado';

    itens.aprovacao
      .querySelector('small')
      .textContent =
        'A análise desta inscrição foi concluída.';

    return;
  }


  /*
   * APROVADO
   */
  if (
    slug === 'aprovado'
  ) {

    itens.aprovacao.classList.add(
      'is-done'
    );

    itens.comprovante.classList.add(
      'is-current'
    );

    return;
  }


  /*
   * COMPROVANTE ENVIADO.
   */
  if (
    slug === 'analise-do-comprovante'
  ) {

    itens.aprovacao.classList.add(
      'is-done'
    );

    itens.comprovante.classList.add(
      'is-done'
    );

    itens.confirmacao.classList.add(
      'is-current'
    );

    itens.confirmacao
      .querySelector('strong')
      .textContent =
        'Conferência';

    itens.confirmacao
      .querySelector('small')
      .textContent =
        'Nossa equipe está conferindo o pagamento.';

    return;
  }


  /*
   * CONFIRMADO
   */
  if (
    slug === 'confirmado'
  ) {

    itens.aprovacao.classList.add(
      'is-done'
    );

    itens.comprovante.classList.add(
      'is-done'
    );

    itens.confirmacao.classList.add(
      'is-done'
    );

    return;
  }

}
