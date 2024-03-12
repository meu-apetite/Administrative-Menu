import { useContext, useEffect, useState } from 'react';
import { Box, Typography, CardHeader, CardContent } from '@mui/material';
import QRCode from 'react-qr-code';
import Chart from 'chart.js/auto';
import { Bar } from 'react-chartjs-2';
import { ApiService } from 'services/api.service';
import { GlobalContext } from 'contexts/Global';
import { ApplicationUtils } from 'utils/ApplicationUtils';
import StepperCompany from './StepperCompany';
import * as S from './style';


const Home = () => {
  const { company } = useContext(GlobalContext);
  const apiService = new ApiService();
  const [barChartData, setBarChartData] = useState(null);
  const [doughnutChartData, setDoughnutChartData] = useState(null);

  const getOrdersDashboard = async () => {
    try {
      const { data } = await apiService.get('/admin/dashboard/orders');
      setBarChartData({
        labels: data.map(item => ApplicationUtils.formatDate(item.date, false, false)),
        datasets: [
          {
            label: 'Quantidade de Pedidos',
            backgroundColor: ApplicationUtils.convertHexToRgba(
              company.custom.colorSecondary, 0.6
            ) || 'rgba(75,192,192,0.4)',
            borderColor: ApplicationUtils.convertHexToRgba(
              company.custom.colorSecondary, 1
            ) || 'rgba(75,192,192,1)',
            borderWidth: 1,
            hoverBackgroundColor: ApplicationUtils.convertHexToRgba(
              company.custom.colorSecondary, 0.4
            ) || 'rgba(75,192,192,0.4)',
              hoverBorderColor: ApplicationUtils.convertHexToRgba(
              company.custom.colorSecondary, 1
            ) || 'rgba(75,192,192,1)',
            data: data.map(item => item.quantity),
          },
        ],
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getTopSellingProducts = async () => {
    try {
      const { data } = await apiService.get('/admin/dashboard/products-topselling');

      setDoughnutChartData({
        labels: data.map(item => item.productName),
        datasets: [{
          label: 'Quant. Vendida',
          backgroundColor: ApplicationUtils.convertHexToRgba(
            company.custom.colorSecondary, 0.6
          ) || 'rgba(75,192,192,0.2)',
          borderColor: ApplicationUtils.convertHexToRgba(
            company.custom.colorSecondary, 1
          ) || 'rgba(75,192,192,1)',
          borderWidth: 1,
          hoverBackgroundColor: ApplicationUtils.convertHexToRgba(
          company.custom.colorSecondary, 0.4
          ) || 'rgba(75,192,192,0.4)',
          hoverBorderColor: ApplicationUtils.convertHexToRgba(
          company.custom.colorSecondary, 1
          ) || 'rgba(75,192,192,1)',
          data: data.map(item => item.quantity),
        }],
      });
    } catch {

    }
  };

  useEffect(() => {
    getOrdersDashboard();
    getTopSellingProducts();
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

          <Box>
            <Typography variant="h6">Últimos 7 dias</Typography>
          </Box>

          <S.SectionChart>
            <S.StyledCard>
              <CardHeader title={<Typography variant="h6">Novos pedidos</Typography>} />
              <CardContent>
                <S.ChartContainer sx={{ width: '100%' }}>
                  {
                    (barChartData !== null) && <Bar
                      data={barChartData}
                      options={{
                        scales: { 
                          x: { type: 'category' }, 
                          y: {
                            beginAtZero: true,
                            ticks: {
                              callback: function (value) {
                                if (Number.isInteger(value)) return value;
                              }
                            }
                          }
                        },
                      }}
                    />
                  }
                </S.ChartContainer>
              </CardContent>
            </S.StyledCard>

            <S.StyledCard>
              <CardHeader title={<Typography variant="h6">Itens mais vendidos</Typography>} />
              <CardContent>
                <S.ChartContainer sx={{ width: '100%' }}>
                  {(doughnutChartData !== null) &&
                    <Bar 
                      data={doughnutChartData} 
                      options={{ 
                        indexAxis: 'y',  
                        scales: { 
                          x: { 
                            precision: 0,
                            ticks: {
                              callback: function (value) {
                                if (Number.isInteger(value)) return value;
                              }
                            }
                          },
                        } 
                      }} 
                    />
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