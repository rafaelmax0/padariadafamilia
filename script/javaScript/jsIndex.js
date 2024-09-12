// Conectar ao WebSocket utilizando o URL do ngrok
const socket = new WebSocket('wss://37ff-2804-51c8-3000-2700-ad32-fde8-15d0-a2c7.ngrok-free.app');

// Evento chamado quando a conexão WebSocket é aberta
socket.onopen = function() {
    console.log('Connected to WebSocket');
};

// Evento chamado quando uma mensagem é recebida pelo WebSocket
socket.onmessage = function(event) {
    // Converte o evento de mensagem em texto para garantir que seja processado corretamente
    const message = typeof event.data === 'string' ? event.data : '';
    
    if (message) {
        try {
            // Parse da mensagem recebida para um objeto JSON
            const { key, value } = JSON.parse(message);
            console.log('Received from server:', message);
            
            // Atualiza o localStorage com os valores recebidos do WebSocket
            localStorage.setItem(key, value);
            carregarValores(); // Atualiza os inputs com os valores do localStorage
        } catch (error) {
            console.error('Error processing WebSocket message:', error);
        }
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
        
        // Verifica se o WebSocket está aberto antes de enviar a mensagem
        if (socket.readyState === WebSocket.OPEN) {
            // Envia os dados para o servidor WebSocket
            socket.send(JSON.stringify({ key, value }));
        } else {
            console.error('WebSocket não está conectado.');
        }
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
        salvarValores();
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
