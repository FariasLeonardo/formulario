const formulario = document.getElementById('form');

formulario.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        const inputs = Array.from(formulario.querySelectorAll('input, select, textarea'));
        const currentIndex = inputs.indexOf(document.activeElement);
        if (currentIndex < inputs.length - 1) {
            inputs[currentIndex + 1].focus();
        }
    }
});

const nomeInput = document.getElementById('nome');
const nascimentoInput = document.getElementById('nascimento');
const cpfInput = document.getElementById('cpf');
const sexoInput = document.getElementById('sexo');
const emailInput = document.getElementById('email');
const telefoneInput = document.getElementById('telefone');
const identidadeFile = document.getElementById('identidade');
const cepInput = document.getElementById('cep');
const ruaInput = document.getElementById('rua');
const numeroInput = document.getElementById('numero');
const cidadeInput = document.getElementById('cidade');
const estadoInput = document.getElementById('estado');
const residencialFile = document.getElementById('residencial');
const trilhasContainer = document.querySelector('.trilhas');
const radioTrilhas = document.querySelectorAll('input[name="trilha"]');
const checkboxDeclaracaoInput = document.getElementById('declaracao');
const botaoSalvar = document.querySelector('.save-btn');
const botaoCancelar = document.querySelector('.cancel-btn');
const botaoInscricao = document.querySelector('.submit-btn');

// Máscaras simples
cpfInput.addEventListener('input', function() {
    let value = cpfInput.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    cpfInput.value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
});

telefoneInput.addEventListener('input', function() {
    let value = telefoneInput.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    telefoneInput.value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
});

cepInput.addEventListener('input', function() {
    let value = cepInput.value.replace(/\D/g, '');
    if (value.length > 8) value = value.slice(0, 8);
    cepInput.value = value.replace(/(\d{5})(\d{3})/, '$1-$2');
});

// Feedback nos campos de upload
identidadeFile.addEventListener('change', function() {
    const span = identidadeFile.nextElementSibling.nextElementSibling;
    span.textContent = identidadeFile.files[0] ? identidadeFile.files[0].name : 'Clique aqui para selecionar o arquivo';
    limparMensagemErro(identidadeFile); // Limpa a mensagem de erro ao selecionar um arquivo
});

residencialFile.addEventListener('change', function() {
    const span = residencialFile.nextElementSibling.nextElementSibling;
    span.textContent = residencialFile.files[0] ? residencialFile.files[0].name : 'Clique aqui para selecionar o arquivo';
    limparMensagemErro(residencialFile); // Limpa a mensagem de erro ao selecionar um arquivo
});

// Função para coletar os dados do formulário
function coletarDadosFormulario() {
    return {
        nome: nomeInput.value,
        nascimento: nascimentoInput.value,
        cpf: cpfInput.value,
        sexo: sexoInput.value,
        email: emailInput.value,
        telefone: telefoneInput.value,
        identidadeNome: identidadeFile.files[0]?.name,
        cep: cepInput.value,
        rua: ruaInput.value,
        numero: numeroInput.value,
        cidade: cidadeInput.value,
        estado: estadoInput.value,
        residencialNome: residencialFile.files[0]?.name,
        trilhaSelecionada: document.querySelector('input[name="trilha"]:checked')?.value,
        declaracaoAceita: checkboxDeclaracaoInput.checked,
    };
}

// Função para salvar os dados no LocalStorage
function salvarDadosNoLocalStorage() {
    const formData = coletarDadosFormulario();
    localStorage.setItem('dadosFormulario', JSON.stringify(formData));
    console.log('Dados do formulário salvos no LocalStorage:', formData);
}

