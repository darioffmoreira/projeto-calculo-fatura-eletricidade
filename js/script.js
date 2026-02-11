// Copyright (c) 2026 Dário Moreira. All rights reserved.

// Configuration
const config = {
    showAds: false, // Set to true to show advertisements
    // Add other config options here
};

function updatePrices() {
    const type = document.getElementById("tarifaType").value;
    document.getElementById("precoBTN").style.display = type === "BTN" ? "block" : "none";
    document.getElementById("precoBT").style.display = type === "BT" ? "block" : "none";
    document.getElementById("precoT").style.display = type === "T" ? "block" : "none";
}

function saveToLocalStorage() {
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        localStorage.setItem(input.id, input.value);
    });
}

function loadFromLocalStorage() {
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        const value = localStorage.getItem(input.id);
        if (value !== null) {
            input.value = value;
        }
    });
    updatePrices(); // Update display after loading
}

window.onload = function() {
    loadFromLocalStorage();
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('change', saveToLocalStorage);
        input.addEventListener('input', function() {
            this.style.borderColor = '';
        });
    });

    // Add form submit listener
    const form = document.getElementById('calculatorForm');
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        calcular();
    });

    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    themeToggle.addEventListener('click', toggleTheme);
    // Load theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.body.classList.add(savedTheme);
        updateThemeIcon(savedTheme);
    }

    // Hide result card initially
    document.getElementById('resultCard').style.display = 'none';

    // Handle ads visibility
    if (config.showAds) {
        const ads = document.querySelectorAll('.ad-card, .footer-ads');
        ads.forEach(ad => {
            ad.style.display = 'block';
        });
    } else {
        // Remove ad elements completely
        const sidebarAd = document.querySelector('.sidebar-ad');
        if (sidebarAd) {
            sidebarAd.remove();
        }
        const horizontalAd = document.querySelector('.ad-horizontal');
        if (horizontalAd) {
            horizontalAd.remove();
        }
        const footerAds = document.querySelector('.footer-ads');
        if (footerAds) {
            footerAds.remove();
        }
    }
};

