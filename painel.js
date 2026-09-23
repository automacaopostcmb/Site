/* CMB — Firebase Web SDK modular. Publicar este arquivo junto a painel.html. */
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

import { getFirestore, doc, getDoc, writeBatch, serverTimestamp, updateDoc } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';

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
let carregando = false;
function mostrar(id) {
  ['cmb-loading','cmb-public','cmb-verify','cmb-perfil-inicial','cmb-private'].forEach(k => $(k).hidden = k !== id);
}
function aviso(mensagem, tipo='info') {
  const el=$('cmb-alert'); el.textContent=mensagem; el.dataset.type=tipo; el.hidden=false;
  el.scrollIntoView({behavior:'smooth',block:'nearest'});
}
function limparAviso(){ $('cmb-alert').hidden=true; }
function ocupado(form, sim){
  if(form) [...form.querySelectorAll('button')].forEach(b=>b.disabled=sim);
}
function mensagemErro(e){
  const m={
    'auth/email-already-in-use':'Este e-mail já possui uma conta. Utilize a tela de login.',
    'auth/invalid-email':'Informe um e-mail válido.',
    'auth/weak-password':'Escolha uma senha mais forte.',
    'auth/invalid-credential':'E-mail ou senha incorretos.',
    'auth/too-many-requests':'Muitas tentativas. Aguarde antes de tentar novamente.',
    'permission-denied':'A operação foi bloqueada pelas regras de segurança. Confira se as regras do Firestore foram publicadas.'
  };
  return m[e?.code] || 'Não foi possível concluir a operação. Tente novamente ou contate a organização.';
}
function cpfLimpo(s){return String(s||'').replace(/\D/g,'');}
function cpfValido(valor){
  const c=cpfLimpo(valor);
  if(!/^\d{11}$/.test(c)||/^(\d)\1{10}$/.test(c)) return false;
  for(let tamanho=9;tamanho<=10;tamanho++){
    let soma=0;for(let i=0;i<tamanho;i++) soma+=Number(c[i])*(tamanho+1-i);
    const dig=(soma*10)%11;
    if(Number(c[tamanho])!==(dig===10?0:dig))return false;
  }
  return true;
}
function cpfMascarado(c){return `***.***.${c.slice(6,9)}-**`;}

function confirmarGrafiaNome(nome) {
  const letras = nome.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ]/g, '');

  if (
    letras.length >= 2 &&
    letras === letras.toLocaleUpperCase('pt-BR')
  ) {
    return window.confirm(
      'Seu nome está todo em maiúsculas. Deseja manter essa grafia?\n\n' +
      'Clique em OK para continuar ou em Cancelar para corrigir.'
    );
  }

  return true;
}

function trocarAba(nome){
  ['login','cadastro','recuperar'].forEach(k=>{
    $('view-'+k).hidden=k!==nome;
    document.querySelectorAll(`[data-view="${k}"]`).forEach(b=>b.setAttribute('aria-selected',String(k===nome)));
  }); limparAviso();
}
function trocarPrivada(nome){
  ['inicio','conta'].forEach(k=>{
    $('private-'+k).hidden=k!==nome;
    document.querySelectorAll(`[data-private-view="${k}"]`).forEach(b=>b.setAttribute('aria-selected',String(k===nome)));
  });
}
async function carregarUsuario(user){
  if(!user){perfil=null;mostrar('cmb-public');return;}
  if(!user.emailVerified){mostrar('cmb-verify');return;}
  const snap=await getDoc(doc(db,'participantes',user.uid));
  if(!snap.exists()){perfil=null;mostrar('cmb-perfil-inicial');return;}
  perfil=snap.data();
$('cmb-boas-vindas').textContent = `Olá, ${perfil.nome.split(' ')[0]}!`;
$('cmb-identificacao').textContent = '';
$('form-nome').elements.nome.value = perfil.nome;
$('conta-email').value = user.email || '';
  $('conta-cpf').value=cpfMascarado(perfil.cpf);
  mostrar('cmb-private');
}
onAuthStateChanged(auth,async user=>{
  mostrar('cmb-loading');
  try{await carregarUsuario(user);}catch(e){mostrar('cmb-public');aviso(mensagemErro(e),'error');}
});
document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>trocarAba(b.dataset.view)));
document.querySelectorAll('[data-private-view]').forEach(b=>b.addEventListener('click',()=>trocarPrivada(b.dataset.privateView)));
document.querySelectorAll('[data-logout]').forEach(b=>b.addEventListener('click',async()=>{await signOut(auth);limparAviso();}));
$('form-cadastro').addEventListener('submit',async e=>{
  e.preventDefault();const f=e.currentTarget, email=f.elements.email.value.trim(),senha=f.elements.senha.value;
  if(senha.length<12||senha!==f.elements.confirmar.value){aviso('A senha deve ter pelo menos 12 caracteres e coincidir com a confirmação.','error');return;}
  ocupado(f,true);try{
    const cred=await createUserWithEmailAndPassword(auth,email,senha);
    await sendEmailVerification(cred.user);
    mostrar('cmb-verify');aviso('Conta criada. Confira seu e-mail e confirme o endereço antes de continuar.','success');
  }catch(err){aviso(mensagemErro(err),'error');}finally{ocupado(f,false);}
});
$('form-login').addEventListener('submit',async e=>{
  e.preventDefault();const f=e.currentTarget;ocupado(f,true);
  try{await signInWithEmailAndPassword(auth,f.elements.email.value.trim(),f.elements.senha.value);limparAviso();}
  catch(err){aviso(mensagemErro(err),'error');}finally{ocupado(f,false);}
});
$('form-recuperar').addEventListener('submit',async e=>{
  e.preventDefault();const f=e.currentTarget;ocupado(f,true);
  try{await sendPasswordResetEmail(auth,f.elements.email.value.trim());}
  catch(err){/* Resposta uniforme para não revelar existência de contas. */}
  finally{ocupado(f,false);aviso('Se o endereço estiver cadastrado, você receberá instruções de recuperação.','success');}
});

