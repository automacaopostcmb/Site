/* CMB — Firebase Web SDK modular. Publicar junto a painel.html. */
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js';

import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut,
  reload,
  getIdToken
} from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js';

import {
  getFirestore,
  doc,
  getDoc,
  writeBatch,
  serverTimestamp,
  updateDoc
} from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';

const firebaseConfig = {
  apiKey: 'AIzaSyDYXVjW4ziE8E4WhqzvWoptQWOyIGoshfk',
  authDomain: 'comic-market-brasil.firebaseapp.com',
  projectId: 'comic-market-brasil',
  storageBucket: 'comic-market-brasil.firebasestorage.app',
  messagingSenderId: '790234681665',
  appId: '1:790234681665:web:5f7634c51f7860a34151c0',
  measurementId: 'G-X7YZQSY50J'
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const $ = id => document.getElementById(id);

let perfil = null;
let versaoTela = 0;

function mostrar(id) {
  [
    'cmb-loading',
    'cmb-public',
    'cmb-verify',
    'cmb-perfil-inicial',
    'cmb-private'
  ].forEach(k => {
    $(k).hidden = k !== id;
  });
}

function aviso(mensagem, tipo = 'info') {
  const el = $('cmb-alert');

  el.textContent = mensagem;
  el.dataset.type = tipo;
  el.hidden = false;

  el.scrollIntoView({
    behavior: 'smooth',
    block: 'nearest'
  });
}

function limparAviso() {
  $('cmb-alert').hidden = true;
}

function mensagemErro(e) {
  const mensagens = {
    'auth/email-already-in-use':
      'Este e-mail já possui uma conta. Utilize a tela de login ou recupere a senha.',

    'auth/invalid-email':
      'Informe um e-mail válido.',

    'auth/weak-password':
      'Escolha uma senha mais forte.',

    'auth/invalid-credential':
      'E-mail ou senha incorretos.',

    'auth/wrong-password':
      'E-mail ou senha incorretos.',

    'auth/user-not-found':
      'E-mail ou senha incorretos.',

    'auth/too-many-requests':
      'Muitas tentativas. Aguarde antes de tentar novamente.',

    'auth/network-request-failed':
      'Falha de conexão. Confira sua internet e tente novamente.',

    'auth/user-disabled':
      'Esta conta foi desativada. Contate a organização.',

    'permission-denied':
      'A operação foi bloqueada pelas regras de segurança. Contate a organização.',

    'unavailable':
      'O serviço está temporariamente indisponível. Tente novamente.',

    'sessao-ausente':
      'Sua sessão terminou. Entre novamente para continuar.'
  };

  return mensagens[e?.code] ||
    'Não foi possível concluir a operação. Tente novamente ou contate a organização.';
}

// Evita envios repetidos e sempre libera os controles após a operação.
async function executar(alvo, operacao) {
  if (alvo.dataset.ocupado === 'true') return;

  alvo.dataset.ocupado = 'true';

  const botoes = alvo.matches('button')
    ? [alvo]
    : [...alvo.querySelectorAll('button')];

  const estados = botoes.map(b => b.disabled);

  botoes.forEach(b => {
    b.disabled = true;
  });

  limparAviso();

  try {
    await operacao();
  } catch (err) {
    console.error('CMB:', err);
    aviso(mensagemErro(err), 'error');
  } finally {
    botoes.forEach((b, i) => {
      b.disabled = estados[i];
    });

    delete alvo.dataset.ocupado;
  }
}

function usuarioAtual() {
  if (!auth.currentUser) {
    throw Object.assign(
      new Error('Sessão ausente'),
      { code: 'sessao-ausente' }
    );
  }

  return auth.currentUser;
}

function cpfLimpo(s) {
  return String(s || '').replace(/\D/g, '');
}

function cpfValido(valor) {
  const c = cpfLimpo(valor);

  if (!/^\d{11}$/.test(c) || /^(\d)\1{10}$/.test(c)) {
    return false;
  }

  for (let tamanho = 9; tamanho <= 10; tamanho++) {
    let soma = 0;

    for (let i = 0; i < tamanho; i++) {
      soma += Number(c[i]) * (tamanho + 1 - i);
    }

    const dig = (soma * 10) % 11;

    if (Number(c[tamanho]) !== (dig === 10 ? 0 : dig)) {
      return false;
    }
  }

  return true;
}

function cpfMascarado(c) {
  return `***.***.${cpfLimpo(c).slice(6, 9)}-**`;
}

function confirmarGrafiaNome(nome) {
  const letras = nome.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ]/g, '');

  return !(
    letras.length >= 2 &&
    letras === letras.toLocaleUpperCase('pt-BR')
  ) || window.confirm(
    'Seu nome está todo em maiúsculas. Deseja manter essa grafia?\n\n' +
    'Clique em OK para continuar ou em Cancelar para corrigir.'
  );
}

