class PerfilUsuario {
    constructor() {
        this.jogos = JSON.parse(localStorage.getItem('jogos')) || [];
        this.usuarioCadastrado = JSON.parse(localStorage.getItem('usuarioCadastrado')); 
        this.dadosUsuario = JSON.parse(localStorage.getItem('dadosUsuario')) 
            || this.criarDadosUsuarioPadrao(this.usuarioCadastrado);

        this.init();
    }

    criarDadosUsuarioPadrao(usuarioCadastrado) {
        return {
            nome: (usuarioCadastrado && usuarioCadastrado.nome) 
                  ? usuarioCadastrado.nome 
                  : 'Nome do Usuário',
            descricao: '',
            avatar: "",
            seguidores: 0,
            dataRegistro: new Date().toISOString()
        };
    }

    init() {
        this.setupEventListeners();
        this.carregarDadosUsuario();
        this.renderizarJogosFavoritos();
        this.atualizarEstatisticas();
    }

    setupEventListeners() {
    const btnInicio = document.getElementById('btnInicio');
    if (btnInicio) {
        btnInicio.addEventListener('click', () => {
            window.location.href = 'telaPrincipal.html'; 
        });
    }

    // Seleciona botão após DOM estar totalmente carregado
    const botaoAlterarAvatar = document.querySelector('.botao-alterar-avatar');
    if (botaoAlterarAvatar) {
        botaoAlterarAvatar.addEventListener('click', (e) => {
            e.preventDefault();
            this.mostrarModalAlterarAvatar();
        });
    } else {
        console.warn('Botão de alterar avatar não encontrado no DOM');
    }

    const descricaoUsuario = document.getElementById('descricaoUsuario');
    if (descricaoUsuario) {
        descricaoUsuario.addEventListener('blur', () => {
            this.dadosUsuario.descricao = descricaoUsuario.value;
            this.salvarDadosUsuario();
        });
    }

    const nomeUsuario = document.getElementById('nomeUsuario');
    if (nomeUsuario) {
        nomeUsuario.addEventListener('click', () => this.editarNomeUsuario());
    }
}

mostrarModalAlterarAvatar() {
    // Remove modal antigo se existir
    const modalExistente = document.querySelector('.modal-overlay');
    if (modalExistente) modalExistente.remove();

    const modal = this.criarModalAlterarAvatar();
    document.body.appendChild(modal);

    // Garante que o modal fique visível
    modal.style.display = 'flex';
    modal.style.zIndex = 9999;
}


    carregarDadosUsuario() {
        const nomeUsuario = document.getElementById('nomeUsuario');
        const descricaoUsuario = document.getElementById('descricaoUsuario');
        const imagemPerfil = document.querySelector('.imagem-perfil');

        if (nomeUsuario) nomeUsuario.textContent = this.dadosUsuario.nome;
        if (descricaoUsuario) descricaoUsuario.value = this.dadosUsuario.descricao;
        if (imagemPerfil) imagemPerfil.src = this.dadosUsuario.avatar || '../itensExternos/fotoperfilindefinida.png';
    }