function toggleTheme() {
    const body = document.body;
    const currentTheme = body.classList.contains('dark') ? 'dark' : 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    body.classList.remove(currentTheme);
    body.classList.add(newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const themeToggle = document.getElementById('themeToggle');
    themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
}

function diasCustom() {
    const select = document.getElementById("diasSelect");
    const input = document.getElementById("diasCustomInput");
    if (select.value === "custom") {
        input.style.display = "block";
        input.value = "";
    } else {
        input.style.display = "none";
        input.value = select.value;
    }
}

function calcular() {

    // Validation
    const requiredInputs = document.querySelectorAll('input[required], select[required]');
    let isValid = true;
    let errorMessages = [];
    requiredInputs.forEach(input => {
        if (!input.value || (input.type === 'number' && (isNaN(parseFloat(input.value)) || parseFloat(input.value) < parseFloat(input.min || 0)))) {
            input.style.borderColor = 'red';
            isValid = false;
            const label = document.querySelector(`label[for="${input.id}"]`);
            const fieldName = label ? label.textContent : input.id;
            errorMessages.push(`Campo "${fieldName}" é obrigatório e deve ter um valor válido.`);
        } else {
            input.style.borderColor = '';
        }
    });

    if (!isValid) {
        alert("Erros encontrados:\n" + errorMessages.join("\n"));
        document.getElementById("resultado").innerText = "Erro: Preencha todos os campos obrigatórios com valores válidos.";
        return;
    }

    let dias;
    const select = document.getElementById("diasSelect");
    if (select.value === "custom") {
        dias = parseInt(document.getElementById("diasCustomInput").value);
    } else {
        dias = parseInt(select.value);
    }

    let potenciaKva = parseFloat(document.getElementById("potenciaKva").value);
    let precoPotenciaDia = parseFloat(document.getElementById("precoPotenciaDia").value);
    let iec = parseFloat(document.getElementById("iec").value);
    let dgeg = parseFloat(document.getElementById("dgeg").value);
    let taxaAudiovisual = parseFloat(document.getElementById("taxaAudiovisual").value);

    let antPonta = document.getElementById("antPonta");
    let antCheias = document.getElementById("antCheias");
    let antVazio = document.getElementById("antVazio");
    let atualPonta = document.getElementById("atualPonta");
    let atualCheias = document.getElementById("atualCheias");
    let atualVazio = document.getElementById("atualVazio");

    let consumoVazio = parseFloat(atualVazio.value) - parseFloat(antVazio.value);
    let consumoCheias = parseFloat(atualCheias.value) - parseFloat(antCheias.value);
    let consumoPonta = parseFloat(atualPonta.value) - parseFloat(antPonta.value);

    const tarifaType = document.getElementById("tarifaType").value;
    let precoPonta, precoCheias, precoVazio;
    if (tarifaType === "BTN") {
        const precoUnico = parseFloat(document.getElementById("preco_BTN_unico").value);
        precoPonta = precoCheias = precoVazio = precoUnico;
    } else if (tarifaType === "BT") {
        precoPonta = parseFloat(document.getElementById("preco_BT_ponta").value);
        const precoCheiasVazio = parseFloat(document.getElementById("preco_BT_cheiasVazio").value);
        precoCheias = precoVazio = precoCheiasVazio;
    } else { // T
        precoPonta = parseFloat(document.getElementById("preco_T_ponta").value);
        precoCheias = parseFloat(document.getElementById("preco_T_cheias").value);
        precoVazio = parseFloat(document.getElementById("preco_T_vazio").value);
    }

    if (isNaN(precoPonta) || isNaN(precoCheias) || isNaN(precoVazio)) {
        alert("Erro: Preços da tarifa inválidos. Verifique os valores introduzidos.");
        document.getElementById("resultado").innerText = "Erro: Preços da tarifa inválidos.";
        return;
    }

    let consumoTotal = consumoVazio + consumoCheias + consumoPonta;

    if (consumoTotal <= 0 || isNaN(consumoTotal) || dias <=0) {
        document.getElementById("resultado").innerText = "Erro: valores inválidos.";
        return;
    }

    let energiaSemIVA =
        (consumoVazio * precoVazio) +
        (consumoCheias * precoCheias) +
        (consumoPonta * precoPonta);

    let limiteIVA6 = (200 * dias) / 30;
    let proporcao6 = Math.min(1, limiteIVA6 / consumoTotal);

    let energiaIVA6 = energiaSemIVA * proporcao6 * 1.06;
    let energiaIVA23 = energiaSemIVA * (1 - proporcao6) * 1.23;

    let totalEnergia = energiaIVA6 + energiaIVA23;

    let totalIEC = consumoTotal * iec * 1.23;

    let potencia6 = Math.min(potenciaKva, 3.45);
    let potencia23 = Math.max(0, potenciaKva - 3.45);

    let custoPotencia6 = potencia6 * precoPotenciaDia * dias * 1.06;
    let custoPotencia23 = potencia23 * precoPotenciaDia * dias * 1.23;

    let totalPotencia = custoPotencia6 + custoPotencia23;

    let totalFinal = totalEnergia + totalIEC + totalPotencia + taxaAudiovisual + dgeg;

    document.getElementById("resultado").innerText =
        "Consumo Total: " + consumoTotal.toFixed(2) + " kWh\n\n" +
        "Energia: " + totalEnergia.toFixed(2) + " €\n" +
        "IEC: " + totalIEC.toFixed(2) + " €\n" +
        "Potência: " + totalPotencia.toFixed(2) + " €\n" +
        "Taxa Audiovisual: " + taxaAudiovisual.toFixed(2) + " €\n" +
        "Taxa DGEG: " + dgeg.toFixed(2) + " €\n\n" +
        "=============================\n" +
        "TOTAL FINAL: " + totalFinal.toFixed(2) + " €";

    // Generate chart
    const ctx = document.getElementById('chart').getContext('2d');
    if (window.myChart) {
        window.myChart.destroy();
    }
    window.myChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Energia', 'IEC', 'Potência', 'Taxa Audiovisual', 'Taxa DGEG'],
            datasets: [{
                data: [totalEnergia, totalIEC, totalPotencia, taxaAudiovisual, dgeg],
                backgroundColor: ['#ff6384', '#36a2eb', '#cc65fe', '#ffce56', '#ff9f40']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                },
                title: {
                    display: true,
                    text: 'Distribuição dos Custos da Fatura'
                }
            }
        }
    });
    document.getElementById('chart').style.display = 'block';
    document.getElementById('resultCard').style.display = 'block';
}