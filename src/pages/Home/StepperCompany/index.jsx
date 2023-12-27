import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stepper, Step, StepLabel, Button, Typography, Container, TextField, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { ApiService } from 'services/api.service';
import { AuthContext } from 'contexts/auth';
import ButtonFloat from 'components/ButtonFloat';

const StepperCompany = () => {
  const { company, setCompany, toast } = useContext(AuthContext);
  const [activeStep, setActiveStep] = useState(0);

  const Step1 = () => {
    const apiService = new ApiService();
    const [code, setCode] = useState(null);
    const [open, setOpen] = useState(false);
    const handleClickOpen = () => setOpen(true);

    const getCode = async () => {
      try {
        await apiService.get('/admin/company/code');
        toast.success('Código enviado!');
        handleClickOpen();
      } catch (error) {
        toast.error('Erro ao enviar o código');
      }
    };

    const verifyCode = async () => {
      try {
        if (!code || code.length !== 5) {
          return toast.error('Digite o código enviado para o seu email');
        }
        await apiService.post('/admin/company/code', { code });
        window.location.reload(false);
      } catch (e) {
        console.log(e);
        toast.error(e.response.data?.message || 'Erro ao verificar código');
      }
    };

    return (
      <div>
        {
          !company.verifyEmail ?
            <>
              <Typography variant="h6">Verificar E-mail</Typography>
              <Typography variant="p">
                Enviaremos um código de verificação para o seu email.
                Clique em enviar código
              </Typography> <br />

              <Button sx={{ mt: 1 }} variant="contained" onClick={getCode}>
                Enviar código
              </Button>

              <Dialog open={open}>
                <DialogTitle>Confirmação de email</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Insira o código enviado para seu email: <strong>{company.email}</strong>
                  </DialogContentText> <br />
                  <TextField
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    fullWidth
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={verifyCode}>Confirmar</Button>
                </DialogActions>
              </Dialog>
            </>
            : <strong>
              <span className="fa fa-check" style={{ marginRight: '0.5rem' }}></span>
              Email verificado, vá para próxima etapa!
            </strong>
        }
      </div>
    );
  };

  const Step2 = () => {
    const navigate = useNavigate();
    const handleGoToAddress = () => navigate('/address');

    return (
      (!company.address.zipCode) ? (
        <div>
          <Typography variant="h6">Atualizar endereço</Typography>
          <Typography variant="p">
            Forneça o endereço do seu negócio. Este é um passo essencial para calcular
            o valor da entrega ou, se preferir, para que o cliente possa retirar o
            pedido pessoalmente.
          </Typography> <br />
          <Button sx={{ mt: 1 }} variant="contained" onClick={handleGoToAddress}>
            Ir para tela de endereço
          </Button>
        </div>
      )
        : (
          <strong>
            <span className="fa fa-check" style={{ marginRight: '0.5rem' }}></span>
            Endereço atualizado, vá para próxima etapa!
          </strong>
        )

    );
  };

  const Step3 = () => {
    const navigate = useNavigate();
    const handleGoToAddress = () => navigate('/appearance');

    return (
      <div>
        <Typography variant="h6">Atualizar logo</Typography>
        <Typography variant="p">
          Envie uma foto da sua logo
        </Typography> <br />
        <Button sx={{ mt: 1 }} variant="contained" onClick={handleGoToAddress}>
          Ir para tela de endereço
        </Button>
      </div>
    );
  };

  return (
    <Container>
      <h3>Siga os passos abaixo para ativar e disponibilizar o seu cardápio online.</h3>

      <Stepper sx={{ mb: 2 }} activeStep={activeStep} alternativeLabel>
        <Step key={0} completed={company.verifyEmail}>
          <StepLabel></StepLabel>
        </Step>
        <Step key={1} completed={company.address?.zipCode}>
          <StepLabel></StepLabel>
        </Step>
        <Step key={2} completed={company.custom.logo?.url?.length > 0}>
          <StepLabel></StepLabel>
        </Step>
      </Stepper>

      {activeStep === 0 && <Step1 />}
      {activeStep === 1 && <Step2 />}
      {activeStep === 2 && <Step3 />}

      {
        activeStep <= 1 &&
        <ButtonFloat text="Próxima etapa" onClick={() => setActiveStep(activeStep + 1)} />
      }
    </Container>
  );
};

export default StepperCompany;
