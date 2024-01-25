import { useContext, useEffect, useState } from 'react';
import { Tab, Tabs, Box } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from 'contexts/auth';
import { ApiService } from 'services/api.service';
import Header from 'components/Header';
import ComplementProduct from 'components/ComplementProduct';
import ButtonFloat from 'components/ButtonFloat';
import FormProduct from 'components/FormProduct';
import BackdropLoading from 'components/BackdropLoading';

const Create = () => {
  const apiService = new ApiService();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { toast } = useContext(AuthContext);
  const [tabCurrent, setTabCurrent] = useState(0);
  const [dataInit, setDataInit] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [complements, setComplements] = useState([]);
  const [complementsErrors, setComplementsErrors] = useState([]);

  const validateData = () => {
    const errors = [];
    if (data?.images === undefined) errors.push('Imagem é obrigatório');
    if (data?.images?.length <= 0) errors.push('Imagem é obrigatório');
    if (!data?.name?.trim().length) errors.push('Nome é obrigatório');
    if (isNaN(Number(data?.price))) errors.push('Preço é obrigatório');
    if (!isNaN(Number(data?.price))) {
      if (data?.price <= 0) errors.push('Preço deve ser maior que zero');
    }
    if (data?.discountPrice && !data.discountPrice > 0) errors.push('Preço do desconto inválido');
      if (!data?.unit?.trim().length) errors.push('Unidade de medida é obrigatório');
    if (!data?.category) errors.push('Categoria é obrigatório');
    if (errors.length <= 0) return true;

    toast.error(errors.map(error => `• ${error}.`).join('\n'));
    return false;
  };

  const handleSubmit = async () => {
    if (!validateData()) return;
    if (complements.length >= 1) {
      if (complementsErrors.length >= 1) {
        return toast.error(complementsErrors.map(error => `• ${error}`).join('\n'));
      }
    
      const newComplements = complements
        .map(c => {
          if (!c || !c.options || c.options.length < 1) return {};
    
          c.options = c.options
            .map(option => {
              if (!option.price) option.price = 0;
              return option;
            })
            .filter(option => option.name && option.name.trim().length > 0);
    
          return c;
        })
        .filter(c => c.options && c.options.length > 0);
    
      console.log(newComplements);
    
      setComplements(newComplements);
    }

    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('description', data.description || '');
      formData.append('code', data.code || '');
      formData.append('price', data.price);
      formData.append('discountPrice', data.discountPrice);
      formData.append('isActive', typeof data.status === 'boolean' ? data.status : true );
      formData.append('category', data.category);
      formData.append('unit', data.unit);
      formData.append('images', data.images[0]);
      if (complements.length >= 1) {
        formData.append('complements', JSON.stringify(complements));
      }

      setLoading('Salvando dados...');
      await apiService.post('/admin/products', formData, true);

      toast.success('Produto cadastrado');
      setTimeout(() => navigate({ pathname: '/products' }), 700);
    } catch (e) {
      toast.error(e.response?.data?.message || 'Erro ao cadastrar produto');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e, v) => setTabCurrent(v);

  useEffect(() => {
    if (state?.product) {
      setDataInit({
        name: state.product.name,
        description: state.product.description || '',
        code: state.product.code || '',
        price: state.product.price?.toFixed(2) || 0,
        discountPrice: state.product.discountPrice?.toFixed(2) || 0,
        status: state.product.isActive,
        category: state.product.category._id,
        unit: state.product.unit,
        images: []
      });
      setComplements(state.product.complements);
    }
  }, []);

  return (
    <Box component="section">
      <Header title="Novo produto" back={-1} />

      <Tabs value={tabCurrent} onChange={handleChange} variant="scrollable" >
        <Tab label="Detalhes" />
        <Tab label="Complementos" />
      </Tabs>

      <Box component="section" sx={{ mb: '48px' }}>
        {tabCurrent === 0 && (
          (state?.duplicate)
            ? dataInit &&
            <FormProduct
              initialData={dataInit}
              getData={data => setData(data)}
            />
            : <FormProduct
              data={data}
              getData={data => setData(data)}
            />
        )}

        {tabCurrent === 1 && (
          <section style={{ marginTop: '1rem' }}>
            <ComplementProduct
              complementsValue={complements}
              getValue={(value, errors) => {
                setComplements(value);
                setComplementsErrors(errors);
              }}
            />
          </section>
        )}
      </Box>
      <ButtonFloat text="Salvar" onClick={() => handleSubmit()} />

      <BackdropLoading loading={loading} />
    </Box>
  );
};

export default Create;
