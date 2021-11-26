const transacaoUl = document.querySelector('#transactions')
const rendaDisplay = document.querySelector('#money-plus')
const despesaDisplay = document.querySelector('#money-minus')
const balancoDisplay = document.querySelector('#balance')
const form = document.querySelector('#form')
const inputTransacaoNome = document.querySelector('#text')
const inputTransacaoQtdd = document.querySelector('#amount')

//adiciona a transação no localStorage via json(array de string)
const localStorageTransactions = JSON.parse(localStorage
    .getItem('transactions'))
let transactions = localStorage
    .getItem('transactions') !== null ? localStorageTransactions : []  

const removeTransaction = ID => {//remove transação do localStorage
    transactions = transactions.filter(transaction => transaction.id !== ID)
    updateLocalStorage()
    iniciar()
}

const addTransaction = transaction => {//adiciona uma nova transaçao
    const operator = transaction.qtdd < 0 ? '-' : '+' //verifica se valor é positivo ou negativo
    const CSSClass = transaction.qtdd < 0 ? 'minus' : 'plus' //variação da classeCSS
    const qtddWithoutOperator = Math.abs(transaction.qtdd)
    const li = document.createElement('li') //cria um novo li no HTML
    
    li.classList.add(CSSClass);
    li.innerHTML = `
    ${transaction.name} <span>${operator} R$ ${qtddWithoutOperator}</span>
    <button class="delete-btn" onClick="removeTransaction(${transaction.id})">
    <i class="bi bi-trash"></i>
    </button>
    `
    transacaoUl.prepend(li)
}

//pega todas as despesas
const getDespesas = transactionsqtdds => Math.abs(transactionsqtdds
    .filter(value => value < 0)
    .reduce((accumulator, value) => accumulator + value, 0))
    .toFixed(2)

//pega as rendas
const getRenda = transactionsqtdds => transactionsqtdds
    .filter(value => value > 0)
    .reduce((accumulator, value) => accumulator + value, 0)
    .toFixed(2)

//pega o total renda + despesas
const getTotal = transactionsqtdds =>  transactionsqtdds
    .reduce((accumulator, transaction) => accumulator + transaction, 0)
    .toFixed(2)

//atualiza o balanco de valores
const updateBalanceValues = () => {
    const transactionsqtdds = transactions.map(({qtdd}) => qtdd)
    const total = getTotal(transactionsqtdds)
    const renda = getRenda(transactionsqtdds)
    const despesa = getDespesas(transactionsqtdds)

    balancoDisplay.textContent = `R$ ${total}`
    rendaDisplay.textContent = `R$ ${renda}`
    despesaDisplay.textContent = `R$ ${despesa}`
}

//inicia a transação
const iniciar = () => {
    transacaoUl.innerHTML = ''

    transactions.forEach(addTransaction)
    updateBalanceValues()
}

iniciar()

//atualiza o localStorage
const updateLocalStorage = () => {
    localStorage.setItem('transactions', JSON.stringify(transactions))
}

//gera um id aleatorio para a transação
const gerarID = () => Math.round(Math.random() * 1000)

//adiciona a transação em uma array
const addToTransactionsArray = (transactionName, transactionqtdd) => {
    transactions.push({
        id: gerarID(),
        name: transactionName,
        qtdd: Number(transactionqtdd) 
    })
}

//sempre que o form é enviado os inputs são limpados
const limparInputs = () => {
    inputTransacaoNome.value = ''
    inputTransacaoQtdd.value = ''
}

//verifica se os inputs estão preenchidos
function validarInputs() {
    inputTransacaoNome.classList.remove("is-invalid")//altera a classe CSS
    inputTransacaoQtdd.classList.remove("is-invalid")
} 

//envio do form
const formSubmit = event => {
    event.preventDefault()

    const transactionName = inputTransacaoNome.value.trim()
    const transactionqtdd = inputTransacaoQtdd.value.trim()
    const inputVazio = transactionName === '' || transactionqtdd === ''

    //se tiver vazio não deixa passar
    if(inputVazio) {
        inputTransacaoNome.classList.toggle("is-invalid")
        inputTransacaoQtdd.classList.toggle("is-invalid")
        return
    }

    //se os inputs estiverem preenchidos chama as funções:
    addToTransactionsArray(transactionName, transactionqtdd)
    iniciar()
    updateLocalStorage()
    limparInputs()
}

form.addEventListener('submit', formSubmit)
form.addEventListener('click', validarInputs)
