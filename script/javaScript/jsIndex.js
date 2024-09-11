'use strict';

// Conecta ao servidor WebSocket
const socket = new WebSocket('ws://localhost:8080');

socket.onopen = function() {
    console.log('Connected to WebSocket');
};

socket.onmessage = function(event) {
    event.data.text().then((message) => {
        console.log('Received from server:', message);
        const { key, value } = JSON.parse(message);
        localStorage.setItem(key, value);
        carregarValores(); // Atualiza os inputs com o valor do localStorage
    }).catch(error => {
        console.error('Error processing WebSocket message:', error);
    });
};

// Função para salvar os valores no localStorage e enviar para o WebSocket
function salvarValores() {
    const inputs = document.querySelectorAll(".inputValor");
    inputs.forEach(input => {
        const key = input.dataset.key;
        const value = input.value;
        localStorage.setItem(key, value);
        
        // Envia os dados para o servidor WebSocket
        socket.send(JSON.stringify({ key, value }));
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
