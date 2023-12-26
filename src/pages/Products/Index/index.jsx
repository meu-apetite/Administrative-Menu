import React, { useState, useEffect, useContext } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useNavigate } from 'react-router-dom';
import { Button, Pagination, Box, MenuItem, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Typography } from '@mui/material';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import { ApiService } from 'services/api.service';
import { AuthContext } from 'contexts/auth';
import Header from 'components/Header';
import Menu from '@mui/material/Menu';
import BackdropLoading from 'components/BackdropLoading';
import * as S from './style';

export default function Index() {
  const apiService = new ApiService();
  const navigate = useNavigate();
  const { toast, company } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const getProducts = async () => {
    const { data } = await apiService.get(`/admin/products?page=1`);
    setProducts(data.products?.reverse());
    setTotalPages(data.totalPages);
    setPage(data.page);
  };

  const changePage = async (e, value) => {
    try {
      setLoading('Carregando...');
      const { data } = await apiService.get(`/admin/products?page=${value}`);

      setProducts(data.products);
      setTotalPages(data.totalPages);
      setPage(data.page);
      window.scrollTo(0, 0);
    } catch (error) {
      console.log(error);
      toast.error('Não foi possível mudar de página');
    } finally {
      setLoading(null);
    }
  };

  const deleteProduct = async (id) => {
    handleCloseConfirm();
    try {
      setLoading('Aguarde...');
      const { data } = await apiService.delete(`/admin/products/${id}/${company._id}/${page}`);
      setProducts(data.products);
      toast.success('Produto excluído!');
    } catch (e) {
      toast.error('Não foi possível excluir o produto!');
    } finally {
      setLoading(false);
    }
  };

  const handleClickOpenConfirm = (id) => {
    setItemToDelete(id);
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setItemToDelete(null);
    setOpenConfirm(false);
  };

  const toUpdate = (id) => navigate('/products/update/' + id);

  const toDuplicate = (product) => {
    return navigate('/products/create/', { state: { product, duplicate: true } });
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <Box sx={{ height: 430, width: '100%' }}>
      <Header
        title="Produtos"
        buttonText="Novo produto"
        buttonClick={() => navigate('create')}
        back={-1}
      />

      <S.ContainerProducts>
        {products.map((item, i) => (
          <S.CardCustom key={'index-' + i}>
            <S.WrapperActions>
              <PopupState variant="popover">
                {(popupState) => (
                  <>
                    <Button {...bindTrigger(popupState)}>
                      Opções <KeyboardArrowDownIcon />
                    </Button>
                    <Menu {...bindMenu(popupState)}>
                      <MenuItem onClick={() => toUpdate(item._id)}>
                        <span className="fa fa-edit"></span>
                        &#160;&#160;&#160;Editar
                      </MenuItem>
                      <MenuItem onClick={() => {
                        toDuplicate(item);
                        popupState.close();
                      }}>
                        <span className="fa fa-copy"></span> 
                        &#160;&#160;&#160;Duplicar
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          handleClickOpenConfirm(item._id);
                          popupState.close();
                        }}
                      >
                        <span className="fa fa-remove"></span> 
                        &#160;&#160;&#160;&#160;Excluir
                      </MenuItem>
                    </Menu>
                  </>
                )}
              </PopupState>
            </S.WrapperActions>

            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <S.CardContentCustom sx={{ flex: '1 0 auto', pt: 0 }}>
                <S.CardInfo>
                  <span>
                    <strong>Nome: </strong>{item.name}
                  </span>
                  <span>
                    <strong>Preço: </strong>
                    {item.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                  <span>
                    <strong>Categoria: </strong>{item.category?.title}
                  </span>
                  <span>
                    <strong>Status: </strong>{item.isActive ? 'Ativo' : 'Desativo'}
                  </span>
                </S.CardInfo>
                <S.CardMediaCustom image={item.images.length ? item.images[0].url : 1} />
              </S.CardContentCustom>
            </Box>
          </S.CardCustom>
        ))}
      </S.ContainerProducts>

      {products.length > 0 &&
        <Pagination
          sx={{ display: 'flex', justifyContent: 'center', p: '32px' }}
          color="primary"
          count={totalPages}
          page={page}
          onChange={changePage}
        />
      }

      {products.length === 0 &&
        <div style={{ textAlign: 'center' }}>
          Não há produtos cadastradas no momento. Para adicionar uma novo
          produto, clique em 'NOVO PRODUTO'.
        </div>
      }

      <Dialog open={openConfirm} onClose={handleCloseConfirm}>
        <DialogTitle>{"Deseja excluir o produto?"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Essa ação não pode ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirm}>Cancelar</Button>
          <Button onClick={() => deleteProduct(itemToDelete)} autoFocus>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      <BackdropLoading loading={loading} />
    </Box>
  );
}
