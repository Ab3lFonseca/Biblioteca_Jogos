
class DetalhesJogo {
    constructor() {
        this.jogos = JSON.parse(localStorage.getItem('jogos')) || [];
        this.jogoAtualId = parseInt(localStorage.getItem('jogoAtualId'));
        this.jogoAtual = null;
        this.init();
    }

    init() {
        this.carregarJogo();
        this.setupEventListeners();
        this.renderizarDetalhes();
    }

    carregarJogo() {
        this.jogoAtual = this.jogos.find(jogo => jogo.id === this.jogoAtualId);
        
        if (!this.jogoAtual) {
            
            alert('Jogo não encontrado!');
            window.location.href = '/pages/telaPrincipal.html';
            return;
        }
    }

    setupEventListeners() {
     
        const btnInicio = document.getElementById('btnInicio');
        const btnPerfil = document.getElementById('btnPerfil');
        const btnVoltar = document.getElementById('btnVoltar');

        if (btnInicio) {
            btnInicio.addEventListener('click', () => {
                window.location.href = '/pages/telaPrincipal.html';
            });
        }

        if (btnPerfil) {
            btnPerfil.addEventListener('click', () => {
                window.location.href = '/pages/telaPerfil.html';
            });
        }

        if (btnVoltar) {
            btnVoltar.addEventListener('click', () => {
                window.history.back();
            });
        }

         const botaoFavorito = document.getElementById('botaoFavoritoGrande');
    if (botaoFavorito) {
        botaoFavorito.addEventListener('click', () => this.toggleFavorito());
    }


       

 
        const estrelas = document.querySelectorAll('.estrela');
        estrelas.forEach((estrela, index) => {
            estrela.addEventListener('click', () => this.avaliarJogo(index + 1));
            estrela.addEventListener('mouseenter', () => this.highlightEstrelas(index + 1));
        });

        const containerEstrelas = document.getElementById('estrelasInterativas');
        if (containerEstrelas) {
            containerEstrelas.addEventListener('mouseleave', () => this.resetEstrelas());
        }


        const botaoEditarJogo = document.getElementById('botaoEditarJogo');
        const botaoRemoverJogo = document.getElementById('botaoRemoverJogo');

        if (botaoEditarJogo) {
            botaoEditarJogo.addEventListener('click', () => this.mostrarModalEditarJogo());
        }

        if (botaoRemoverJogo) {
            botaoRemoverJogo.addEventListener('click', () => this.confirmarRemocaoJogo());
        }


        const botaoSalvarAnotacoes = document.getElementById('botaoSalvarAnotacoes');
        if (botaoSalvarAnotacoes) {
            botaoSalvarAnotacoes.addEventListener('click', () => this.salvarAnotacoes());
        }

        const textareaAnotacoes = document.getElementById('anotacoesPessoais');
        if (textareaAnotacoes) {
            textareaAnotacoes.addEventListener('input', () => {
                clearTimeout(this.autoSaveTimeout);
                this.autoSaveTimeout = setTimeout(() => this.salvarAnotacoes(), 2000);
            });
        }
    }

    atualizarBotaoFavorito() {
    const botaoFavorito = document.getElementById('botaoFavoritoGrande');
    if (!botaoFavorito) return;

    if (this.jogoAtual.favorito) {
        botaoFavorito.textContent = "❤"; // marcado
        botaoFavorito.classList.add("favorited");
    } else {
        botaoFavorito.textContent = "♡"; // vazio
        botaoFavorito.classList.remove("favorited");
    }
}

