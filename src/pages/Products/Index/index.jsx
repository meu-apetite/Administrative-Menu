import React, { useState, useEffect, useContext } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useNavigate } from 'react-router-dom';
import { Button, Pagination, Box, MenuItem, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Menu } from '@mui/material';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import { ApiService } from 'services/api.service';
import { GlobalContext } from 'contexts/Global';
import Header from 'components/Header';
import BackdropLoading from 'components/BackdropLoading';
import Filter from 'components/Filter';
import * as S from './style';


const filters = [
  {
    name: 'searchTerm',
    label: 'Buscar por produto',
    placeholder: 'Buscar produtos...',
    type: 'text'
  },  
  {
    name: 'status',
    label: 'Status',
    placeholder: 'Todos',
    type: 'select',
    options: [
      { value: true, label: 'Ativo' }, 
      { value: false, label: 'Inativo' }, 
    ]
  }
];

const Index = () => {
  const apiService = new ApiService();
  const navigate = useNavigate();
  const { toast, company } = useContext(GlobalContext);
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [filter, setFilter] = useState('');
  const [categories, setCategories] = useState([]);

  const getProducts = async () => {
    try {
      setLoading('Carregando...');

      let url = `/admin/products?page=1`;

      if (filter.status) {
        url += `&status=${encodeURIComponent(filter.status)}`;
      }

      if (filter.searchTerm) {
        url += `&search=${encodeURIComponent(filter.searchTerm)}`;
      }

      if (filter.category) {
        url += `&filterCategory=${encodeURIComponent(filter.category)}`;
      }

      const { data } = await apiService.get(url);

      setProducts(data.products);
      setTotalPages(data.totalPages);
      setPage(data.page);
      window.scrollTo(0, 0);
    } catch (error) {
      console.log(error);
      toast.error('Não foi possível obter os produtos');
    } finally {
      setLoading(null);
    }
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

  const getCategories = async () => {
    try {
      const response = await apiService.get('/admin/categories');
      setCategories(response.data);
    } catch (e) { }
  };

  const getFilters = async (filter) => setFilter(filter);

  useEffect(() => {
    getProducts();
  }, [filter]);

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <Box sx={{ height: 430, width: '100%' }}>
      <Header
        title="Produtos"
        buttonText="Novo produto"
        buttonClick={() => navigate('create')}
        back={-1}
      />

      <Filter
        filters={[
          ...filters,
          {
            name: 'category',
            label: 'Categoria',
            placeholder: 'Todas categoria',
            type: 'select',
            options: categories.map(item => 
              ({ value: item._id, label: item.title })
            )
          }
        ]}
        onApplyFilters={getFilters}
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
                      <MenuItem onClick={() => toDuplicate(item)}>
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
};

export default Index;