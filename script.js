/* =========================================================
   CONFIGURAÇÕES RÁPIDAS
   Troque o e-mail abaixo para alterar o destino do formulário.
   O intervalo dos banners está em milissegundos (6500 = 6,5s).
   ========================================================= */
const SITE_CONFIG = {
  emailDestino: "limasketch@gmail.com",
  intervaloBanner: 6500,
};

document.addEventListener("DOMContentLoaded", () => {
  configurarMenu();
  configurarCabecalho();
  configurarCarrosseis();
  configurarSetores();
  configurarFormulario();
  atualizarAno();
});

function configurarMenu() {
  const botao = document.querySelector("[data-menu-toggle]");
  const menu = document.querySelector("[data-menu]");
  if (!botao || !menu) return;

  const fechar = () => {
    botao.setAttribute("aria-expanded", "false");
    botao.setAttribute("aria-label", "Abrir menu");
    menu.classList.remove("is-open");
    document.body.classList.remove("menu-open");
  };

  botao.addEventListener("click", () => {
    const aberto = botao.getAttribute("aria-expanded") === "true";
    botao.setAttribute("aria-expanded", String(!aberto));
    botao.setAttribute("aria-label", aberto ? "Abrir menu" : "Fechar menu");
    menu.classList.toggle("is-open", !aberto);
    document.body.classList.toggle("menu-open", !aberto);
  });

  menu.querySelectorAll("a").forEach((link) => link.addEventListener("click", fechar));
  document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape") fechar();
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) fechar();
  });
}

function configurarCabecalho() {
  const cabecalho = document.querySelector("[data-header]");
  if (!cabecalho || cabecalho.classList.contains("solid-header")) return;

  const atualizar = () => cabecalho.classList.toggle("is-scrolled", window.scrollY > 24);
  atualizar();
  window.addEventListener("scroll", atualizar, { passive: true });
}

function configurarCarrosseis() {
  document.querySelectorAll("[data-carousel]").forEach((elemento) => criarCarrossel(elemento));
}

function configurarSetores() {
  const botoes = [...document.querySelectorAll("[data-sector-toggle]")];
  if (!botoes.length) return;

  botoes.forEach((botao) => {
    botao.addEventListener("click", () => {
      const card = botao.closest(".sector-card");
      const vaiAbrir = !card?.classList.contains("is-expanded");

      botoes.forEach((outroBotao) => {
        const outroCard = outroBotao.closest(".sector-card");
        outroCard?.classList.remove("is-expanded");
        outroBotao.setAttribute("aria-expanded", "false");
        outroBotao.firstChild.textContent = "Saiba mais ";
      });

      if (vaiAbrir && card) {
        card.classList.add("is-expanded");
        botao.setAttribute("aria-expanded", "true");
        botao.firstChild.textContent = "Mostrar menos ";
      }
    });
  });
}

