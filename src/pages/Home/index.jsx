import { useContext, useEffect, useState } from 'react';
import { Box, Typography, CardHeader, CardContent } from '@mui/material';
import QRCode from 'react-qr-code';
import { Bar } from 'react-chartjs-2';
import { ApiService } from 'services/api.service';
import { AuthContext } from 'contexts/auth';
import Chart from 'chart.js/auto';
import * as S from './style';
import StepperCompany from './StepperCompany';


const hexToRgba = (hex, alpha) => {
  hex = hex.replace(/^#/, '');
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  const clampedAlpha = Math.min(1, Math.max(0, alpha));
  const rgba = `rgba(${r}, ${g}, ${b}, ${clampedAlpha})`;
  return rgba;
};

const Home = () => {
  const { company } = useContext(AuthContext);
  const apiService = new ApiService();

  const [barChartData, setBarChartData] = useState(null);
  const [doughnutChartData, setDoughnutChartData] = useState(null);

  const getOrders = async () => {
    try {
      const { data } = await apiService.get('/admin/orders-dashboard');
      getDataOrders(data);
      getDataProducts(data);
    } catch (error) {
      console.log(error);
    }
  };

  const getDataOrders = (data) => {
    const ordersByDate = data.reduce((acc, order) => {
      const dateWithoutTime = new Date(order.date).toLocaleDateString();
      acc[dateWithoutTime] = (acc[dateWithoutTime] || 0) + order.products.length;
      return acc;
    }, {});
    const dates = Object.keys(ordersByDate);
    const quantities = Object.values(ordersByDate);

    setBarChartData({
      labels: dates,
      datasets: [
        {
          label: 'Quantidade de Pedidos',
          backgroundColor: hexToRgba(company.custom.colorSecondary, 0.6) || 'rgba(75,192,192,0.4)',
          borderColor: hexToRgba(company.custom.colorSecondary, 1) || 'rgba(75,192,192,1)',
          borderWidth: 1,
          hoverBackgroundColor: 'rgba(75,192,192,0.6)',
          hoverBorderColor: 'rgba(75,192,192,1)',
          data: quantities,
        },
      ],
    });
  };

  const getDataProducts = (orders) => {
    const productCount = {};

    const productNames = orders.reduce((acc, order) => {
      order.products.forEach((product) => {
        const productId = product.productId;
        const productName = product.productName;
        acc[productId] = productName;
      });
      return acc;
    }, {});

    orders.forEach((order) => {
      order.products.forEach((product) => {
        const productId = product.productId;
        const productName = productNames[productId];
        if (productCount[productName]) {
          productCount[productName] += product.quantity;
        } else {
          productCount[productName] = product.quantity;
        }
      });
    });

    const labels = Object.keys(productCount);
    const data = Object.values(productCount);

    setDoughnutChartData({
      labels,
      datasets: [{
        label: 'Quantidade Vendida',
        backgroundColor: hexToRgba(company.custom.colorSecondary, 0.6) || 'rgba(75,192,192,0.2)',
        borderColor: hexToRgba(company.custom.colorSecondary, 1) || 'rgba(75,192,192,1)',
        borderWidth: 1,
        hoverBackgroundColor: hexToRgba(company.custom.colorSecondary, 0.4) || 'rgba(75,192,192,0.4)',
        hoverBorderColor: hexToRgba(company.custom.colorSecondary, 1) || 'rgba(75,192,192,1)',
        data,
      }],
    });
  };

  useEffect(() => {
    getOrders();
  }, []);

  return (
    <>
      {company.online ? (
        <div>
          <S.CardWelcome>
            <CardContent sx={{ flex: '1 0 auto', p: 0 }}>
              <Typography component="div" variant="h5">Bem-vindo(a)!</Typography>
              <Typography variant="subtitle1" color="text.secondary" component="div">
                Este é o seu painel administrativo. Aqui, você pode adicionar e excluir
                produtos, gerenciar categorias e ajustar as configurações e aparência
                do seu cardápio. Aponte sua camêra para o qr para visitar seu cardapio.
              </Typography>
            </CardContent>
            <Box sx={{ border: ' 2px solid #fff', width: 'fit-content', m: 'auto' }}>
              <QRCode value={'https://meuapetite.com/' + company.storeUrl} />
            </Box>
          </S.CardWelcome>

          <Typography variant="h6">Ultímos 30 dias</Typography>
          <S.SectionChart>
            <S.StyledCard>
              <CardHeader title={<Typography variant="h6">Pedidos</Typography>} />
              <CardContent>
                <S.ChartContainer sx={{ width: '100%' }}>
                  {
                    (barChartData !== null) && <Bar
                      data={barChartData}
                      options={{
                        scales: { x: { type: 'category' }, y: { beginAtZero: true, } },
                      }}
                    />
                  }
                </S.ChartContainer>
              </CardContent>
            </S.StyledCard>

            <S.StyledCard>
              <CardHeader title={<Typography variant="h6">Mais vendidos</Typography>} />
              <CardContent>
                <S.ChartContainer sx={{ width: '100%' }}>
                  {(doughnutChartData !== null) &&
                    <Bar data={doughnutChartData} options={{ indexAxis: 'y' }} />
                  }
                </S.ChartContainer>
              </CardContent>
            </S.StyledCard>
          </S.SectionChart>
        </div>
      ) : (
        <StepperCompany company={company} />
      )}
    </>
  );
};

export default Home;