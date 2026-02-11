# Calculadora de Faturas de Eletricidade

Uma calculadora web para estimar o custo de faturas de eletricidade em Portugal, suportando diferentes tipos de tarifas (BTN, BT, T).

## Direitos Autorais

Copyright (c) 2026 Dário Moreira. Todos os direitos reservados.

## Funcionalidades

- Cálculo de custos para tarifas tri-horárias (T), bi-horárias (BT) e normal (BTN)
- Entrada de leituras de consumo por período (Vazio, Cheias, Ponta)
- Preços de energia ajustáveis por período
- Cálculo automático de IVA, IEC, potência e taxas
- Gráfico de pizza para visualização da distribuição de custos
- Persistência de dados no localStorage
- Design responsivo e acessível

## Estrutura do Projeto

```
projeto_calculo_fatura_eletricidade/
├── index.html          # Página principal
├── css/
│   └── style.css       # Estilos CSS
├── js/
│   └── script.js       # Lógica JavaScript
└── README.md           # Este arquivo
```

## Como Usar

1. Abra `index.html` em um navegador web
2. Selecione o tipo de tarifa
3. Insira as leituras anteriores e atuais
4. Configure os preços de energia
5. Clique em "Calcular" para ver o resultado e o gráfico

## Tecnologias

- HTML5
- CSS3
- JavaScript (ES6+)
- Chart.js para gráficos

## Acessibilidade

- Suporte a navegação por teclado
- Leitores de tela compatíveis
- Contraste de cores adequado
- Estrutura semântica

## Licença

Este projeto é de código aberto e gratuito.