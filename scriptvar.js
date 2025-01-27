document.addEventListener('DOMContentLoaded', () => {
    const x0Input = document.getElementById('x0');
    const hInput = document.getElementById('h');
    const funcInput = document.getElementById('func');
    
    const x0ValueText = document.getElementById('x0-value');
    const hValueText = document.getElementById('h-value');
    const x0Text = document.getElementById('x0-text');
    const hText = document.getElementById('h-text');
    const x0hText = document.getElementById('x0h-text');
    const fX0Text = document.getElementById('f-x0-text');
    const fX0hText = document.getElementById('f-x0h-text');
    const rateText = document.getElementById('rate-text');
    
    // Função para calcular a função matemática f(x)
    function calcFunc(func, x) {
        try {
            const result = math.evaluate(func.replace(/x/g, `(${x})`));  // Substitui "x" pela variável
            // console.log(`Calculando f(${x}) = ${result}`);  // Log do cálculo de f(x)
            return result;
        } catch (error) {
            console.log(`Erro ao calcular f(${x}): ${error.message}`);  // Log do erro se o cálculo falhar
            return NaN;
        }
    }

    

    // Atualiza os valores na tela
    function updateValues() {
        const x0 = parseFloat(x0Input.value);  // Converte o valor de x0
        const h = parseFloat(hInput.value);    // Converte o valor de h
        const func = funcInput.value;          // Pega a função inserida
        
        // console.log(`Valores atualizados: x0 = ${x0}, h = ${h}, func = "${func}"`);  // Log dos valores de entrada

        // Calcular os valores de f(x0) e f(x0+h)
        const fX0 = calcFunc(func, x0);       // Calcula f(x0)
        const fX0h = calcFunc(func, x0 + h);  // Calcula f(x0 + h)
        
        // Log de fX0 e fX0h
/*         console.log(`f(x0) = ${fX0}`);
        console.log(`f(x0 + h) = ${fX0h}`); */
        
        // Atualizar os valores no painel
        x0ValueText.textContent = x0.toFixed(2);  // Exibe o valor de x0
        hValueText.textContent = h.toFixed(2);    // Exibe o valor de h
        x0Text.textContent = x0.toFixed(2);       // Exibe o valor de x0 para cálculos
        hText.textContent = h.toFixed(2);         // Exibe o valor de h para cálculos

        const x0h = x0 + h;
        x0hText.textContent = x0h.toFixed(2);  // Exibe x0 + h

        fX0Text.textContent = isNaN(fX0) ? 'Erro' : fX0.toFixed(2);  // Exibe f(x0), ou "Erro" se o cálculo falhar
        fX0hText.textContent = isNaN(fX0h) ? 'Erro' : fX0h.toFixed(2);  // Exibe f(x0 + h), ou "Erro" se o cálculo falhar

        const rateOfChange = isNaN(fX0h) || isNaN(fX0) ? 'Erro' : ((fX0h - fX0) / h).toFixed(2);  // Taxa de variação
        // console.log(`Taxa de variação: ${rateOfChange}`);  // Log da taxa de variação
        rateText.textContent = rateOfChange;


        

        plotGraph(func, x0, h, fX0, fX0h, rateOfChange);  // Atualiza o gráfico
    }


// Função para calcular a reta secante entre os pontos (x0, f(x0)) e (x0+h, f(x0+h))
function secanteLine(x0, fX0, h, fX0h) {
    const m = (fX0h - fX0) / h;  // Calcula a inclinação da secante
    const xStart = x0 - 2 * h;   // Estende a reta para a esquerda
    const xEnd = x0 + 2 * h;     // Estende a reta para a direita
    
    // Calcula os valores de y correspondentes a xStart e xEnd
    const yStart = m * (xStart - x0) + fX0;
    const yEnd = m * (xEnd - x0) + fX0;
    
    return {
        x: [xStart, xEnd], // Posição x da reta secante extendida
        y: [yStart, yEnd], // Posição y da reta secante extendida
    };
}

    // Função para plotar o gráfico com zoom fixo
    function plotGraph(func, x0, h, fX0, fX0h, rateOfChange) {
        const xValues = [];
        const yValues = [];
        for (let i = -10; i <= 10; i += 0.1) {
            xValues.push(i);
            yValues.push(calcFunc(func, i));  // Calcula o valor de f(x) para cada ponto
        }
    
        const trace1 = {
            x: xValues,
            y: yValues,
            mode: 'lines',
            name: 'f(x)',
        };
    
        const trace2 = {
            x: [x0, x0],
            y: [0, fX0],
            mode: 'lines',
            name: 'Linha vertical em x0',
            line: { color: 'black', dash: 'dot' },
            showlegend: false,
        };
    
        const trace3 = {
            x: [x0 + h, x0 + h],
            y: [0, fX0h],
            mode: 'lines',
            name: 'Linha vertical em x0+h',
            line: { color: 'black', dash: 'dot' },
            showlegend: false,
        };
        
        const secante = secanteLine(x0, fX0, h, fX0h);

        const trace4 = {
            
            x: secante.x,
            y: secante.y,
            mode: 'lines',
            name: 'Secante',
            line: { color: 'red' },
        };
    
        const trace5 = {
            x: [x0, x0 + h],
            y: [fX0, fX0],
            mode: 'lines',
            name: 'Reta horizontal',
            line: { color: 'black', dash: 'dash' },
            showlegend: false,
        };
    
        // Definindo o layout com zoom fixo
        const layout = {
            title: `Gráfico`,
            xaxis: {
                title: 'x',
                range: [-10, 10],  // Intervalo fixo do eixo X
                autorange: false,   // Desabilita o autorange
                dtick: 1,
            },
            yaxis: {
                title: 'f(x)',
                range: [-10, 10],  // Intervalo fixo do eixo Y
                autorange: false,  // Desabilita o autorange
                dtick: 1,
            },
            margin: {
                t: 50,  // Margem superior
                b: 50,  // Margem inferior
                l: 50,  // Margem esquerda
                r: 50,  // Margem direita
            },
            autosize: true, // Ajuste inteligente do tamanho do gráfico
            dragmode: false, // Impede que o gráfico seja arrastado
            height: null,
            with: null,
        };
    
        Plotly.react('grafico', [trace1, trace2, trace3, trace4, trace5], layout);
    }

    // Inicializar valores
    updateValues();
    

    // Atualizar valores quando o slider mudar
    x0Input.addEventListener('input', updateValues);
    hInput.addEventListener('input', updateValues);
    funcInput.addEventListener('input', updateValues);
});
