document.addEventListener("DOMContentLoaded", () => {
    const formularioCadastro = document.getElementById("formularioCadastro");

    if (formularioCadastro) {
        formularioCadastro.addEventListener("submit", (e) => {
            e.preventDefault();

            const email = document.getElementById("email").value.trim();
            const senha = document.getElementById("senha").value;
            const confirmarSenha = document.getElementById("confirmarSenha").value;
            const nomeUsuario = document.getElementById("nomeUsuario").value.trim();

           
            if (!email || !senha || !confirmarSenha) {
                alert("Preencha todos os campos!");
                return;
            }

         
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert("Digite um e-mail válido!");
                return;
            }

            if (senha !== confirmarSenha) {
                alert("As senhas não coincidem!");
                return;
            }


            localStorage.setItem("usuarioCadastrado", JSON.stringify({ email: email, senha: senha, nome: nomeUsuario  }));
            
            alert("Cadastro realizado com sucesso! Você já pode fazer login.");
            window.location.href = "/pages/telaLogin.html"; 
        });
    }
});