$('btn-verificar').addEventListener('click', async () => {
  try {
    const user = auth.currentUser;

    if (!user) {
      mostrar('cmb-public');
      aviso('Sua sessão terminou. Entre novamente para continuar.', 'error');
      return;
    }

    await reload(user);

    if (!user.emailVerified) {
      mostrar('cmb-verify');
      aviso(
        'A confirmação ainda não foi identificada. Verifique o link enviado ao seu e-mail.'
      );
      return;
    }

    // Atualiza o token para que as regras do Firestore reconheçam
    // que o e-mail já foi confirmado.
    await getIdToken(user, true);

    await carregarUsuario(user);
    limparAviso();

  } catch (err) {
    console.error('Erro ao verificar e-mail e carregar cadastro:', err);
    aviso(mensagemErro(err), 'error');
  }
});


$('btn-reenviar').addEventListener('click',async()=>{
  try{await sendEmailVerification(auth.currentUser);aviso('Enviamos um novo e-mail de confirmação.','success');}
  catch(err){aviso(mensagemErro(err),'error');}
});
$('form-perfil-inicial').addEventListener('submit',async e=>{
  e.preventDefault();const f=e.currentTarget,user=auth.currentUser;
  if(!user?.emailVerified){aviso('Confirme seu e-mail antes de continuar.','error');return;}
  const nome=f.elements.nome.value.trim().replace(/\s+/g,' '),cpf=cpfLimpo(f.elements.cpf.value);
  if(nome.length<2||nome.length>120||!cpfValido(cpf)||!f.elements.privacidade.checked){aviso('Confira o nome, o CPF e o aviso de privacidade.','error');return;}
  if (!confirmarGrafiaNome(nome)) {
  f.elements.nome.focus();
  return;
}
  ocupado(f,true);
  try{
    const refPerfil=doc(db,'participantes',user.uid),refCpf=doc(db,'cpfs',cpf);
    // Batch atômico: se o CPF já existir, a regra create-only impede toda a gravação.
    const batch=writeBatch(db);
    batch.set(refPerfil,{idParticipante:user.uid,nome,cpf,email:user.email,status:'ATIVO',criadoEm:serverTimestamp(),atualizadoEm:serverTimestamp()});
    batch.set(refCpf,{uid:user.uid,cpf,criadoEm:serverTimestamp()});
    await batch.commit();
    await carregarUsuario(user);aviso('Cadastro concluído!','success');
 } catch (err) {
  console.error('Erro ao concluir cadastro:', err);

  aviso(
    'Não foi possível concluir o cadastro. Verifique os dados informados ou entre em contato com a organização.',
    'error'
  );
}
  
  finally{ocupado(f,false);}
});
$('form-nome').addEventListener('submit',async e=>{
  e.preventDefault();const f=e.currentTarget,nome=f.elements.nome.value.trim().replace(/\s+/g,' ');
  if(nome.length<2||nome.length>120){aviso('Informe um nome entre 2 e 120 caracteres.','error');return;}
  ocupado(f,true);try{
    await updateDoc(doc(db,'participantes',auth.currentUser.uid),{nome,atualizadoEm:serverTimestamp()});
    perfil.nome=nome;$('cmb-boas-vindas').textContent=`Olá, ${nome.split(' ')[0]}!`;aviso('Nome atualizado.','success');
  }catch(err){aviso(mensagemErro(err),'error');}finally{ocupado(f,false);}
});
$('btn-trocar-senha').addEventListener('click',async()=>{
  try{await sendPasswordResetEmail(auth,auth.currentUser.email);aviso('Enviamos um link para alteração de senha.','success');}
  catch(err){aviso(mensagemErro(err),'error');}
});
