// Copyright (c) 2026 Dário Moreira. All rights reserved.

// Configuration
const config = {
    showAds: false, // Set to true to show advertisements
    // Add other config options here
};

function updatePrices() {
    const type = document.getElementById("tarifaType").value;
    const btnDiv = document.getElementById("precoBTN");
    const btDiv = document.getElementById("precoBT");
    const tDiv = document.getElementById("precoT");

    // Show/hide divs
    btnDiv.style.display = type === "BTN" ? "block" : "none";
    btDiv.style.display = type === "BT" ? "block" : "none";
    tDiv.style.display = type === "T" ? "block" : "none";

    // Set required attributes
    const btnInput = document.getElementById("preco_BTN_unico");
    const btInputs = [document.getElementById("preco_BT_ponta"), document.getElementById("preco_BT_cheiasVazio")];
    const tInputs = [document.getElementById("preco_T_ponta"), document.getElementById("preco_T_cheias"), document.getElementById("preco_T_vazio")];

    btnInput.required = type === "BTN";
    btInputs.forEach(input => input.required = type === "BT");
    tInputs.forEach(input => input.required = type === "T");
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

    console.log("Iniciando cálculo...");

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
        console.log("Erro de validação:", errorMessages);
        alert("Erros encontrados:\n" + errorMessages.join("\n"));
        document.getElementById("resultado").innerText = "Erro: Preencha todos os campos obrigatórios com valores válidos.";
        document.getElementById('resultCard').style.display = 'block';
        return;
    }

    let dias;
    const select = document.getElementById("diasSelect");
    if (select.value === "custom") {
        dias = parseInt(document.getElementById("diasCustomInput").value);
    } else {
        dias = parseInt(select.value);
    }
    console.log("Dias:", dias);

    let potenciaKva = parseFloat(document.getElementById("potenciaKva").value);
    let precoPotenciaDia = parseFloat(document.getElementById("precoPotenciaDia").value);
    let iec = parseFloat(document.getElementById("iec").value);
    let dgeg = parseFloat(document.getElementById("dgeg").value);
    let taxaAudiovisual = parseFloat(document.getElementById("taxaAudiovisual").value);
    console.log("Potência kVA:", potenciaKva, "Preço potência/dia:", precoPotenciaDia, "IEC:", iec, "DGEG:", dgeg, "Audiovisual:", taxaAudiovisual);

    let antPonta = document.getElementById("antPonta");
    let antCheias = document.getElementById("antCheias");
    let antVazio = document.getElementById("antVazio");
    let atualPonta = document.getElementById("atualPonta");
    let atualCheias = document.getElementById("atualCheias");
    let atualVazio = document.getElementById("atualVazio");

    let consumoVazio = parseFloat(atualVazio.value) - parseFloat(antVazio.value);
    let consumoCheias = parseFloat(atualCheias.value) - parseFloat(antCheias.value);
    let consumoPonta = parseFloat(atualPonta.value) - parseFloat(antPonta.value);
    console.log("Consumo Ponta:", consumoPonta, "Cheias:", consumoCheias, "Vazio:", consumoVazio);

    const tarifaType = document.getElementById("tarifaType").value;
    let precoPonta, precoCheias, precoVazio;
    if (tarifaType === "BTN") {
        const precoUnico = parseFloat(document.getElementById("preco_BTN_unico").value);
        precoPonta = precoCheias = precoVazio = precoUnico;
        console.log("Tarifa BTN, preço único:", precoUnico);
    } else if (tarifaType === "BT") {
        precoPonta = parseFloat(document.getElementById("preco_BT_ponta").value);
        const precoCheiasVazio = parseFloat(document.getElementById("preco_BT_cheiasVazio").value);
        precoCheias = precoVazio = precoCheiasVazio;
        console.log("Tarifa BT, Ponta:", precoPonta, "Cheias/Vazio:", precoCheiasVazio);
    } else { // T
        precoPonta = parseFloat(document.getElementById("preco_T_ponta").value);
        precoCheias = parseFloat(document.getElementById("preco_T_cheias").value);
        precoVazio = parseFloat(document.getElementById("preco_T_vazio").value);
        console.log("Tarifa T, Ponta:", precoPonta, "Cheias:", precoCheias, "Vazio:", precoVazio);
    }

    if (isNaN(precoPonta) || isNaN(precoCheias) || isNaN(precoVazio)) {
        console.log("Erro: Preços inválidos - Ponta:", precoPonta, "Cheias:", precoCheias, "Vazio:", precoVazio);
        alert("Erro: Preços da tarifa inválidos. Verifique os valores introduzidos.");
        document.getElementById("resultado").innerText = "Erro: Preços da tarifa inválidos.";
        document.getElementById('resultCard').style.display = 'block';
        return;
    }

    let consumoTotal = consumoVazio + consumoCheias + consumoPonta;
    console.log("Consumo total:", consumoTotal);

    if (consumoTotal <= 0 || isNaN(consumoTotal) || dias <=0) {
        console.log("Erro: Consumo total inválido ou dias inválidos - Total:", consumoTotal, "Dias:", dias);
        document.getElementById("resultado").innerText = "Erro: As leituras atuais devem ser maiores que as anteriores. Verifique os valores introduzidos.";
        document.getElementById('resultCard').style.display = 'block';
        return;
    }

    let energiaSemIVA =
        (consumoVazio * precoVazio) +
        (consumoCheias * precoCheias) +
        (consumoPonta * precoPonta);

    // Validation for reasonable energy cost
    if (energiaSemIVA > 10000 || isNaN(energiaSemIVA)) {
        console.log("Erro: Custo de energia muito alto ou inválido - Energia sem IVA:", energiaSemIVA, "Preços:", precoVazio, precoCheias, precoPonta);
        alert("Erro: O custo calculado da energia parece muito alto. Verifique se os preços das tarifas estão corretos (€/kWh) e não foram confundidos com leituras do contador.");
        document.getElementById("resultado").innerText = "Erro: Preços da energia inválidos ou muito altos.";
        document.getElementById('resultCard').style.display = 'block';
        return;
    }
    console.log("Energia sem IVA:", energiaSemIVA);

    let limiteIVA6 = (200 * dias) / 30;
    let proporcao6 = Math.min(1, limiteIVA6 / consumoTotal);
    console.log("Limite IVA 6%:", limiteIVA6, "Proporção 6%:", proporcao6);

    let energiaIVA6 = energiaSemIVA * proporcao6 * 1.06;
    let energiaIVA23 = energiaSemIVA * (1 - proporcao6) * 1.23;
    console.log("Energia IVA 6%:", energiaIVA6, "IVA 23%:", energiaIVA23);

    let totalEnergia = energiaIVA6 + energiaIVA23;
    console.log("Total Energia:", totalEnergia);

    let totalIEC = consumoTotal * iec * 1.23;
    console.log("Total IEC:", totalIEC);

    let potencia6 = Math.min(potenciaKva, 3.45);
    let potencia23 = Math.max(0, potenciaKva - 3.45);
    console.log("Potência 6%:", potencia6, "23%:", potencia23);

    let custoPotencia6 = potencia6 * precoPotenciaDia * dias * 1.06;
    let custoPotencia23 = potencia23 * precoPotenciaDia * dias * 1.23;
    console.log("Custo potência 6%:", custoPotencia6, "23%:", custoPotencia23);

    let totalPotencia = custoPotencia6 + custoPotencia23;
    console.log("Total Potência:", totalPotencia);

    let totalFinal = totalEnergia + totalIEC + totalPotencia + taxaAudiovisual + dgeg;
    console.log("Total Final:", totalFinal);

    document.getElementById("resultado").innerText =
        "Consumo Total: " + consumoTotal.toFixed(2) + " kWh\n\n" +
        "Energia: " + totalEnergia.toFixed(2) + " €\n" +
        "IEC: " + totalIEC.toFixed(2) + " €\n" +
        "Potência: " + totalPotencia.toFixed(2) + " €\n" +
        "Taxa Audiovisual: " + taxaAudiovisual.toFixed(2) + " €\n" +
        "Taxa DGEG: " + dgeg.toFixed(2) + " €\n\n" +
        "=============================\n" +
        "TOTAL FINAL: " + totalFinal.toFixed(2) + " €";

    console.log("Cálculo concluído com sucesso.");

    // Generate cost distribution chart
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

    // Generate consumption by period chart
    const ctx2 = document.getElementById('consumptionChart').getContext('2d');
    if (window.myConsumptionChart) {
        window.myConsumptionChart.destroy();
    }
    window.myConsumptionChart = new Chart(ctx2, {
        type: 'pie',
        data: {
            labels: ['Ponta', 'Cheias', 'Vazio'],
            datasets: [{
                data: [consumoPonta, consumoCheias, consumoVazio],
                backgroundColor: ['#ff6384', '#36a2eb', '#cc65fe']
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
                    text: 'Distribuição do Consumo por Período'
                }
            }
        }
    });
    document.getElementById('consumptionChart').style.display = 'block';
    document.getElementById('resultCard').style.display = 'block';
}