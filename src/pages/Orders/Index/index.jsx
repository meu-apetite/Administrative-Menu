import React, { useState, useEffect, useContext } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Button, Chip, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Input, Menu, MenuItem, Pagination, Select, TextField } from '@mui/material';
import { Box, Typography, IconButton, Toolbar, AppBar, ListItem, Dialog, List, Slide } from '@mui/material';
import PopupState, { bindMenu, bindTrigger } from 'material-ui-popup-state';
import { ApiService } from 'services/api.service';
import { orderStatus } from 'utils/orderStatus';
import { AuthContext } from 'contexts/auth';
import Header from 'components/Header';
import BackdropLoading from 'components/BackdropLoading';
import * as S from './style';

const Transition = React.forwardRef((props, ref) => {
  return <Slide direction="up" ref={ref} {...props} />;
});

const getStatusColor = (status) => {
  switch (status) {
    case 'OrderReceived':
      return '#2196F3';
    case 'Processing':
      return '#00BCD4';
    case 'WaitingForPaymentConfirmation':
      return '#FFC107';
    case 'Shipped':
      return '#4CAF50';
    case 'Concluded':
      return '#4CAF50';
    case 'Cancelled':
      return '#FF3D00';
    case 'WaitingForPickup':
      return '#00BCD4';
    default:
      return '#808080';
  }
};

