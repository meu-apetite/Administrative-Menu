import React, { useState, useEffect } from 'react';
import { Button, Grid, Menu, Pagination } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import PopupState, { bindMenu, bindTrigger } from 'material-ui-popup-state';
import { Box, Typography, IconButton, Toolbar, AppBar, ListItem, Dialog, List, Slide } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { ApiService } from 'services/api.service';
import Header from 'components/Header';
import * as S from './style';

const Transition = React.forwardRef((props, ref) => {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function Index() {
  const apiService = new ApiService();
  const [orders, setOrders] = useState([]);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [totalPages, setTotalPages] = useState([]);
  const [page, setPage] = useState([]);
  const [modalView, setModalView] = useState(false);

  const modalViewOpen = (order) => {
    setCurrentOrder(order);
    setModalView(true);
  }

  const modalViewClose = () => setModalView(false);

  const getOrders = async () => {
    try {
      const { data } = await apiService.get('/admin/orders?page=1');
      setOrders(data.orders);
      setTotalPages(data.totalPages);
      setPage(data.page);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  return (
    <Box sx={{ height: 430, width: '100%' }}>
      <Header title="Pedidos" buttonText="Atualizar" />
      <S.ContainerProducts>
        {orders.map((item) => {
          return (
            <S.CardCustom>
              <S.WrapperAction>
                <PopupState variant="popover">
                  {(popupState) => (
                    <>
                      <Button {...bindTrigger(popupState)}>
                        Opções <KeyboardArrowDownIcon />
                      </Button>
                      <Menu {...bindMenu(popupState)}>
                        <S.MenuItemCuston onClick={() => {
                          modalViewOpen(item);
                          popupState.close();
                        }}>
                          <span className="fa fa-circle-info"></span> Ver detalhes
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
                      {/* {
                        (item?.status === 'awaiting-approval') && 'Aguardando aprovação'
                      } */}
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
                    <img src={item.imageUrl} />
                  </S.ProductInfo>
                ))}
              </List>
              <Typography variant="h6" style={{ marginTop: 20 }}>
                Total: {currentOrder?.total?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </Typography>
            </S.CustomPaper>
          </Dialog>
        )}
    </Box>
  );
}
