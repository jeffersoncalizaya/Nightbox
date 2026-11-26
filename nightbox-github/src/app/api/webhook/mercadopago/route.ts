import { NextResponse } from 'next/server';
import { updateOrderStatus } from '@/lib/storage';

export async function POST(request: Request) {
  try {
    const url = new URL(request.url);
    const topic = url.searchParams.get('topic') || url.searchParams.get('type');
    const id = url.searchParams.get('id') || url.searchParams.get('data.id');

    if (topic === 'payment' && id) {
      // Quando um pagamento for aprovado pelo Mercado Pago
      console.log(`Mercado Pago Notificação recebida: ID ${id}`);
      // Em produção real, você consulta o status no Mercado Pago e atualiza o pedido
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
