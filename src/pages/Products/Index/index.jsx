import { useState, useEffect, useContext } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useNavigate } from 'react-router-dom';
import { Button, Pagination, Box, MenuItem } from '@mui/material';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import { ApiService } from 'services/api.service';
import { AuthContext } from 'contexts/auth';
import Header from 'components/Header';
import Menu from '@mui/material/Menu';
import * as S from './style';
import ConfirmAction from 'components/ConfirmAction';

export default function Index() {
  const apiService = new ApiService();
  const navigate = useNavigate();
  const { setLoading, toast, company } = useContext(AuthContext);
  const [itemsSelect, setItemsSelect] = useState([]);
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(0);
  const [itemDelete, setItemDelete] = useState(null);

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

      setProducts(data.products?.reverse());
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

  const removeSelect = async () => {
    try {
      setLoading('Aguarde...');
      const response = await apiService.post(
        `/admin/products/delete-multiple`, { productIds: itemsSelect }
      );
      setProducts(response.data?.reverse());
      toast.success('Categorias excluidas');
    } catch (e) {
      toast.error('Não foi possível excuir os itens selecionados!');
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    try {
      setLoading('Aguarde...');
      const { data } = await apiService.delete(`/admin/products/${id}/${company._id}`);
      setProducts(data?.reverse());

      toast.success('Produto excluído!');
    } catch (e) {
      toast.error('Não foi possível excuir o produto!');
    } finally {
      setLoading(false);
    }
  };

  const toUpdate = (id) => navigate('/admin/products/update/' + id);

  const toDuplicate = (product) => {
    return navigate('/admin/products/create/', { state: { product, duplicate: true } });
  }

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
      {itemsSelect.length > 0 && (
        <Button
          variant="contained"
          color="error"
          sx={{ mb: 2 }}
          onClick={removeSelect}
        >
          Remover
        </Button>
      )}

      <S.ContainerProducts>
        {products.map((item, i) => {
          return (
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
                            setItemDelete(item._id);
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
                      <strong>Categoria: </strong>{item.category.title}
                    </span>
                    <span>
                      <strong>Status: </strong>{item.isActive ? 'Ativo' : 'Desativo'}
                    </span>
                  </S.CardInfo>
                  <S.CardMediaCustom image={item.images.length ? item.images[0].url : 1} />
                </S.CardContentCustom>
              </Box>
            </S.CardCustom>
          );
        })}
      </S.ContainerProducts>

      {products.length ? (
        <Pagination
          sx={{ display: 'flex', justifyContent: 'center', p: '32px' }}
          color="primary"
          count={totalPages}
          page={page}
          onChange={changePage}
        />
      ) : (
        <div style={{ textAlign: 'center' }}>
          Não há produtos cadastradas no momento. Para adicionar uma novo
          produto, clique em 'NOVO PRODUTO'.
        </div>
      )}

      <ConfirmAction
        open={!!itemDelete}
        confirm={async(isConfirm) => {
          if (isConfirm) await deleteProduct(itemDelete);
          itemDelete(false);
        }}
      />
    </Box>
  );
}
