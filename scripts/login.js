document.addEventListener("DOMContentLoaded", () => {
    const formularioLogin = document.getElementById("formularioLogin");

    if (formularioLogin) {
        formularioLogin.addEventListener("submit", (e) => {
            e.preventDefault();

            const email = document.getElementById("emailLogin").value.trim();
            const senha = document.getElementById("senhaLogin").value;

            if (!email || !senha) {
                alert("Preencha todos os campos!");
                return;
            }

            const usuarioCadastrado = JSON.parse(localStorage.getItem("usuarioCadastrado"));

            if (!usuarioCadastrado) {
                alert("Nenhum usuário cadastrado. Faça o cadastro primeiro!");
                return;
            }

            if (email === usuarioCadastrado.email && senha === usuarioCadastrado.senha) {
                localStorage.setItem("loggedIn", "true");
                alert("Login realizado com sucesso!");
                window.location.href = "telaPerfil.html";
            } else {
                alert("E-mail ou senha incorretos!");
            }
        });
    }
});
