let transacoes = JSON.parse(localStorage.getItem("transacoes")) || [];

const lista = document.getElementById("lista-transacoes");
const saldo = document.getElementById("saldo");
const entradas = document.getElementById("entradas");
const saidas = document.getElementById("saidas");

let grafico;

document.getElementById("form-transacao").addEventListener("submit", function (e) {
  e.preventDefault();

  const descricao = document.getElementById("descricao").value;
  const valor = parseFloat(document.getElementById("valor").value);

  if (!descricao || isNaN(valor)) return;

  const transacao = { descricao, valor, id: Date.now() };
  transacoes.push(transacao);
  salvarLocalStorage();
  atualizarInterface();

  this.reset();
});

function salvarLocalStorage() {
  localStorage.setItem("transacoes", JSON.stringify(transacoes));
}

function atualizarInterface() {
  lista.innerHTML = "";
  let total = 0;
  let somaEntradas = 0;
  let somaSaidas = 0;

  transacoes.forEach((t) => {
    const item = document.createElement("li");
    item.classList.add(t.valor >= 0 ? "entrada" : "saida");
    item.innerHTML = `
      ${t.descricao}: R$ ${t.valor.toFixed(2)}
      <button onclick="removerTransacao(${t.id})">x</button>
    `;
    lista.appendChild(item);

    total += t.valor;
    if (t.valor >= 0) somaEntradas += t.valor;
    else somaSaidas += t.valor;
  });

  saldo.textContent = `Saldo: R$ ${total.toFixed(2)}`;
  entradas.textContent = `Entradas: R$ ${somaEntradas.toFixed(2)}`;
  saidas.textContent = `Saídas: R$ ${Math.abs(somaSaidas).toFixed(2)}`;

  atualizarGrafico(somaEntradas, somaSaidas);
}

function removerTransacao(id) {
  transacoes = transacoes.filter(t => t.id !== id);
  salvarLocalStorage();
  atualizarInterface();
}

function atualizarGrafico(entradas, saidas) {
  const ctx = document.getElementById("grafico").getContext("2d");
  if (grafico) grafico.destroy();

  grafico = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Entradas", "Saídas"],
      datasets: [{
        data: [entradas, Math.abs(saidas)],
        backgroundColor: ["#4caf50", "#f44336"],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: "bottom" }
      }
    }
  });
}

atualizarInterface();