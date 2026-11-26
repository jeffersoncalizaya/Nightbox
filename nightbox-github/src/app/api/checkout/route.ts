import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { generatePixCopiaECola, generatePixQrCodeDataUrl } from '@/lib/pix';
import { INITIAL_STORE_CONFIG } from '@/lib/data';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { order, accessToken, storeConfig } = body;

    const mpAccessToken = accessToken || process.env.MERCADO_PAGO_ACCESS_TOKEN;

    // 1. Se o lojista configurou o Mercado Pago, usa o checkout automático do MP
    if (mpAccessToken) {
      try {
        const client = new MercadoPagoConfig({ accessToken: mpAccessToken });

        if (order.paymentMethod === 'pix') {
          const payment = new Payment(client);
          
          const paymentData = {
            body: {
              transaction_amount: order.total,
              description: `Pedido ${order.id} - NIGHTBOX`,
              payment_method_id: 'pix',
              payer: {
                email: `${order.customer.phone.replace(/\D/g, '')}@nightbox.com.br`,
                first_name: order.customer.name.split(' ')[0],
                last_name: order.customer.name.split(' ').slice(1).join(' ') || 'Cliente',
                identification: {
                  type: 'CPF',
                  number: (order.customer.cpf || '11144477735').replace(/\D/g, ''),
                },
              },
            },
          };

          const result = await payment.create(paymentData);
          const pointOfInteraction = result.point_of_interaction;
          const transactionData = pointOfInteraction?.transaction_data;

          return NextResponse.json({
            success: true,
            paymentId: result.id,
            status: result.status,
            pixQrCode: transactionData?.qr_code_base64 
              ? `data:image/png;base64,${transactionData.qr_code_base64}` 
              : undefined,
            pixCopiaECola: transactionData?.qr_code,
          });
        }
      } catch (mpErr: any) {
        console.warn('Falha no Mercado Pago, caindo para Pix Direto do dono:', mpErr?.message);
      }
    }

    // 2. Chave Pix Direta do Dono (Banco Central / Padrão EMV BR Code)
    // O valor cai 100% diretamente na conta bancária do dono
    const pixKey = storeConfig?.pixKey || process.env.NEXT_PUBLIC_PIX_KEY || INITIAL_STORE_CONFIG.pixKey || 'sua-chave-pix-aqui';
    const merchantName = storeConfig?.pixMerchantName || process.env.NEXT_PUBLIC_PIX_MERCHANT_NAME || INITIAL_STORE_CONFIG.pixMerchantName || 'Nightbox Delivery';
    const merchantCity = storeConfig?.pixMerchantCity || INITIAL_STORE_CONFIG.pixMerchantCity || 'Sao Paulo';

    const pixCopiaECola = generatePixCopiaECola({
      pixKey,
      merchantName,
      merchantCity,
      amount: order.total,
      txId: order.id.replace(/[^A-Za-z0-9]/g, '').slice(0, 20) || 'PEDIDO'
    });

    const pixQrCode = await generatePixQrCodeDataUrl(pixCopiaECola);

    return NextResponse.json({
      success: true,
      directPix: true,
      paymentId: `pix_${Date.now()}`,
      status: 'pending',
      pixCopiaECola,
      pixQrCode,
    });
  } catch (error: any) {
    console.error('Erro no checkout API:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Erro ao processar pagamento' },
      { status: 500 }
    );
  }
}
