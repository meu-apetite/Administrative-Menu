import { useEffect, useState } from 'react';
import { FormControl, Grid, InputAdornment, InputLabel, OutlinedInput, TextField } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { ApiService } from 'services/api.service';
import { propsTextField } from 'utils/form';
import { units } from 'utils/units';
import Select from 'components/Select';
import imageDefault from 'assets/images/default-placeholder.png';
import * as S from './style';

const FormProduct = (props) => {
  const apiService = new ApiService();
  const { state } = useLocation();
  const [categories, setCategories] = useState([]);
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
  const [imageCurrent, setImageCurrent] = useState(null);

  const loadImage = async (e) => {
    if (e.target.files.length <= 0) return;
    setImageCurrent(URL.createObjectURL(e.target.files[0]));
    setData({ ...data, images: [e.target.files[0]] });
  };

  const removeImage = () => {
    setData({ ...data, images: [] });
    setImageCurrent(null);
  }

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

  const maskFormat = (data) => {
    const numericString = data.replace(/[^\d]/g, '');
    const number = parseFloat(numericString); 
    if (isNaN(number)) return '0.00';
    return (number / 100).toFixed(2);
  };

  useEffect(() => {
    getCategories();
    setData(props.initialData);
    setImageCurrent(props.initialData.images)
  }, []);
  
  useEffect(() => {
    props.getData(data);
  }, [data]);

  return (
    <Grid container spacing={2} sx={{ mt: '1rem' }}>
      <S.wrapperIntro>
        <S.WrapperUpload>
          {(data.images.length >= 1) 
            && <span className="fa fa-close close" onClick={removeImage}></span>
          }
          <label>
            {(data.images.length <= 0) && <button>clique aqui para add imagem</button>}
            <input accept="image/*" onChange={loadImage} type="file" />
            <S.ImageProduct src={imageCurrent || imageDefault} />
          </label>
        </S.WrapperUpload>
        <Grid item sm={12} sx={{ display: 'grid', gap: '1rem', m: 0 }}>
          <TextField
            {...propsTextField}
            label="Nome"
            required={true}
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
          />
          <TextField
            {...propsTextField}
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
         <FormControl fullWidth>
          <InputLabel>Preço</InputLabel>
          <OutlinedInput
            startAdornment={<InputAdornment position="start">R$</InputAdornment>}
            label="Preço"
            value={data.price}
            onChange={(e) => {
              setData({ ...data, price: maskFormat(e.target.value) });
            }}
          />
        </FormControl>
      </Grid>
      <Grid item xs={6} sx={{ display: 'flex', alignItems: 'end', mb: '4px' }}>
        <FormControl fullWidth>
          <InputLabel>Preço com desconto</InputLabel>
          <OutlinedInput
            startAdornment={<InputAdornment position="start">R$</InputAdornment>}
            label="Preço com desconto"
            value={data.discountPrice}
            onChange={(e) => {
              setData({ ...data, discountPrice: maskFormat(e.target.value) });
            }}
          />
        </FormControl>
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
  );
};

export default FormProduct;
