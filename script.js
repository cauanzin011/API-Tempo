const cidadeHtml = document.querySelector(".nomeCidade")
const input = document.querySelector(".inputCidade")
const btnPesquisar = document.querySelector(".buscarCidade")
const listaCidades = document.querySelector(".listaCidades")
 
const erroTexto = document.querySelector(".textoErroInput")
const divErroInput = document.querySelector(".divErroInput")
 
let tempoErro;
 
function fundoSite(){
    let dataAtual = new Date()
    let horas = dataAtual.getHours()
 
    if(horas >= 6 && horas < 18){
        document.body.classList.remove("noite")
    }else{
        document.body.classList.add("noite")
    }
}
 
function mostrarErro(mensagem) {
    erroTexto.textContent = mensagem
    divErroInput.style.display = "block"
 
    clearTimeout(tempoErro)
 
    tempoErro = setTimeout(() => {
        divErroInput.style.display = "none"
    }, 1500)
}
 
function procurarTemperatura() {
    const valorInput = input.value.trim()
 
    listaCidades.innerHTML = ""
    listaCidades.style.display = "none"
 
    if (valorInput === "") {
        mostrarErro("Digite o nome de alguma cidade")
        return
    }
 
    const urlCidade = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(valorInput)}&count=5&language=pt`;
 
    fetch(urlCidade)
        .then((resultado) => {
            if (!resultado.ok) {
                throw new Error("Falha ao pesquisar as cidades")
            }
 
            return resultado.json()
        })
        .then((dados) => {
            if (!dados.results || dados.results.length === 0) {
                throw new Error("Cidade não encontrada")
            }
 
            cidadeHtml.textContent = "Escolha uma cidade"
 
            dados.results.forEach((cidade) => {
                const botaoCidade = document.createElement("button")
 
                botaoCidade.textContent = `${cidade.name} - ${cidade.admin1} - ${cidade.country}`
 
                botaoCidade.addEventListener("click", () => {
                    cidadeHtml.textContent = cidade.name
 
                    listaCidades.innerHTML = ""
                    listaCidades.style.display = "none"
 
                    input.value = "";
 
                    buscarClima(cidade.latitude, cidade.longitude)
                })
 
                listaCidades.appendChild(botaoCidade)
            });
 
            listaCidades.style.display = "block"
        })
        .catch((erro) => {
            mostrarErro(erro.message)
        })
}
 
function buscarClima(latitude, longitude) {
    const temperatura = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`;
 
    fetch(temperatura)
        .then((resultadoClima) => {
            if (!resultadoClima.ok) {
                throw new Error("Não foi possível conseguir a previsão")
            }
 
            return resultadoClima.json()
        })
        .then((dadosClima) => {
            const grausHtml = document.querySelector(".graus")
            const maximaHtml = document.querySelector(".maxima")
            const minimaHtml = document.querySelector(".minima")
            const umidadeHtml = document.querySelector(".umidade")
            const previsao = document.querySelector(".chanceChuva")
 
            const graus = dadosClima.current.temperature_2m
            const maxima = dadosClima.daily.temperature_2m_max[0]
            const minima = dadosClima.daily.temperature_2m_min[0]
            const umidade = dadosClima.current.relative_humidity_2m
            const chanceChuva = dadosClima.daily.precipitation_probability_max[0]
 
            grausHtml.textContent = `${graus} °C`
            maximaHtml.textContent = `${maxima} °C`
            minimaHtml.textContent = `${minima} °C`
            umidadeHtml.textContent = `${umidade}%`
            previsao.textContent = `${chanceChuva ?? "--"}%`
        })
        .catch((erro) => {
            mostrarErro(erro.message)
        })
}
 
btnPesquisar.addEventListener("click", procurarTemperatura)
 
fundoSite()
setInterval(fundoSite, 60000)
 