    renderizarDetalhes() {
        if (!this.jogoAtual) return;


        const tituloJogo = document.getElementById('tituloJogo');
        const categoriaJogo = document.getElementById('categoriaJogo');
        const dataAdicao = document.getElementById('dataAdicao');
        const descricaoJogo = document.getElementById('descricaoJogo');

        if (tituloJogo) tituloJogo.textContent = this.jogoAtual.titulo;
        if (categoriaJogo) categoriaJogo.textContent = this.jogoAtual.categoria.toUpperCase();
        if (dataAdicao) {
            const data = new Date(this.jogoAtual.dataAdicao).toLocaleDateString('pt-BR');
            dataAdicao.textContent = `Adicionado em: ${data}`;
        }
        if (descricaoJogo) descricaoJogo.textContent = this.jogoAtual.descricao;


        const imagemPrincipal = document.getElementById('imagemPrincipalJogo');
        const imagemGaleria1 = document.getElementById('imagemGaleria1');

        if (imagemPrincipal) {
            imagemPrincipal.src = this.jogoAtual.imagem;
            imagemPrincipal.alt = this.jogoAtual.titulo;
        }

        if (imagemGaleria1) {
            imagemGaleria1.src = this.jogoAtual.imagem;
            imagemGaleria1.alt = this.jogoAtual.titulo;
        }

   
        this.atualizarAvaliacaoDisplay();


        this.atualizarBotaoFavorito();


        const textareaAnotacoes = document.getElementById('anotacoesPessoais');
        if (textareaAnotacoes) {
            textareaAnotacoes.value = this.jogoAtual.anotacoes || '';
        }


 

        document.title = `${this.jogoAtual.titulo} - Biblioteca de Jogos`;
    }

    

    resetEstrelas() {
        const estrelas = document.querySelectorAll('.estrela');
        estrelas.forEach((estrela, index) => {
            if (index < this.jogoAtual.avaliacao) {
                estrela.textContent = '★';
                estrela.classList.add('ativa');
            } else {
                estrela.textContent = '☆';
                estrela.classList.remove('ativa');
            }
        });
    }

    highlightEstrelas(rating) {
        const estrelas = document.querySelectorAll('.estrela');
        estrelas.forEach((estrela, index) => {
            if (index < rating) {
                estrela.textContent = '★';
                estrela.classList.add('ativa');
            } else {
                estrela.textContent = '☆';
                estrela.classList.remove('ativa');
            }
        });
    }

    avaliarJogo(rating) {
        this.jogoAtual.avaliacao = rating;
        this.salvarJogo();
        this.atualizarAvaliacaoDisplay();
        

        const textoAvaliacao = document.querySelector('.texto-avaliacao-interativa');
        if (textoAvaliacao) {
            textoAvaliacao.textContent = `Você avaliou com ${rating} estrela${rating > 1 ? 's' : ''}!`;
            setTimeout(() => {
                textoAvaliacao.textContent = 'Clique nas estrelas para avaliar';
            }, 2000);
        }
    }

    toggleFavorito() {
        this.jogoAtual.favorito = !this.jogoAtual.favorito;
        this.salvarJogo();
        this.atualizarBotaoFavorito();
    }

    

    salvarAnotacoes() {
        const textareaAnotacoes = document.getElementById('anotacoesPessoais');
        if (textareaAnotacoes) {
            this.jogoAtual.anotacoes = textareaAnotacoes.value;
            this.salvarJogo();
            

            const botaoSalvar = document.getElementById('botaoSalvarAnotacoes');
            if (botaoSalvar) {
                const textoOriginal = botaoSalvar.textContent;
                botaoSalvar.textContent = 'Salvo!';
                botaoSalvar.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
                
                setTimeout(() => {
                    botaoSalvar.textContent = textoOriginal;
                    botaoSalvar.style.background = '';
                }, 1500);
            }
        }
    }

    mostrarModalEditarJogo() {
        const modal = this.criarModalEditarJogo();
        document.body.appendChild(modal);
    }