function trocarAba(nome) {
  ['login', 'cadastro', 'recuperar'].forEach(k => {
    $('view-' + k).hidden = k !== nome;

    document
      .querySelectorAll(`.cmb-tabs [data-view="${k}"]`)
      .forEach(b => {
        b.setAttribute('aria-selected', String(k === nome));
      });
  });

  limparAviso();
}

function trocarPrivada(nome) {
  ['inicio', 'conta'].forEach(k => {
    $('private-' + k).hidden = k !== nome;

    document
      .querySelectorAll(`[data-private-view="${k}"]`)
      .forEach(b => {
        b.setAttribute('aria-selected', String(k === nome));
      });
  });
}

async function carregarUsuario(user) {
  const versao = ++versaoTela;

  perfil = null;

  if (!user) {
    trocarAba('login');
    mostrar('cmb-public');
    return;
  }

  if (!user.emailVerified) {
    mostrar('cmb-verify');
    return;
  }

  const snap = await getDoc(
    doc(db, 'participantes', user.uid)
  );

  // Uma resposta antiga não deve reabrir o painel após sair da conta.
  if (
    versao !== versaoTela ||
    auth.currentUser !== user
  ) {
    return;
  }

  if (!snap.exists()) {
    mostrar('cmb-perfil-inicial');
    return;
  }

  perfil = snap.data();

  const nome = String(perfil.nome || '').trim();

  $('cmb-boas-vindas').textContent = nome
    ? `Olá, ${nome.split(/\s+/)[0]}!`
    : 'Olá!';

  $('cmb-identificacao').textContent = '';
  $('form-nome').elements.nome.value = nome;
  $('conta-email').value = user.email || '';
  $('conta-cpf').value = cpfMascarado(perfil.cpf);

  mostrar('cmb-private');
}

onAuthStateChanged(auth, async user => {
  mostrar('cmb-loading');
  limparAviso();
  trocarPrivada('inicio');

  try {
    await carregarUsuario(user);
  } catch (err) {
    if (auth.currentUser !== user) return;

    mostrar('cmb-public');
    aviso(mensagemErro(err), 'error');
  }
});

document.querySelectorAll('[data-view]').forEach(b => {
  b.addEventListener('click', () => {
    trocarAba(b.dataset.view);
  });
});

document.querySelectorAll('[data-private-view]').forEach(b => {
  b.addEventListener('click', () => {
    trocarPrivada(b.dataset.privateView);
  });
});

document.querySelectorAll('[data-logout]').forEach(b => {
  b.addEventListener('click', () => {
    executar(b, async () => {
      await signOut(auth);

      document.querySelectorAll('.cmb-area form').forEach(f => {
        f.reset();
      });
    });
  });
});

$('form-cadastro').addEventListener('submit', e => {
  e.preventDefault();

  const f = e.currentTarget;
  const email = f.elements.email.value.trim();
  const senha = f.elements.senha.value;

  if (
    senha.length < 12 ||
    senha !== f.elements.confirmar.value
  ) {
    aviso(
      'A senha deve ter pelo menos 12 caracteres e coincidir com a confirmação.',
      'error'
    );

    return;
  }

  executar(f, async () => {
    const cred = await createUserWithEmailAndPassword(
      auth,
      email,
      senha
    );

    f.reset();
    mostrar('cmb-verify');

    try {
      await sendEmailVerification(cred.user);

      aviso(
        'Conta criada. Confira seu e-mail e confirme o endereço antes de continuar.',
        'success'
      );
    } catch (err) {
      console.error('CMB — envio de confirmação:', err);

      aviso(
        'Sua conta foi criada, mas não conseguimos enviar a confirmação. ' +
        'Use “Reenviar confirmação”. ' +
        mensagemErro(err),
        'error'
      );
    }
  });
});

