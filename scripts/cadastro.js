// cadastro.js - validação simples + persistência em localStorage
(function(){
  'use strict';

  function $(sel){ return document.querySelector(sel); }
  function showError(el, msg){ el.textContent = msg || ''; }

  document.addEventListener('DOMContentLoaded', function(){
    var form = $('#formularioCadastro');
    if(!form) return;

    var nome = $('#nomeUsuario');
    var email = $('#email');
    var senha = $('#senha');
    var confirmar = $('#confirmarSenha');

    var eNome = $('#erroNome');
    var eEmail = $('#erroEmail');
    var eSenha = $('#erroSenha');
    var eConf = $('#erroConfirmarSenha');

    form.addEventListener('submit', function(ev){
      ev.preventDefault();

      // Limpa erros
      [eNome, eEmail, eSenha, eConf].forEach(function(n){ showError(n,''); });

      var ok = true;
      var vNome = (nome.value || '').trim();
      var vEmail = (email.value || '').trim().toLowerCase();
      var vSenha = senha.value || '';
      var vConf  = confirmar.value || '';

      // Regras
      if(!vNome){ showError(eNome, 'Informe seu nome.'); ok = false; }

      var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(vEmail);
      if(!vEmail || !emailOk){ showError(eEmail, 'E-mail inválido.'); ok = false; }

      if(vSenha.length < 6){ showError(eSenha, 'A senha deve ter no mínimo 6 caracteres.'); ok = false; }
      if(vSenha !== vConf){ showError(eConf, 'As senhas não coincidem.'); ok = false; }

      if(!ok) return;

      var usuario = { nome: vNome, email: vEmail, senha: vSenha };
      try{
        localStorage.setItem('usuarioCadastrado', JSON.stringify(usuario));
      }catch(err){
        alert('Não foi possível salvar seus dados neste navegador.');
        return;
      }

      alert('Cadastro realizado com sucesso! Você já pode fazer login.');
      window.location.href = './pages/telaLogin.html';
    });
  });
})();
