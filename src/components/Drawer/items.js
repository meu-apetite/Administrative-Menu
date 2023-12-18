const items = [
  [
    {
      text: 'Início',
      link: '/',
      Icon: () => <i className="fas fa-home"></i>,
    },

    {
      text: 'Categoria',
      link: '/categories',
      Icon: () => <i className="fas fa-tags"></i>,
    },

    {
      text: 'Produtos',
      link: '/products',
      Icon: () => <i className="fas fa-cube"></i>,
    },

    {
      text: 'Pedidos',
      link: '/orders',
      Icon: () => <i className="fas fa-shopping-cart"></i>,
    },

    {
      text: 'Formas de pagamento',
      link: '/payment-method',
      Icon: () => <i className="fas fa-money-bill"></i>
    },

    {
      text: 'Endereço',
      link: '/address',
      Icon: () => <i className="fas fa-map-location"></i>,
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
    
    {
      text: 'Sair',
      link: 'logout',
      Icon: () => <i className="fas fa-sign-out-alt"></i>,
    },
  ],
];

export default items;
