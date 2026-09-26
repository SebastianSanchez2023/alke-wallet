/**
 * Alke Wallet - jQuery Interactive Behaviors & UI Controller
 */

$(document).ready(function () {
  // Inicialización de tooltips de Bootstrap si existen
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });

  // 1. COMPONENTE COMÚN: Actualizar saldo visual en cualquier vista
  function renderGlobalBalance() {
    const balance = AlkeState.getBalance();
    const formatted = AlkeState.formatCurrency(balance);
    $('[data-wallet-balance]').fadeOut(150, function () {
      $(this).text(formatted).fadeIn(150);
    });
  }
  renderGlobalBalance();

  // 2. LOGOUT
  $('#btnLogout, .btn-logout').on('click', function (e) {
    e.preventDefault();
    if (confirm('¿Deseas cerrar tu sesión de Alke Wallet?')) {
      AlkeState.logout();
    }
  });

  // 3. VISTA: LOGIN (login.html)
  $('#loginForm').on('submit', function (e) {
    e.preventDefault();
    const email = $('#loginEmail').val().trim();
    const password = $('#loginPassword').val().trim();
    const $alert = $('#loginAlert');

    if (!email || !password) {
      $alert
        .removeClass('d-none alert-success')
        .addClass('alert-danger')
        .html('<i class="bi bi-exclamation-triangle-fill me-2"></i>Por favor ingresa correo y contraseña.')
        .hide()
        .fadeIn(300);
      return;
    }

    if (password.length < 6) {
      $alert
        .removeClass('d-none alert-success')
        .addClass('alert-danger')
        .html('<i class="bi bi-shield-lock-fill me-2"></i>La contraseña debe contener al menos 6 caracteres.')
        .hide()
        .fadeIn(300);
      return;
    }

    // Efecto de carga en botón
    const $submitBtn = $(this).find('button[type="submit"]');
    const originalText = $submitBtn.html();
    $submitBtn.prop('disabled', true).html('<span class="spinner-border spinner-border-sm me-2"></span>Iniciando sesión...');

    setTimeout(function () {
      const res = AlkeState.login(email, password);
      if (res.success) {
        $alert
          .removeClass('d-none alert-danger')
          .addClass('alert-success')
          .html('<i class="bi bi-check-circle-fill me-2"></i>¡Credenciales verificadas! Redirigiendo...')
          .fadeIn(200);

        setTimeout(function () {
          window.location.href = 'menu.html';
        }, 800);
      } else {
        $submitBtn.prop('disabled', false).html(originalText);
        $alert
          .removeClass('d-none alert-success')
          .addClass('alert-danger')
          .html(`<i class="bi bi-x-circle-fill me-2"></i>${res.message}`)
          .fadeIn(300);
      }
    }, 700);
  });

  // 4. VISTA: MENÚ PRINCIPAL (menu.html)
  if ($('#menuRecentTransactions').length) {
    // Animación suave de entrada con jQuery
    $('.wallet-card').hide().each(function (index) {
      $(this).delay(index * 120).fadeIn(400);
    });

    // Cargar últimas 3 transacciones
    const txs = AlkeState.getTransactions().slice(0, 4);
    const $container = $('#menuRecentTransactions');
    $container.empty();

    if (txs.length === 0) {
      $container.html('<div class="text-center py-4 text-muted"><i class="bi bi-inbox fs-2 d-block mb-2"></i>No hay movimientos recientes</div>');
    } else {
      txs.forEach(function (tx) {
        const isCredit = tx.type === 'credit';
        const sign = isCredit ? '+' : '-';
        const badgeClass = isCredit ? 'credit' : 'debit';
        const amountClass = isCredit ? 'amount-credit' : 'amount-debit';
        const iconClass = isCredit ? 'bi-arrow-down-left' : 'bi-arrow-up-right';

        const itemHtml = `
          <div class="transaction-item">
            <div class="d-flex align-items-center gap-3">
              <div class="tx-icon-badge ${badgeClass}">
                <i class="bi ${iconClass}"></i>
              </div>
              <div>
                <h6 class="mb-0 fw-semibold">${tx.title}</h6>
                <small class="text-muted">${tx.party} • ${tx.date}</small>
              </div>
            </div>
            <div class="text-end">
              <span class="${amountClass} fs-6">${sign}${AlkeState.formatCurrency(tx.amount)}</span>
              <div class="small text-muted">${tx.status}</div>
            </div>
          </div>
        `;
        $container.append(itemHtml);
      });
    }
  }

  // 5. VISTA: DEPÓSITO (deposit.html)
  if ($('#depositForm').length) {
    // Selección con pills de montos rápidos
    $('.amount-pill').on('click', function () {
      $('.amount-pill').removeClass('active');
      $(this).addClass('active');
      const val = $(this).data('amount');
      $('#depositAmount').val(val).trigger('input');
    });

    $('#depositAmount').on('input', function () {
      const val = parseFloat($(this).val()) || 0;
      const current = AlkeState.getBalance();
      $('#projectedBalance').text(AlkeState.formatCurrency(current + val));
    });

    // Inicializar balance proyectado
    $('#projectedBalance').text(AlkeState.formatCurrency(AlkeState.getBalance()));

    $('#depositForm').on('submit', function (e) {
      e.preventDefault();
      const amount = $('#depositAmount').val();
      const method = $('#depositMethod').val();
      const $alert = $('#depositAlert');

      const result = AlkeState.depositFunds(amount, method);

      if (result.success) {
        $alert
          .removeClass('d-none alert-danger')
          .addClass('alert-success')
          .html(`<i class="bi bi-check-circle-fill me-2"></i>¡Depósito exitoso! Se han acreditado ${AlkeState.formatCurrency(amount)} a tu saldo.`)
          .hide()
          .slideDown(300);

        renderGlobalBalance();
        $('#depositAmount').val('');
        $('.amount-pill').removeClass('active');
        $('#projectedBalance').text(AlkeState.formatCurrency(result.newBalance));

        // Animación de pulso en tarjeta de saldo
        $('#depositBalanceCard').css('transform', 'scale(1.03)').delay(200).queue(function (next) {
          $(this).css('transform', 'scale(1)');
          next();
        });
      } else {
        $alert
          .removeClass('d-none alert-success')
          .addClass('alert-danger')
          .html(`<i class="bi bi-exclamation-triangle-fill me-2"></i>${result.message}`)
          .hide()
          .slideDown(300);
      }
    });

    // Manejo de Retiro de Fondos
    $('#withdrawForm').on('submit', function (e) {
      e.preventDefault();
      const amount = $('#withdrawAmount').val();
      const account = $('#withdrawAccount').val();
      const $alert = $('#withdrawAlert');

      const result = AlkeState.withdrawFunds(amount, account);

      if (result.success) {
        $alert
          .removeClass('d-none alert-danger')
          .addClass('alert-success')
          .html(`<i class="bi bi-check-circle-fill me-2"></i>¡Retiro procesado con éxito! Se transfirieron ${AlkeState.formatCurrency(amount)} a tu cuenta externa.`)
          .hide()
          .slideDown(300);

        renderGlobalBalance();
        $('#withdrawAmount').val('');
        $('#projectedBalance').text(AlkeState.formatCurrency(result.newBalance));

        $('#depositBalanceCard').css('transform', 'scale(0.97)').delay(200).queue(function (next) {
          $(this).css('transform', 'scale(1)');
          next();
        });
      } else {
        $alert
          .removeClass('d-none alert-success')
          .addClass('alert-danger')
          .html(`<i class="bi bi-x-circle-fill me-2"></i>${result.message}`)
          .hide()
          .slideDown(300);
      }
    });
  }

  // 6. VISTA: ENVIAR DINERO / TRANSFERENCIAS (sendmoney.html)
  if ($('#sendMoneyForm').length) {
    const contacts = AlkeState.getContacts();

    // Renderizar contactos frecuentes/recientes
    function renderContactCards(filter = '') {
      const $list = $('#quickContactsList');
      if (!$list.length) return;
      $list.empty();

      const filtered = contacts.filter(c => 
        c.name.toLowerCase().includes(filter.toLowerCase()) || 
        c.email.toLowerCase().includes(filter.toLowerCase())
      );

      if (filtered.length === 0) {
        $list.html('<div class="col-12 text-center text-muted py-2"><small>No se encontraron contactos</small></div>');
        return;
      }

      filtered.forEach(c => {
        const initials = c.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
        const cardHtml = `
          <div class="col-sm-6 col-md-4 mb-2">
            <div class="contact-chip d-flex align-items-center gap-2" data-contact-name="${c.name}" data-contact-email="${c.email}" data-contact-bank="${c.bank}">
              <div class="avatar-circle">${initials}</div>
              <div class="overflow-hidden">
                <div class="fw-bold text-truncate">${c.name}</div>
                <small class="text-muted d-block text-truncate">${c.bank}</small>
              </div>
            </div>
          </div>
        `;
        $list.append(cardHtml);
      });

      // Selección al hacer click en un contacto sugerido
      $('.contact-chip').on('click', function () {
        $('.contact-chip').removeClass('selected');
        $(this).addClass('selected');
        const name = $(this).data('contact-name');
        $('#searchContact').val(name);
        $('#selectedContactInfo').html(`
          <div class="alert alert-info py-2 px-3 small d-flex justify-content-between align-items-center mb-0">
            <span><strong>Destinatario:</strong> ${name} (${$(this).data('contact-bank')})</span>
            <button type="button" class="btn-close btn-sm" id="btnClearSelectedContact"></button>
          </div>
        `).slideDown(200);

        $('#btnClearSelectedContact').on('click', function () {
          $('#selectedContactInfo').slideUp(200).empty();
          $('.contact-chip').removeClass('selected');
          $('#searchContact').val('');
        });
      });
    }

    renderContactCards();

    // AUTOCOMPLETADO con jQuery en #searchContact
    const $search = $('#searchContact');
    const $autocompleteBox = $('#autocompleteBox');

    $search.on('input', function () {
      const query = $(this).val().toLowerCase().trim();
      renderContactCards(query);

      if (query.length === 0) {
        $autocompleteBox.hide().empty();
        return;
      }

      const matches = contacts.filter(c => 
        c.name.toLowerCase().includes(query) || 
        c.email.toLowerCase().includes(query)
      );

      if (matches.length > 0) {
        $autocompleteBox.empty();
        matches.forEach(m => {
          const item = $(`
            <div class="autocomplete-item">
              <div>
                <strong>${m.name}</strong>
                <div class="small text-muted">${m.email} • ${m.bank}</div>
              </div>
              <span class="badge bg-light text-dark border">Seleccionar</span>
            </div>
          `);

          item.on('click', function () {
            $search.val(m.name);
            $autocompleteBox.hide();
            $(`.contact-chip[data-contact-name="${m.name}"]`).trigger('click');
          });

          $autocompleteBox.append(item);
        });
        $autocompleteBox.slideDown(150);
      } else {
        $autocompleteBox.hide();
      }
    });

    $(document).on('click', function (e) {
      if (!$(e.target).closest('#searchContact, #autocompleteBox').length) {
        $autocompleteBox.hide();
      }
    });

    // Enviar dinero
    $('#sendMoneyForm').on('submit', function (e) {
      e.preventDefault();
      const recipient = $('#searchContact').val().trim();
      const amount = $('#transferAmount').val();
      const message = $('#transferMessage').val().trim();
      const $alert = $('#sendMoneyAlert');

      if (!recipient) {
        $alert
          .removeClass('d-none alert-success')
          .addClass('alert-danger')
          .html('<i class="bi bi-exclamation-triangle-fill me-2"></i>Por favor selecciona o escribe el nombre del destinatario.')
          .slideDown(200);
        return;
      }

      const result = AlkeState.sendFunds(recipient, amount, message);

      if (result.success) {
        $alert
          .removeClass('d-none alert-danger')
          .addClass('alert-success')
          .html(`<i class="bi bi-check-circle-fill me-2"></i>¡Transferencia enviada con éxito! Se transfirieron ${AlkeState.formatCurrency(amount)} a ${recipient}.`)
          .slideDown(300);

        renderGlobalBalance();
        $('#transferAmount').val('');
        $('#transferMessage').val('');
        $('#searchContact').val('');
        $('#selectedContactInfo').slideUp(200).empty();
        $('.contact-chip').removeClass('selected');
      } else {
        $alert
          .removeClass('d-none alert-success')
          .addClass('alert-danger')
          .html(`<i class="bi bi-x-circle-fill me-2"></i>${result.message}`)
          .slideDown(300);
      }
    });

    // AGREGAR NUEVO CONTACTO (Modal + jQuery)
    $('#saveNewContactBtn').on('click', function () {
      const name = $('#newContactName').val().trim();
      const email = $('#newContactEmail').val().trim();
      const bank = $('#newContactBank').val().trim();
      const account = $('#newContactAccount').val().trim();

      const res = AlkeState.addContact(name, email, bank, account);
      if (res.success) {
        // Cerrar modal
        const modalEl = document.getElementById('addContactModal');
        const modal = bootstrap.Modal.getInstance(modalEl);
        if (modal) modal.hide();

        // Limpiar inputs del modal
        $('#addContactForm')[0].reset();

        // Actualizar lista en pantalla
        contacts.push(res.contact);
        renderContactCards();

        // Autoseleccionar recién creado
        $search.val(name);
        $('#selectedContactInfo').html(`
          <div class="alert alert-success py-2 px-3 small d-flex justify-content-between align-items-center mb-0">
            <span><strong>¡Nuevo contacto agregado!</strong> Listo para transferir a ${name}</span>
          </div>
        `).slideDown(200);
      } else {
        alert(res.message);
      }
    });
  }

  // 7. VISTA: MOVIMIENTOS / HISTORIAL (transactions.html)
  if ($('#transactionsTableBody').length) {
    const allTxs = AlkeState.getTransactions();

    function renderTransactions(filterType = 'all', searchQuery = '') {
      const $tbody = $('#transactionsTableBody');
      $tbody.empty();

      const filtered = allTxs.filter(tx => {
        const matchesType = (filterType === 'all') || (tx.type === filterType);
        const matchesSearch = tx.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              tx.party.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              tx.category.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesType && matchesSearch;
      });

      if (filtered.length === 0) {
        $tbody.html(`
          <tr>
            <td colspan="5" class="text-center py-4 text-muted">
              <i class="bi bi-search fs-3 d-block mb-2"></i>
              No se encontraron movimientos con los filtros seleccionados
            </td>
          </tr>
        `);
        return;
      }

      filtered.forEach(tx => {
        const isCredit = tx.type === 'credit';
        const sign = isCredit ? '+' : '-';
        const badgeClass = isCredit ? 'bg-success-subtle text-success border border-success-subtle' : 'bg-danger-subtle text-danger border border-danger-subtle';
        const iconClass = isCredit ? 'bi-arrow-down-left text-success' : 'bi-arrow-up-right text-danger';

        const row = $(`
          <tr class="align-middle">
            <td>
              <div class="d-flex align-items-center gap-2">
                <i class="bi ${iconClass} fs-5"></i>
                <div>
                  <div class="fw-semibold">${tx.title}</div>
                  <small class="text-muted">${tx.id}</small>
                </div>
              </div>
            </td>
            <td><span class="badge bg-light text-secondary border">${tx.category}</span></td>
            <td class="text-muted small">${tx.party}</td>
            <td class="text-muted small">${tx.date}</td>
            <td class="text-end fw-bold ${isCredit ? 'text-success' : 'text-danger'}">
              ${sign}${AlkeState.formatCurrency(tx.amount)}
            </td>
          </tr>
        `);
        $tbody.append(row);
      });
    }

    renderTransactions();

    // Filtros por tab/botón
    $('.tx-filter-btn').on('click', function () {
      $('.tx-filter-btn').removeClass('active');
      $(this).addClass('active');
      const filter = $(this).data('filter');
      const search = $('#txSearchInput').val().trim();
      renderTransactions(filter, search);
    });

    // Buscador en vivo
    $('#txSearchInput').on('keyup', function () {
      const activeFilter = $('.tx-filter-btn.active').data('filter') || 'all';
      renderTransactions(activeFilter, $(this).val().trim());
    });
  }

  // 8. Botón de restablecer datos demo
  $('.btn-reset-demo').on('click', function () {
    if (confirm('¿Deseas restaurar los saldos y transacciones a los valores originales de prueba?')) {
      AlkeState.resetToDemo();
    }
  });
});