$('form-login').addEventListener('submit', e => {
  e.preventDefault();

  const f = e.currentTarget;

  executar(f, async () => {
    await signInWithEmailAndPassword(
      auth,
      f.elements.email.value.trim(),
      f.elements.senha.value
    );

    f.elements.senha.value = '';
  });
});

$('form-recuperar').addEventListener('submit', e => {
  e.preventDefault();

  const f = e.currentTarget;

  executar(f, async () => {
    try {
      await sendPasswordResetEmail(
        auth,
        f.elements.email.value.trim()
      );
    } catch (err) {
      // Mantém resposta uniforme para endereço inexistente,
      // mas informa falhas reais.
      if (err.code !== 'auth/user-not-found') {
        throw err;
      }
    }

    aviso(
      'Se o endereço estiver cadastrado, você receberá instruções de recuperação.',
      'success'
    );
  });
});

$('btn-verificar').addEventListener('click', e => {
  executar(e.currentTarget, async () => {
    const user = usuarioAtual();

    await reload(user);

    if (auth.currentUser !== user) return;

    if (!user.emailVerified) {
      mostrar('cmb-verify');

      aviso(
        'A confirmação ainda não foi identificada. ' +
        'Verifique o link enviado ao seu e-mail.'
      );

      return;
    }

    await getIdToken(user, true);
    await carregarUsuario(user);
  });
});

$('btn-reenviar').addEventListener('click', e => {
  executar(e.currentTarget, async () => {
    await sendEmailVerification(usuarioAtual());

    aviso(
      'Enviamos um novo e-mail de confirmação.',
      'success'
    );
  });
});

$('form-perfil-inicial').addEventListener('submit', e => {
  e.preventDefault();

  const f = e.currentTarget;

  const nome = f.elements.nome.value
    .trim()
    .replace(/\s+/g, ' ');

  const cpf = cpfLimpo(f.elements.cpf.value);

  if (!auth.currentUser?.emailVerified) {
    aviso(
      'Confirme seu e-mail antes de continuar.',
      'error'
    );

    return;
  }

  if (
    nome.length < 2 ||
    nome.length > 120 ||
    !cpfValido(cpf) ||
    !f.elements.privacidade.checked
  ) {
    aviso(
      'Confira o nome, o CPF e o aviso de privacidade.',
      'error'
    );

    return;
  }

  if (!confirmarGrafiaNome(nome)) {
    f.elements.nome.focus();
    return;
  }

  executar(f, async () => {
    const user = usuarioAtual();
    const batch = writeBatch(db);

    batch.set(
      doc(db, 'participantes', user.uid),
      {
        idParticipante: user.uid,
        nome,
        cpf,
        email: user.email,
        status: 'ATIVO',
        criadoEm: serverTimestamp(),
        atualizadoEm: serverTimestamp()
      }
    );

    batch.set(
      doc(db, 'cpfs', cpf),
      {
        uid: user.uid,
        cpf,
        criadoEm: serverTimestamp()
      }
    );

    await batch.commit();
    await carregarUsuario(user);

    aviso('Cadastro concluído!', 'success');
  });
});

$('form-nome').addEventListener('submit', e => {
  e.preventDefault();

  const f = e.currentTarget;

  const nome = f.elements.nome.value
    .trim()
    .replace(/\s+/g, ' ');

  if (nome.length < 2 || nome.length > 120) {
    aviso(
      'Informe um nome entre 2 e 120 caracteres.',
      'error'
    );

    return;
  }

  if (!confirmarGrafiaNome(nome)) {
    f.elements.nome.focus();
    return;
  }

  executar(f, async () => {
    const user = usuarioAtual();

    await updateDoc(
      doc(db, 'participantes', user.uid),
      {
        nome,
        atualizadoEm: serverTimestamp()
      }
    );

    if (auth.currentUser !== user) return;

    if (perfil) {
      perfil.nome = nome;
    }

    $('cmb-boas-vindas').textContent =
      `Olá, ${nome.split(' ')[0]}!`;

    aviso('Nome atualizado.', 'success');
  });
});

$('btn-trocar-senha').addEventListener('click', e => {
  executar(e.currentTarget, async () => {
    await sendPasswordResetEmail(
      auth,
      usuarioAtual().email
    );

    aviso(
      'Enviamos um link para alteração de senha.',
      'success'
    );
  });
});
