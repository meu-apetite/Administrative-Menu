export const menuItems = [
  {
    category: 'Navegação',
    items: [
      {
        text: 'Início',
        link: '/home',
        Icon: () => <i className="fas fa-home"></i>,
      }
    ]
  },

  {
    category: 'Gerenciar cardápio',
    items: [
      {
        text: 'Categoria',
        link: '/categories',
        Icon: () => <i className="fas fa-tags"></i>,
      },
      {
        text: 'Produtos',
        link: '/products',
        Icon: () => <i className="fas fa-box"></i>,  // Ícone de caixa como alternativa
      },
    ],
  },

  {
    category: 'Dados de pedidos e financeiro',
    items: [
      {
        text: 'Pedidos',
        link: '/orders',
        Icon: () => <i className="fas fa-list"></i>,
      },
      {
        text: 'Financeiro',
        link: '/financial',
        Icon: () => <i className="fas fa-money-bill-wave"></i>, 
      },
    ],
  },

  {
    category: 'Ajustes e aparência',
    items: [
      {
        text: 'Formas de pagamento',
        link: '/payment-method',
        Icon: () => <i className="fas fa-credit-card"></i>,  
      },
      {
        text: 'Endereço',
        link: '/address',
        Icon: () => <i className="fas fa-map-marker-alt"></i>, 
      },
      {
        text: 'Aparência',
        link: '/appearance',
        Icon: () => <i className="fas fa-paint-brush"></i>, 
      },
      {
        text: 'Configurações',
        link: '/settings',
        Icon: () => <i className="fas fa-cog"></i>,  
      },
    ],
  },
];
