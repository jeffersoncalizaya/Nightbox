import QRCode from 'qrcode';

/**
 * Utilitário oficial para geração de payload Pix no padrão EMV BR Code (Banco Central do Brasil)
 */

interface PixPayloadParams {
  pixKey: string;
  merchantName: string;
  merchantCity: string;
  amount?: number;
  txId?: string;
  description?: string;
}

// Formata campo no padrão ID (2 chars) + Tamanho (2 chars) + Valor
function formatEmvField(id: string, value: string): string {
  const len = value.length.toString().padStart(2, '0');
  return `${id}${len}${value}`;
}

// Remove acentos e caracteres especiais conforme norma BACEN
function cleanText(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .replace(/[^A-Z0-9 ]/g, '')
    .trim();
}

// Calcula checksum CRC16-CCITT (polinômio 0x1021, valor inicial 0xFFFF)
function calculateCRC16(payload: string): string {
  let crc = 0xffff;
  const polynomial = 0x1021;

  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let bit = 0; bit < 8; bit++) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ polynomial) & 0xffff;
      } else {
        crc = (crc << 1) & 0xffff;
      }
    }
  }

  return crc.toString(16).toUpperCase().padStart(4, '0');
}

/**
 * Gera a string Pix Copia e Cola no padrão oficial do Banco Central
 */
export function generatePixCopiaECola(params: PixPayloadParams): string {
  const {
    pixKey,
    merchantName,
    merchantCity,
    amount,
    txId = '***'
  } = params;

  // 00: Payload Format Indicator ("01")
  let payload = formatEmvField('00', '01');

  // 01: Point of Initiation Method: 12 (Dinamico) ou 11 (Estatico com valor)
  payload += formatEmvField('01', '12');

  // 26: Merchant Account Information - GUI ("br.gov.bcb.pix") + Chave
  const gui = formatEmvField('00', 'br.gov.bcb.pix');
  const key = formatEmvField('01', pixKey.trim());
  payload += formatEmvField('26', `${gui}${key}`);

  // 52: Merchant Category Code
  payload += formatEmvField('52', '0000');

  // 53: Transaction Currency (986 = Real BRL)
  payload += formatEmvField('53', '986');

  // 54: Transaction Amount
  if (amount && amount > 0) {
    payload += formatEmvField('54', amount.toFixed(2));
  }

  // 58: Country Code
  payload += formatEmvField('58', 'BR');

  // 59: Merchant Name (Max 25 chars)
  const safeName = cleanText(merchantName).slice(0, 25) || 'JEFFERSON LINDOMAR';
  payload += formatEmvField('59', safeName);

  // 60: Merchant City (Max 15 chars)
  const safeCity = cleanText(merchantCity).slice(0, 15) || 'SAO PAULO';
  payload += formatEmvField('60', safeCity);

  // 62: Additional Data Field Template (TxId)
  const safeTxId = cleanText(txId).slice(0, 25) || '***';
  const txField = formatEmvField('05', safeTxId);
  payload += formatEmvField('62', txField);

  // 63: CRC16 Checksum
  const payloadWithCrcId = `${payload}6304`;
  const crc = calculateCRC16(payloadWithCrcId);

  return `${payloadWithCrcId}${crc}`;
}

/**
 * Gera o QR Code em Data URL (base64 image/png) a partir do Copia e Cola
 */
export async function generatePixQrCodeDataUrl(copiaECola: string): Promise<string> {
  return await QRCode.toDataURL(copiaECola, {
    errorCorrectionLevel: 'M',
    margin: 2,
    scale: 8,
    color: {
      dark: '#000000',
      light: '#ffffff'
    }
  });
}
