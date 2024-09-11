'use strict';

// Estabelece a conexão com o servidor WebSocket
const socket = new WebSocket('ws://localhost:8080');

// Função para salvar os valores no localStorage e enviar via WebSocket
function salvarValores() {
    const inputs = document.querySelectorAll(".inputValor");
    inputs.forEach(input => {
        localStorage.setItem(input.dataset.key, input.value);

        // Enviar os dados atualizados via WebSocket
        socket.send(JSON.stringify({
            key: input.dataset.key,
            value: input.value
        }));
    });
}

// Função para carregar os valores do localStorage
function carregarValores() {
    const inputs = document.querySelectorAll(".inputValor");
    inputs.forEach(input => {
        const valorSalvo = localStorage.getItem(input.dataset.key);
        if (valorSalvo !== null) {
            input.value = valorSalvo;
        }
    });
}

// Atualiza o localStorage e a interface ao receber uma mensagem via WebSocket
socket.onmessage = function(event) {
    const data = JSON.parse(event.data);
    localStorage.setItem(data.key, data.value);

    // Atualiza o campo correspondente na interface do usuário
    const input = document.querySelector(`.inputValor[data-key='${data.key}']`);
    if (input) {
        input.value = data.value;
        calcularPlacas();  // Recalcula as placas com os novos valores
    }
};

document.getElementById("botaoAlterarValor").addEventListener("click", function() {
    const inputs = document.querySelectorAll(".inputValor");
    let allDisabled = true;

    inputs.forEach(input => {
        if (!input.disabled) {
            allDisabled = false;
        }
    });

    if (allDisabled) {
        inputs.forEach(input => input.disabled = false);
        this.textContent = "SALVAR";
    } else {
        inputs.forEach(input => input.disabled = true);
        this.textContent = "CONFIGURAÇÃO";
        salvarValores();
    }
});

// Carrega os valores do localStorage ao carregar a página
window.addEventListener("load", carregarValores);

// Função para calcular as placas
function calcularPlacas() {
    const itens = ["SAL", "MILH", "LEIT", "HOT", "INT", "HAMB", "CACAU", "CEBOL", "BATAT", "FAROF", "v.SAL", "v.MILH", "v.LEIT"];
    const capacidadePlaca = { "SAL": 25, "MILH": 25, "LEIT": 25, "HOT": 20, "INT": 20, "HAMB": 20, "CACAU": 25, "CEBOL": 25, "BATAT": 25, "FAROF": 20, "v.SAL": 20, "v.MILH": 20, "v.LEIT": 20 };

    itens.forEach(item => {
        let totalPaes = 0;

        // Seleciona todos os inputs que começam com a chave do item atual e soma os valores
        document.querySelectorAll(`input[data-key^='${item}']`).forEach(input => {
            totalPaes += parseInt(input.value) || 0;
        });

        // Calcular o número de placas necessário
        const numPlacas = totalPaes / capacidadePlaca[item];
        document.getElementById(`placa${item}`).value = numPlacas.toFixed(2);
    });
}

// Adiciona o evento "input" a todos os campos de entrada para recalcular as placas automaticamente
document.querySelectorAll('.inputValor').forEach(input => {
    input.addEventListener('input', calcularPlacas);
});

// Chama a função ao carregar a página para garantir que os valores de placas estejam corretos
window.onload = calcularPlacas;
