import { useContext, useEffect, useState } from 'react';
import { Grid, Typography, TextField } from '@mui/material';
import { AuthContext } from 'contexts/auth/index.jsx';
import { ApiService } from 'services/api.service';
import ButtonFloat from 'components/ButtonFloat/index.jsx';
import BackdropLoading from 'components/BackdropLoading';

const Settings_OpeningHours = ({ openingHours, }) => {
  const apiService = new ApiService();

  const { toast, company, setCompany } = useContext(AuthContext);

  const listDayName = [
    { name: 'monday', label: 'Segunda' },
    { name: 'tuesday', label: 'Terça' },
    { name: 'wednesday', label: 'Quarta' },
    { name: 'thursday', label: 'Quinta' },
    { name: 'friday', label: 'Sexta' },
    { name: 'saturday', label: 'Sábado' },
    { name: 'saturday', label: 'Domingo' }
  ];

  const [hours, setHours] = useState({});
  const [loading, setLoading] = useState(false);

  const changeHours = (day, interval, value) => {
    const newHours = { ...hours };
    newHours[day][interval] = value;
    setHours(newHours);
  };

  const save = async (e) => {
    e.preventDefault();
    setLoading('Agurade...');

    try {
      const { data } = await apiService.put('/admin/company/openinghours', hours);
      setCompany({ ...company, openingHours: data });
      toast.success('Horários atualizados!')
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setHours(company?.settings.openingHours);
  }, [openingHours]);

  return (
    <section>
      <Grid container spacing={2}>
        {hours && listDayName.map((item, i) => {
          return (
            <Grid item key={'indice-' + i} xs={12} md={6}>
              <Typography variant="h6" sx={{ fontSize: '1.1rem' }}>{item.label}</Typography>
              <TextField
                label="Abertura"
                type="time"
                value={hours[item.name]?.open}
                onChange={(e) => changeHours(item.name, 'open', e.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
                margin="dense"
              />
              <TextField
                label="Fechamento"
                type="time"
                value={hours[item.name]?.close}
                onChange={(e) => changeHours(item.name, 'close', e.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
                margin="dense"
              />
            </Grid>
          );
        })}
      </Grid>

      <ButtonFloat text="Salvar" onClick={save} />

      <BackdropLoading loading={loading} />
    </section>
  );
};

export default Settings_OpeningHours;
