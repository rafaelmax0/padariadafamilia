// Exemplo de URL fornecida pelo Ngrok
const socket = new WebSocket('wss://11cb-2804-51c8-3000-2700-ad32-fde8-15d0-a2c7.ngrok-free.app');

// WebSocket agora conectará à URL pública gerada pelo Ngrok
socket.onopen = function() {
    console.log('Conectado ao WebSocket via Ngrok');
};

socket.onmessage = function(event) {
    try {
        const message = JSON.parse(event.data); // Recebe e processa a mensagem do WebSocket
        console.log('Recebido do servidor:', message);

        // Atualiza o localStorage com os valores recebidos
        const { key, value } = message;
        localStorage.setItem(key, value);

        // Atualiza os inputs com os valores do localStorage
        carregarValores();
    } catch (error) {
        console.error('Erro ao processar a mensagem do WebSocket:', error);
    }
};

// Função para salvar os valores no localStorage e enviar para o WebSocket
function salvarValores() {
    const inputs = document.querySelectorAll(".inputValor");
    inputs.forEach(input => {
        const key = input.dataset.key;
        const value = input.value;

        // Salva o valor no localStorage
        localStorage.setItem(key, value);

        // Envia os dados para o servidor WebSocket
        if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ key, value }));
        } else {
            console.error('WebSocket não está conectado.');
        }
    });
}

// Função para carregar os valores do localStorage e exibir nos inputs
function carregarValores() {
    const inputs = document.querySelectorAll(".inputValor");
    inputs.forEach(input => {
        const valorSalvo = localStorage.getItem(input.dataset.key);
        if (valorSalvo !== null) {
            input.value = valorSalvo;
        }
    });
}

// Evento do botão de salvar configurações
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
        salvarValores(); // Salva os valores e envia para o WebSocket
    }
});

// Carrega os valores do localStorage ao carregar a página
window.addEventListener("load", carregarValores);

// Função para calcular as placas com base nos valores dos inputs
function calcularPlacas() {
    const itens = ["SAL", "MILH", "LEIT", "HOT", "INT", "HAMB", "CACAU", "CEBOL", "BATAT", "FAROF", "v.SAL", "v.MILH", "v.LEIT"];
    const capacidadePlaca = { "SAL": 25, "MILH": 25, "LEIT": 25, "HOT": 20, "INT": 20, "HAMB": 20, "CACAU": 25, "CEBOL": 25, "BATAT": 25, "FAROF": 20, "v.SAL": 20, "v.MILH": 20, "v.LEIT": 20 };

    itens.forEach(item => {
        let totalPaes = 0;

        // Seleciona todos os inputs que começam com a chave do item atual e soma os valores
        document.querySelectorAll(`input[data-key^='${item}']`).forEach(input => {
            totalPaes += parseInt(input.value) || 0;
        });

        // Calcula o número de placas necessário
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
