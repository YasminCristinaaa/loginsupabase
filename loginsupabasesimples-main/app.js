document.addEventListener('DOMContentLoaded', () => {
    // Chama a função para ouvir mudanças de autenticação assim que o DOM estiver carregado
    listenToAuthChanges();

    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const logoutButton = document.getElementById('logoutButton');
    const errorMessageElement = document.getElementById('error-message');
    const successMessageElement = document.getElementById('success-message');
    const userEmailElement = document.getElementById('userEmail');

    // --- Funções Auxiliares para Mensagens ---
    function displayError(message) {
        if (errorMessageElement) {
            errorMessageElement.textContent = message;
        }
    }

    function displaySuccess(message) {
        if (successMessageElement) {
            successMessageElement.textContent = message;
        }
    }

    function clearMessages() {
        if (errorMessageElement) {
            errorMessageElement.textContent = '';
        }
        if (successMessageElement) {
            successMessageElement.textContent = '';
        }
    }

    // --- Lógica de Login ---
    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            clearMessages();
            const email = loginForm.email.value;
            const password = loginForm.password.value;

            try {
                // Primeiro, verifica se o usuário existe
                const { data: existingUser, error: checkError } = await checkUserExists(email);
                
                if (checkError) {
                    displayError('Erro ao verificar usuário');
                    return;
                }

                if (!existingUser) {
                    displayError('Usuário não encontrado. Por favor, cadastre-se.');
                    return;
                }

                // Se o usuário existe, tenta fazer login
                const { data, error } = await signIn(email, password);

                if (error) {
                    displayError('Senha incorreta');
                } else {
                    displaySuccess('Login realizado com sucesso! Redirecionando...');
                    setTimeout(() => {
                        window.location.href = 'menu.html';
                    }, 1000);
                }
            } catch (error) {
                displayError('Erro ao realizar login');
            }
        });
    }

    // --- Lógica de Cadastro ---
    if (signupForm) {
        signupForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            clearMessages();
            const email = signupForm.email.value;
            const password = signupForm.password.value;

            const { data, error } = await signUp(email, password);

            if (error) {
                displayError(error.message);
            } else {
                displaySuccess('Cadastro realizado com sucesso! Redirecionando para a página de login...');
                // Redireciona para a página de login após 2 segundos
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000);
            }
        });
    }

    // --- Lógica de Logout ---
    if (logoutButton) {
        logoutButton.addEventListener('click', async () => {
            clearMessages();
            const { error } = await signOut();
            if (error) {
                // Normalmente não haverá erro no logout, mas é bom tratar
                alert('Erro ao fazer logout: ' + error.message); // Usando alert aqui para simplicidade
            }
            // O onAuthStateChange em auth.js cuidará do redirecionamento para index.html
        });
    }

    // --- Lógica para exibir informações do usuário no menu ---
    async function displayUserInfo() {
        if (userEmailElement) {
            const user = await getCurrentUser();
            if (user) {
                userEmailElement.textContent = user.email;
            } else {
                console.log("Tentativa de exibir informações do usuário no menu, mas nenhum usuário encontrado.");
            }
        }
    }

    // Se estivermos na página de menu, tente exibir as informações do usuário
    if (window.location.pathname.endsWith('menu.html')) {
        displayUserInfo();
    }
});