// Função para carregar os dados do LocalStorage e preencher o formulário
function carregarDadosDoLocalStorage() {
    const dadosSalvos = localStorage.getItem('dadosFormulario');
    if (dadosSalvos) {
        try {
            const formData = JSON.parse(dadosSalvos);
            if (formData.nome !== undefined) nomeInput.value = formData.nome;
            if (formData.nascimento !== undefined) nascimentoInput.value = formData.nascimento;
            if (formData.cpf !== undefined) cpfInput.value = formData.cpf;
            if (formData.sexo !== undefined) sexoInput.value = formData.sexo;
            if (formData.email !== undefined) emailInput.value = formData.email;
            if (formData.telefone !== undefined) telefoneInput.value = formData.telefone;
            if (formData.cep !== undefined) cepInput.value = formData.cep;
            if (formData.rua !== undefined) ruaInput.value = formData.rua;
            if (formData.numero !== undefined) numeroInput.value = formData.numero;
            if (formData.cidade !== undefined) cidadeInput.value = formData.cidade;
            if (formData.estado !== undefined) estadoInput.value = formData.estado;
            if (formData.trilhaSelecionada !== undefined) {
                radioTrilhas.forEach(radio => {
                    if (radio.value === formData.trilhaSelecionada) radio.checked = true;
                });
            }
            if (formData.declaracaoAceita !== undefined) checkboxDeclaracaoInput.checked = formData.declaracaoAceita;
            console.log('Dados do LocalStorage carregados no formulário:', formData);
        } catch (error) {
            console.error('Erro ao carregar dados do LocalStorage:', error);
        }
    }
}

// Função para limpar o formulário
function limparFormulario() {
    formulario.reset();
    console.log('Formulário limpo.');
    document.querySelectorAll('.erro-mensagem').forEach(span => {
        span.textContent = '';
        span.classList.remove('ativo');
    });
    document.querySelectorAll('.input-invalido').forEach(input => input.classList.remove('input-invalido'));
    // Reseta os textos dos campos de upload
    identidadeFile.nextElementSibling.nextElementSibling.textContent = 'Clique aqui para selecionar o arquivo';
    residencialFile.nextElementSibling.nextElementSibling.textContent = 'Clique aqui para selecionar o arquivo';
}

// Função para remover dados do LocalStorage
function removerDadosDoLocalStorage() {
    localStorage.removeItem('dadosFormulario');
    console.log('Dados do formulário removidos do LocalStorage.');
}

// Função para exibir mensagens de erro
function exibirMensagemErro(campo, mensagem) {
    const erroElement = document.getElementById(`erro-${campo.id || campo.dataset.id}`);
    if (erroElement) {
        erroElement.textContent = mensagem;
        erroElement.classList.add('ativo'); // Aplica a classe que torna visível e vermelho
        if (campo.tagName === 'INPUT' || campo.tagName === 'SELECT') campo.classList.add('input-invalido');
    }
}

// Função para limpar mensagens de erro
function limparMensagemErro(campo) {
    const erroElement = document.getElementById(`erro-${campo.id || campo.dataset.id}`);
    if (erroElement) {
        erroElement.textContent = '';
        erroElement.classList.remove('ativo');
        if (campo.tagName === 'INPUT' || campo.tagName === 'SELECT') campo.classList.remove('input-invalido');
    }
}

