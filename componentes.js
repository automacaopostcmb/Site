async function carregarComponente(seletor, arquivo) {
  const local = document.querySelector(seletor);

  if (!local) return;

  try {
    const resposta = await fetch(arquivo);

    if (!resposta.ok) {
      throw new Error(`Não foi possível carregar ${arquivo}`);
    }

    local.innerHTML = await resposta.text();
  } catch (erro) {
    console.error(erro);
  }
}

window.componentesProntos = Promise.all([
  carregarComponente(
    "[data-header-placeholder]",
    "header.html"
  ),

  carregarComponente(
    "[data-footer-placeholder]",
    "footer.html"
  )
]);
