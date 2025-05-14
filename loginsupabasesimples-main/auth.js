const SUPABASE_URL = 'https://tpjwicgzrjfmujfbbftc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRwandpY2d6cmpmbXVqZmJiZnRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyMjE1NjQsImV4cCI6MjA2Mjc5NzU2NH0.xUm0z6irPefXY3et1N_Z3XDxa2c934fO6CbY_5EHXPQ';

const supabase_client = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Verifica se um usuário existe no Supabase.
 * @param {string} email O email do usuário.
 * @returns {Promise<{data: boolean, error: any}>}
 */
async function checkUserExists(email) {
    try {
        const { data: { user }, error } = await supabase_client.auth.signInWithOtp({
            email: email,
            options: {
                shouldCreateUser: false
            }
        });
        // If there's no error, the user exists
        return { data: !error, error: null };
    } catch (error) {
        return { data: null, error };
    }
}

/**
 * Realiza o cadastro de um novo usuário.
 * @param {string} email O email do usuário.
 * @param {string} password A senha do usuário.
 * @returns {Promise<{data: any, error: any}>}
 */
async function signUp(email, password) {
    const { data, error } = await supabase_client.auth.signUp({
        email: email,
        password: password,
    });
    return { data, error };
}

/**
 * Realiza o login de um usuário existente.
 * @param {string} email O email do usuário.
 * @param {string} password A senha do usuário.
 * @returns {Promise<{data: any, error: any}>}
 */
async function signIn(email, password) {
    const { data, error } = await supabase_client.auth.signInWithPassword({
        email: email,
        password: password,
    });
    return { data, error };
}

/**
 * Realiza o logout do usuário atual.
 * @returns {Promise<{error: any}>}
 */
async function signOut() {
    const { error } = await supabase_client.auth.signOut();
    return { error };
}

/**
 * Obtém o usuário atualmente logado.
 * @returns {Promise<any>} O objeto do usuário ou null se não estiver logado.
 */
async function getCurrentUser() {
    const { data: { session } } = await supabase_client.auth.getSession();
    if (session) {
        return session.user;
    }
    return null;
}

/**
 * Ouve as mudanças no estado de autenticação e redireciona o usuário.
 */
function listenToAuthChanges() {
    supabase_client.auth.onAuthStateChange((event, session) => {
        const user = session?.user;
        const currentPage = window.location.pathname.split('/').pop();

        if (user) {
            // Se o usuário está logado e está na página de login ou cadastro, redireciona para o menu
            if (currentPage === 'index.html' || currentPage === 'signup.html' || currentPage === '') {
                window.location.href = 'menu.html';
            }
        } else {
            // Se o usuário não está logado e está em uma página protegida (menu), redireciona para o login
            if (currentPage === 'menu.html') {
                window.location.href = 'index.html';
            }
        }
    });
}