    editarNomeUsuario() {
        const nomeUsuario = document.getElementById('nomeUsuario');
        if (!nomeUsuario) return;
        const nomeAtual = nomeUsuario.textContent;

        const input = document.createElement('input');
        input.type = 'text';
        input.value = nomeAtual;
        input.className = 'input-editar-nome';
        input.style.cssText = `
            background: rgba(20, 20, 20, 0.8);
            border: 2px solid rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            color: #ffffff;
            font-size: 1.5rem;
            font-weight: 600;
            padding: 8px 12px;
            width: 100%;
            outline: none;
        `;

        nomeUsuario.style.display = 'none';
        nomeUsuario.parentNode.insertBefore(input, nomeUsuario);
        input.focus();
        input.select();

        const finalizarEdicao = () => {
            const novoNome = input.value.trim() || 'Nome do Usuário';
            this.dadosUsuario.nome = novoNome;
            nomeUsuario.textContent = novoNome;
            nomeUsuario.style.display = 'block';
            input.remove();
            this.salvarDadosUsuario();
        };

        input.addEventListener('blur', finalizarEdicao);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') finalizarEdicao();
        });
    }

    mostrarModalAlterarAvatar() {
        const modal = this.criarModalAlterarAvatar();
        document.body.appendChild(modal);
    }

    criarModalAlterarAvatar() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-conteudo">
            <div class="modal-cabecalho">
                <h2>Alterar Avatar</h2>
                <button class="botao-fechar-modal">&times;</button>
            </div>
            <div class="modal-corpo">
                <div class="preview-avatar">
                    <img src="${this.dadosUsuario.avatar || '../itensExternos/fotoperfilindefinida.png'}" 
                         alt="Preview" class="imagem-preview">
                </div>
                <div class="grupo-entrada">
                    <label for="urlAvatar">URL da Imagem</label>
                    <input type="url" id="urlAvatar" 
                           value="${this.dadosUsuario.avatar}" 
                           placeholder="https://exemplo.com/avatar.png">
                </div>
                <div class="grupo-entrada">
                    <label for="uploadAvatar">Ou envie do seu computador:</label>
                    <input type="file" id="uploadAvatar" accept="image/*">
                </div>
                
                

                <div class="botoes-modal">
                    <button type="button" class="botao-cancelar">Cancelar</button>
                    <button type="button" class="botao-confirmar">Salvar Avatar</button>
                </div>
            </div>
        </div>
    `;

  



        const botaoFechar = modal.querySelector('.botao-fechar-modal');
        const botaoCancelar = modal.querySelector('.botao-cancelar');
        const botaoConfirmar = modal.querySelector('.botao-confirmar');
        const inputUrl = modal.querySelector('#urlAvatar');
        const inputUpload = modal.querySelector('#uploadAvatar');
        const imagemPreview = modal.querySelector('.imagem-preview');
        const avatarOpcoes = modal.querySelectorAll('.avatar-opcao');

        botaoFechar.addEventListener('click', () => this.fecharModal(modal));
        botaoCancelar.addEventListener('click', () => this.fecharModal(modal));
        modal.addEventListener('click', (e) => {
            if (e.target === modal) this.fecharModal(modal);
        });

        // Atualiza preview via URL
        inputUrl.addEventListener('input', (e) => {
            const url = e.target.value;
            if (url) {
                imagemPreview.src = url;
                imagemPreview.onerror = () => {
                    imagemPreview.src = '../itensExternos/fotoperfilindefinida.png';
                };
            }
        });

        // Upload do computador
        inputUpload.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = () => {
                    imagemPreview.src = reader.result;
                    inputUrl.value = reader.result; // salva base64
                };
                reader.readAsDataURL(file);
            }
        });

      

        botaoConfirmar.addEventListener('click', () => {
            const novaUrl = inputUrl.value || this.dadosUsuario.avatar;
            this.dadosUsuario.avatar = novaUrl;
            this.salvarDadosUsuario();

            const imagemPerfil = document.querySelector('.imagem-perfil');
            if (imagemPerfil) imagemPerfil.src = novaUrl;

            this.fecharModal(modal);
        });

        return modal;
    }

    fecharModal(modal) {
        modal.remove();
    }

    renderizarJogosFavoritos() {
        const jogosFavoritos = this.jogos.filter(jogo => jogo.favorito);
        const gradeJogos = document.querySelector('.grade-jogos');
        if (!gradeJogos) return;

        gradeJogos.innerHTML = '';

        if (jogosFavoritos.length === 0) {
            const cardVazio = document.createElement('div');
            cardVazio.className = 'cartao-jogo-vazio';
            cardVazio.textContent = 'Nenhum jogo favorito encontrado.';
            gradeJogos.appendChild(cardVazio);
        } else {
            jogosFavoritos.forEach(jogo => {
                const cardJogo = this.criarCardJogoFavorito(jogo);
                gradeJogos.appendChild(cardJogo);
            });
        }
    }

    criarCardJogoFavorito(jogo) {
        const card = document.createElement('div');
        card.className = 'cartao-jogo';
        card.dataset.id = jogo.id;

        card.innerHTML = `
            <img src="${jogo.imagem || '../itensExternos/fotoperfilindefinida.png'}" 
                 alt="${jogo.titulo}" 
                 class="imagem-jogo" 
                 onerror="this.src='../itensExternos/fotoperfilindefinida.png'">
            <div class="informacoes-jogo">
                <h4>${jogo.titulo}</h4>
                <button class="botao-padrao botao-detalhes-jogo" data-game="${jogo.id}">
                    Ver Detalhes
                </button>
            </div>
        `;

        const botaoDetalhes = card.querySelector('.botao-detalhes-jogo');
        botaoDetalhes.addEventListener('click', (e) => {
            e.stopPropagation();
            this.irParaDetalhesJogo(jogo.id);
        });

        card.addEventListener('click', () => {
            this.irParaDetalhesJogo(jogo.id);
        });

        return card;
    }

    irParaDetalhesJogo(id) {
        localStorage.setItem('jogoAtualId', id);
        window.location.href = 'detalhes-jogo.html';
    }

    atualizarEstatisticas() {
        const seguidores = document.getElementById('seguidores');
        const jogosFavoritos = document.getElementById('jogosFavoritos');
        const jogosJogados = document.getElementById('jogosJogados');

        if (seguidores) seguidores.textContent = this.dadosUsuario.seguidores;
        if (jogosFavoritos) jogosFavoritos.textContent = this.jogos.filter(j => j.favorito).length;
        if (jogosJogados) jogosJogados.textContent = this.jogos.length;
    }

    salvarDadosUsuario() {
        localStorage.setItem('dadosUsuario', JSON.stringify(this.dadosUsuario));
    }
}


document.addEventListener('DOMContentLoaded', () => {
    new PerfilUsuario();
});
