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
                        <label for="descricaoJogo">Descrição</label>
                        <textarea id="descricaoJogo" rows="3" required></textarea>
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
                    
                    <div class="grupo-entrada">
                        <label for="avaliacaoJogo">Avaliação (1-5)</label>
                        <input type="number" id="avaliacaoJogo" min="1" max="5" value="5">
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
            descricao: formulario.descricaoJogo.value,
            categoria: formulario.categoriaJogo.value,
            imagem: formulario.imagemJogo.value || "https://placehold.co/300x400?text=Sem+Imagem",
            avaliacao: parseInt(formulario.avaliacaoJogo.value),
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

        card.innerHTML = `
            <div class="container-imagem-jogo">
                <img src="${jogo.imagem}" alt="${jogo.titulo}"  class="imagem-jogo"  onerror="this.src='https://placehold.co/200x250?text=Erro+Imagem'">
            </div>
            <div class="informacoes-jogo">
                <h4 class="titulo-jogo">${jogo.titulo}</h4>
                <p class="descricao-jogo">${jogo.descricao}</p>
                <div class="avaliacao-jogo">
                    <div class="estrelas">${'★'.repeat(jogo.avaliacao)}${'☆'.repeat(5 - jogo.avaliacao)}</div>
                    <span class="texto-avaliacao">${jogo.avaliacao}/5</span>
                </div>
                <button class="botao-detalhes-jogo" data-game="${jogo.id}">Detalhes do Jogo</button>
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

// 🔹 estilos do modal que estavam faltando
const estilosModal = `
    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        animation: fadeIn 0.3s ease;
    }

    .modal-conteudo {
        background: rgba(40, 40, 40, 0.95);
        border-radius: 16px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        width: 90%;
        max-width: 500px;
        max-height: 90vh;
        overflow-y: auto;
        animation: slideIn 0.3s ease;
    }

    .modal-cabecalho {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px 30px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .modal-cabecalho h2 {
        color: #ffffff;
        font-size: 1.5rem;
        margin: 0;
    }

    .botao-fechar-modal {
        background: none;
        border: none;
        color: #999999;
        font-size: 2rem;
        cursor: pointer;
        padding: 0;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: all 0.3s ease;
    }

    .botao-fechar-modal:hover {
        color: #ffffff;
        background: rgba(255, 255, 255, 0.1);
    }

    .formulario-modal {
        padding: 30px;
    }

    .formulario-modal .grupo-entrada {
        margin-bottom: 20px;
    }

    .formulario-modal label {
        display: block;
        color: #c0c0c0;
        font-size: 0.9rem;
        font-weight: 600;
        margin-bottom: 8px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .formulario-modal input,
    .formulario-modal textarea,
    .formulario-modal select {
        width: 100%;
        padding: 12px 16px;
        background: rgba(20, 20, 20, 0.8);
        border: 2px solid rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        color: #ffffff;
        font-size: 1rem;
        outline: none;
        transition: all 0.3s ease;
    }

    .formulario-modal input:focus,
    .formulario-modal textarea:focus,
    .formulario-modal select:focus {
        border-color: #888888;
        background: rgba(30, 30, 30, 0.9);
        box-shadow: 0 0 0 3px rgba(136, 136, 136, 0.1);
    }

    .formulario-modal textarea {
        resize: vertical;
        min-height: 80px;
    }

    .botoes-modal {
        display: flex;
        gap: 15px;
        justify-content: flex-end;
        margin-top: 30px;
    }

    .botao-cancelar,
    .botao-confirmar {
        padding: 12px 24px;
        border: none;
        border-radius: 8px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .botao-cancelar {
        background: rgba(60, 60, 60, 0.8);
        color: #e0e0e0;
    }

    .botao-cancelar:hover {
        background: rgba(80, 80, 80, 0.9);
    }

    .botao-confirmar {
        background: linear-gradient(135deg, #666666, #777777);
        color: #ffffff;
    }

    .botao-confirmar:hover {
        background: linear-gradient(135deg, #777777, #888888);
        transform: translateY(-1px);
    }

    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(-30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;


function injetarEstilosModal() {
    if (!document.getElementById('estilos-modal')) {
        const style = document.createElement('style');
        style.id = 'estilos-modal';
        style.textContent = estilosModal;
        document.head.appendChild(style);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    injetarEstilosModal();
    new BibliotecaJogos();
});
