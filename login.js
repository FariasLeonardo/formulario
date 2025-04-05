const formLogin = document.getElementById('form-login');
const loginIdUsuarioInput = document.getElementById('loginIdUsuario');
const loginSenhaInput = document.getElementById('loginSenha');
const mensagemErroLogin = document.getElementById('mensagem-erro-login');
const mensagemErroTexto = document.getElementById('mensagem-erro-texto');

// Adicionar depuração para verificar se os elementos foram encontrados
console.log('mensagemErroLogin:', mensagemErroLogin);
console.log('mensagemErroTexto:', mensagemErroTexto);

// Proteger a rota: se o usuário estiver logado, redireciona para index.html (formulário)
window.onload = function() {
    if (isLoggedIn()) {
        window.location.href = 'index.html'; // Redireciona para o formulário se já estiver logado
    }
};

// Função para exibir mensagens de erro nos campos
function exibirMensagemErro(campo, mensagem) {
    const erroElement = document.getElementById(`erro-${campo.id}`);
    if (erroElement) {
        erroElement.textContent = mensagem;
        erroElement.classList.add('ativo');
        campo.classList.add('input-invalido');
    }
}

// Função para limpar mensagens de erro nos campos
function limparMensagemErro(campo) {
    const erroElement = document.getElementById(`erro-${campo.id}`);
    if (erroElement) {
        erroElement.textContent = '';
        erroElement.classList.remove('ativo');
        campo.classList.remove('input-invalido');
    }
}

// Função para exibir mensagem de erro geral
function exibirMensagemErroGeral(mensagem) {
    if (mensagemErroTexto && mensagemErroLogin) {
        mensagemErroTexto.textContent = mensagem;
        mensagemErroLogin.style.display = 'block';
    } else {
        console.error('Elementos de mensagem de erro não encontrados.');
    }
}

// Função para limpar mensagem de erro geral
function limparMensagemErroGeral() {
    if (mensagemErroTexto && mensagemErroLogin) {
        mensagemErroTexto.textContent = '';
        mensagemErroLogin.style.display = 'none';
    } else {
        console.error('Elementos de mensagem de erro não encontrados.');
    }
}

// Função para validar o login
function validarLogin() {
    let loginValido = true;

    // Limpar mensagens de erro anteriores
    limparMensagemErro(loginIdUsuarioInput);
    limparMensagemErro(loginSenhaInput);
    limparMensagemErroGeral();

    // Verificar se os campos estão preenchidos
    if (!loginIdUsuarioInput.value.trim()) {
        exibirMensagemErro(loginIdUsuarioInput, 'O campo ID do Usuário é obrigatório.');
        loginValido = false;
    }

    if (!loginSenhaInput.value.trim()) {
        exibirMensagemErro(loginSenhaInput, 'O campo Senha é obrigatório.');
        loginValido = false;
    }

    // Se os campos estiverem preenchidos, verificar as credenciais
    if (loginValido) {
        const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
        const usuarioEncontrado = usuarios.find(
            usuario => usuario.idUsuario === loginIdUsuarioInput.value && usuario.senha === loginSenhaInput.value
        );

        if (!usuarioEncontrado) {
            exibirMensagemErro(loginIdUsuarioInput, 'ID do Usuário ou senha incorretos.');
            exibirMensagemErro(loginSenhaInput, 'ID do Usuário ou senha incorretos.');
            exibirMensagemErroGeral('ID do Usuário ou senha incorretos. Tente novamente.');
            loginValido = false;
        }
    }

    return loginValido;
}

// Evento de submissão do formulário de login
if (formLogin) {
    formLogin.addEventListener('submit', function(event) {
        event.preventDefault();

        if (validarLogin()) {
            login(); // Marca o usuário como logado
            console.log('Após login - isLoggedIn:', isLoggedIn()); // Depuração
            window.location.href = 'index.html'; // Redireciona para o formulário
        }
    });
}