export default function Index() {
  const apiService = new ApiService();
  const { toast } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [totalPages, setTotalPages] = useState([]);
  const [page, setPage] = useState([]);
  const [modalView, setModalView] = useState(false);
  const [modalChangeStatus, setModalChangeStatus] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('');
  const [categories, setCategories] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const modalViewOpen = (order) => {
    setCurrentOrder(order);
    setModalView(true);
  };

  const modalViewClose = () => setModalView(false);

  const modalChangeStatusOpen = (order) => {
    setCurrentOrder(order);
    setSelectedStatus(order.status.name);
    setModalChangeStatus(true);
  };

  const modalChangeStatusClose = () => setModalChangeStatus(false);

  const getOrders = async () => {
    try {
      setLoading('Carregando');

      const queryParams = new URLSearchParams();
  
      if (searchTerm) queryParams.append('searchTerm', searchTerm);
      if (filter) queryParams.append('filter', filter);
      if (startDate) queryParams.append('startDate', startDate);
      if (endDate) queryParams.append('endDate', endDate);
      if (selectedStatus) queryParams.append('selectedStatus', selectedStatus);
      if (categoryFilter) queryParams.append('categoryFilter', categoryFilter);
  
      const url = `/admin/orders?page=1&${queryParams.toString()}`;
      
      const { data } = await apiService.get(url);
      
      setOrders(data.orders);
      setTotalPages(data.totalPages);
      setPage(data.page);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const changeStatus = async () => {
    try {
      setLoading('Atualizando');
      const { data } = await apiService.put('/admin/orders', {
        orderId: currentOrder._id, status: selectedStatus
      });
      modalChangeStatusClose();
      getOrders();
      toast.success('Pedido atualizado!');
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  return (
    <Box sx={{ height: 430, width: '100%' }}>
      <Header title="Pedidos" buttonText="Atualizar" />

      <S.SearchContainer>
        <input
          type="text"
          placeholder="Busque por cliente ou número do pedido"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <S.CustomButton onClick={getOrders}>Buscar</S.CustomButton>
      </S.SearchContainer>

      <S.FilterContainer>
        <div style={{ display: 'flex' }}>
          <label>
            Data inicio <br />
            <input
              type="date"
              label="Data inicio"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </label>
          <label>
            Data fim <br />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </label>
        </div>
        <label>
          Status <br />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="">Todos</option>
            {orderStatus.map((status) => <option key={status.name} value={status.name}>{status.label}</option>)}
          </select>
        </label>
        <Button onClick={() => getOrders()} className="button">Filtrar</Button>
      </S.FilterContainer>



      <S.ContainerProducts>
        {orders.map((item) => {
          return (
            <S.CardCustom>
              <S.WrapperAction>
                <Chip
                  sx={{
                    maxWidth: '200px',
                    background: getStatusColor(item?.status?.name),
                    fontWeight: 600,
                    color: '#fff'
                  }}
                  label={item?.status?.label}
                  variant="filled"
                />

                <PopupState variant="popover">
                  {(popupState) => (
                    <>
                      <Button {...bindTrigger(popupState)}>Opções <KeyboardArrowDownIcon /></Button>

                      <Menu {...bindMenu(popupState)}>
                        <S.MenuItemCuston onClick={() => {
                          modalViewOpen(item);
                          popupState.close();
                        }}>
                          <span className="fa fa-circle-info"></span> Ver detalhes
                        </S.MenuItemCuston>
                        <S.MenuItemCuston onClick={() => {
                          modalChangeStatusOpen(item);
                          popupState.close();
                        }}>
                          <span className="fa fa-edit"></span> Alterar status
                        </S.MenuItemCuston>
                        <S.MenuItemCuston onClick={popupState.close}>
                          <span className="fa fa-file-pdf"></span> Baixar recibo
                        </S.MenuItemCuston>
                      </Menu>
                    </>
                  )}
                </PopupState>
              </S.WrapperAction>

              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <S.CardContentCustom sx={{ flex: '1 0 auto', pt: 0 }}>
                  <S.CardInfo>
                    <span style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span><strong>{item?.client?.name} -  #{item?.id}</strong></span>
                    </span>
                    <span>
                      <strong>Delivery: </strong>
                      {item.deliveryType === 'pickup' && 'Retirada'}
                      {item.deliveryType === 'delivery' && item.address.freeformAddress}
                    </span>
                    <span>
                      <strong>Data: </strong> {new Date(item.date).toLocaleString('pt-BR')}
                    </span>
                    <span style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>
                        <strong>Total: </strong>
                        {item.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </span>
                    </span>
                  </S.CardInfo>
                </S.CardContentCustom>
              </Box>
            </S.CardCustom>
          );
        })}
      </S.ContainerProducts>

      {orders.length ? (
        <Pagination
          sx={{ display: 'flex', justifyContent: 'center', p: '32px' }}
          color="primary"
          count={totalPages}
          page={page}
        // onChange={changePage}
        />
      ) : null}


      {!orders.length ? (
        <div style={{ textAlign: 'center' }}>
          Calmaria agora, agitação em breve. Seus pedidos estão a caminho,
          prontos para animar esta tela. Em breve, a movimentação começará!
        </div>
      ) : null}

      {
        currentOrder && (
          <Dialog fullScreen open={modalView} onClose={modalViewClose} TransitionComponent={Transition}>
            <AppBar sx={{ position: 'relative' }}>
              <Toolbar>
                <IconButton
                  edge="start"
                  color="inherit"
                  onClick={modalViewClose}
                  aria-label="close"
                >
                  <CloseIcon />
                </IconButton>
                <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                  Pedido #{currentOrder?.id}
                </Typography>
              </Toolbar>
            </AppBar>

            <S.CustomPaper>
              <Typography variant="h4" align="center" style={{ marginBottom: '16px' }}>
                Detalhes do pedido #{currentOrder?.id}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="h6">Informações do cliente:</Typography>
                  <Typography variant="body1">
                    Nome: {currentOrder?.client.name} <br />
                    Email: {currentOrder?.client.email} <br />
                    Telefone: {currentOrder?.client.phoneNumber}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  {currentOrder.deliveryType === 'delivery' ? (
                    <>
                      <Typography variant="h6">Endereço de entrega:</Typography>
                      <Typography variant="body1">
                        {currentOrder?.address?.street} <br />
                        {currentOrder?.address?.city}, {'BA'}, {'44400432'}
                      </Typography>
                    </>
                  ) : (
                    <Typography variant="h6">**Pedido para retirada**</Typography>
                  )}
                </Grid>
              </Grid>
              <Typography variant="h6" sx={{ mt: '20px', mb: '-16px' }}>Produtos:</Typography>
              <List>
                {currentOrder.products?.map((item, i) => (
                  <S.ProductInfo key={i}>
                    <div>
                      <ListItem sx={{ pt: '2px', pb: '2px', display: 'flex', flexWrap: 'wrap' }}>
                        Nome:&#160;<strong>{item.productName}</strong>
                      </ListItem>
                      <ListItem sx={{ pt: '2px', pb: '2px', display: 'flex', flexWrap: 'wrap' }}>
                        Complementos:&#160;
                        <strong>{item?.complements.map(c => c.name).join(', ')}</strong>
                      </ListItem>
                      <ListItem sx={{ pt: '2px', pb: '2px', display: 'flex', flexWrap: 'wrap' }}>
                        Quantidade:&#160;<strong>{item.quantity}</strong>
                      </ListItem>
                      <ListItem sx={{ pt: '2px', pb: '2px', display: 'flex', flexWrap: 'wrap' }}>
                        Valor:&#160;<strong>{item.priceTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong>
                      </ListItem>
                    </div>
                  </S.ProductInfo>
                ))}
              </List>
              <Typography variant="h6" style={{ marginTop: 20 }}>
                Total: {currentOrder?.total?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </Typography>
            </S.CustomPaper>
          </Dialog>
        )
      }

      <Dialog open={modalChangeStatus} onClose={modalChangeStatusClose}>
        <DialogTitle>Pedido #{currentOrder?.id}</DialogTitle>
        <DialogContent>
          <DialogContentText>Atualize o status do pedido para refletir a situação atual do mesmo.</DialogContentText>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6">Novo status:</Typography>
              <Select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                fullWidth
              >
                {orderStatus.map((status) => <MenuItem value={status.name}>{status.label}</MenuItem>)}
              </Select>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={modalChangeStatusClose}>Cancelar</Button>
          <Button onClick={changeStatus}>Confirmar</Button>
        </DialogActions>
      </Dialog>

      <BackdropLoading loading={loading} />
    </Box>
  );
}
