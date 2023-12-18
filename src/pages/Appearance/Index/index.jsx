import React, { useContext, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import ButtonUpload from 'components/ButtonUpload';
import Gallery from 'components/Gallery';
import Header from 'components/Header';
import { ApiService } from 'services/api.service';
import { Button, MenuItem } from '@mui/material';
import { AuthContext } from 'contexts/auth';
import { colorOptions } from 'utils/colorsOptions';
import ButtonFloat from 'components/ButtonFloat';
import { SketchPicker } from 'react-color';


const colors = [
  '#2C3E50', '#34495E', '#7F8C8D', '#1F618D', '#8E44AD',
  '#2E4053', '#5D6D7E', '#4A235A', '#515A5A', '#3498DB'
];

const Create = () => {
  const apiService = new ApiService();
  const { toast, setLoading } = useContext(AuthContext);
  const [logo, setLogo] = useState();
  const [gallery, setGallery] = useState([]);
  const [data, setData] = useState({
    fantasyName: '',
    slogan: '',
    description: '',
    custom: { googleMapUrl: '' }
  });
  const [color, setColor] = useState('#000000'); // Cor padrão inicial
  const [displayColorPicker, setDisplayColorPicker] = useState(false);

  const handleClose = () => setDisplayColorPicker(false);

  const handleChange = (newColor) => setColor(newColor.hex);

  const formSubmit = async (e) => {
    e.preventDefault();
    setLoading('Agurade...');

    try {
      const formData = data;
      formData.custom.gallery = gallery;
      formData.custom.logo = logo;

      const response = await apiService.put('/admin/company', formData);
      setData(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(null);
    }
  };

  const loadImageGallery = async (e) => {
    const formData = new FormData();
    formData.append('image', e.target.files[0]);
    apiService.post('/admin/company/gallery', formData, true)
      .then(res => {
        setGallery([]);

        const newGallery = [...res.data];

        newGallery.forEach((item) => {
          setGallery(prev => [...prev, { url: item.url, id: item.id }]);
        });

        toast.success('Galeria atualizada');
      })
      .catch((error) => toast.error('Não foi possível atualizar'));
  };

  const removeImageGallery = async (index) => {
    try {
      const response = await apiService.delete('/admin/company/gallery/' + encodeURIComponent(gallery[index].id));
      const newGallery = response.data;

      setGallery([]);

      newGallery.forEach((item) => setGallery(prev => [...prev, {
        title: '', url: item.url, id: item.id
      }])
      );

      toast.success('Imagem removida');
    } catch (e) {
      console.log(e);
      toast.error('Não foi possível remover a foto.');
    }
  };

  const updateLogo = async (e) => {
    const formData = new FormData();
    formData.append('logo', e.target.files[0]);

    apiService.post('/admin/company/logo', formData, true)
      .then(res => {
        console.log(res);
        setLogo({ title: 'Logo', url: res.data.url, id: res.data.id });
        toast.success('Logo atualizada');
      })
      .catch((error) => console.log(error));
  };

  const removeLogo = async () => {
    apiService.delete('/admin/company/logo/' + encodeURIComponent(logo.id)).then(_ => {
      setLogo(null);
      toast.success('Logo removida');
    })
      .catch((error) => toast.error('Não foi possível remover o logo'));
  };

  const getData = async (id) => {
    const response = await apiService.get('/admin/company/');
    const data = response.data;

    setData({
      ...data,
      fantasyName: data.fantasyName || '',
      slogan: data.slogan || '',
      description: data.description || '',
      custom: { ...data.custom, googleMapUrl: data.custom.googleMapUrl || '' }
    });

    setGallery([]);

    if (data.custom.logo) {
      setLogo({
        title: 'Logo',
        url: data.custom.logo.url,
        id: data.custom.logo.id
      });

      delete data.custom.logo;
    }

    if (data.custom.gallery) {
      const gallery = data.custom.gallery;
      gallery.forEach((item) => {
        setGallery(prev => [...prev, { url: item.url, id: item.id }]);
      });

      delete data.custom.gallery;
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const [selectedColor, setSelectedColor] = useState('');

  const handleColorChange = (event) => {
    setSelectedColor(event.target.value);
  };

  return (
    <>
      <Header title="Aparência" back={-1} />

      <Box component="section" noValidate>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12}>
            <TextField
              label="Nome fantasia"
              value={data.fantasyName}
              onChange={(e) => setData({ ...data, fantasyName: e.target.value })}
              InputLabelProps={{ shrink: true }}
              margin="dense"
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <TextField
              label="Slogan"
              value={data.slogan}
              onChange={(e) => setData({ ...data, slogan: e.target.value })}
              InputLabelProps={{ shrink: true }}
              margin="dense"
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <TextField
              label="Sobre nós"
              value={data.description}
              onChange={(e) => setData({ ...data, description: e.target.value })}
              InputLabelProps={{ shrink: true }}
              rows={3}
              margin="dense"
              multiline
              fullWidth
              required
            />
          </Grid>
          <>
            <Grid item xs={12} sm={12}>
          
            </Grid>
           
            <Grid item xs={6} sm={6}>
      <div style={{ position: 'relative' }}>
        <TextField
          type="text"
          label="Cor tema secundária"
          value={color}
          // onClick={handleClick}
          sx={{ width: '100%' }}
        />
        {displayColorPicker && (
          <div style={{ position: 'absolute', zIndex: '2' }}>
            <div onClick={handleClose} style={{ position: 'fixed', top: '0', right: '0', bottom: '0', left: '0' }} />
            <SketchPicker color={color} onChange={handleChange} />
          </div>
        )}
      </div>
    </Grid>

          </>
          <Grid item xs={12} sm={12}>
            <label>Logomarca</label>
            <Gallery data={logo ? [logo] : []} closeImage={removeLogo} />
            {!logo && <ButtonUpload text="Adicionar logo" loadFile={updateLogo} />}
          </Grid>
        </Grid>
      </Box>

      <ButtonFloat text={'salvar'} />
    </>
  );
};

export default Create;
