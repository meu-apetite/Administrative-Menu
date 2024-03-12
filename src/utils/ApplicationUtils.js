import { createTheme } from "@mui/material";

export class ApplicationUtils {

  static getStatusColor(status) {
    switch (status) {
      case 'OrderReceived':
        return '#2196F3';
      case 'Processing':
        return '#00BCD4';
      case 'WaitingForPaymentConfirmation':
        return '#FFC107';
      case 'Shipped':
        return '#4CAF50';
      case 'Concluded':
        return '#4CAF50';
      case 'Cancelled':
        return '#FF3D00';
      case 'WaitingForPickup':
        return '#00BCD4';
      default:
        return '#808080';
    }
  };
  
  static formatPrice(price) {
    if (!price) return;

    return price.toLocaleString(
      'pt-BR', 
      { style: 'currency', currency: 'BRL' }
    ) || 'R$ 0,00';
  }

  static createCustomTheme(colorPrimary, colorSecondary) {
    return createTheme({
      palette: {
        primary: { main: colorPrimary || '#800080' },
        secondary: { main: colorSecondary || '#CD5C5C' },
      },
      typography: { fontFamily: 'Roboto, sans-serif' },
      spacing: (factor) => `${0.5 * factor}rem`,
    });
  };
}