// Função de validação do formulário
function validarFormulario() {
    let formularioValido = true;

    const camposObrigatorios = formulario.querySelectorAll('[required]');
    camposObrigatorios.forEach(campo => {
        limparMensagemErro(campo);
        if (!campo.value.trim() && campo.type !== 'file' && campo.type !== 'radio' && campo.type !== 'checkbox') {
            exibirMensagemErro(campo, `O campo "${campo.labels[0]?.textContent || campo.id}" é obrigatório.`);
            formularioValido = false;
        }
    });

    if (nomeInput.value.trim()) {
        if (!/^[A-Za-zÀ-ú\s]+$/.test(nomeInput.value.trim())) {
            exibirMensagemErro(nomeInput, 'Digite um nome válido (apenas letras e espaços).');
            formularioValido = false;
        } else if (nomeInput.value.trim().length < 3) {
            exibirMensagemErro(nomeInput, 'O nome deve ter pelo menos 3 caracteres.');
            formularioValido = false;
        }
    }

    if (nascimentoInput.value.trim()) {
        const dataNascimento = new Date(nascimentoInput.value);
        const hoje = new Date();
        let idade = hoje.getFullYear() - dataNascimento.getFullYear();
        const m = hoje.getMonth() - dataNascimento.getMonth();
        if (m < 0 || (m === 0 && hoje.getDate() < dataNascimento.getDate())) idade--;
        if (idade < 18) {
            exibirMensagemErro(nascimentoInput, 'Você deve ter pelo menos 18 anos.');
            formularioValido = false;
        }
    }

    if (cpfInput.value.trim() && !validarCPF(cpfInput.value.replace(/\D/g, ''))) {
        exibirMensagemErro(cpfInput, 'Digite um CPF válido.');
        formularioValido = false;
    }

    if (emailInput.value.trim() && !isValidEmail(emailInput.value.trim())) {
        exibirMensagemErro(emailInput, 'Digite um e-mail válido.');
        formularioValido = false;
    }

    if (telefoneInput.value.trim()) {
        const telefoneLimpo = telefoneInput.value.replace(/\D/g, '');
        if (!/^\d{10,11}$/.test(telefoneLimpo)) {
            exibirMensagemErro(telefoneInput, 'Digite um telefone válido (10 ou 11 dígitos).');
            formularioValido = false;
        }
    }

    if (cepInput.value.trim() && !/^\d{8}$/.test(cepInput.value.replace(/\D/g, ''))) {
        exibirMensagemErro(cepInput, 'Digite um CEP válido (8 dígitos).');
        formularioValido = false;
    }

    if (estadoInput.value.trim().length !== 2 || !/^[A-Z]{2}$/.test(estadoInput.value.trim())) {
        exibirMensagemErro(estadoInput, 'Digite a sigla do estado com 2 letras (ex: SP).');
        formularioValido = false;
    }

    // Validação explícita dos arquivos
    if (!identidadeFile.files[0]) {
        exibirMensagemErro(identidadeFile, 'O arquivo de identidade é obrigatório.');
        formularioValido = false;
    } else {
        limparMensagemErro(identidadeFile);
    }

    if (!residencialFile.files[0]) {
        exibirMensagemErro(residencialFile, 'O comprovante de residência é obrigatório.');
        formularioValido = false;
    } else {
        limparMensagemErro(residencialFile);
    }

    const trilhaSelecionada = document.querySelector('input[name="trilha"]:checked');
    if (!trilhaSelecionada) {
        trilhasContainer.dataset.id = 'trilha';
        exibirMensagemErro(trilhasContainer, 'Selecione pelo menos uma trilha de aprendizagem.');
        formularioValido = false;
    } else {
        limparMensagemErro(trilhasContainer);
    }

    if (!checkboxDeclaracaoInput.checked) {
        exibirMensagemErro(checkboxDeclaracaoInput, 'Você deve aceitar os termos.');
        formularioValido = false;
    } else {
        limparMensagemErro(checkboxDeclaracaoInput);
    }

    return formularioValido;
}

// Função auxiliar para validar CPF
function validarCPF(cpf) {
    if (!cpf || cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
    let sum = 0;
    for (let i = 0; i < 9; i++) sum += parseInt(cpf.charAt(i)) * (10 - i);
    let remainder = 11 - (sum % 11);
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.charAt(9))) return false;
    sum = 0;
    for (let i = 0; i < 10; i++) sum += parseInt(cpf.charAt(i)) * (11 - i);
    remainder = 11 - (sum % 11);
    if (remainder === 10 || remainder === 11) remainder = 0;
    return remainder === parseInt(cpf.charAt(10));
}

// Função auxiliar para validar e-mail
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Eventos
if (botaoSalvar) {
    botaoSalvar.addEventListener('click', salvarDadosNoLocalStorage);
}

if (botaoCancelar) {
    botaoCancelar.addEventListener('click', function() {
        limparFormulario();
        removerDadosDoLocalStorage();
    });
}

if (botaoInscricao) {
    botaoInscricao.addEventListener('click', function(event) {
        event.preventDefault();
        botaoInscricao.disabled = true;

        if (validarFormulario()) {
            const dadosParaEnviar = coletarDadosFormulario();
            console.log('Dados para inscrição:', dadosParaEnviar);
            alert('Inscrição realizada com sucesso!');
            localStorage.removeItem('dadosFormulario');
            formulario.reset();
            window.location.href = 'capa.html';
        }

        botaoInscricao.disabled = false;
    });
}

window.onload = carregarDadosDoLocalStorage;