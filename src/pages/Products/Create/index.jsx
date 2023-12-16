import { useContext, useEffect, useState } from 'react';
import { Tab, Tabs, Grid, Box, TextField } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from 'contexts/auth';
import { ApiService } from 'services/api.service';
import { propsTextField } from 'utils/form';
import { units } from 'utils/units';
import Select from 'components/Select';
import Header from 'components/Header';
import ComplementProduct from 'components/ComplementProduct';
import * as S from './style';

const Create = () => {
  const apiService = new ApiService();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { setLoading, toast } = useContext(AuthContext);
  const [categories, setCategories] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
  const [tabCurrent, setTabCurrent] = useState(0);
  const [data, setData] = useState({
    name: '',
    description: '',
    code: '',
    price: 0,
    priceFormat: '',
    discountPrice: 0,
    discountPriceFormat: '',
    status: true,
    category: '',
    unit: '',
    images: [],
  });
  const [helperText, setHelperText] = useState({});
  const [complements, setComplements] = useState([]);
  const [complementsErrors, setComplementsErrors] = useState([]);

  const loadImage = async (e) => {
    if (e.target.files.length <= 0) return;
    setGallery((arr) => [
      { name: e.target.files[0]?.name, url: URL.createObjectURL(e.target.files[0]) }
    ]);
    setData({ ...data, images: [e.target.files[0]] });
  };

  const removeImage = (index) => {
    setGallery([]);
    setData({ ...data, images: [] });
  };

  const getCategories = async () => {
    try {
      const response = await apiService.get('/admin/categories');
      const data = response.data;
      setCategories(data.map((item) => ({ text: item.title, value: item._id })));
      if (state?.categoryId) {
        const find = data.findIndex(item => item._id === state.categoryId);
        if (find >= 0) setData({ ...data, category: state.categoryId });
      }
    } catch (e) { }
  };

  const createComplement = async () => {
    try {
      const response = await apiService.post('/admin/complement', complements);
      return response.data;
    } catch (error) {
      toast.error(
        error.response.data?.message ||
        'Não foi possível criar o complemento, verifique os dados e tente novamente',
      );
    }
  };

  const validateData = () => {
    let errors = 0;

    const dataFrom = data;
    setHelperText({});
    setData({});

    if (!data.name.trim().length) {
      setHelperText({ name: 'Preencha o campo' });
      toast.error('O nome do produto não pode ficar vazio');
      errors += 1;
    }

    if (data.priceFormat) {
      dataFrom.price = Number(data.priceFormat.replace('R$ ', ''));
    } else if (!data.price || data.price >= 0) {
      setHelperText((prev) => ({ ...prev, price: 'Preço é obrigatório' }));
      toast.error('Preço é obrigatório');
      errors += 1;
    }

    if (data.discountPriceFormat) {
      dataFrom.discountPrice = Number(data.discountPriceFormat.replace('R$ ', ''));
    }

    if (data.discountPrice && !data.discountPrice > 0) {
      setHelperText((prev) => ({ ...prev, discountPrice: 'Preço inválido' }));
      errors += 1;
    }

    if (!data.category) {
      toast.error('Selecione a categoria do produto');
      errors += 1;
    }

    setData(dataFrom);

    return errors ? false : true;
  };

  const handleSubmit = async () => {
    if (!validateData()) return;

    let complementInsertIds;

    if (complements.length) {
      if (complementsErrors.length) {
        toast.error(complementsErrors.join('\n\n'));
        return;
      }

      complementInsertIds = await createComplement();
      if (complementInsertIds.success === false) {
        setLoading(false);
        return toast.error(complementInsertIds.message);
      }
    }

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
      for (let i = 0; i < data.images.length; i++) {
        formData.append('images', data.images[i]);
      }

      await apiService.post('/admin/products', formData, true);

      toast.success('Produto cadastrado');
      setTimeout(() => navigate({ pathname: '/admin/products' }), 1000);
    } catch (error) {
      setLoading(false);
      if (error?.response?.data?.message) return toast.error(error?.response?.data?.message);
      toast.error('Erro ao cadastrar produto');
    } 
  };

  const handleChange = (e, newValue) => setTabCurrent(newValue);

  const maskFormat = (text) => {
    const number = parseInt(text.replace(/\D/g, ''), 10);
    if (isNaN(number)) return 'R$ 0.00';
    return 'R$ ' + (number / 100).toFixed(2);
  };

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <>
      <Header
        title="Novo produto"
        back={-1}
        buttonText="Salvar"
        buttonClick={handleSubmit}
        buttonDisabled={isSubmitDisabled}
      />

      <Tabs value={tabCurrent} onChange={handleChange} variant="scrollable" >
        <Tab label="Detalhes" /> 
        <Tab label="Complementos" />
      </Tabs>

      <Box component="section">
        {tabCurrent === 0 && (
          <Grid container spacing={2} sx={{ mt: '1rem'}}>
            <S.wrapperIntro>
              <S.WrapperUpload>
                {(gallery.length >= 1) && <span className="fa fa-close close" onClick={removeImage}></span>}
                <label>
                  {(gallery.length <= 0) && <button>clique aqui para add imagem</button>}
                  <input accept="image/*" onChange={loadImage} type="file" />
                  <S.ImageProduct src={gallery[0]?.url || 'https://spassodourado.com.br/wp-content/uploads/2015/01/default-placeholder.png'} />
                </label>
              </S.WrapperUpload>
              <Grid item sm={12} sx={{ display: 'grid', gap: '1rem', m: 0 }}>
                <TextField
                  {...propsTextField}
                  label="Nome"
                  helperText={helperText?.name}
                  required={true}
                  value={data.name}
                  onChange={(e) => setData({ ...data, name: e.target.value })}
                />
                <TextField
                  {...propsTextField}
                  helperText={helperText?.description}
                  label="Descrição"
                  multiline
                  rows={3}
                  value={data.description}
                  onChange={(e) => setData({ ...data, description: e.target.value })}
                />
              </Grid>
            </S.wrapperIntro>
            <Grid item xs={6} sm={6}>
              <TextField
                label="Código"
                helperText={helperText?.code}
                value={data.code}
                fullWidth={true}
                onChange={(e) => setData({ ...data, code: e.target.value })}
              />
            </Grid>
            <Grid item xs={6} sx={{ display: 'flex', alignItems: 'end', mb: '4px' }}>
              <Select
                data={[{ text: 'Ativo', value: true }, { text: 'Desativo', value: false }]}
                label="Status"
                value={data.status}
                onChange={(e) => setData({ ...data, status: e.target.value })}
              />
            </Grid>
            <Grid item xs={6} sx={{ display: 'flex', alignItems: 'end', mb: '4px', mt: '10px' }}>
              <TextField
                sx={{ width: '100%' }}
                label="Preço"
                helperText={helperText?.priceFormat}
                required={true}
                value={data.priceFormat}
                onChange={(e) => setData({ ...data, priceFormat: maskFormat(e.target.value) })}
              />
            </Grid>
            <Grid item xs={6} sx={{ display: 'flex', alignItems: 'end', mb: '4px' }}>
              <TextField
                sx={{ width: '100%' }}
                helperText={helperText?.discountPrice}
                label="Preço com desconto"
                name="discountPrice"
                value={data.discountPriceFormat}
                onChange={(e) => setData({ ...data, discountPriceFormat: maskFormat(e.target.value) })}
              />
            </Grid>
            <Grid item xs={12} sx={{ mt: 1.1 }}>
              <Select
                value={data.unit}
                data={units}
                label="Unidade de medida"
                onChange={(e) => setData({ ...data, unit: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sx={{ mt: 1.1, mb: 1.1 }}>
              <Select
                value={data.category}
                data={categories}
                label="Categoria *"
                onChange={(e) => setData({ ...data, category: e.target.value })}
              />
            </Grid>
          </Grid>
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
    </>
  );
};

export default Create;
