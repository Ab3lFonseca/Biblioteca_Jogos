class BibliotecaJogos {
    constructor() {
        this.jogos = JSON.parse(localStorage.getItem('jogos')) || [];
        this.jogoIdCounter = parseInt(localStorage.getItem('jogoIdCounter')) || 1;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderizarJogos();
        this.setupFiltros();
    }

    setupEventListeners() {
        const botaoRemover = document.getElementById("botaoRemoveJogo");
        if (botaoRemover) {
            botaoRemover.addEventListener("click", () => this.toggleModoRemocao());
        }

        const botaoPerfil = document.getElementById("botaoPerfil");
        if (botaoPerfil) {
            botaoPerfil.addEventListener("click", () => {
                if (this.isLoggedIn()) {
                    window.location.href = "telaPerfil.html";
                } else {
                    alert("Você precisa estar logado para acessar o perfil!");
                    window.location.href = "telaLogin.html";
                }
            });
        }

        const campoBusca = document.getElementById("pesquisaJogos");
        if (campoBusca) {
            campoBusca.addEventListener("input", (e) => this.filtrarJogos(e.target.value));
        }

        const cartaoAdicionarJogo = document.getElementById("cartaoAdicionarJogo");
        if (cartaoAdicionarJogo) {
            cartaoAdicionarJogo.addEventListener("click", () => this.mostrarModalAdicionarJogo());
        }
    }

    setupFiltros() {
        const filtros = document.querySelectorAll('.tag-filtro');
        filtros.forEach(filtro => {
            filtro.addEventListener('click', (e) => {
                filtros.forEach(f => f.classList.remove('active'));
                e.target.classList.add('active');

                const categoria = e.target.dataset.category;
                this.filtrarPorCategoria(categoria);
            });
        });
    }

    mostrarModalAdicionarJogo() {
        const modal = this.criarModalAdicionarJogo();
        document.body.appendChild(modal);
    }

    criarModalAdicionarJogo() {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-conteudo">
                <div class="modal-cabecalho">
                    <h2>Adicionar Novo Jogo</h2>
                    <button class="botao-fechar-modal">&times;</button>
                </div>
                <form id="formularioAdicionarJogo" class="formulario-modal">
                    <div class="grupo-entrada">
                        <label for="tituloJogo">Título do Jogo</label>
                        <input type="text" id="tituloJogo" required>
                    </div>

                  

                    <div class="grupo-entrada">
                        <label for="categoriaJogo">Categoria</label>
                        <select id="categoriaJogo" required>
                            <option value="">Selecione uma categoria</option>
                            <option value="acao">Ação</option>
                            <option value="aventura">Aventura</option>
                            <option value="rpg">RPG</option>
                            <option value="estrategia">Estratégia</option>
                            <option value="esporte">Esporte</option>
                        </select>
                    </div>

                    <div class="grupo-entrada">
                        <label for="imagemJogo">URL da Imagem</label>
                        <input type="url" id="imagemJogo" placeholder="https://exemplo.com/imagem.jpg">
                    </div>

                    <div class="botoes-modal">
                        <button type="button" class="botao-cancelar">Cancelar</button>
                        <button type="submit" class="botao-confirmar">Adicionar Jogo</button>
                    </div>
                </form>
            </div>
        `;

        const botaoFechar = modal.querySelector('.botao-fechar-modal');
        const botaoCancelar = modal.querySelector('.botao-cancelar');
        const formulario = modal.querySelector('#formularioAdicionarJogo');

        botaoFechar.addEventListener('click', () => this.fecharModal(modal));
        botaoCancelar.addEventListener('click', () => this.fecharModal(modal));
        modal.addEventListener('click', (e) => {
            if (e.target === modal) this.fecharModal(modal);
        });

        formulario.addEventListener('submit', (e) => {
            e.preventDefault();
            this.adicionarJogo(formulario);
            this.fecharModal(modal);
        });

        return modal;
    }

    fecharModal(modal) {
        modal.remove();
    }

    adicionarJogo(formulario) {
        const novoJogo = {
            id: this.jogoIdCounter++,
            titulo: formulario.tituloJogo.value,
        
            categoria: formulario.categoriaJogo.value,
            imagem: formulario.imagemJogo.value || "https://placehold.co/300x400?text=Sem+Imagem",
            dataAdicao: new Date().toISOString(),
            favorito: false
        };

        this.jogos.push(novoJogo);
        this.salvarDados();
        this.renderizarJogos();
    }

    toggleModoRemocao() {
        const container = document.getElementById('jogosContainer');
        container.classList.toggle('modo-remocao');

        const botaoRemover = document.getElementById('botaoRemoveJogo');
        if (container.classList.contains('modo-remocao')) {
            botaoRemover.textContent = '✓';
            botaoRemover.title = 'Finalizar Remoção';
        } else {
            botaoRemover.textContent = '-';
            botaoRemover.title = 'Remover Jogo';
        }
    }

    removerJogo(id) {
        this.jogos = this.jogos.filter(jogo => jogo.id !== id);
        this.salvarDados();
        this.renderizarJogos();
    }

    toggleFavorito(id) {
        const jogo = this.jogos.find(j => j.id === id);
        if (jogo) {
            jogo.favorito = !jogo.favorito;
            this.salvarDados();
            this.renderizarJogos();
        }
    }

    filtrarJogos(termo) {
        const jogosVisiveis = this.jogos.filter(jogo =>
            jogo.titulo.toLowerCase().includes(termo.toLowerCase()) ||
            jogo.descricao.toLowerCase().includes(termo.toLowerCase())
        );
        this.renderizarJogos(jogosVisiveis);
    }

    filtrarPorCategoria(categoria) {
        if (categoria === 'todos') {
            this.renderizarJogos();
        } else {
            const jogosFiltrados = this.jogos.filter(jogo => jogo.categoria === categoria);
            this.renderizarJogos(jogosFiltrados);
        }
    }

    renderizarJogos(jogosParaRenderizar = this.jogos) {
        const container = document.getElementById('jogosContainer');
        if (!container) return;

        const cardVazio = container.querySelector('.cartao-jogo-vazio');
        container.innerHTML = '';

        if (cardVazio) {
            container.appendChild(cardVazio);
        }

        jogosParaRenderizar.forEach(jogo => {
            const cardJogo = this.criarCardJogo(jogo);
            container.appendChild(cardJogo);
        });
    }

    criarCardJogo(jogo) {
    const card = document.createElement('div');
    card.className = 'cartao-jogo';
    card.dataset.category = jogo.categoria;
    card.dataset.id = jogo.id;

    // Suporte a várias imagens separadas por vírgula
    const imagens = jogo.imagem.split(',').map(img => img.trim());

    card.innerHTML = `
    <div class="carrossel-imagens">
        ${imagens.map((img, i) => `
            <img src="${img}" alt="${jogo.titulo}"
                 class="imagem-jogo ${i === 0 ? 'ativa' : ''}"
                 onerror="this.src='https://placehold.co/200x250?text=Erro+Imagem'">
        `).join('')}
    </div>
    <div class="informacoes-jogo">
        <h4 class="titulo-jogo">${jogo.titulo}</h4>
 
        <button class="botao-detalhes-jogo" data-game="${jogo.id}">Detalhes</button>
    </div>
`;

    // Troca automática de imagens
    if (imagens.length > 1) {
        let index = 0;
        setInterval(() => {
            const imgs = card.querySelectorAll('.imagem-jogo');
            imgs.forEach(img => img.classList.remove('ativa'));
            index = (index + 1) % imgs.length;
            imgs[index].classList.add('ativa');
        }, 3000);
    }

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

    salvarDados() {
        localStorage.setItem('jogos', JSON.stringify(this.jogos));
        localStorage.setItem('jogoIdCounter', this.jogoIdCounter.toString());
    }

    // 🔹 Métodos de login (que estavam soltos antes)
    isLoggedIn() {
        return localStorage.getItem("loggedIn") === "true";
    }

    setLoggedInStatus(status) {
        localStorage.setItem("loggedIn", status);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new BibliotecaJogos();
});
