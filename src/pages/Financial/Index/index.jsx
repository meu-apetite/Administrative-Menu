import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Select,
  MenuItem,
  Grid,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { ApiService } from 'services/api.service';
import { AuthContext } from 'contexts/auth';
import Header from 'components/Header';
import BackdropLoading from 'components/BackdropLoading';

const Index = () => {
  const apiService = new ApiService();
  const { toast } = useContext(AuthContext);
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
      setLoading(true);

      let params = { dateRange };

      if (dateRange === 'custom') params = { dateRange, customStartDate, customEndDate };

      const response = await apiService.get('/admin/finance', { params });

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
    { field: 'totalItems', headerName: 'Total Items', width: 150 },
    { field: 'totalValue', headerName: 'Valor Total', width: 150 },
  ];

  return (
    <Box>
      <Header title="Financeiro" buttonText="Atualizar" />

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Select value={dateRange} onChange={handleDateRangeChange} fullWidth>
            <MenuItem value="all">Todos</MenuItem>
            <MenuItem value="day">Dia</MenuItem>
            <MenuItem value="week">Semana</MenuItem>
            <MenuItem value="month">Mês</MenuItem>
            <MenuItem value="custom">Personalizado</MenuItem>
          </Select>
        </Grid>

        {dateRange === 'custom' && (
          <Grid item xs={12} sm={6}>
            {/* Add your custom date range components here */}
          </Grid>
        )}
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