function criarCarrossel(carrossel) {
  const trilha = carrossel.querySelector("[data-carousel-track]");
  const slides = [...carrossel.querySelectorAll("[data-carousel-slide]")];
  const botaoAnterior = carrossel.querySelector("[data-carousel-prev]");
  const botaoProximo = carrossel.querySelector("[data-carousel-next]");
  const areaPontos = carrossel.querySelector("[data-carousel-dots]");
  const botaoPausa = carrossel.querySelector("[data-carousel-pause]");
  const reduzMovimento = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (!trilha || slides.length < 2) return;

  let indice = 0;
  let maximo = slides.length - 1;
  let temporizador = null;
  let pausadoPeloUsuario = false;
  let ponteiroInicial = null;
  let deslocamento = 0;
  let bloquearClique = false;

  const porTela = () => {
    const configurado = Number(carrossel.dataset.perView || 1);
    if (configurado === 1) return 1;
    if (window.innerWidth <= 700) return 1;
    if (window.innerWidth <= 900) return Math.min(2, configurado);
    return configurado;
  };

  const intervalo = () => {
    const valorHtml = Number(carrossel.dataset.autoplay || 0);
    return carrossel.classList.contains("hero-carousel") ? SITE_CONFIG.intervaloBanner : valorHtml;
  };

  const criarPontos = () => {
    if (!areaPontos) return;
    areaPontos.replaceChildren();
    for (let i = 0; i <= maximo; i += 1) {
      const ponto = document.createElement("button");
      ponto.type = "button";
      ponto.className = "carousel-dot";
      ponto.setAttribute("role", "tab");
      ponto.setAttribute("aria-label", `Ir para o item ${i + 1}`);
      ponto.addEventListener("click", () => irPara(i, true));
      areaPontos.appendChild(ponto);
    }
  };

  const atualizarAcessibilidade = () => {
    const visiveis = porTela();
    slides.forEach((slide, i) => {
      const visivel = i >= indice && i < indice + visiveis;
      slide.classList.toggle("is-active", visivel);
      slide.setAttribute("aria-hidden", String(!visivel));
      slide.inert = !visivel;
    });
    if (areaPontos) {
      [...areaPontos.children].forEach((ponto, i) => {
        const ativo = i === indice;
        ponto.classList.toggle("is-active", ativo);
        ponto.setAttribute("aria-selected", String(ativo));
        ponto.setAttribute("tabindex", ativo ? "0" : "-1");
      });
    }
  };

  const aplicarPosicao = (animar = true) => {
    carrossel.classList.toggle("is-dragging", !animar);
    const alvo = slides[indice];
    const posicao = alvo ? alvo.offsetLeft : 0;
    trilha.style.transform = `translate3d(${-posicao}px, 0, 0)`;
    atualizarAcessibilidade();
  };

  const pararAutomatico = () => {
    window.clearInterval(temporizador);
    temporizador = null;
  };

  const iniciarAutomatico = () => {
    pararAutomatico();
    if (intervalo() <= 0 || pausadoPeloUsuario || reduzMovimento.matches || document.hidden) return;
    temporizador = window.setInterval(() => irPara(indice + 1, false), intervalo());
  };

  const irPara = (novoIndice, interacao = false) => {
    indice = novoIndice > maximo ? 0 : novoIndice < 0 ? maximo : novoIndice;
    aplicarPosicao(true);
    if (interacao) iniciarAutomatico();
  };

  const recalcular = () => {
    maximo = Math.max(0, slides.length - porTela());
    indice = Math.min(indice, maximo);
    criarPontos();
    aplicarPosicao(false);
    window.requestAnimationFrame(() => carrossel.classList.remove("is-dragging"));
  };

  botaoAnterior?.addEventListener("click", () => irPara(indice - 1, true));
  botaoProximo?.addEventListener("click", () => irPara(indice + 1, true));

  botaoPausa?.addEventListener("click", () => {
    pausadoPeloUsuario = !pausadoPeloUsuario;
    botaoPausa.textContent = pausadoPeloUsuario ? "▶" : "Ⅱ";
    botaoPausa.setAttribute("aria-label", pausadoPeloUsuario ? "Retomar rotação automática" : "Pausar rotação automática");
    iniciarAutomatico();
  });

  carrossel.addEventListener("mouseenter", pararAutomatico);
  carrossel.addEventListener("mouseleave", iniciarAutomatico);
  carrossel.addEventListener("focusin", pararAutomatico);
  carrossel.addEventListener("focusout", (evento) => {
    if (!carrossel.contains(evento.relatedTarget)) iniciarAutomatico();
  });
  carrossel.addEventListener("keydown", (evento) => {
    if (evento.key === "ArrowLeft") {
      evento.preventDefault();
      irPara(indice - 1, true);
    }
    if (evento.key === "ArrowRight") {
      evento.preventDefault();
      irPara(indice + 1, true);
    }
  });

  trilha.addEventListener("pointerdown", (evento) => {
    if (evento.pointerType === "mouse" && evento.button !== 0) return;
    ponteiroInicial = evento.clientX;
    deslocamento = 0;
    trilha.setPointerCapture?.(evento.pointerId);
    carrossel.classList.add("is-dragging");
    pararAutomatico();
  });

  trilha.addEventListener("pointermove", (evento) => {
    if (ponteiroInicial === null) return;
    deslocamento = evento.clientX - ponteiroInicial;
    if (Math.abs(deslocamento) > 8) bloquearClique = true;
    const base = slides[indice]?.offsetLeft || 0;
    trilha.style.transform = `translate3d(${deslocamento - base}px, 0, 0)`;
  });

  const terminarArraste = () => {
    if (ponteiroInicial === null) return;
    carrossel.classList.remove("is-dragging");
    if (Math.abs(deslocamento) > 45) irPara(indice + (deslocamento < 0 ? 1 : -1), true);
    else aplicarPosicao(true);
    ponteiroInicial = null;
    deslocamento = 0;
    iniciarAutomatico();
    if (bloquearClique) window.setTimeout(() => { bloquearClique = false; }, 0);
  };

  trilha.addEventListener("pointerup", terminarArraste);
  trilha.addEventListener("pointercancel", terminarArraste);
  trilha.addEventListener("dragstart", (evento) => evento.preventDefault());
  trilha.addEventListener(
    "click",
    (evento) => {
      if (!bloquearClique) return;
      evento.preventDefault();
      evento.stopPropagation();
      bloquearClique = false;
    },
    true,
  );

  let ajusteResize = null;
  window.addEventListener("resize", () => {
    window.clearTimeout(ajusteResize);
    ajusteResize = window.setTimeout(recalcular, 120);
  });
  document.addEventListener("visibilitychange", () => (document.hidden ? pararAutomatico() : iniciarAutomatico()));
  reduzMovimento.addEventListener?.("change", iniciarAutomatico);

  recalcular();
  iniciarAutomatico();
}

