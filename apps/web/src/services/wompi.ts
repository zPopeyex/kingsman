import type { WompiCheckoutParams } from '@/types/booking';

declare global {
  interface Window {
    WidgetCheckout: any;
  }
}

class WompiService {
  private publicKey: string | null = null;
  private environment: 'production' | 'test' = 'test';
  private initialized = false;
  private mockMode = false;

  /**
   * Inicializa Wompi con las credenciales
   */
  init(publicKey?: string, environment: 'production' | 'test' = 'test') {
    this.publicKey = publicKey || import.meta.env.VITE_WOMPI_PUBLIC_KEY;
    this.environment = environment || import.meta.env.VITE_WOMPI_ENV || 'test';
    
    if (!this.publicKey) {
      console.warn('⚠️ Wompi: No se encontró public key. Modo mock activado.');
      this.mockMode = true;
      return;
    }

    // Cargar script de Wompi si no está cargado
    if (!document.getElementById('wompi-script')) {
      const script = document.createElement('script');
      script.id = 'wompi-script';
      script.src = 'https://checkout.wompi.co/widget.js';
      script.async = true;
      script.onload = () => {
        this.initialized = true;
        console.log('✅ Wompi SDK cargado');
      };
      document.body.appendChild(script);
    } else {
      this.initialized = true;
    }
  }

  /**
   * Abre el checkout de Wompi
   */
  async openCheckout(params: WompiCheckoutParams): Promise<any> {
    // Modo mock para desarrollo sin credenciales
    if (this.mockMode) {
      return this.mockCheckout(params);
    }

    // Esperar a que Wompi esté inicializado
    await this.waitForInit();

    return new Promise((resolve, reject) => {
      try {
        const checkout = new window.WidgetCheckout({
          currency: params.currency || 'COP',
          amountInCents: params.amount * 100, // Wompi usa centavos
          reference: params.reference,
          publicKey: this.publicKey,
          redirectUrl: window.location.origin + '/booking/success',
          customerData: {
            email: params.customerEmail,
            fullName: params.customerName,
            phoneNumber: params.customerPhone,
            phoneNumberPrefix: '+57'
          }
        });

        checkout.open((result: any) => {
          if (result.transaction) {
            if (params.onSuccess) {
              params.onSuccess(result.transaction);
            }
            resolve(result.transaction);
          } else if (result.error) {
            if (params.onError) {
              params.onError(result.error);
            }
            reject(result.error);
          } else if (params.onClose) {
            params.onClose();
          }
        });
      } catch (error) {
        console.error('Error abriendo checkout Wompi:', error);
        reject(error);
      }
    });
  }

  /**
   * Mock del checkout para desarrollo
   */
  private async mockCheckout(params: WompiCheckoutParams): Promise<any> {
    console.log('🔧 Modo Mock Wompi activado');
    console.log('Parámetros:', params);

    // Simular delay de proceso
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Simular diferentes respuestas
    const mockResponses = [
      {
        status: 'APPROVED',
        id: `mock-${Date.now()}`,
        reference: params.reference,
        amount_in_cents: params.amount * 100,
        currency: params.currency,
        payment_method_type: 'CARD',
        created_at: new Date().toISOString()
      }
    ];
    // const confirmed = true;
    // Mostrar UI de confirmación mock
    const confirmed = window.confirm(
      `🔧 MODO MOCK WOMPI\n\n` +
      `Monto: ${new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP'
      }).format(params.amount)}\n` +
      `Referencia: ${params.reference}\n\n` +
      `¿Simular pago exitoso?`
    );

    if (confirmed) {
      const transaction = mockResponses[0];
      if (params.onSuccess) {
        params.onSuccess(transaction);
      }
      return transaction;
    } else {
      const error = { message: 'Pago cancelado por el usuario' };
      if (params.onError) {
        params.onError(error);
      }
      throw error;
    }
  }

  /**
   * Espera a que Wompi esté inicializado
   */
  private waitForInit(timeout = 10000): Promise<void> {
    return new Promise((resolve, reject) => {
      const start = Date.now();
      
      const check = () => {
        if (this.initialized && window.WidgetCheckout) {
          resolve();
        } else if (Date.now() - start > timeout) {
          reject(new Error('Timeout esperando inicialización de Wompi'));
        } else {
          setTimeout(check, 100);
        }
      };
      
      check();
    });
  }

  /**
   * Verifica el estado de una transacción
   */
  async checkTransactionStatus(transactionId: string): Promise<any> {
    if (this.mockMode) {
      return { 
        id: transactionId, 
        status: 'APPROVED',
        mock: true 
      };
    }

    // En producción, esto requeriría un backend
    console.warn('checkTransactionStatus requiere implementación backend');
    return null;
  }

  /**
   * Genera una referencia única para la transacción
   */
  generateReference(prefix = 'KB'): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
  }

  /**
   * Valida el monto según reglas de negocio
   */
  validateAmount(amount: number, minAmount = 10000, maxAmount?: number): {
    valid: boolean;
    error?: string;
  } {
    if (amount < minAmount) {
      return {
        valid: false,
        error: `El monto mínimo es ${new Intl.NumberFormat('es-CO', {
          style: 'currency',
          currency: 'COP'
        }).format(minAmount)}`
      };
    }

    if (maxAmount && amount > maxAmount) {
      return {
        valid: false,
        error: `El monto máximo es ${new Intl.NumberFormat('es-CO', {
          style: 'currency',
          currency: 'COP'
        }).format(maxAmount)}`
      };
    }

    return { valid: true };
  }
}

// Exportar instancia singleton
export const wompiService = new WompiService();

// Exportar también como default para conveniencia
export default wompiService;