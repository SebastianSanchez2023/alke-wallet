/**
 * Alke Wallet - State Management & Local Storage Handler
 * Permite sincronizar saldo, historial y contactos entre todas las vistas.
 */

const AlkeState = (function () {
  const STORAGE_KEYS = {
    USER: 'alke_wallet_user',
    BALANCE: 'alke_wallet_balance',
    TRANSACTIONS: 'alke_wallet_transactions',
    CONTACTS: 'alke_wallet_contacts',
    INITIALIZED: 'alke_wallet_initialized'
  };

  // Datos semilla iniciales si el usuario abre por primera vez
  const DEFAULT_DATA = {
    balance: 1450000,
    user: {
      name: 'Sebastián Silva',
      email: 'seba@alkewallet.com',
      accountNumber: 'CL93-0182-9921-0021'
    },
    contacts: [
      { id: 1, name: 'Camila Rojas', email: 'camila.rojas@gmail.com', bank: 'Banco Santander', account: '19.876.543-2' },
      { id: 2, name: 'Matías González', email: 'matias.g@empresa.com', bank: 'Banco de Chile', account: '18.432.190-5' },
      { id: 3, name: 'Valentina Soto', email: 'vale.soto@design.io', bank: 'Banco Estado', account: '20.111.450-8' },
      { id: 4, name: 'Lucas Benítez', email: 'lucas.b@fintech.net', bank: 'BCI', account: '17.654.321-0' },
      { id: 5, name: 'Francisca Morales', email: 'fran.morales@alkemy.org', bank: 'Banco Falabella', account: '19.002.341-9' }
    ],
    transactions: [
      {
        id: 'TX-9021',
        type: 'credit', // 'credit' = ingreso, 'debit' = egreso
        category: 'Depósito',
        title: 'Depósito bancario transferido',
        party: 'Cuenta Propia (Banco Santander)',
        amount: 500000,
        date: '2026-09-25 18:30',
        status: 'Completado'
      },
      {
        id: 'TX-9020',
        type: 'debit',
        category: 'Transferencia',
        title: 'Transferencia a Camila Rojas',
        party: 'Camila Rojas',
        amount: 45000,
        date: '2026-09-24 14:15',
        status: 'Completado'
      },
      {
        id: 'TX-9019',
        type: 'credit',
        category: 'Recepción',
        title: 'Pago recibido de Matías González',
        party: 'Matías González',
        amount: 120000,
        date: '2026-09-22 09:40',
        status: 'Completado'
      },
      {
        id: 'TX-9018',
        type: 'debit',
        category: 'Transferencia',
        title: 'Transferencia a Valentina Soto',
        party: 'Valentina Soto',
        amount: 85000,
        date: '2026-09-20 20:05',
        status: 'Completado'
      },
      {
        id: 'TX-9017',
        type: 'credit',
        category: 'Depósito',
        title: 'Abono de nómina mensual',
        party: 'Alkemy Tech SpA',
        amount: 875000,
        date: '2026-09-15 12:00',
        status: 'Completado'
      }
    ]
  };

  // Inicializar estado por primera vez si no existe
  function init() {
    if (!localStorage.getItem(STORAGE_KEYS.INITIALIZED)) {
      localStorage.setItem(STORAGE_KEYS.BALANCE, JSON.stringify(DEFAULT_DATA.balance));
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(DEFAULT_DATA.user));
      localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(DEFAULT_DATA.contacts));
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(DEFAULT_DATA.transactions));
      localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
    }
  }

  init();

  return {
    formatCurrency: function (num) {
      return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        maximumFractionDigits: 0
      }).format(num);
    },

    getBalance: function () {
      const b = localStorage.getItem(STORAGE_KEYS.BALANCE);
      return b ? JSON.parse(b) : DEFAULT_DATA.balance;
    },

    getUser: function () {
      const u = localStorage.getItem(STORAGE_KEYS.USER);
      return u ? JSON.parse(u) : DEFAULT_DATA.user;
    },

    login: function (email, password) {
      // Validación flexible para prueba y evaluación
      if (email && password && password.length >= 6) {
        sessionStorage.setItem('alke_auth_token', 'valid_session_token_' + Date.now());
        sessionStorage.setItem('alke_user_email', email);
        return { success: true };
      }
      return { success: false, message: 'La contraseña debe tener al menos 6 caracteres y el correo ser válido.' };
    },

    isAuthenticated: function () {
      return sessionStorage.getItem('alke_auth_token') !== null;
    },

    logout: function () {
      sessionStorage.removeItem('alke_auth_token');
      sessionStorage.removeItem('alke_user_email');
      window.location.href = 'login.html';
    },

    depositFunds: function (amount, method = 'Transferencia') {
      const currentBalance = this.getBalance();
      const numAmount = parseFloat(amount);
      if (isNaN(numAmount) || numAmount <= 0) {
        return { success: false, message: 'Ingrese un monto válido mayor a $0.' };
      }

      const newBalance = currentBalance + numAmount;
      localStorage.setItem(STORAGE_KEYS.BALANCE, JSON.stringify(newBalance));

      const newTx = {
        id: 'TX-' + Math.floor(1000 + Math.random() * 9000),
        type: 'credit',
        category: 'Depósito',
        title: `Depósito vía ${method}`,
        party: 'Fondo Propio / Banco',
        amount: numAmount,
        date: new Date().toLocaleString('es-CL', { dateStyle: 'short', timeStyle: 'short' }),
        status: 'Completado'
      };

      const txs = this.getTransactions();
      txs.unshift(newTx);
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(txs));

      return { success: true, newBalance, tx: newTx };
    },

    withdrawFunds: function (amount, targetAccount = 'Cuenta Bancaria Principal') {
      const currentBalance = this.getBalance();
      const numAmount = parseFloat(amount);
      if (isNaN(numAmount) || numAmount <= 0) {
        return { success: false, message: 'Ingrese un monto válido mayor a $0.' };
      }
      if (numAmount > currentBalance) {
        return { success: false, message: 'Saldo insuficiente para realizar el retiro.' };
      }

      const newBalance = currentBalance - numAmount;
      localStorage.setItem(STORAGE_KEYS.BALANCE, JSON.stringify(newBalance));

      const newTx = {
        id: 'TX-' + Math.floor(1000 + Math.random() * 9000),
        type: 'debit',
        category: 'Retiro',
        title: `Retiro de fondos hacia ${targetAccount}`,
        party: targetAccount,
        amount: numAmount,
        date: new Date().toLocaleString('es-CL', { dateStyle: 'short', timeStyle: 'short' }),
        status: 'Completado'
      };

      const txs = this.getTransactions();
      txs.unshift(newTx);
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(txs));

      return { success: true, newBalance, tx: newTx };
    },

    sendFunds: function (contactName, amount, message = '') {
      const currentBalance = this.getBalance();
      const numAmount = parseFloat(amount);
      if (isNaN(numAmount) || numAmount <= 0) {
        return { success: false, message: 'Por favor, ingrese un monto positivo válido.' };
      }
      if (numAmount > currentBalance) {
        return { success: false, message: 'Saldo insuficiente para realizar esta transferencia.' };
      }

      const newBalance = currentBalance - numAmount;
      localStorage.setItem(STORAGE_KEYS.BALANCE, JSON.stringify(newBalance));

      const newTx = {
        id: 'TX-' + Math.floor(1000 + Math.random() * 9000),
        type: 'debit',
        category: 'Transferencia',
        title: `Transferencia enviada a ${contactName}`,
        party: contactName,
        amount: numAmount,
        date: new Date().toLocaleString('es-CL', { dateStyle: 'short', timeStyle: 'short' }),
        status: 'Completado',
        note: message
      };

      const txs = this.getTransactions();
      txs.unshift(newTx);
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(txs));

      return { success: true, newBalance, tx: newTx };
    },

    getTransactions: function () {
      const tx = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      return tx ? JSON.parse(tx) : DEFAULT_DATA.transactions;
    },

    getContacts: function () {
      const c = localStorage.getItem(STORAGE_KEYS.CONTACTS);
      return c ? JSON.parse(c) : DEFAULT_DATA.contacts;
    },

    addContact: function (name, email, bank, account) {
      if (!name || !email) {
        return { success: false, message: 'El nombre y correo son obligatorios.' };
      }
      const contacts = this.getContacts();
      const newContact = {
        id: Date.now(),
        name: name.trim(),
        email: email.trim(),
        bank: bank ? bank.trim() : 'Banco General',
        account: account ? account.trim() : 'Cuenta Vista'
      };
      contacts.push(newContact);
      localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(contacts));
      return { success: true, contact: newContact };
    },

    resetToDemo: function () {
      localStorage.clear();
      init();
      window.location.reload();
    }
  };
})();