function configurarFormulario() {
  const formulario = document.querySelector("[data-contact-form]");
  if (!formulario) return;

  formulario.action = `https://formsubmit.co/${SITE_CONFIG.emailDestino}`;

  const proximaPagina = formulario.querySelector("[data-form-next]");
  if (proximaPagina && window.location.protocol !== "file:") {
    proximaPagina.value = `${window.location.origin}${window.location.pathname}?enviado=1`;
  }

  const parametros = new URLSearchParams(window.location.search);
  if (parametros.get("enviado") === "1") {
    const aviso = formulario.querySelector("[data-form-success]");
    if (aviso) {
      aviso.hidden = false;
      window.setTimeout(() => aviso.focus(), 100);
    }
    window.history.replaceState({}, "", window.location.pathname);
  }

  formulario.addEventListener("submit", () => {
    const botao = formulario.querySelector("button[type='submit']");
    if (!botao) return;
    botao.disabled = true;
    botao.textContent = "Enviando...";
  });
}

function atualizarAno() {
  document.querySelectorAll("[data-current-year]").forEach((elemento) => {
    elemento.textContent = String(new Date().getFullYear());
  });
}

/* IMAGEM AMPLIADA */

const modalImagem = document.querySelector("[data-image-modal]");
const imagemAmpliada = document.querySelector("[data-image-modal-content]");
const botaoFecharImagem = document.querySelector("[data-image-modal-close]");
const botoesDeImagem = document.querySelectorAll("[data-lightbox]");

function abrirImagemModal(botao) {
  if (!modalImagem || !imagemAmpliada) return;

  const enderecoImagem =
    botao.dataset.image ||
    botao.querySelector("img")?.src;

  if (!enderecoImagem) return;

  imagemAmpliada.src = enderecoImagem;
  modalImagem.classList.add("is-open");
  modalImagem.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");

  botaoFecharImagem?.focus();
}

function fecharImagemModal() {
  if (!modalImagem || !imagemAmpliada) return;

  modalImagem.classList.remove("is-open");
  modalImagem.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");

  imagemAmpliada.src = "";
}

botoesDeImagem.forEach((botao) => {
  botao.addEventListener("click", () => {
    abrirImagemModal(botao);
  });
});

botaoFecharImagem?.addEventListener("click", fecharImagemModal);

modalImagem?.addEventListener("click", (evento) => {
  if (evento.target === modalImagem) {
    fecharImagemModal();
  }
});

document.addEventListener("keydown", (evento) => {
  if (evento.key === "Escape") {
    fecharImagemModal();
  }
});
