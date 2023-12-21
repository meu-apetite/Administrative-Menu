import { useContext, useEffect, useState } from 'react';
import { Tab, Tabs, Box } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from 'contexts/auth';
import { ApiService } from 'services/api.service';
import Header from 'components/Header';
import ComplementProduct from 'components/ComplementProduct';
import ButtonFloat from 'components/ButtonFloat';
import FormProduct from 'components/FormProduct';

const Create = () => {
  const apiService = new ApiService();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { setLoading, toast } = useContext(AuthContext);
  const [tabCurrent, setTabCurrent] = useState(0);
  const [dataInit, setDataInit] = useState(null);
  const [data, setData] = useState({
    name: '',
    description: '',
    code: '',
    price: 0,
    discountPrice: 0,
    status: true,
    category: '',
    unit: '',
    images: [],
  });
  const [complements, setComplements] = useState([]);
  const [complementsErrors, setComplementsErrors] = useState([]);

  const createComplement = async () => {
    try {
      const response = await apiService.post('/admin/complement', complements);
      return response.data;
    } catch (error) {
      toast.error(
        error.response.data?.message ||
        'Não foi possível criar o complemento do produto',
      );
    }
  };

  const validateData = () => {
    let errors = 0;
    const dataForm = data;
    setData({});

    if (!data.name.trim().length) {
      toast.error('O nome do produto não pode ficar vazio');
      errors += 1;
    }
    if (isNaN(Number(data.price))) {
      toast.error('Preço é obrigatório');
      errors += 1;
    } else {
      Number(data.price) <= 0 
        ? toast.error('Preço é deve ser maior que zero')
        : dataForm.price = Number(data.price);
    }
    if (data.discountPriceFormat) {
      dataForm.discountPrice = Number(data.discountPrice);
    }
    if (data.discountPrice && !data.discountPrice > 0) {
      toast.error('Preço do desconto inválido');
      errors += 1;
    }
    if (!data.category) {
      toast.error('Selecione a categoria do produto');
      errors += 1;
    }

    setData(dataForm);
    return errors ? false : true;
  };

  const handleSubmit = async () => {
    if (!validateData()) return;

    let complementInsertIds;

    if (complements.length) {
      if (complementsErrors.length) return toast.error(complementsErrors.join('\n\n'));
      complementInsertIds = await createComplement();
      if (complementInsertIds.success === false) {
        setLoading(false);
        return toast.error(complementInsertIds.message);
      }
    }

    console.log(complementInsertIds)

    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('description', data.description);
      formData.append('code', data.code);
      formData.append('price', data.price);
      formData.append('discountPrice', data.discountPrice);
      formData.append('isActive', data.status);
      formData.append('category', data.category);
      formData.append('unit', data.unit);
      if (complementInsertIds) formData.append('complements', JSON.stringify(complementInsertIds));
      formData.append('images', data.images[0]);

      setLoading('Salvando dados...');
      await apiService.post('/admin/products', formData, true);

      toast.success('Produto cadastrado');
      setTimeout(() => navigate({ pathname: '/products' }), 700);
    } catch (error) {
      toast.error(error.response.data?.message || 'Erro ao cadastrar produto');
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
      console.log(state.product)
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
            ? dataInit && <FormProduct initialData={dataInit} getData={data => setData(data)} />
            : <FormProduct initialData={data} getData={data => setData(data)} />
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
    </Box>
  );
};

export default Create;
