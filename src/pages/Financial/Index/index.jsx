import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Select,
  MenuItem,
  Grid,
  Button,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { ApiService } from 'services/api.service';
import { GlobalContext } from 'contexts/Global';
import Header from 'components/Header';
import BackdropLoading from 'components/BackdropLoading';

const Index = () => {
  const apiService = new ApiService();
  const { toast } = useContext(GlobalContext);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState('month');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [financialData, setFinancialData] = useState([]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const getFinancialData = async () => {
    try {
      setLoading('Buscando...');


      const response = await apiService.post('/admin/finance', { period: dateRange });

      const formattedData = response.data.ordersBriefInfo.map(item => ({
        ...item, 
        date: formatDate(item.date), 
        totalValue: parseFloat(item.totalValue).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      }));

      setFinancialData(formattedData);
    } catch (error) {
      console.error('Erro ao buscar dados financeiros:', error);
      toast.error('Erro ao buscar dados financeiros.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFinancialData();
  }, []);

  const handleDateRangeChange = (event) => {
    const value = event.target.value;
    setDateRange(value);
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'client', headerName: 'Cliente', width: 200 },
    { field: 'date', headerName: 'Data', width: 180 },
    { field: 'delivery', headerName: 'Entrega', width: 180 },
    { field: 'totalItems', headerName: 'Total Items', width: 150 },
    { field: 'totalValue', headerName: 'Valor Total', width: 150 },
  ];

  return (
    <Box>
      <Header title="Pedidos concluídos" />

      <Grid container spacing={2}>
        <Grid item xs={6} sm={6}>
          <Select 
            sx={{ height: '40px' }} 
            value={dateRange} 
            onChange={handleDateRangeChange} 
            fullWidth
          >
            <MenuItem value="all">Todos</MenuItem>
            <MenuItem value="day">Dia</MenuItem>
            <MenuItem value="week">Semana</MenuItem>
            <MenuItem value="month">Mês</MenuItem>
          </Select>
        </Grid>

        <Grid item xs={6} sm={6}>
          <Button 
            sx={{ height: '40px' }} 
            variant="contained" 
            onClick={getFinancialData}
          >
            Buscar
          </Button>
        </Grid>
      </Grid>

      <br />

      <div style={{ height: 400, width: '100%' }}>
        <DataGrid rows={financialData} columns={columns} pageSize={10} />
      </div>

      <BackdropLoading loading={loading} />
    </Box>
  );
};

export default Index;
