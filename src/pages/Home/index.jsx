import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import QRCode from 'react-qr-code';
import { Bar, } from 'react-chartjs-2';
import { ApiService } from 'services/api.service';
import { useEffect, useState } from 'react';
import { Box, CardMedia, Typography } from '@mui/material';
import Chart from 'chart.js/auto';
import * as S from './style';

const StyledCard = styled(Card)({ maxWidth: '100%', marginBottom: '20px' });
const ChartContainer = styled('div')({ width: '100%' });

export default function Home() {
  const apiService = new ApiService();

  const [barChartData, setBarChartData] = useState(null);
  const [doughnutChartData, setDoughnutChartData] = useState(null);

  const getOrders = async () => {
    try {
      const { data } = await apiService.get('/admin/orders-dashboard');

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
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(75,192,192,0.6)',
            hoverBorderColor: 'rgba(75,192,192,1)',
            data: quantities,
          },
        ],
      });
    } catch (error) {
      console.log(error);
    }
  };

  const processOrderData = async (orders) => {
    const response = await apiService.get('/admin/orders-all');
    const productCount = {};
  
    const productNames = response.data.reduce((acc, order) => {
      order.products.forEach((product) => {
        const productId = product.productId;
        const productName = product.productName; 
        acc[productId] = productName;
      });
      return acc;
    }, {});
  
    response.data.forEach((order) => {
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
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(75,192,192,0.4)',
        hoverBorderColor: 'rgba(75,192,192,1)',
        data,
      }],
    });
  };
  

  useEffect(() => {
    getOrders();
    processOrderData()
  }, []);

  return (
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
          <>
            <QRCode value={'http://192.168.0.136/cardapio/doces'} />
          </>
      </S.CardWelcome>

      <Typography variant="h6">Ultímos 30 dias</Typography>
      <S.SectionChart>
        <StyledCard>
        <CardHeader title={<Typography variant="h6">Pedidos</Typography>} />
          <CardContent>
            <ChartContainer sx={{ width: '100%' }}>
              {
                (barChartData !== null) && <Bar
                  data={barChartData}
                  options={{
                    scales: { x: { type: 'category' }, y: { beginAtZero: true, } },
                  }}
                />
              }
            </ChartContainer>
          </CardContent>
        </StyledCard>

        <StyledCard>
          <CardHeader title={<Typography variant="h6">Mais vendidos</Typography>} />
          <CardContent>
            <ChartContainer sx={{ width: '100%' }}>
              { (doughnutChartData !== null) && 
                <Bar data={doughnutChartData} options={{ indexAxis: 'y' }} />
              }
            </ChartContainer>
          </CardContent>
        </StyledCard>
      </S.SectionChart>
    </div>
  );
}
