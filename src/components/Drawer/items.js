const items = [
  [
    {
      text: 'Início',
      link: '/admin',
      Icon: () => <i className="fas fa-home"></i>,
    },

    {
      text: 'Categoria',
      link: '/admin/categories',
      Icon: () => <i className="fas fa-tags"></i>,
    },

    {
      text: 'Produtos',
      link: '/admin/products',
      Icon: () => <i className="fas fa-cube"></i>,
    },

    {
      text: 'Pedidos',
      link: '/admin/orders',
      Icon: () => <i className="fas fa-shopping-cart"></i>,
    },

    {
      text: 'Formas de pagamento',
      link: '/admin/payment-method',
      Icon: () => <i className="fas fa-money-bill"></i>
    },

    {
      text: 'Endereço',
      link: '/admin/address',
      Icon: () => <i className="fas fa-map-location"></i>,
    },

    {
      text: 'Aparência',
      link: '/admin/appearance',
      Icon: () => <i className="fas fa-paint-brush"></i>,
    },

    {
      text: 'Configurações',
      link: '/admin/settings',
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
