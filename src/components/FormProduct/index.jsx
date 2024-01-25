import React, { useEffect, useState } from 'react';
import { FormControl, Grid, InputAdornment, InputLabel, MenuItem, OutlinedInput, TextField } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { ApiService } from 'services/api.service';
import { propsTextField } from 'utils/form';
import { units } from 'utils/units';
import Select from '@mui/material/Select';
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
    props.getData({ ...data, images: [e.target.files[0]] });
  };

  const removeImage = () => {
    setData({ ...data, images: [] });
    setImageCurrent(null);
  };

  const getCategories = async () => {
    try {
      const response = await apiService.get('/admin/categories');
      setCategories(response.data);
    } catch (e) {}
  };

  const maskFormat = (data) => {
    const numericString = data.replace(/[^\d]/g, '');
    const number = parseFloat(numericString);
    if (isNaN(number)) return '0.00';
    return (number / 100).toFixed(2);
  };

  const handleInputChange = (fieldName, value) => {
    setData((prevData) => {
      const newData = { ...prevData, [fieldName]: value };
      return newData;
    });
    props.getData({ ...data, [fieldName]: value })
  };
  
  useEffect(() => {
    getCategories();
    
    if (props?.data?.images?.[0] instanceof File) {
      setImageCurrent(URL.createObjectURL(props.data.images[0]));
    } else if(props?.data?.images?.[0]) {
      setImageCurrent(props.data.images[0]);
    }

    const category = state?.categoryId || props.data?.category || '';
    setData({ ...props.data, category });
  }, []);

  return (
    <Grid container spacing={2} sx={{ mt: '1rem' }}>
      <S.wrapperIntro>
        <S.WrapperUpload>
          {data?.images?.length >= 1 && (
            <span className="fa fa-close close" onClick={removeImage}></span>
          )}
          <label>
            {!imageCurrent && <button>clique aqui para add imagem</button>}
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
            onChange={(e) => handleInputChange('name', e.target.value)}
          />
          <TextField
            {...propsTextField}
            label="Descrição"
            multiline
            rows={3}
            value={data.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
          />
        </Grid>
      </S.wrapperIntro>
      <Grid item xs={6} sm={6}>
        <TextField
          label="Código"
          value={data.code}
          fullWidth={true}
          onChange={(e) => handleInputChange('code', e.target.value)}
        />
      </Grid>

      <Grid item xs={6} sx={{ display: 'flex', alignItems: 'end', mb: '4px' }}>
        <FormControl sx={{ width: '100%' }}>
          <InputLabel id="status">Status</InputLabel>
          <Select
            labelId="status"
            value={data.status}
            onChange={(e) => handleInputChange('status', e.target.value)}
            label="Status"
            fullWidth
          >
            <MenuItem value={true}>Ativo</MenuItem>
            <MenuItem value={false}>Desativo</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={6} sx={{ display: 'flex', alignItems: 'end', mb: '4px', mt: '10px' }}>
        <FormControl fullWidth>
          <InputLabel>Preço</InputLabel>
          <OutlinedInput
            startAdornment={<InputAdornment position="start">R$</InputAdornment>}
            label="Preço"
            value={data.price}
            onChange={(e) => handleInputChange('price', maskFormat(e.target.value))}
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
            onChange={(e) =>
              handleInputChange('discountPrice', maskFormat(e.target.value))
            }
          />
        </FormControl>
      </Grid>

      <Grid item xs={12} sx={{ mt: 1.1 }}>
        <FormControl sx={{ width: '100%' }}>
          <InputLabel id="unit">Unidade de medida</InputLabel>
          <Select
            labelId="unit"
            value={data.unit}
            onChange={(e) => handleInputChange('unit', e.target.value)}
            label="Unidade de medida"
            fullWidth
          >
            {units?.map((u) => (
              <MenuItem key={u.value} value={u.value}>
                {u.text}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12} sx={{ mt: 1.1, mb: 1.1 }}>
        <FormControl sx={{ width: '100%' }}>
          <InputLabel id="category">Categoria</InputLabel>
          <Select
            labelId="category"
            value={data.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            label="Categoria"
            fullWidth
          >
            {categories?.map((c) => (
              <MenuItem key={c._id} value={c._id}>
                {c.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
};

export default FormProduct;