    criarModalEditarJogo() {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-conteudo">
                <div class="modal-cabecalho">
                    <h2>Editar Jogo</h2>
                    <button class="botao-fechar-modal">&times;</button>
                </div>
                <form id="formularioEditarJogo" class="formulario-modal">
                    <div class="grupo-entrada">
                        <label for="tituloJogoEdit">Título do Jogo</label>
                        <input type="text" id="tituloJogoEdit" value="${this.jogoAtual.titulo}" required>
                    </div>
                    
                    <div class="grupo-entrada">
                        <label for="descricaoJogoEdit">Descrição</label>
                        <textarea id="descricaoJogoEdit" rows="3" required>${this.jogoAtual.descricao}</textarea>
                    </div>
                    
                    <div class="grupo-entrada">
                        <label for="categoriaJogoEdit">Categoria</label>
                        <select id="categoriaJogoEdit" required>
                            <option value="acao" ${this.jogoAtual.categoria === 'acao' ? 'selected' : ''}>Ação</option>
                            <option value="aventura" ${this.jogoAtual.categoria === 'aventura' ? 'selected' : ''}>Aventura</option>
                            <option value="rpg" ${this.jogoAtual.categoria === 'rpg' ? 'selected' : ''}>RPG</option>
                            <option value="estrategia" ${this.jogoAtual.categoria === 'estrategia' ? 'selected' : ''}>Estratégia</option>
                            <option value="esporte" ${this.jogoAtual.categoria === 'esporte' ? 'selected' : ''}>Esporte</option>
                        </select>
                    </div>
                    
                    <div class="grupo-entrada">
                        <label for="imagemJogoEdit">URL da Imagem</label>
                        <input type="url" id="imagemJogoEdit" value="${this.jogoAtual.imagem}">
                    </div>
                    
                    <div class="botoes-modal">
                        <button type="button" class="botao-cancelar">Cancelar</button>
                        <button type="submit" class="botao-confirmar">Salvar Alterações</button>
                    </div>
                </form>
            </div>
        `;


        const botaoFechar = modal.querySelector('.botao-fechar-modal');
        const botaoCancelar = modal.querySelector('.botao-cancelar');
        const formulario = modal.querySelector('#formularioEditarJogo');

        botaoFechar.addEventListener('click', () => this.fecharModal(modal));
        botaoCancelar.addEventListener('click', () => this.fecharModal(modal));
        modal.addEventListener('click', (e) => {
            if (e.target === modal) this.fecharModal(modal);
        });

        formulario.addEventListener('submit', (e) => {
            e.preventDefault();
            this.salvarEdicaoJogo(formulario);
            this.fecharModal(modal);
        });

        return modal;
    }

    salvarEdicaoJogo(formulario) {
        this.jogoAtual.titulo = formulario.tituloJogoEdit.value;
        this.jogoAtual.descricao = formulario.descricaoJogoEdit.value;
        this.jogoAtual.categoria = formulario.categoriaJogoEdit.value;
        this.jogoAtual.imagem = formulario.imagemJogoEdit.value || this.jogoAtual.imagem;

        this.salvarJogo();
        this.renderizarDetalhes();
    }

    confirmarRemocaoJogo() {
        const confirmacao = confirm(`Tem certeza que deseja remover "${this.jogoAtual.titulo}" da sua biblioteca?`);
        
        if (confirmacao) {
            this.removerJogo();
        }
    }

    removerJogo() {
    this.jogos = this.jogos.filter(jogo => jogo.id !== this.jogoAtualId);
    localStorage.setItem('jogos', JSON.stringify(this.jogos));
    localStorage.removeItem('jogoAtualId');
    
    alert('Jogo removido com sucesso!');
    window.location.href = '/pages/telaPrincipal.html'; // ✅ corrigido
}


    

    fecharModal(modal) {
        modal.remove();
    }

    salvarJogo() {
        const index = this.jogos.findIndex(jogo => jogo.id === this.jogoAtualId);
        if (index !== -1) {
            this.jogos[index] = this.jogoAtual;
            localStorage.setItem('jogos', JSON.stringify(this.jogos));
        }
    }
}


document.addEventListener('DOMContentLoaded', () => {
    new DetalhesJogo();
});

